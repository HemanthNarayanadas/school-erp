import { User } from './User';
import { Teacher } from './Teacher';
import { Student } from './Student';
import { Parent } from './Parent';
import { Class } from './Class';
import { Subject } from './Subject';
import { Attendance } from './Attendance';
import { Exam } from './Exam';
import { Mark } from './Mark';
import { Assignment } from './Assignment';
import { Announcement } from './Announcement';
import { Event } from './Event';
import { Timetable } from './Timetable';
import { Fee } from './Fee';
import { ActivityLog } from './ActivityLog';
import { Settings } from './Settings';

// Define Associations

// User associations
User.hasOne(Teacher, { foreignKey: 'userId', as: 'teacherProfile' });
Teacher.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(Parent, { foreignKey: 'userId', as: 'parentProfile' });
Parent.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Parent & Student
Parent.hasMany(Student, { foreignKey: 'parentId', as: 'children' });
Student.belongsTo(Parent, { foreignKey: 'parentId', as: 'parent' });

// Class & Student
Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });
Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

// Class & Teacher (Class Teacher)
Teacher.hasOne(Class, { foreignKey: 'teacherId', as: 'managedClass' });
Class.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'classTeacher' });

// Class & Subject
Class.hasMany(Subject, { foreignKey: 'classId', as: 'subjects' });
Subject.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

// Student & Attendance
Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendances' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Teacher & Attendance (markedBy)
Teacher.hasMany(Attendance, { foreignKey: 'markedBy', as: 'markedAttendances' });
Attendance.belongsTo(Teacher, { foreignKey: 'markedBy', as: 'marker' });

// Exam Associations
Class.hasMany(Exam, { foreignKey: 'classId', as: 'exams' });
Exam.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

Subject.hasMany(Exam, { foreignKey: 'subjectId', as: 'exams' });
Exam.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

// Mark Associations
Student.hasMany(Mark, { foreignKey: 'studentId', as: 'marks' });
Mark.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

Exam.hasMany(Mark, { foreignKey: 'examId', as: 'marks' });
Mark.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

Subject.hasMany(Mark, { foreignKey: 'subjectId', as: 'marks' });
Mark.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

Teacher.hasMany(Mark, { foreignKey: 'enteredBy', as: 'enteredMarks' });
Mark.belongsTo(Teacher, { foreignKey: 'enteredBy', as: 'marker' });

// Assignment Associations
Class.hasMany(Assignment, { foreignKey: 'classId', as: 'assignments' });
Assignment.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

Subject.hasMany(Assignment, { foreignKey: 'subjectId', as: 'assignments' });
Assignment.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

Teacher.hasMany(Assignment, { foreignKey: 'createdBy', as: 'assignments' });
Assignment.belongsTo(Teacher, { foreignKey: 'createdBy', as: 'teacher' });

// Timetable Associations
Class.hasMany(Timetable, { foreignKey: 'classId', as: 'timetables' });
Timetable.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

Subject.hasMany(Timetable, { foreignKey: 'subjectId', as: 'timetables' });
Timetable.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

Teacher.hasMany(Timetable, { foreignKey: 'teacherId', as: 'timetables' });
Timetable.belongsTo(Teacher, { foreignKey: 'teacherId', as: 'teacher' });

// Fee Associations
Student.hasMany(Fee, { foreignKey: 'studentId', as: 'fees' });
Fee.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Activity Log Associations
User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'logs' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
  User,
  Teacher,
  Student,
  Parent,
  Class,
  Subject,
  Attendance,
  Exam,
  Mark,
  Assignment,
  Announcement,
  Event,
  Timetable,
  Fee,
  ActivityLog,
  Settings,
};
