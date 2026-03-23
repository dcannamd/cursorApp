Native Cursor Overlay for macOS
This project creates a High-Fidelity Native Overlay that sits on top of your macOS desktop. It works in tandem with ProtoPie Connect to render custom cursor designs (like pencils, hands, or tools) and dual-cursor inputs (Co-Pilot) that standard web browsers cannot achieve.
🏗 The Architecture
1. ProtoPie (Logic Layer): Detects hovers and clicks, sending signals to ProtoPie Connect.
2. Web Browser (Input Layer): Runs the prototype, captures your actual mouse clicks, and hides the default system cursor.
3. Electron App (Visual Layer): A transparent, click-through window that floats above everything to render the custom cursor graphics in real-time.
🚀 Prerequisites
* Node.js installed on your Mac.
* ProtoPie Connect installed and running.
* ProtoPie Studio (to create the prototype interactions).
📦 Installation
1. Open your terminal in this project folder.
2. Install the required dependencies:
npm install electron socket.io-client

3. Create an assets folder in the root directory and add your 32x32px PNG files:
   * hand.png
   * pencil.png
   * wait.png
🛠 Configuration
1. The Main Process (main.js)
Ensure your main.js uses screen bounds (not workArea) to prevent the "250px Gap" caused by the macOS Menu Bar.
Key Code Block:
const { width, height, x, y } = screen.getPrimaryDisplay().bounds; // 'bounds' is critical!

overlayWindow = new BrowserWindow({
 x: x, 
 y: y,
 width: width,
 height: height,
 transparent: true,
 frame: false,
 alwaysOnTop: true,
 // ... other settings
});

2. The Renderer (index.html)
Ensure your CSS classes match the values you send from ProtoPie.
/* If ProtoPie sends "pencil", this class activates */
.state-pencil { 
   background-image: url('./assets/pencil.png'); 
}

🚦 How to Run the System
Step 1: Start ProtoPie Connect
Open ProtoPie Connect. It should automatically listen on localhost:9981.
Step 2: Start the Electron Overlay
In your terminal, run:
npx electron .

You should see a brief flash or nothing at all (since it is transparent). The app is now waiting for signals.
Step 3: Open Prototype in Browser (Layer 2)
1. Drag your Pie file into ProtoPie Connect.
2. Click the Web Browser icon to open it in Chrome/Safari.
3. Important: Put the browser in Full Screen Mode (Green button or Ctrl+Cmd+F) to ensure coordinate alignment.
Step 4: Hide the System Cursor
To prevent the "Double Cursor" effect (seeing both the Mac arrow and your custom icon), you must force the browser to hide its cursor.
1. Click inside the browser window.
2. Open Developer Tools (Cmd + Option + J).
3. Paste this JavaScript code into the Console and hit Enter:
// Creates a style rule that forces cursor:none on EVERYTHING
var style = document.createElement('style');
style.innerHTML = '* { cursor: none !important; }';
document.head.appendChild(style);

Step 5: Test It
Move your mouse over the prototype.
* System Cursor: Should be invisible.
* Custom Cursor: Should appear when you trigger the ProtoPie interactions (e.g., hovering a button).
🔧 Troubleshooting
I see two cursors (Arrow + Custom):
* You missed Step 4. You must inject the JS code into the browser console to hide the system arrow.
The Custom Cursor is offset by ~250px:
* Your main.js is likely using .workAreaSize instead of .bounds. Update it to use .bounds to account for the macOS menu bar.
The Custom Cursor is invisible:
* Check your assets folder. Do the filenames match exactly? (hand.png vs Hand.png).
* Check the ProtoPie message value. Are you sending pencil or state-pencil? (It should be just