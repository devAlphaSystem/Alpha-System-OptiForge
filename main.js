const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

Menu.setApplicationMenu(null);

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  switch (level) {
    case 'info':
      console.info(`[${timestamp}] INFO: ${message}`);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARN: ${message}`);
      break;
    case 'error':
      console.error(`[${timestamp}] ERROR: ${message}`);
      break;
    default:
      console.log(`[${timestamp}] ${message}`);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1152,
    height: 648,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    },
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true
  });

  log("Creating BrowserWindow");
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  log("App is ready");
  createWindow();

  require('./optimizations');
  require('./apps');
  require('./commands');
  require('./advanced');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      log("Activating app, creating new window");
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log("All windows closed, quitting app");
    app.quit();
  }
});
