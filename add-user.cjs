
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
}

async function addTeacher(username, password, name) {
  const passwordHash = await bcrypt.hash(password, 10);
  let user = await query('SELECT * FROM users WHERE username = $1', [username]);
  if (user.length === 0) {
    try {
      const userResult = await query(
        `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id`,
        [username, passwordHash, 'teacher']
      );
      console.log(`✓ Teacher added: ${username}`);
      return userResult[0].id;
    } catch (e) {
      if (e.code === '23505') {
        console.log(`✓ Teacher already exists: ${username}`);
        let user = await query('SELECT * FROM users WHERE username = $1', [username]);
        return user[0].id;
      } else {
        console.error('Error adding teacher:', e);
      }
    }
  } else {
    console.log(`✓ Teacher already exists: ${username}`);
    return user[0].id;
  }
}

async function addStudent(username, password, name, courseCode) {
  const passwordHash = await bcrypt.hash(password, 10);
  let user = await query('SELECT * FROM users WHERE username = $1', [username]);
  let userId;
  if (user.length === 0) {
    try {
      const userResult = await query(
        `INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id`,
        [username, passwordHash, 'student']
      );
      userId = userResult[0].id;
      console.log(`✓ Student user added: ${username}`);
    } catch (e) {
      if (e.code === '23505') {
        console.log(`✓ Student user already exists: ${username}`);
        let user = await query('SELECT * FROM users WHERE username = $1', [username]);
        userId = user[0].id;
      } else {
        console.error('Error adding student user:', e);
      }
    }
  } else {
    userId = user[0].id;
    console.log(`✓ Student user already exists: ${username}`);
  }
  // Get next roll number for this course
  const existingStudents = await query(
    `SELECT COUNT(*) as cnt FROM students WHERE course_code = $1`,
    [courseCode]
  );
  const count = parseInt(existingStudents[0]?.cnt || 0);
  const rollNumber = `${courseCode}-S${String(count + 1).padStart(3, '0')}`;
  // Insert into students table
  let student = await query('SELECT * FROM students WHERE user_id = $1', [userId]);
  if (student.length === 0) {
    try {
      await query(
        `INSERT INTO students (user_id, roll_number, name, course_code) VALUES ($1, $2, $3, $4)`,
        [userId, rollNumber, name, courseCode]
      );
      console.log(`✓ Student added: ${username}`);
    } catch (e) {
      if (e.code === '23505') {
        console.log(`✓ Student already exists: ${username}`);
      } else {
        console.error('Error adding student:', e);
      }
    }
  } else {
    console.log(`✓ Student already exists: ${username}`);
  }
}

async function addCourse(courseCode, courseName, teacherName) {
  let course = await query('SELECT * FROM courses WHERE course_code = $1', [courseCode]);
  if (course.length === 0) {
    try {
      await query('INSERT INTO courses (course_code, course_name, teacher_name) VALUES ($1, $2, $3)', [courseCode, courseName, teacherName]);
      console.log(`✓ Course added: ${courseCode} - ${courseName}`);
    } catch (e) {
      if (e.code === '23505') {
        console.log(`✓ Course already exists: ${courseCode}`);
      } else {
        console.error('Error adding course:', e);
      }
    }
  } else {
    console.log(`✓ Course already exists: ${courseCode}`);
  }
}

async function main() {
  // Add course
  const courseCode = 'JAI-001';
  const courseName = 'Overview of AI technology';
  const teacherName = 'teacher1';
  await addCourse(courseCode, courseName, teacherName);
  console.log(`✓ Course ensured: ${courseCode} - ${courseName}`);

  // Add teacher
  const teacherUsername = 'teacher1';
  const teacherPassword = 'teacher123';
  await addTeacher(teacherUsername, teacherPassword, teacherName);
  console.log(`✓ Teacher ensured: ${teacherUsername}`);

  // Add student
  const studentUsername = 'swati';
  const studentPassword = 'swati123';
  const studentName = 'Swati';
  await addStudent(studentUsername, studentPassword, studentName, courseCode);
  console.log(`✓ Student ensured: ${studentUsername}`);

  process.exit(0);
}

main();


// Always add the specified course, teacher, and student on every run
async function main() {
  // Add course
  const courseCode = 'JAI-001';
  const courseName = 'Overview of AI technology';
  const teacherName = 'teacher1';
  await addCourse(courseCode, courseName, teacherName);
  console.log(`✓ Course ensured: ${courseCode} - ${courseName}`);

  // Add teacher
  const teacherUsername = 'teacher1';
  const teacherPassword = 'teacher123';
  await addTeacher(teacherUsername, teacherPassword, teacherName);
  console.log(`✓ Teacher ensured: ${teacherUsername}`);

  // Add student
  const studentUsername = 'swati';
  const studentPassword = 'swati123';
  const studentName = 'Swati';
  await addStudent(studentUsername, studentPassword, studentName, courseCode);
  console.log(`✓ Student ensured: ${studentUsername}`);

  process.exit(0);
}

main();
 