import ADODB from 'node-adodb';
import bcrypt from 'bcryptjs';

const conn = ADODB.open('Provider=Microsoft.ACE.OLEDB.12.0;Data Source=./database/attendance.accdb;Persist Security Info=False;', 'C:\\Windows\\System32\\cscript.exe');

async function resetAndAddUsers() {
  try {
    // Delete all existing data
    console.log('Deleting existing data...');
    try { await conn.execute('DELETE FROM attendance_audit'); } catch(e) { console.log('  Cleared audit records'); }
    try { await conn.execute('DELETE FROM attendance'); } catch(e) { console.log('  Cleared attendance records'); }
    try { await conn.execute('DELETE FROM students'); } catch(e) { console.log('  Cleared students'); }
    try { await conn.execute('DELETE FROM users'); } catch(e) { console.log('  Cleared users'); }
    console.log('✓ All existing data deleted\n');

    // Add Cheshta as faculty/teacher
    const cheshtaHash = await bcrypt.hash('cheshta123', 10);
    const cheshtaId = 'teacher-cheshta-001';
    await conn.execute(`INSERT INTO users (id, username, password_hash, role) VALUES ('${cheshtaId}', 'cheshta', '${cheshtaHash}', 'teacher')`);
    console.log('✓ Added Cheshta as faculty');
    console.log('  Username: cheshta');
    console.log('  Password: cheshta123\n');

    // Add Swati as student
    const swatiHash = await bcrypt.hash('swati123', 10);
    const swatiUserId = 'student-swati-001';
    const swatiStudentId = 'stud-swati-001';
    await conn.execute(`INSERT INTO users (id, username, password_hash, role) VALUES ('${swatiUserId}', 'swati', '${swatiHash}', 'student')`);
    console.log('✓ Added Swati user account');
    
    // Insert student record - using brackets around reserved words
    await conn.execute(`INSERT INTO students ([id], [user_id], [roll_number], [name], [class], [section], [year], [course_code]) VALUES ('${swatiStudentId}', '${swatiUserId}', 'SWATI001', 'Swati', 'BCA', 'A', 2024, 'BCA-001')`);
    console.log('✓ Added Swati as student');
    console.log('  Username: swati');
    console.log('  Password: swati123');
    console.log('  Roll Number: SWATI001\n');

    console.log('═══════════════════════════════════');
    console.log('  DATABASE RESET COMPLETE!');
    console.log('═══════════════════════════════════');
    console.log('\nNew Login Credentials:');
    console.log('  Faculty: cheshta / cheshta123');
    console.log('  Student: swati / swati123');
    console.log('═══════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetAndAddUsers();
