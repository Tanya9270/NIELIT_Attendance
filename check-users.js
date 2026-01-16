import ADODB from 'node-adodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database', 'attendance.accdb');
const connectionString = `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${dbPath};Persist Security Info=False;`;

const cscriptPath = 'C:\\Windows\\SysWOW64\\cscript.exe';
const db = ADODB.open(connectionString, true, cscriptPath);

async function checkAndFix() {
    try {
        // Check all students
        const allStudents = await db.query("SELECT * FROM students");
        console.log('All students:', JSON.stringify(allStudents, null, 2));

        // Check all users with student role
        const studentUsers = await db.query("SELECT * FROM users WHERE role = 'student'");
        console.log('\nStudent users:', JSON.stringify(studentUsers, null, 2));

        // Find which user_id is linked to swati login
        const swatiUser = await db.query("SELECT * FROM users WHERE username = 'swati'");
        console.log('\nSwati user:', JSON.stringify(swatiUser, null, 2));

        // Update the correct student record
        if (swatiUser.length > 0) {
            const userId = swatiUser[0].id;
            console.log(`\nSwati's user_id: ${userId}`);
            
            // Update student with this user_id to have JAI-001 course
            await db.execute(`UPDATE students SET course_code = 'JAI-001' WHERE user_id = '${userId}'`);
            console.log('Updated student with user_id', userId, 'to course JAI-001');

            // Verify
            const updated = await db.query(`SELECT * FROM students WHERE user_id = '${userId}'`);
            console.log('\nUpdated student:', JSON.stringify(updated, null, 2));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

checkAndFix();
