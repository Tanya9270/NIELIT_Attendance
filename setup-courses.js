import bcrypt from 'bcryptjs';
import ADODB from 'node-adodb';

// Database connection
const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=./database/attendance.accdb;Persist Security Info=False;', 'C:\\Windows\\System32\\cscript.exe');

// Query queue to prevent concurrent access issues
let queryQueue = Promise.resolve();

function query(sql) {
  queryQueue = queryQueue.then(async () => {
    try {
      console.log('Executing SQL:', sql);
      return await connection.query(sql);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  });
  return queryQueue;
}

function execute(sql) {
  queryQueue = queryQueue.then(async () => {
    try {
      console.log('Executing SQL:', sql);
      return await connection.execute(sql);
    } catch (error) {
      // Ignore "table already exists" errors
      if (error.message && error.message.includes('already exists')) {
        console.log('Table already exists, continuing...');
        return;
      }
      console.error('Database execute error:', error);
      throw error;
    }
  });
  return queryQueue;
}

async function setupCourses() {
  try {
    console.log('\n========================================');
    console.log('   NIELIT Attendance System - Setup');
    console.log('========================================\n');

    // Step 1: Create courses table (MS Access syntax - avoiding reserved words)
    console.log('Step 1: Creating courses table...');
    try {
      await execute(`CREATE TABLE courses (id TEXT(50), course_code TEXT(20), course_name TEXT(100), teacher_id TEXT(50), teacher_name TEXT(100), class_name TEXT(20), section_name TEXT(10), batch_year INTEGER, created_at DATETIME)`);
      console.log('✓ Courses table created');
    } catch (err) {
      console.log('⚠ Courses table may already exist, error:', err.message || err);
    }

    // Step 2: Alter students table to add course_code column
    console.log('\nStep 2: Adding course_code column to students...');
    try {
      await execute('ALTER TABLE students ADD COLUMN course_code TEXT(20)');
      console.log('✓ course_code column added to students');
    } catch (err) {
      console.log('⚠ course_code column may already exist');
    }

    // Step 3: Add teacher for the course
    console.log('\nStep 3: Adding teacher for the course...');
    const teacherId = `teacher-jai-${Date.now()}`;
    const teacherPasswordHash = await bcrypt.hash('teacher123', 10);
    
    try {
      await execute(`INSERT INTO users (id, username, password_hash, role) VALUES ('${teacherId}', 'jai_teacher', '${teacherPasswordHash}', 'teacher')`);
      console.log('✓ Teacher user created');
    } catch (err) {
      console.log('⚠ Teacher user may already exist');
    }

    // Step 4: Add course JAI-001
    console.log('\nStep 4: Adding course JAI-001...');
    const courseId = `course-${Date.now()}`;
    const now = new Date();
    const nowStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    try {
      await execute(`INSERT INTO courses (id, course_code, course_name, teacher_id, teacher_name, class_name, section_name, batch_year, created_at) VALUES ('${courseId}', 'JAI-001', 'Overview Of AI Technology', '${teacherId}', 'JAI Teacher', 'AI', 'A', 2025, #${nowStr}#)`);
      console.log('✓ Course JAI-001 created');
    } catch (err) {
      console.log('⚠ Course JAI-001 may already exist, error:', err.message || err);
    }

    // Step 5: Add student Swati
    console.log('\nStep 5: Adding student Swati...');
    const studentUserId = `student-swati-${Date.now()}`;
    const studentId = `stud-swati-${Date.now()}`;
    const studentPasswordHash = await bcrypt.hash('swati123', 10);
    
    try {
      // Create user account for Swati
      await execute(`INSERT INTO users (id, username, password_hash, role) VALUES ('${studentUserId}', 'swati', '${studentPasswordHash}', 'student')`);
      console.log('✓ Student user account created');

      // Create student record
      await execute(`INSERT INTO students (id, user_id, roll_number, name, [class], section, [year], course_code) VALUES ('${studentId}', '${studentUserId}', 'JAI-001-S001', 'Swati', 'AI', 'A', 2025, 'JAI-001')`);
      console.log('✓ Student record created');
    } catch (err) {
      console.log('⚠ Student Swati may already exist, error:', err.message || err);
    }

    console.log('\n========================================');
    console.log('         Setup Complete!');
    console.log('========================================\n');
    console.log('Course Details:');
    console.log('  Course Code: JAI-001');
    console.log('  Course Name: Overview Of AI Technology');
    console.log('  Class: AI - Section A');
    console.log('  Year: 2025');
    console.log('\nTeacher Login:');
    console.log('  Username: jai_teacher');
    console.log('  Password: teacher123');
    console.log('\nStudent Details:');
    console.log('  Name: Swati');
    console.log('  Roll Number: JAI-001-S001');
    console.log('  Username: swati');
    console.log('  Password: swati123');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
  }

  process.exit(0);
}

setupCourses();
