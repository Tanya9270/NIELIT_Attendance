import ADODB from 'node-adodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database', 'attendance.accdb');
const cscriptPath = 'C:\\Windows\\System32\\cscript.exe';
const db = ADODB.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${dbPath};`, cscriptPath);

async function fixSwatiCourse() {
    try {
        // Check current status of Swati
        console.log('Checking Swati student record...');
        const students = await db.query(`SELECT id, roll_number, name, course_code FROM students WHERE name LIKE '%Swati%' OR roll_number LIKE '%JAI%'`);
        console.log('Found students:', students);

        // Update Swati's course_code to JAI-001
        if (students.length > 0) {
            for (const student of students) {
                if (!student.course_code || student.course_code !== 'JAI-001') {
                    console.log(`Updating ${student.name} (${student.roll_number}) course_code to JAI-001...`);
                    await db.execute(`UPDATE students SET course_code = 'JAI-001' WHERE id = '${student.id}'`);
                    console.log('Updated successfully!');
                } else {
                    console.log(`${student.name} already has course_code: ${student.course_code}`);
                }
            }
        }

        // Verify the update
        const updated = await db.query(`SELECT id, roll_number, name, course_code FROM students WHERE name LIKE '%Swati%' OR roll_number LIKE '%JAI%'`);
        console.log('\nVerified students after update:', updated);

        // Also show the course info
        const courses = await db.query(`SELECT * FROM courses WHERE course_code = 'JAI-001'`);
        console.log('\nCourse JAI-001 info:', courses);

    } catch (error) {
        console.error('Error:', error);
    }
}

fixSwatiCourse();
