import bcrypt from 'bcryptjs';
import {
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
  Settings,
} from './models';

export async function seedDatabase() {
  try {
    console.log('Seeding database with demo data...');

    // 1. Seed School Settings
    const settingsCount = await Settings.count();
    if (settingsCount === 0) {
      await Settings.create({
        schoolName: 'ABC International School',
        logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80',
        address: 'Sector 4, Dwarka, New Delhi, Delhi 110075',
        phone: '+91 11 2345 6789',
        email: 'admissions@abcinternational.edu.in',
        socialFacebook: 'https://facebook.com/abcinternationalschool',
        socialTwitter: 'https://twitter.com/abcinternational',
        socialInstagram: 'https://instagram.com/abcinternational',
        socialLinkedin: 'https://linkedin.com/school/abc-international',
        primaryColor: '#1e3a8a', // Deep Navy Blue
        secondaryColor: '#f59e0b', // Amber/Gold
        principalName: 'Dr. (Mrs.) Anjali Sharma',
        principalMessage: 'At ABC International School, we foster a nurturing environment where students excel academically, grow socially, and develop into responsible global citizens. Our curriculum combines rigorous CBSE standards with modern technological tools to prepare students for the challenges of tomorrow.',
        principalPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=80',
        academicYear: '2026-2027',
        aboutIntroduction: 'Founded in 2010, ABC International School is dedicated to providing high-quality, student-centered education. We empower learners with scientific temper, creativity, and integrity.',
        aboutVision: 'To be a premier center of educational excellence, shaping creative, resilient, and ethical leaders of tomorrow.',
        aboutMission: 'To deliver a holistic learning experience that integrates state-of-the-art academic training, active sports participation, and moral development using innovative methodologies.',
      });
      console.log('✔ Settings seeded.');
    }

    // Check if users already exist
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('Database already has data. Skipping seeding.');
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('password123', salt);

    // 2. Create Users
    // Principal (Super Admin)
    const principalUser = await User.create({
      name: 'Dr. Anjali Sharma',
      username: 'principal',
      email: 'principal@abcinternational.edu.in',
      passwordHash,
      role: 'principal',
      phone: '+91 99999 88888',
      status: 'active',
    });

    // Teachers
    const teacher1User = await User.create({
      name: 'Mr. Ramesh Prasad',
      username: 'ramesh.t',
      email: 'ramesh@abcinternational.edu.in',
      passwordHash,
      role: 'teacher',
      phone: '+91 99999 11111',
      status: 'active',
    });

    const teacher2User = await User.create({
      name: 'Mrs. Sita Verma',
      username: 'sita.t',
      email: 'sita@abcinternational.edu.in',
      passwordHash,
      role: 'teacher',
      phone: '+91 99999 22222',
      status: 'active',
    });

    const teacher3User = await User.create({
      name: 'Mr. Amit Singh',
      username: 'amit.t',
      email: 'amit@abcinternational.edu.in',
      passwordHash,
      role: 'teacher',
      phone: '+91 99999 33333',
      status: 'active',
    });

    const teacher4User = await User.create({
      name: 'Mrs. Priya Sharma',
      username: 'priya.t',
      email: 'priya@abcinternational.edu.in',
      passwordHash,
      role: 'teacher',
      phone: '+91 99999 44444',
      status: 'active',
    });

    const teacher5User = await User.create({
      name: 'Mr. Karan Malhotra',
      username: 'karan.t',
      email: 'karan@abcinternational.edu.in',
      passwordHash,
      role: 'teacher',
      phone: '+91 99999 55555',
      status: 'active',
    });

    // Parents
    const parent1User = await User.create({
      name: 'Mr. Rajesh Kumar',
      username: 'rajesh.p',
      email: 'rajesh@gmail.com',
      passwordHash,
      role: 'parent',
      phone: '+91 98888 11111',
      status: 'active',
    });

    const parent2User = await User.create({
      name: 'Mrs. Sunita Sen',
      username: 'sunita.p',
      email: 'sunita@gmail.com',
      passwordHash,
      role: 'parent',
      phone: '+91 98888 22222',
      status: 'active',
    });

    const parent3User = await User.create({
      name: 'Mr. Vijay Mehta',
      username: 'vijay.p',
      email: 'vijay@gmail.com',
      passwordHash,
      role: 'parent',
      phone: '+91 98888 33333',
      status: 'active',
    });

    // Students
    const student1User = await User.create({
      name: 'Sunil Kumar',
      username: 'stu101', // Student ID
      email: 'sunil@abcinternational.edu.in',
      passwordHash,
      role: 'student',
      phone: '+91 97777 11111',
      status: 'active',
    });

    const student2User = await User.create({
      name: 'Rohan Sen',
      username: 'stu102',
      email: 'rohan@abcinternational.edu.in',
      passwordHash,
      role: 'student',
      phone: '+91 97777 22222',
      status: 'active',
    });

    const student3User = await User.create({
      name: 'Divya Mehta',
      username: 'stu103',
      email: 'divya@abcinternational.edu.in',
      passwordHash,
      role: 'student',
      phone: '+91 97777 33333',
      status: 'active',
    });

    const student4User = await User.create({
      name: 'Aarav Gupta',
      username: 'stu901',
      email: 'aarav@abcinternational.edu.in',
      passwordHash,
      role: 'student',
      phone: '+91 97777 44444',
      status: 'active',
    });

    const student5User = await User.create({
      name: 'Riya Das',
      username: 'stu902',
      email: 'riya@abcinternational.edu.in',
      passwordHash,
      role: 'student',
      phone: '+91 97777 55555',
      status: 'active',
    });

    console.log('✔ Users created.');

    // 3. Create Teacher Profiles
    const rameshTeacher = await Teacher.create({
      userId: teacher1User.id,
      employeeId: 'TCH001',
      qualifications: 'M.Sc. Mathematics, B.Ed.',
      joiningDate: new Date('2018-06-01'),
    });

    const sitaTeacher = await Teacher.create({
      userId: teacher2User.id,
      employeeId: 'TCH002',
      qualifications: 'M.Sc. Physics, M.Ed.',
      joiningDate: new Date('2019-07-15'),
    });

    const amitTeacher = await Teacher.create({
      userId: teacher3User.id,
      employeeId: 'TCH003',
      qualifications: 'M.A. English Literature, B.Ed.',
      joiningDate: new Date('2020-09-01'),
    });

    const priyaTeacher = await Teacher.create({
      userId: teacher4User.id,
      employeeId: 'TCH004',
      qualifications: 'M.A. History, B.Ed.',
      joiningDate: new Date('2021-11-10'),
    });

    const karanTeacher = await Teacher.create({
      userId: teacher5User.id,
      employeeId: 'TCH005',
      qualifications: 'B.Tech Computer Science, MCA',
      joiningDate: new Date('2022-04-01'),
    });

    console.log('✔ Teacher profiles created.');

    // 4. Create Parent Profiles
    const rajeshParent = await Parent.create({
      userId: parent1User.id,
      occupation: 'Software Engineer',
      address: 'H.No. 402, Sunshine Apartments, Dwarka, New Delhi',
    });

    const sunitaParent = await Parent.create({
      userId: parent2User.id,
      occupation: 'Bank Manager',
      address: 'Flat 101, Green Meadows, Dwarka, New Delhi',
    });

    const vijayParent = await Parent.create({
      userId: parent3User.id,
      occupation: 'Business Owner',
      address: 'H.No. 76, Sector 12, Dwarka, New Delhi',
    });

    console.log('✔ Parent profiles created.');

    // 5. Create Classes (Class Teacher assignments)
    const class10A = await Class.create({
      name: 'Class 10',
      section: 'A',
      teacherId: rameshTeacher.id, // Class Teacher is Ramesh (Math)
    });

    const class9A = await Class.create({
      name: 'Class 9',
      section: 'A',
      teacherId: sitaTeacher.id, // Class Teacher is Sita (Science)
    });

    console.log('✔ Classes created.');

    // 6. Create Subjects
    // Subjects for Class 10A
    const math10 = await Subject.create({ name: 'Mathematics', code: 'MATH10', classId: class10A.id });
    const science10 = await Subject.create({ name: 'Science', code: 'SCI10', classId: class10A.id });
    const english10 = await Subject.create({ name: 'English', code: 'ENG10', classId: class10A.id });
    const sst10 = await Subject.create({ name: 'Social Studies', code: 'SST10', classId: class10A.id });
    const comp10 = await Subject.create({ name: 'Computer Science', code: 'COMP10', classId: class10A.id });

    // Subjects for Class 9A
    const math9 = await Subject.create({ name: 'Mathematics', code: 'MATH09', classId: class9A.id });
    const science9 = await Subject.create({ name: 'Science', code: 'SCI09', classId: class9A.id });
    const english9 = await Subject.create({ name: 'English', code: 'ENG09', classId: class9A.id });
    const sst9 = await Subject.create({ name: 'Social Studies', code: 'SST09', classId: class9A.id });
    const comp9 = await Subject.create({ name: 'Computer Science', code: 'COMP09', classId: class9A.id });

    console.log('✔ Subjects created.');

    // 7. Create Student Profiles
    const sunilStudent = await Student.create({
      userId: student1User.id,
      rollNumber: '01',
      admissionId: 'STU101',
      classId: class10A.id,
      parentId: rajeshParent.id,
      dob: new Date('2011-05-14'),
      address: rajeshParent.address,
    });

    const rohanStudent = await Student.create({
      userId: student2User.id,
      rollNumber: '02',
      admissionId: 'STU102',
      classId: class10A.id,
      parentId: sunitaParent.id,
      dob: new Date('2011-08-20'),
      address: sunitaParent.address,
    });

    const divyaStudent = await Student.create({
      userId: student3User.id,
      rollNumber: '03',
      admissionId: 'STU103',
      classId: class10A.id,
      parentId: vijayParent.id,
      dob: new Date('2011-03-05'),
      address: vijayParent.address,
    });

    const aaravStudent = await Student.create({
      userId: student4User.id,
      rollNumber: '01',
      admissionId: 'STU901',
      classId: class9A.id,
      parentId: rajeshParent.id,
      dob: new Date('2012-04-18'),
      address: rajeshParent.address,
    });

    const riyaStudent = await Student.create({
      userId: student5User.id,
      rollNumber: '02',
      admissionId: 'STU902',
      classId: class9A.id,
      parentId: sunitaParent.id,
      dob: new Date('2012-09-02'),
      address: sunitaParent.address,
    });

    console.log('✔ Student profiles created.');

    // 8. Timetable Schedule Seeding (Days: Mon-Fri)
    const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
    ];

    // Class 10A Timetable (Subjects: Math-Ramesh, Science-Sita, English-Amit, SST-Priya, Computer-Karan)
    for (const day of days) {
      await Timetable.create({
        classId: class10A.id,
        dayOfWeek: day,
        startTime: '08:30 AM',
        endTime: '09:30 AM',
        subjectId: math10.id,
        teacherId: rameshTeacher.id,
      });
      await Timetable.create({
        classId: class10A.id,
        dayOfWeek: day,
        startTime: '09:30 AM',
        endTime: '10:30 AM',
        subjectId: science10.id,
        teacherId: sitaTeacher.id,
      });
      await Timetable.create({
        classId: class10A.id,
        dayOfWeek: day,
        startTime: '10:45 AM',
        endTime: '11:45 AM',
        subjectId: english10.id,
        teacherId: amitTeacher.id,
      });
      await Timetable.create({
        classId: class10A.id,
        dayOfWeek: day,
        startTime: '11:45 AM',
        endTime: '12:45 PM',
        subjectId: sst10.id,
        teacherId: priyaTeacher.id,
      });
      await Timetable.create({
        classId: class10A.id,
        dayOfWeek: day,
        startTime: '01:30 PM',
        endTime: '02:30 PM',
        subjectId: comp10.id,
        teacherId: karanTeacher.id,
      });
    }

    // Class 9A Timetable
    for (const day of days) {
      await Timetable.create({
        classId: class9A.id,
        dayOfWeek: day,
        startTime: '08:30 AM',
        endTime: '09:30 AM',
        subjectId: science9.id,
        teacherId: sitaTeacher.id,
      });
      await Timetable.create({
        classId: class9A.id,
        dayOfWeek: day,
        startTime: '09:30 AM',
        endTime: '10:30 AM',
        subjectId: math9.id,
        teacherId: rameshTeacher.id,
      });
      await Timetable.create({
        classId: class9A.id,
        dayOfWeek: day,
        startTime: '10:45 AM',
        endTime: '11:45 AM',
        subjectId: sst9.id,
        teacherId: priyaTeacher.id,
      });
      await Timetable.create({
        classId: class9A.id,
        dayOfWeek: day,
        startTime: '11:45 AM',
        endTime: '12:45 PM',
        subjectId: english9.id,
        teacherId: amitTeacher.id,
      });
      await Timetable.create({
        classId: class9A.id,
        dayOfWeek: day,
        startTime: '01:30 PM',
        endTime: '02:30 PM',
        subjectId: comp9.id,
        teacherId: karanTeacher.id,
      });
    }

    console.log('✔ Timetables seeded.');

    // 9. Attendance Seeding (Last 10 days for each student)
    const last10Days: string[] = [];
    const dateCursor = new Date();
    // Go backwards skipping Sundays
    while (last10Days.length < 10) {
      dateCursor.setDate(dateCursor.getDate() - 1);
      const dayName = dateCursor.toLocaleDateString('en-US', { weekday: 'long' });
      if (dayName !== 'Sunday') {
        const formattedDate = dateCursor.toISOString().split('T')[0];
        last10Days.push(formattedDate);
      }
    }

    const studentsList = [sunilStudent, rohanStudent, divyaStudent, aaravStudent, riyaStudent];
    for (const student of studentsList) {
      for (let i = 0; i < last10Days.length; i++) {
        // Randomly assign present (90% chance), absent (7% chance), late (3% chance)
        const rand = Math.random();
        let status: 'present' | 'absent' | 'late' = 'present';
        let remarks = '';
        if (rand < 0.07) {
          status = 'absent';
          remarks = 'Family emergency';
        } else if (rand < 0.1) {
          status = 'late';
          remarks = 'Missed school bus';
        }

        // Assigned class teachers mark attendance
        const markerId = student.classId === class10A.id ? rameshTeacher.id : sitaTeacher.id;

        await Attendance.create({
          studentId: student.id,
          date: last10Days[i],
          status,
          remarks,
          markedBy: markerId,
        });
      }
    }

    console.log('✔ Attendance records seeded.');

    // 10. Exam Seeding
    // Unit Test 1
    const ut1Math = await Exam.create({
      name: 'Unit Test 1',
      type: 'Unit Test',
      date: '2026-05-10',
      maxMarks: 50,
      classId: class10A.id,
      subjectId: math10.id,
    });
    const ut1Science = await Exam.create({
      name: 'Unit Test 1',
      type: 'Unit Test',
      date: '2026-05-11',
      maxMarks: 50,
      classId: class10A.id,
      subjectId: science10.id,
    });

    // Term 1 (Midterm)
    const midtermMath = await Exam.create({
      name: 'Midterm Examination',
      type: 'Midterm',
      date: '2026-09-20',
      maxMarks: 100,
      classId: class10A.id,
      subjectId: math10.id,
    });
    const midtermSci = await Exam.create({
      name: 'Midterm Examination',
      type: 'Midterm',
      date: '2026-09-22',
      maxMarks: 100,
      classId: class10A.id,
      subjectId: science10.id,
    });

    // Class 9 Exams
    const ut1Math9 = await Exam.create({
      name: 'Unit Test 1',
      type: 'Unit Test',
      date: '2026-05-10',
      maxMarks: 50,
      classId: class9A.id,
      subjectId: math9.id,
    });

    console.log('✔ Exams seeded.');

    // 11. Marks Seeding
    // Class 10 students marks for Unit Test 1
    const class10Students = [sunilStudent, rohanStudent, divyaStudent];
    // Seeding marks
    for (const student of class10Students) {
      // Math UT1: random mark between 30 and 49
      await Mark.create({
        studentId: student.id,
        examId: ut1Math.id,
        subjectId: math10.id,
        marksObtained: Math.floor(Math.random() * 20) + 30,
        remarks: 'Good progress.',
        enteredBy: rameshTeacher.id,
      });

      // Science UT1: random mark between 35 and 48
      await Mark.create({
        studentId: student.id,
        examId: ut1Science.id,
        subjectId: science10.id,
        marksObtained: Math.floor(Math.random() * 14) + 35,
        remarks: 'Keep it up.',
        enteredBy: sitaTeacher.id,
      });
    }

    // Class 9 students marks
    const class9Students = [aaravStudent, riyaStudent];
    for (const student of class9Students) {
      await Mark.create({
        studentId: student.id,
        examId: ut1Math9.id,
        subjectId: math9.id,
        marksObtained: Math.floor(Math.random() * 20) + 28,
        remarks: 'Satisfactory.',
        enteredBy: rameshTeacher.id,
      });
    }

    console.log('✔ Marks records seeded.');

    // 12. Assignments Seeding
    await Assignment.create({
      title: 'Quadratic Equations Practice Set',
      description: 'Solve problems in exercises 4.1 to 4.3 from NCERT textbook. Write down solutions in your homework notebooks.',
      dueDate: '2026-06-25',
      classId: class10A.id,
      subjectId: math10.id,
      createdBy: rameshTeacher.id,
    });

    await Assignment.create({
      title: 'Light Reflection Lab Report',
      description: 'Submit a detailed report outlining our lab session about concave and convex mirrors including diagram representation.',
      dueDate: '2026-06-28',
      classId: class10A.id,
      subjectId: science10.id,
      createdBy: sitaTeacher.id,
    });

    await Assignment.create({
      title: 'Basic Python Coding Problems',
      description: 'Write Python programs to check palindrome, find factorial, and create Fibonacci series up to N terms. Submit the code files.',
      dueDate: '2026-06-30',
      classId: class10A.id,
      subjectId: comp10.id,
      createdBy: karanTeacher.id,
    });

    console.log('✔ Assignments seeded.');

    // 13. Announcements Seeding
    await Announcement.create({
      title: 'Unit Test 2 Schedule Announcement',
      content: 'The second cycle of Unit Tests (UT-2) for Classes 1 to 12 is scheduled to begin on July 15th, 2026. The detailed date sheet and syllabus will be shared next week by respective class teachers.',
      type: 'all',
      date: '2026-06-12',
      createdBy: principalUser.id,
    });

    await Announcement.create({
      title: 'Urgent: School Timing Altered due to Heatwave',
      content: 'In compliance with government directives regarding the heatwave conditions, school timings will be altered to 07:30 AM to 12:30 PM effective from June 16th, 2026 until further notice. Bus schedules are adjusted by 1 hour early.',
      type: 'emergency',
      date: '2026-06-13',
      createdBy: principalUser.id,
    });

    await Announcement.create({
      title: 'Teacher Training Workshop on AI Tools',
      content: 'A mandatory professional development workshop on "Integrating AI and Smart Tools in Classrooms" will be held for all teachers on Saturday, June 20th in the computer lab from 9:00 AM to 1:00 PM.',
      type: 'teachers',
      date: '2026-06-14',
      createdBy: principalUser.id,
    });

    console.log('✔ Announcements seeded.');

    // 14. School Events
    await Event.create({
      title: 'Annual Science Exhibition - InnoQuest',
      description: 'Join us to see the innovative working models and research projects built by students of Grade 6 to 12. Parents are cordially invited as judges and guests.',
      date: '2026-07-10',
      location: 'School Multipurpose Auditorium',
      imageUrl: 'https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=800&fit=crop&q=80',
    });

    await Event.create({
      title: 'Parent-Teacher Meeting (PTM)',
      description: 'Term-1 review meeting to discuss academic progress, attendance records, and personal development of students. Attendance is mandatory for all parents.',
      date: '2026-06-27',
      location: 'Respective Classrooms',
      imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&fit=crop&q=80',
    });

    await Event.create({
      title: 'Monsoon Intra-School Sports Meet',
      description: 'Inter-house athletic track events, football tournament, and indoor chess championship. Sign up with your house captains by June 20th.',
      date: '2026-07-25',
      location: 'School Sports Ground',
      imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&fit=crop&q=80',
    });

    console.log('✔ Events seeded.');

    // 15. Fee Invoices Seeding
    const students = [sunilStudent, rohanStudent, divyaStudent, aaravStudent, riyaStudent];
    for (const student of students) {
      // 1st Term Tuition fee (Paid for some, unpaid for others)
      const isPaid = student.id % 2 === 0;
      await Fee.create({
        studentId: student.id,
        amount: 25000,
        title: 'Academic Fee - Term 1',
        dueDate: '2026-05-15',
        status: isPaid ? 'paid' : 'unpaid',
        paidDate: isPaid ? '2026-05-10' : undefined,
        receiptNo: isPaid ? `REC-${10000 + student.id}` : undefined,
      });

      // Transport Fee (All Unpaid)
      await Fee.create({
        studentId: student.id,
        amount: 5000,
        title: 'Transport Fee - Q1',
        dueDate: '2026-06-30',
        status: 'unpaid',
      });
    }

    console.log('✔ Fee records seeded.');
    console.log('Database Seeding Completed Successfully! 🎉');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}
export default seedDatabase;
