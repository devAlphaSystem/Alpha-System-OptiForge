const { app, Menu, dialog, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let logWindow = null;
const logEntries = [];

Menu.setApplicationMenu(null);

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, message, level };
  logEntries.push(entry);

  if (logWindow && !logWindow.isDestroyed()) {
    logWindow.webContents.send('log-entry', entry);
  }

  const consoleMethod = { info: console.info, warn: console.warn, error: console.error }[level] || console.log;

  consoleMethod(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
}

async function checkAdminPrivileges() {
  try {
    const { default: isElevated } = await import('is-elevated');
    const elevated = await isElevated();

    if (!elevated) {
      log('Application is not running with administrator privileges', 'warn');
      dialog.showErrorBox(
        'Admin Rights Required',
        'This application requires administrator privileges to run.\nPlease restart as administrator.'
      );
      app.quit();
    } else {
      log('Application running with admin privileges', 'info');
    }
  } catch (error) {
    log(`Admin check error: ${error.message}`, 'error');
    app.quit();
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false
    },
    frame: false,
    resizable: false,
    backgroundColor: '#282a36'
  });

  mainWindow.on('closed', () => {
    log('Main window closed');
    mainWindow = null;
    if (logWindow && !logWindow.isDestroyed()) {
      logWindow.close();
    }
  });

  mainWindow.loadFile('index.html');
  log('Main window created');

  mainWindow.webContents.on('did-finish-load', () => {
    if (logWindow && !logWindow.isDestroyed()) {
      logEntries.forEach(entry => {
        logWindow.webContents.send('log-entry', entry);
      });
    }
  });
}

function createLogWindow() {
  if (logWindow && !logWindow.isDestroyed()) return;

  logWindow = new BrowserWindow({
    width: 1024,
    height: 576,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    backgroundColor: '#1e1e2f',
    title: 'Application Logs'
  });

  logWindow.loadFile('logs.html');
  log('Log window created');

  if (mainWindow && !mainWindow.isDestroyed()) {
    const mainBounds = mainWindow.getBounds();
    logWindow.setPosition(
      mainBounds.x + 50,
      mainBounds.y + 50
    );
  }

  logWindow.on('closed', () => {
    logWindow = null;
    log('Log window closed');
  });
}

app.whenReady().then(async () => {
  log('Application starting');
  await checkAdminPrivileges();

  ipcMain.on('renderer-log', (_, message, level = 'info') => {
    log(`[Renderer] ${message}`, level);
  });

  ipcMain.on('window-minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });

  ipcMain.on('window-close', () => {
    BrowserWindow.getFocusedWindow()?.close();
  });

  ipcMain.on('show-logs', () => {
    if (!logWindow || logWindow.isDestroyed()) {
      createLogWindow();
    }
  });

  createMainWindow();

  require('./apps');
  require('./optimizations');
  require('./commands');
  require('./fixes');
  require('./features');

  app.on('activate', () => {
    if (!mainWindow) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    log('All windows closed - quitting application');
    app.quit();
  }
});
