import { Router, Request, Response } from 'express';
import { User, Teacher, Student, Parent, Class, Subject, Attendance, Exam, Mark, Assignment, Announcement, Event, Fee, ActivityLog } from '../models';
import { authenticateToken } from '../middleware/auth';
import { Op } from 'sequelize';

const router = Router();

router.get('/stats', authenticateToken, async (req: Request, res: Response) => {
  const { role, id, teacherId, studentId, parentId, classId } = req.user!;

  try {
    // ==========================================
    // PRINCIPAL STATS
    // ==========================================
    if (role === 'principal') {
      const studentsCount = await Student.count();
      const teachersCount = await Teacher.count();
      const parentsCount = await Parent.count();
      const classesCount = await Class.count();

      // Calculate average attendance
      const totalAttendanceCount = await Attendance.count();
      const presentCount = await Attendance.count({ where: { status: { [Op.in]: ['present', 'late'] } } });
      const avgAttendance = totalAttendanceCount > 0 ? Math.round((presentCount / totalAttendanceCount) * 100) : 100;

      // Fees collection status
      const totalFeesCollectedResult = await Fee.sum('amount', { where: { status: 'paid' } });
      const totalFeesPendingResult = await Fee.sum('amount', { where: { status: 'unpaid' } });

      const totalFeesCollected = totalFeesCollectedResult || 0;
      const totalFeesPending = totalFeesPendingResult || 0;

      // Recent Activity Logs
      const recentLogs = await ActivityLog.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['name', 'role'] }],
      });

      return res.json({
        role,
        stats: {
          studentsCount,
          teachersCount,
          parentsCount,
          classesCount,
          avgAttendance,
          totalFeesCollected,
          totalFeesPending,
        },
        recentLogs,
      });
    }

    // ==========================================
    // TEACHER STATS
    // ==========================================
    if (role === 'teacher') {
      if (!teacherId) {
        return res.status(400).json({ message: 'Teacher profile not found for this user.' });
      }

      // Find classes managed or taught by the teacher
      const managedClass = await Class.findOne({ where: { teacherId } });

      // Total students in teacher's class
      let classStudentsCount = 0;
      let studentsList: Student[] = [];
      if (managedClass) {
        classStudentsCount = await Student.count({ where: { classId: managedClass.id } });
        studentsList = await Student.findAll({
          where: { classId: managedClass.id },
          include: [{ model: User, as: 'user', attributes: ['name'] }],
        });
      }

      // Teacher assignments count
      const assignmentsCount = await Assignment.count({ where: { createdBy: teacherId } });

      // Fetch exams created for teacher's class
      const examsCount = managedClass ? await Exam.count({ where: { classId: managedClass.id } }) : 0;

      return res.json({
        role,
        teacherId,
        managedClass: managedClass ? { id: managedClass.id, name: managedClass.name, section: managedClass.section } : null,
        stats: {
          classStudentsCount,
          assignmentsCount,
          examsCount,
        },
        students: studentsList,
      });
    }

    // ==========================================
    // STUDENT STATS
    // ==========================================
    if (role === 'student') {
      if (!studentId || !classId) {
        return res.status(400).json({ message: 'Student profile not found for this user.' });
      }

      const student = await Student.findByPk(studentId, {
        include: [{ model: Class, as: 'class', attributes: ['name', 'section'] }],
      });

      // Student attendance percentage
      const totalAttendance = await Attendance.count({ where: { studentId } });
      const presentCount = await Attendance.count({ where: { studentId, status: { [Op.in]: ['present', 'late'] } } });
      const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;

      // Student marks summary
      const marks = await Mark.findAll({
        where: { studentId },
        include: [
          { model: Exam, as: 'exam', attributes: ['name', 'maxMarks'] },
          { model: Subject, as: 'subject', attributes: ['name'] },
        ],
        order: [['createdAt', 'DESC']],
      });

      // Assignments for student's class
      const assignments = await Assignment.findAll({
        where: { classId },
        include: [
          { model: Subject, as: 'subject', attributes: ['name'] },
          { model: Teacher, as: 'teacher', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        ],
        order: [['dueDate', 'ASC']],
      });

      // Fee dues
      const pendingFees = await Fee.findAll({
        where: { studentId, status: 'unpaid' },
      });

      return res.json({
        role,
        studentId,
        studentClass: student?.class,
        stats: {
          attendanceRate,
          marksCount: marks.length,
          pendingAssignmentsCount: assignments.length,
          pendingFeesCount: pendingFees.length,
        },
        marks,
        assignments,
        pendingFees,
      });
    }

    // ==========================================
    // PARENT STATS
    // ==========================================
    if (role === 'parent') {
      if (!parentId) {
        return res.status(400).json({ message: 'Parent profile not found for this user.' });
      }

      // Fetch child profiles
      const children = await Student.findAll({
        where: { parentId },
        include: [
          { model: User, as: 'user', attributes: ['name', 'username', 'email'] },
          { model: Class, as: 'class', attributes: ['id', 'name', 'section'] },
        ],
      });

      // We'll calculate details for each child
      const childrenDetails = [];

      for (const child of children) {
        // Attendance
        const totalAttendance = await Attendance.count({ where: { studentId: child.id } });
        const presentCount = await Attendance.count({ where: { studentId: child.id, status: { [Op.in]: ['present', 'late'] } } });
        const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;

        // Pending fees
        const pendingFees = await Fee.findAll({
          where: { studentId: child.id, status: 'unpaid' },
        });

        // Recent Marks
        const childMarks = await Mark.findAll({
          where: { studentId: child.id },
          include: [
            { model: Exam, as: 'exam', attributes: ['name', 'maxMarks'] },
            { model: Subject, as: 'subject', attributes: ['name'] },
          ],
        });

        childrenDetails.push({
          id: child.id,
          name: child.user.name,
          admissionId: child.admissionId,
          rollNumber: child.rollNumber,
          class: child.class,
          attendanceRate,
          pendingFees,
          marks: childMarks,
        });
      }

      return res.json({
        role,
        parentId,
        children: childrenDetails,
      });
    }

    return res.status(400).json({ message: 'Unknown user role.' });
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return res.status(500).json({ message: 'Error calculating dashboard stats.' });
  }
});

export default router;
