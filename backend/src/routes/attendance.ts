import { Router, Request, Response } from 'express';
import { Attendance, Student, User, Class } from '../models';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

// Get attendance records
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { studentId, classId, date } = req.query;
    const filter: any = {};

    if (studentId) {
      filter.studentId = Number(studentId);
    }

    if (date) {
      filter.date = date as string;
    }

    // If query has classId but not studentId, we get students of that class first
    if (classId && !studentId) {
      const students = await Student.findAll({ where: { classId: Number(classId) } });
      const studentIds = students.map((s) => s.id);
      filter.studentId = studentIds;
    }

    const attendance = await Attendance.findAll({
      where: filter,
      include: [
        {
          model: Student,
          as: 'student',
          include: [{ model: User, as: 'user', attributes: ['name', 'username'] }],
        },
      ],
      order: [['date', 'DESC']],
    });

    return res.json(attendance);
  } catch (error) {
    console.error('Fetch attendance error:', error);
    return res.status(500).json({ message: 'Error fetching attendance.' });
  }
});

// Mark/Update attendance (Batch)
router.post('/', authenticateToken, authorize(['principal', 'teacher']), async (req: Request, res: Response) => {
  const { date, records } = req.body; // records: [{ studentId, status, remarks }]

  if (!date || !records || !Array.isArray(records)) {
    return res.status(400).json({ message: 'Date and records array are required.' });
  }

  try {
    const results = [];
    const markerId = req.user?.teacherId; // If teacher is marking

    for (const record of records) {
      const { studentId, status, remarks } = record;

      // Check if record exists for this date and student
      let attendanceRecord = await Attendance.findOne({
        where: { studentId, date },
      });

      if (attendanceRecord) {
        // Update
        await attendanceRecord.update({
          status,
          remarks: remarks || '',
          markedBy: markerId || attendanceRecord.markedBy,
        });
      } else {
        // Create
        attendanceRecord = await Attendance.create({
          studentId,
          date,
          status,
          remarks: remarks || '',
          markedBy: markerId,
        });
      }
      results.push(attendanceRecord);
    }

    return res.json({ message: 'Attendance marked successfully.', count: results.length });
  } catch (error) {
    console.error('Mark attendance error:', error);
    return res.status(500).json({ message: 'Error marking attendance.' });
  }
});

export default router;
