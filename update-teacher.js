import ADODB from 'node-adodb';

const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=./database/attendance.accdb;Persist Security Info=False;', 'C:\\Windows\\System32\\cscript.exe');

async function updateTeacher() {
  try {
    console.log('Updating teacher name to Cheshta...');
    
    // Update teacher name in courses
    await connection.execute("UPDATE courses SET teacher_name = 'Cheshta' WHERE course_code = 'JAI-001'");
    console.log('✓ Updated teacher name in courses table');
    
    // Update username to cheshta
    await connection.execute("UPDATE users SET username = 'cheshta' WHERE username = 'jai_teacher'");
    console.log('✓ Updated username to cheshta');
    
    // Verify
    const course = await connection.query("SELECT * FROM courses WHERE course_code = 'JAI-001'");
    console.log('\nCourse Info:', course);
    
    const user = await connection.query("SELECT id, username, role FROM users WHERE username = 'cheshta'");
    console.log('\nTeacher User:', user);
    
    console.log('\n========================================');
    console.log('Teacher Login Credentials:');
    console.log('  Username: cheshta');
    console.log('  Password: teacher123');
    console.log('========================================\n');
    
  } catch (e) {
    console.error('Error:', e.message || e);
  }
  
  process.exit(0);
}

updateTeacher();
