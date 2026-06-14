import { Router, Request, Response } from 'express';
import { Assignment, Subject, Class, Teacher, User } from '../models';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    const filter = classId ? { classId: Number(classId) } : {};

    const assignments = await Assignment.findAll({
      where: filter,
      include: [
        { model: Class, as: 'class', attributes: ['name', 'section'] },
        { model: Subject, as: 'subject', attributes: ['name', 'code'] },
        {
          model: Teacher,
          as: 'teacher',
          include: [{ model: User, as: 'user', attributes: ['name'] }],
        },
      ],
      order: [['dueDate', 'ASC']],
    });
    return res.json(assignments);
  } catch (error) {
    console.error('Fetch assignments error:', error);
    return res.status(500).json({ message: 'Error fetching assignments.' });
  }
});

router.post('/', authenticateToken, authorize(['principal', 'teacher']), async (req: Request, res: Response) => {
  const { title, description, dueDate, classId, subjectId, filePath } = req.body;

  if (!title || !description || !dueDate || !classId || !subjectId) {
    return res.status(400).json({ message: 'All fields (title, description, dueDate, classId, subjectId) are required.' });
  }

  try {
    const teacherId = req.user?.teacherId;
    if (!teacherId && req.user?.role !== 'principal') {
      return res.status(403).json({ message: 'Only teachers or principal can create assignments.' });
    }

    const assignment = await Assignment.create({
      title,
      description,
      dueDate,
      classId: Number(classId),
      subjectId: Number(subjectId),
      filePath: filePath || '',
      createdBy: teacherId || 1, // Fallback to teacherId 1 if created by principal without teacher profile
    });

    return res.status(201).json(assignment);
  } catch (error) {
    console.error('Create assignment error:', error);
    return res.status(500).json({ message: 'Error creating assignment.' });
  }
});

export default router;
