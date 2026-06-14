import { Router, Request, Response } from 'express';
import { Class, Subject, Timetable, Teacher, User } from '../models';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// ==========================================
// CLASSES ENDPOINTS
// ==========================================

router.get('/classes', authenticateToken, async (req: Request, res: Response) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Teacher,
          as: 'classTeacher',
          include: [{ model: User, as: 'user', attributes: ['name'] }],
        },
      ],
    });
    return res.json(classes);
  } catch (error) {
    console.error('Fetch classes error:', error);
    return res.status(500).json({ message: 'Error fetching classes.' });
  }
});

router.post('/classes', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { name, section, teacherId } = req.body;

  if (!name || !section) {
    return res.status(400).json({ message: 'Class name and section are required.' });
  }

  try {
    const newClass = await Class.create({ name, section, teacherId: teacherId || null });
    return res.status(201).json(newClass);
  } catch (error) {
    console.error('Create class error:', error);
    return res.status(500).json({ message: 'Error creating class.' });
  }
});

// ==========================================
// SUBJECTS ENDPOINTS
// ==========================================

router.get('/subjects', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    const filter = classId ? { classId: Number(classId) } : {};

    const subjects = await Subject.findAll({
      where: filter,
      include: [{ model: Class, as: 'class', attributes: ['name', 'section'] }],
    });
    return res.json(subjects);
  } catch (error) {
    console.error('Fetch subjects error:', error);
    return res.status(500).json({ message: 'Error fetching subjects.' });
  }
});

router.post('/subjects', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { name, code, classId } = req.body;

  if (!name || !code || !classId) {
    return res.status(400).json({ message: 'Name, code, and classId are required.' });
  }

  try {
    const subject = await Subject.create({ name, code, classId });
    return res.status(201).json(subject);
  } catch (error) {
    console.error('Create subject error:', error);
    return res.status(500).json({ message: 'Error creating subject.' });
  }
});

// ==========================================
// TIMETABLES ENDPOINTS
// ==========================================

router.get('/timetables', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { classId, teacherId } = req.query;
    const filter: any = {};

    if (classId) {
      filter.classId = Number(classId);
    }
    if (teacherId) {
      filter.teacherId = Number(teacherId);
    }

    const timetables = await Timetable.findAll({
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
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC'],
      ],
    });
    return res.json(timetables);
  } catch (error) {
    console.error('Fetch timetables error:', error);
    return res.status(500).json({ message: 'Error fetching timetables.' });
  }
});

router.post('/timetables', authenticateToken, authorize(['principal']), async (req: Request, res: Response) => {
  const { classId, dayOfWeek, startTime, endTime, subjectId, teacherId } = req.body;

  if (!classId || !dayOfWeek || !startTime || !endTime || !subjectId || !teacherId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const timetable = await Timetable.create({
      classId,
      dayOfWeek,
      startTime,
      endTime,
      subjectId,
      teacherId,
    });
    return res.status(201).json(timetable);
  } catch (error) {
    console.error('Create timetable error:', error);
    return res.status(500).json({ message: 'Error creating timetable.' });
  }
});

export default router;
