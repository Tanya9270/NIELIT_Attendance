import ADODB from 'node-adodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database', 'attendance.accdb');
const connectionString = `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${dbPath};Persist Security Info=False;`;

const cscriptPath = 'C:\\Windows\\SysWOW64\\cscript.exe';
const db = ADODB.open(connectionString, true, cscriptPath);

async function fixSwatiCourse() {
    try {
        // Check current Swati data
        const swatiResult = await db.query("SELECT * FROM students WHERE name = 'Swati'");
        console.log('Current Swati data:', swatiResult);

        // Check Cheshta's course
        const cheshtaCourse = await db.query("SELECT * FROM courses WHERE teacher_name = 'cheshta' OR teacher_name = 'Cheshta'");
        console.log('Cheshta courses:', cheshtaCourse);

        // Update Swati's course_code to JAI-001 (Cheshta's course)
        await db.execute("UPDATE students SET course_code = 'JAI-001' WHERE name = 'Swati'");
        console.log('Updated Swati course_code to JAI-001');

        // Verify update
        const updatedSwati = await db.query("SELECT * FROM students WHERE name = 'Swati'");
        console.log('Updated Swati data:', updatedSwati);

        console.log('\n✅ Swati is now enrolled in JAI-001 (Cheshta\'s course)');
        console.log('Swati can now mark attendance by scanning Cheshta\'s QR code');
    } catch (error) {
        console.error('Error:', error);
    }
}

fixSwatiCourse();
