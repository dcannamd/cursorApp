const { app, screen } = require('electron');
const io = require('socket.io-client');

// ================= CONFIGURATION =================
const MODE = 'REAL'; // 'DEMO' or 'REAL'
const BRIDGE_URL = 'http://10.0.0.146:9981'; 
// =================================================

let socket;
app.on('window-all-closed', (e) => e.preventDefault());

app.whenReady().then(() => {
    console.log(`🚀 Co-Pilot Tracker Started in ${MODE} mode`);
    socket = io(BRIDGE_URL);

    socket.on('connect', () => {
        console.log("✅ Connected! Sending encoded ProtoPie messages...");
        if (MODE === 'REAL') startRealTracking();
        else startDemoSimulation();
    });
});

// Helper to send data in "ProtoPie Format"
function sendCoords(x, y) {
    // We package the X and Y into a single string
    const payload = JSON.stringify({ x: parseInt(x), y: parseInt(y) });
    
    socket.emit('ppMessage', { 
        messageId: 'CO_PILOT_MOVE', // The ID we look for in index.html
        value: payload              // The coordinate string
    });
}

function startDemoSimulation() {
    let angle = 0;
    const centerX = 800, centerY = 500, radius = 200;
    setInterval(() => {
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        sendCoords(x, y);
        angle += 0.05;
    }, 16);
}

function startRealTracking() {
    setInterval(() => {
        const point = screen.getCursorScreenPoint();
        sendCoords(point.x, point.y);
    }, 16);
}