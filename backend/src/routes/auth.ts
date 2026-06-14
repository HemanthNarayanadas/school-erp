import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Teacher, Student, Parent } from '../models';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'This user account is suspended.' });
    }

    // Check password
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Wrong password.' });
    }

    // Resolve specific profile IDs depending on role
    let teacherId: number | undefined;
    let studentId: number | undefined;
    let parentId: number | undefined;
    let classId: number | undefined;

    if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ where: { userId: user.id } });
      if (teacher) teacherId = teacher.id;
    } else if (user.role === 'student') {
      const student = await Student.findOne({ where: { userId: user.id } });
      if (student) {
        studentId = student.id;
        classId = student.classId;
      }
    } else if (user.role === 'parent') {
      const parent = await Parent.findOne({ where: { userId: user.id } });
      if (parent) parentId = parent.id;
    }

    // Generate JWT
    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      teacherId,
      studentId,
      parentId,
      classId,
    };

    const secret = process.env.JWT_SECRET || 'super_secret_school_erp_token_key_2026';
    const token = jwt.sign(payload, secret, { expiresIn: '8h' });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        email: user.email,
        phone: user.phone,
        teacherId,
        studentId,
        parentId,
        classId,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not logged in.' });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      email: user.email,
      phone: user.phone,
      teacherId: req.user.teacherId,
      studentId: req.user.studentId,
      parentId: req.user.parentId,
      classId: req.user.classId,
    });
  } catch (error) {
    console.error('Auth verify error:', error);
    return res.status(500).json({ message: 'Server error during verification.' });
  }
});

export default router;
