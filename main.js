const { app, Menu, dialog, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

let mainWindow = null;
let logWindow = null;
const logEntries = [];

Menu.setApplicationMenu(null);

/**
 * Logs a message to the console and optionally to a log window.
 * @param {string} message - The message to log.
 * @param {string} [level="info"] - The log level ('info', 'warn', 'error').
 */
function log(message, level = "info") {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, message, level };
  logEntries.push(entry);

  if (logWindow && !logWindow.isDestroyed()) {
    logWindow.webContents.send("log-entry", entry);
  }

  const consoleMethod = { info: console.info, warn: console.warn, error: console.error }[level] || console.log;

  consoleMethod(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
}

/**
 * Checks if the application is running with administrator privileges.
 * Quits the application with an error message if not elevated.
 */
async function checkAdminPrivileges() {
  try {
    const { default: isElevated } = await import("is-elevated");
    const elevated = await isElevated();

    if (!elevated) {
      log("Application is not running with administrator privileges", "warn");
      dialog.showErrorBox("Admin Rights Required", "This application requires administrator privileges to run.\nPlease restart as administrator.");
      app.quit();
    } else {
      log("Application running with admin privileges", "info");
    }
  } catch (error) {
    log(`Admin check error: ${error.message}`, "error");
    dialog.showErrorBox("Error Checking Privileges", `Failed to check administrator privileges: ${error.message}`);
    app.quit();
  }
}

/**
 * Creates the main application window.
 */
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
    },
    frame: false,
    resizable: false,
    backgroundColor: "#282a36",
    icon: path.join(__dirname, "icon.ico"),
  });

  mainWindow.on("closed", () => {
    log("Main window closed");
    mainWindow = null;
    if (logWindow && !logWindow.isDestroyed()) {
      logWindow.close();
    }
  });

  mainWindow.loadFile("index.html");
  log("Main window created");

  mainWindow.webContents.on("did-finish-load", () => {
    if (logWindow && !logWindow.isDestroyed()) {
      for (const entry of logEntries) {
        logWindow.webContents.send("log-entry", entry);
      }
    }
  });
}

/**
 * Creates the log display window.
 */
function createLogWindow() {
  if (logWindow && !logWindow.isDestroyed()) {
    logWindow.focus();
    return;
  }

  logWindow = new BrowserWindow({
    width: 1024,
    height: 576,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: false,
    },
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    backgroundColor: "#1e1e2f",
    title: "Application Logs",
    parent: mainWindow,
    modal: false,
  });

  logWindow.loadFile("logs.html");
  log("Log window created");

  if (mainWindow && !mainWindow.isDestroyed()) {
    const mainBounds = mainWindow.getBounds();
    const logBounds = logWindow.getBounds();
    const x = mainBounds.x + (mainBounds.width - logBounds.width) / 2;
    const y = mainBounds.y + (mainBounds.height - logBounds.height) / 2;
    logWindow.setPosition(Math.max(0, Math.round(x)), Math.max(0, Math.round(y)));
  }

  logWindow.on("closed", () => {
    logWindow = null;
    log("Log window closed");
  });

  logWindow.webContents.on("did-finish-load", () => {
    for (const entry of logEntries) {
      logWindow.webContents.send("log-entry", entry);
    }
  });
}

app.whenReady().then(async () => {
  log("Application starting");
  await checkAdminPrivileges();

  ipcMain.on("renderer-log", (_, message, level = "info") => {
    log(`[Renderer] ${message}`, level);
  });

  ipcMain.on("window-minimize", () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });

  ipcMain.on("window-close", () => {
    BrowserWindow.getFocusedWindow()?.close();
  });

  ipcMain.on("show-logs", () => {
    createLogWindow();
  });

  require("./apps");
  require("./optimizations");
  require("./commands");
  require("./fixes");
  require("./features");

  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    log("All windows closed - quitting application");
    app.quit();
  }
});
