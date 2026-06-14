import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Teacher, Student, Parent, Class, ActivityLog } from '../models';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// ==========================================
// TEACHERS ENDPOINTS
// ==========================================

// Get all teachers
router.get('/teachers', authenticateToken, authorize(['principal', 'teacher']), async (req: Request, res: Response) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'username', 'email', 'phone', 'status'],
        },
      ],
    });
    return res.json(teachers);
  } catch (error) {
    console.error('Fetch teachers error:', error);
    return res.status(500).json({ message: 'Error fetching teachers.' });
  }
});

// Create a teacher
router.post('/teachers', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { name, username, email, phone, password, employeeId, qualifications, joiningDate } = req.body;

  if (!name || !username || !password || !employeeId || !qualifications) {
    return res.status(400).json({ message: 'Required fields missing: name, username, password, employeeId, qualifications.' });
  }

  try {
    // Check if username already exists
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Create Base User
    const user = await User.create({
      name,
      username,
      email,
      phone,
      passwordHash,
      role: 'teacher',
      status: 'active',
    });

    // Create Teacher Profile
    const teacher = await Teacher.create({
      userId: user.id,
      employeeId,
      qualifications,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
    });

    // Activity Log
    await ActivityLog.create({
      userId: req.user!.id,
      action: 'CREATE_TEACHER',
      details: `Created teacher profile for ${name} (ID: ${employeeId}).`,
    });

    return res.status(201).json({ message: 'Teacher created successfully.', user, teacher });
  } catch (error: any) {
    console.error('Create teacher error:', error);
    return res.status(500).json({ message: error.message || 'Error creating teacher.' });
  }
});

// Update teacher
router.put('/teachers/:id', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, status, qualifications, joiningDate } = req.body;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found.' });
    }

    const user = await User.findByPk(teacher.userId);
    if (!user) {
      return res.status(404).json({ message: 'User record not found.' });
    }

    // Update base user
    await user.update({
      name: name || user.name,
      email: email !== undefined ? email : user.email,
      phone: phone !== undefined ? phone : user.phone,
      status: status || user.status,
    });

    // Update teacher profile
    await teacher.update({
      qualifications: qualifications || teacher.qualifications,
      joiningDate: joiningDate ? new Date(joiningDate) : teacher.joiningDate,
    });

    return res.json({ message: 'Teacher profile updated.', user, teacher });
  } catch (error) {
    console.error('Update teacher error:', error);
    return res.status(500).json({ message: 'Error updating teacher.' });
  }
});

// Delete teacher
router.delete('/teachers/:id', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found.' });
    }

    const userId = teacher.userId;

    // Delete profile and user
    await teacher.destroy();
    await User.destroy({ where: { id: userId } });

    await ActivityLog.create({
      userId: req.user!.id,
      action: 'DELETE_TEACHER',
      details: `Deleted teacher profile ID ${id}.`,
    });

    return res.json({ message: 'Teacher deleted successfully.' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    return res.status(500).json({ message: 'Error deleting teacher.' });
  }
});

// ==========================================
// PARENTS ENDPOINTS
// ==========================================

// Get all parents
router.get('/parents', authenticateToken, authorize(['principal', 'teacher']), async (req: Request, res: Response) => {
  try {
    const parents = await Parent.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'username', 'email', 'phone', 'status'],
        },
        {
          model: Student,
          as: 'children',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
          ],
        },
      ],
    });
    return res.json(parents);
  } catch (error) {
    console.error('Fetch parents error:', error);
    return res.status(500).json({ message: 'Error fetching parents.' });
  }
});

// Create a parent
router.post('/parents', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { name, username, email, phone, password, occupation, address } = req.body;

  if (!name || !username || !password || !occupation) {
    return res.status(400).json({ message: 'Required fields missing: name, username, password, occupation.' });
  }

  try {
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      phone,
      passwordHash,
      role: 'parent',
      status: 'active',
    });

    const parent = await Parent.create({
      userId: user.id,
      occupation,
      address,
    });

    return res.status(201).json({ message: 'Parent created successfully.', user, parent });
  } catch (error) {
    console.error('Create parent error:', error);
    return res.status(500).json({ message: 'Error creating parent.' });
  }
});

// ==========================================
// STUDENTS ENDPOINTS
// ==========================================

// Get all students
router.get('/students', authenticateToken, authorize(['principal', 'teacher', 'parent']), async (req: Request, res: Response) => {
  try {
    // If a parent is querying, restrict to parent's children
    const filter: any = {};
    if (req.user!.role === 'parent') {
      filter.parentId = req.user!.parentId;
    }

    const students = await Student.findAll({
      where: filter,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'username', 'email', 'phone', 'status'],
        },
        {
          model: Class,
          as: 'class',
          attributes: ['id', 'name', 'section'],
        },
        {
          model: Parent,
          as: 'parent',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name', 'phone'],
            },
          ],
        },
      ],
    });
    return res.json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    return res.status(500).json({ message: 'Error fetching students.' });
  }
});

// Create student
router.post('/students', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { name, username, email, phone, password, rollNumber, admissionId, classId, parentId, dob, address } = req.body;

  if (!name || !username || !password || !rollNumber || !admissionId || !classId) {
    return res.status(400).json({ message: 'Required fields missing: name, username, password, rollNumber, admissionId, classId.' });
  }

  try {
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    // Create base user
    const user = await User.create({
      name,
      username, // this will be the Student ID or Username
      email,
      phone,
      passwordHash,
      role: 'student',
      status: 'active',
    });

    // Create student profile
    const student = await Student.create({
      userId: user.id,
      rollNumber,
      admissionId,
      classId,
      parentId: parentId || null,
      dob: dob ? new Date(dob) : undefined,
      address,
    });

    await ActivityLog.create({
      userId: req.user!.id,
      action: 'CREATE_STUDENT',
      details: `Created student profile for ${name} (Roll: ${rollNumber}, Adm ID: ${admissionId}).`,
    });

    return res.status(201).json({ message: 'Student created successfully.', user, student });
  } catch (error) {
    console.error('Create student error:', error);
    return res.status(500).json({ message: 'Error creating student.' });
  }
});

// Update student
router.put('/students/:id', authenticateToken, authorize(['principal', 'teacher']), async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, status, rollNumber, classId, parentId, dob, address } = req.body;

  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const user = await User.findByPk(student.userId);
    if (!user) {
      return res.status(404).json({ message: 'User record not found.' });
    }

    // Update base user
    await user.update({
      name: name || user.name,
      email: email !== undefined ? email : user.email,
      phone: phone !== undefined ? phone : user.phone,
      status: status || user.status,
    });

    // Update student profile
    await student.update({
      rollNumber: rollNumber || student.rollNumber,
      classId: classId || student.classId,
      parentId: parentId !== undefined ? parentId : student.parentId,
      dob: dob ? new Date(dob) : student.dob,
      address: address !== undefined ? address : student.address,
    });

    return res.json({ message: 'Student profile updated.', user, student });
  } catch (error) {
    console.error('Update student error:', error);
    return res.status(500).json({ message: 'Error updating student.' });
  }
});

// Delete student
router.delete('/students/:id', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const userId = student.userId;

    await student.destroy();
    await User.destroy({ where: { id: userId } });

    await ActivityLog.create({
      userId: req.user!.id,
      action: 'DELETE_STUDENT',
      details: `Deleted student profile ID ${id}.`,
    });

    return res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Delete student error:', error);
    return res.status(500).json({ message: 'Error deleting student.' });
  }
});

export default router;
