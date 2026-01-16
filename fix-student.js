import ADODB from 'node-adodb';

const connection = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=./database/attendance.accdb;Persist Security Info=False;', 'C:\\Windows\\System32\\cscript.exe');

async function fixStudent() {
  try {
    // Check if student already exists
    const existing = await connection.query("SELECT * FROM students WHERE roll_number = 'JAI-001-S001'");
    if (existing && existing.length > 0) {
      console.log('✓ Student already exists:', existing[0]);
      process.exit(0);
      return;
    }
    
    // Get the student user we just created
    const users = await connection.query("SELECT id FROM users WHERE username = 'swati'");
    console.log('User found:', users);
    
    if (users && users.length > 0) {
      const userId = users[0].id;
      const studentId = 'stud-swati-' + Date.now();
      
      // Try INSERT with square brackets around reserved words
      const sql = `INSERT INTO students ([id], [user_id], [roll_number], [name], [class], [section], [year], [course_code]) VALUES ('${studentId}', '${userId}', 'JAI-001-S001', 'Swati', 'AI', 'A', 2025, 'JAI-001')`;
      console.log('SQL:', sql);
      
      await connection.execute(sql);
      console.log('✓ Student record created successfully!');
    }
  } catch (e) {
    console.error('Error:', e.message || e);
    console.error('Full error:', e);
  }
  
  process.exit(0);
}

fixStudent();
