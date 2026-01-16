import bcrypt from 'bcryptjs';
import ADODB from 'node-adodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database', 'attendance.accdb');
const connectionString = `Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${dbPath};Persist Security Info=False;`;

const cscriptPath = 'C:\\Windows\\SysWOW64\\cscript.exe';
const db = ADODB.open(connectionString, true, cscriptPath);

async function resetPassword() {
    try {
        // Generate new password hash
        const password = 'teacher123';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('New hashed password:', hashedPassword);

        // Update cheshta's password
        await db.execute(`UPDATE users SET password_hash = '${hashedPassword}' WHERE username = 'cheshta'`);
        console.log('Password updated for cheshta');

        // Also update swati's password
        const studentHash = await bcrypt.hash('student123', 10);
        await db.execute(`UPDATE users SET password_hash = '${studentHash}' WHERE username = 'swati'`);
        console.log('Password updated for swati');

        // Verify the update
        const result = await db.query("SELECT username, password_hash FROM users WHERE username IN ('cheshta', 'swati')");
        console.log('Updated users:', result);

        console.log('\nLogin credentials:');
        console.log('Teacher: cheshta / teacher123');
        console.log('Student: swati / student123');
    } catch (error) {
        console.error('Error:', error);
    }
}

resetPassword();
