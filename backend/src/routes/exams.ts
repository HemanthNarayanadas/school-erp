import { Router, Request, Response } from 'express';
import { Exam, Mark, Student, User, Subject, Class } from '../models';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// ==========================================
// EXAMS ENDPOINTS
// ==========================================

// Get all exams
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    const filter = classId ? { classId: Number(classId) } : {};

    const exams = await Exam.findAll({
      where: filter,
      include: [
        { model: Class, as: 'class', attributes: ['name', 'section'] },
        { model: Subject, as: 'subject', attributes: ['name', 'code'] },
      ],
    });
    return res.json(exams);
  } catch (error) {
    console.error('Fetch exams error:', error);
    return res.status(500).json({ message: 'Error fetching exams.' });
  }
});

// Create exam
router.post('/', authenticateToken, authorize(['principal', 'teacher']), async (req: Request, res: Response) => {
  const { name, type, date, maxMarks, classId, subjectId } = req.body;

  if (!name || !type || !date || !maxMarks || !classId || !subjectId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const exam = await Exam.create({
      name,
      type,
      date,
      maxMarks: Number(maxMarks),
      classId: Number(classId),
      subjectId: Number(subjectId),
    });
    return res.status(201).json(exam);
  } catch (error) {
    console.error('Create exam error:', error);
    return res.status(500).json({ message: 'Error creating exam.' });
  }
});

// ==========================================
// MARKS ENDPOINTS
// ==========================================

// Get marks
router.get('/marks', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { studentId, examId, classId, subjectId } = req.query;
    const filter: any = {};

    if (studentId) {
      filter.studentId = Number(studentId);
    }
    if (examId) {
      filter.examId = Number(examId);
    }
    if (subjectId) {
      filter.subjectId = Number(subjectId);
    }

    if (classId && !studentId) {
      const students = await Student.findAll({ where: { classId: Number(classId) } });
      filter.studentId = students.map((s) => s.id);
    }

    const marks = await Mark.findAll({
      where: filter,
      include: [
        {
          model: Student,
          as: 'student',
          include: [{ model: User, as: 'user', attributes: ['name', 'username'] }],
        },
        {
          model: Exam,
          as: 'exam',
          attributes: ['name', 'type', 'maxMarks'],
        },
        {
          model: Subject,
          as: 'subject',
          attributes: ['name', 'code'],
        },
      ],
    });
    return res.json(marks);
  } catch (error) {
    console.error('Fetch marks error:', error);
    return res.status(500).json({ message: 'Error fetching marks.' });
  }
});

// Enter marks (Batch)
router.post('/marks', authenticateToken, authorize(['principal', 'teacher']), async (req: Request, res: Response) => {
  const { examId, subjectId, records } = req.body; // records: [{ studentId, marksObtained, remarks }]

  if (!examId || !subjectId || !records || !Array.isArray(records)) {
    return res.status(400).json({ message: 'examId, subjectId, and records are required.' });
  }

  try {
    const results = [];
    const teacherId = req.user?.teacherId;

    for (const record of records) {
      const { studentId, marksObtained, remarks } = record;

      let markRecord = await Mark.findOne({
        where: { studentId, examId, subjectId },
      });

      if (markRecord) {
        await markRecord.update({
          marksObtained: Number(marksObtained),
          remarks: remarks || '',
          enteredBy: teacherId || markRecord.enteredBy,
        });
      } else {
        markRecord = await Mark.create({
          studentId,
          examId,
          subjectId,
          marksObtained: Number(marksObtained),
          remarks: remarks || '',
          enteredBy: teacherId,
        });
      }
      results.push(markRecord);
    }

    return res.json({ message: 'Marks entered successfully.', count: results.length });
  } catch (error) {
    console.error('Enter marks error:', error);
    return res.status(500).json({ message: 'Error entering marks.' });
  }
});

export default router;
