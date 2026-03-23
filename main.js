
//transparent: true: Creates the invisible canvas needed for the overlay.
//setIgnoreMouseEvents(true, { forward: true }): This is the specific line that allows the "Pilot" to click buttons in ProtoPie while the custom cursor or Co-Pilot's cursor floats above it.
//webPreferences: Enables nodeIntegration, allowing you to use socket.io-client directly inside your index.html script to listen to ProtoPie Connect.


const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

let overlayWindow;

function createOverlay() {
  // 1. Get the Primary Display Details
  const primaryDisplay = screen.getPrimaryDisplay();
  const { x, y, width, height } = primaryDisplay.bounds; // 'bounds' includes the menu bar area

  // 2. Create the window aligned to those exact bounds
  overlayWindow = new BrowserWindow({
    x: x,              // Force X position
    y: y,              // Force Y position
    width: width,      // Force Width
    height: height,    // Force Height
    enableLargerThanScreen: true,
    transparent: true,
    frame: false,
    hasShadow: false,
    alwaysOnTop: true,
    focusable: false,
    resizable: false,
    movable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  overlayWindow.loadFile('index.html');

  // Allow clicks to pass through
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  // Keep it on top of everything (Mac specific level)
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlayWindow.setAlwaysOnTop(true, 'screen-saver'); 
}

// App Lifecycle
app.whenReady().then(() => {
  createOverlay();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createOverlay();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const { ipcMain } = require('electron');

// Poll mouse position for the PILOT
setInterval(() => {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    const point = screen.getCursorScreenPoint();
    const [winX, winY] = overlayWindow.getPosition();

    // Adjust for window offset if necessary
    overlayWindow.webContents.send('MOUSE_POSITION', {
        x: point.x - winX,
        y: point.y - winY
    });
  }
}, 16); // 60 FPS