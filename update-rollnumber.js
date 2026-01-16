import ADODB from 'node-adodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database', 'attendance.accdb');
const connectionString = `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${dbPath};Persist Security Info=False;`;

const cscriptPath = 'C:\\Windows\\SysWOW64\\cscript.exe';
const db = ADODB.open(connectionString, true, cscriptPath);

async function updateRollNumber() {
    try {
        // Update Swati's roll number to course-based format
        await db.execute("UPDATE students SET roll_number = 'JAI-001-S001' WHERE user_id = 'student-swati-001'");
        console.log('Updated Swati roll number to JAI-001-S001');
        
        // Verify the update
        const result = await db.query("SELECT roll_number, name, course_code FROM students");
        console.log('Updated students:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

updateRollNumber();
