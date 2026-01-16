import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRScanner({ onScanSuccess }) {
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const [lastScanned, setLastScanned] = useState('');
  const [showHttpsWarning, setShowHttpsWarning] = useState(false);
  const scannerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if using HTTP (camera won't work on Android)
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      setShowHttpsWarning(true);
    }
    
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError('');
      setScanning(false); // Reset state
      
      console.log('Initializing QR scanner...');
      console.log('Protocol:', window.location.protocol);
      console.log('Hostname:', window.location.hostname);
      
      // Check if camera API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available. Make sure you are using HTTPS or localhost.');
      }
      
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      console.log('Getting available cameras...');
      
      // Get available cameras
      const devices = await Html5Qrcode.getCameras();
      console.log('Available cameras:', devices);
      
      if (devices.length === 0) {
        throw new Error('No cameras found on this device. Please check camera permissions in your browser settings.');
      }
      
      // Prefer rear camera on mobile
      let cameraId = devices[0].id;
      const rearCamera = devices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      if (rearCamera) {
        cameraId = rearCamera.id;
      }
      
      console.log('Using camera:', cameraId);
      
      await scanner.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250,
          aspectRatio: 1.777778, // 16:9
          disableFlip: false,
          videoConstraints: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        },
        (decodedText) => {
          console.log('QR code scanned:', decodedText);
          // Prevent duplicate scans
          if (decodedText !== lastScanned) {
            setLastScanned(decodedText);
            onScanSuccess(decodedText);
            
            // Reset after 2 seconds to allow scanning same QR again if needed
            setTimeout(() => setLastScanned(''), 2000);
          }
        },
        (errorMessage) => {
          // Ignore scan errors (they happen continuously while searching)
        }
      );

      console.log('Scanner started successfully');
      setScanning(true);
    } catch (err) {
      console.error('Scanner error:', err);
      setError(`Failed to start camera: ${err.message || 'Please ensure camera permissions are granted.'}`);
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
    setScanning(false);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
      setManualInput('');
      
      // Keep focus on input for quick successive scans
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Camera Scanner</h3>
        
        <div style={{ marginBottom: '15px' }}>
          {!scanning ? (
            <button onClick={startScanner} className="btn btn-success">
              Start Camera
            </button>
          ) : (
            <button onClick={stopScanner} className="btn btn-danger">
              Stop Camera
            </button>
          )}
        </div>

        {showHttpsWarning && (
          <div className="alert alert-warning" style={{ marginBottom: '15px', background: '#fff3cd', color: '#856404', border: '1px solid #ffc107' }}>
            <strong>⚠️ HTTPS Required for Camera on Android</strong>
            <p style={{ marginTop: '8px', marginBottom: '8px' }}>
              Camera access requires HTTPS on Android devices. You are currently using HTTP.
            </p>
            <p style={{ marginTop: '8px', marginBottom: '0', fontSize: '14px' }}>
              <strong>Solutions:</strong>
            </p>
            <ol style={{ marginTop: '4px', marginBottom: '0', paddingLeft: '20px', fontSize: '14px' }}>
              <li>Access via your computer's local IP with HTTPS</li>
              <li>Use the "Manual Input" field below with a USB scanner</li>
              <li>Students can type their QR code manually (roll_number|timestamp format)</li>
            </ol>
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '15px' }}>
            <strong>❌ Camera Error:</strong> {error}
            <br /><br />
            <strong>Troubleshooting Steps:</strong>
            <ol style={{ marginTop: '8px', marginBottom: '8px', paddingLeft: '20px', fontSize: '14px' }}>
              <li><strong>Chrome Android:</strong> Tap the lock/info icon in address bar → Permissions → Allow Camera</li>
              <li><strong>Firefox Android:</strong> Tap the lock icon → Clear permissions → Reload page → Allow when prompted</li>
              <li><strong>Samsung Internet:</strong> Menu → Settings → Sites and downloads → Site permissions → Camera → Allow</li>
              <li><strong>If still not working:</strong> Use Manual Input field below with USB scanner or manual entry</li>
            </ol>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '0' }}>
              Note: Camera access requires HTTPS on Android (except localhost). Current URL: <code>{window.location.href}</code>
            </p>
          </div>
        )}

        <div 
          id="qr-reader" 
          style={{ 
            width: '100%',
            maxWidth: '500px',
            minHeight: scanning ? '400px' : '0',
            margin: '0 auto',
            display: scanning ? 'block' : 'none',
            border: scanning ? '2px solid #28a745' : 'none',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        ></div>

        {!scanning && (
          <div style={{ 
            width: '100%',
            maxWidth: '500px',
            height: '300px',
            margin: '0 auto',
            background: '#f8f9fa',
            border: '2px dashed #ddd',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '16px'
          }}>
            📷 Camera preview will appear here
          </div>
        )}
      </div>

      <div style={{ 
        borderTop: '1px solid #ddd',
        paddingTop: '20px',
        marginTop: '20px'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Manual Input (USB Scanner)</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Use this field if you have a USB QR scanner that acts like a keyboard
        </p>

        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '10px' }}>
          <input
            ref={inputRef}
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Focus here and scan with USB scanner"
            style={{
              flex: 1,
              padding: '10px',
              border: '2px solid #007bff',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            autoFocus
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
