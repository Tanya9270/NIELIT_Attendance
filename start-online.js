import { spawn, exec } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('');
console.log('==========================================');
console.log('  QR Attendance - Online Classes Setup');
console.log('==========================================');
console.log('');

// Check if ngrok exists
exec('where ngrok', (error) => {
    if (error) {
        console.log('❌ ngrok not found!');
        console.log('');
        console.log('Please download ngrok from: https://ngrok.com/download');
        console.log('Extract ngrok.exe to this folder');
        console.log('Then run: ngrok authtoken YOUR_TOKEN');
        console.log('Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken');
        process.exit(1);
    }
});

console.log('Step 1: Starting backend server...');
const backend = spawn('node', ['index.js'], { 
    cwd: 'server',
    stdio: 'inherit',
    shell: true
});

setTimeout(() => {
    console.log('');
    console.log('Step 2: Starting ngrok tunnel for backend...');
    console.log('');
    
    const ngrokBackend = spawn('ngrok', ['http', '3000', '--log=stdout'], {
        shell: true
    });

    let backendUrl = '';
    
    ngrokBackend.stdout.on('data', (data) => {
        const output = data.toString();
        const match = output.match(/url=(https:\/\/[^\s]+)/);
        if (match && !backendUrl) {
            backendUrl = match[1];
            console.log('');
            console.log('✅ Backend tunnel ready!');
            console.log(`   URL: ${backendUrl}`);
            console.log('');
            
            // Now start frontend
            console.log('Step 3: Starting frontend...');
            const frontend = spawn('npm', ['run', 'dev'], {
                cwd: 'client',
                env: { ...process.env, VITE_API_URL: `${backendUrl}/api` },
                stdio: 'inherit',
                shell: true
            });
            
            setTimeout(() => {
                console.log('');
                console.log('Step 4: Starting ngrok tunnel for frontend...');
                
                const ngrokFrontend = spawn('ngrok', ['http', 'https://localhost:5173', '--log=stdout'], {
                    shell: true
                });
                
                ngrokFrontend.stdout.on('data', (data) => {
                    const output = data.toString();
                    const match = output.match(/url=(https:\/\/[^\s]+)/);
                    if (match) {
                        console.log('');
                        console.log('==========================================');
                        console.log('  ✅ ONLINE SETUP COMPLETE!');
                        console.log('==========================================');
                        console.log('');
                        console.log(`📱 Share this URL with students:`);
                        console.log(`   ${match[1]}`);
                        console.log('');
                        console.log('Students can access from any network!');
                        console.log('');
                        console.log('Press Ctrl+C to stop all servers');
                    }
                });
            }, 5000);
        }
    });
    
}, 3000);

process.on('SIGINT', () => {
    console.log('\nShutting down...');
    process.exit();
});
