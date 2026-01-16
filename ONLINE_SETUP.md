# Online Classes Setup Guide

## How it Works
For online classes, students from different networks need to access your attendance system via the internet. We use **ngrok** to create a public URL that tunnels to your local server.

## Prerequisites
1. ngrok account (free): https://ngrok.com/signup
2. After signup, get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken

## One-Time Setup

### 1. Configure ngrok authtoken
```powershell
cd "c:\Users\Tanya Singh\Downloads\attendence"
.\ngrok authtoken YOUR_AUTH_TOKEN_HERE
```

## Starting for Online Classes

### Step 1: Start the Backend Server
Open PowerShell and run:
```powershell
cd "c:\Users\Tanya Singh\Downloads\attendence\server"
node index.js
```

### Step 2: Start ngrok Tunnel (in new PowerShell window)
```powershell
cd "c:\Users\Tanya Singh\Downloads\attendence"
.\ngrok http 3000
```

You'll see something like:
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:3000
```

**Copy that https URL!** (e.g., `https://abc123.ngrok-free.app`)

### Step 3: Start the Frontend (in new PowerShell window)
```powershell
cd "c:\Users\Tanya Singh\Downloads\attendence\client"
$env:VITE_API_URL="https://abc123.ngrok-free.app/api"
npm run dev
```
(Replace `abc123` with your actual ngrok subdomain)

### Step 4: Start ngrok for Frontend (in new PowerShell window)
```powershell
cd "c:\Users\Tanya Singh\Downloads\attendence"
.\ngrok http https://localhost:5173
```

You'll get another URL like:
```
Forwarding    https://xyz789.ngrok-free.app -> https://localhost:5173
```

## Share with Students

Give students the **FRONTEND ngrok URL**:
```
https://xyz789.ngrok-free.app
```

### Important Notes:
1. ngrok free tier URLs change every time you restart
2. Students may see a "Visit Site" warning page from ngrok - just click through
3. For permanent URLs, consider ngrok paid plan or deploy to cloud

## Troubleshooting

### "Failed to fetch" error
- Make sure the backend ngrok is running
- Check that VITE_API_URL is set correctly

### Camera not working
- Students need to allow camera permissions
- ngrok provides HTTPS so camera should work

### QR expired too fast
- Network latency can cause timing issues
- You can increase the 15-second window in server code

## Alternative: Cloud Deployment (Permanent Solution)

For a permanent solution without ngrok:
1. Deploy backend to Railway/Render/Heroku (free tiers available)
2. Use PostgreSQL instead of MS Access
3. Deploy frontend to Vercel/Netlify (free)

This gives you permanent URLs that never change.
