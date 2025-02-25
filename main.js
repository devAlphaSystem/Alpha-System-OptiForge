const { app, Menu, dialog, BrowserWindow, ipcMain } = require('electron');
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

async function checkAdminPrivileges() {
  try {
    const { default: isElevated } = await import('is-elevated');
    const elevated = await isElevated();
    if (!elevated) {
      log('Application is not running with administrator privileges', 'warn');
      dialog.showErrorBox('Admin Rights Required', 'This application requires administrator privileges to run. Please restart the application as an administrator.');
      app.quit();
    } else {
      log('Application is running with administrator privileges', 'info');
    }
  } catch (error) {
    log(`Error checking admin privileges: ${error.message}`, 'error');
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    },
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    backgroundColor: '#282a36'
  });

  log("Creating BrowserWindow");
  win.loadFile('index.html');
}

ipcMain.on('renderer-log', (event, message, level = 'info') => {
  log(`[Renderer] ${message}`, level);
});

ipcMain.on('window-minimize', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.minimize();
});

ipcMain.on('window-close', () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.close();
});

app.whenReady().then(async () => {
  log("App is ready");

  await checkAdminPrivileges();

  createWindow();

  require('./apps');
  require('./optimizations');
  require('./commands');
  require('./fixes');
  require('./features');

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
