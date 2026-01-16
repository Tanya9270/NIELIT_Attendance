import ADODB from 'node-adodb';

const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=./database/attendance.accdb;Persist Security Info=False;', 'C:\\Windows\\System32\\cscript.exe');

async function checkData() {
  try {
    console.log('\n========================================');
    console.log('   Checking Database Data');
    console.log('========================================\n');

    // Check courses
    console.log('Courses:');
    const courses = await connection.query('SELECT * FROM courses');
    console.log(courses);

    // Check students with course JAI-001
    console.log('\nStudents in JAI-001:');
    const students = await connection.query("SELECT * FROM students WHERE course_code = 'JAI-001'");
    console.log(students);

    // Check all students
    console.log('\nAll students:');
    const allStudents = await connection.query('SELECT id, roll_number, name, course_code FROM students');
    console.log(allStudents);

  } catch (e) {
    console.error('Error:', e.message || e);
  }
  
  process.exit(0);
}

checkData();
