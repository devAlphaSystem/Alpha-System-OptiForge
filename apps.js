const { ipcMain } = require("electron");
const { spawn } = require("node:child_process");

/**
 * Logs a message to the console.
 * @param {string} message - The message to log.
 * @param {string} [level="info"] - The log level ('info', 'warn', 'error').
 */
function log(message, level = "info") {
  const timestamp = new Date().toISOString();
  const consoleMethod = { info: console.info, warn: console.warn, error: console.error }[level] || console.log;
  consoleMethod(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
}

const removeAppsOptions = [
  {
    id: "apps_calc",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsCalculator -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_onedrive",
    command: "Get-AppxPackage -AllUsers -Name *OneDrive* -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_xbox",
    command: "Get-AppxPackage -AllUsers -Name *Xbox* -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_newoutlook",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.OutlookForWindows -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_recall",
    command: "Get-AppxPackage -AllUsers -Name *Recall* -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_groovemusic",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.ZuneMusic -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_teams",
    command: "Get-AppxPackage -AllUsers -Name MSTeams -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_mstore",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsStore -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_photos",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Windows.Photos -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_snipsketch",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.ScreenSketch -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_paint",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.MSPaint -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_movietv",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.ZuneVideo -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_edge",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.MicrosoftEdge -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_xboxcore",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.XboxApp -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
];

const uselessBloatwareOptions = [
  {
    id: "apps_ub_mail",
    command: "Get-AppxPackage -AllUsers -Name *communi* -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_maps",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsMaps -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_skype",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.SkypeApp -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_getstarted",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Getstarted -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_meetnow",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsMeetNow -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_phonelink",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.YourPhone -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_gethelp",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.GetHelp -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_family",
    command: "Get-AppxPackage -AllUsers -Name MicrosoftCorporationII.MicrosoftFamily -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_paint3d",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Paint3D -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_feedback",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsFeedbackHub -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_copilotstore",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Copilot_8wekyb3d8bbwe -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_clipchamp",
    command: "Get-AppxPackage -AllUsers -Name Clipchamp.Clipchamp -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_onenote",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Office.OneNote -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_quickassist",
    command: "Get-AppxPackage -AllUsers -Name MicrosoftCorporationII.QuickAssist -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_solitaire",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.MicrosoftSolitaireCollection -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_powerautomate",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.PowerAutomateDesktop -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_alarms",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsAlarms -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_copilotprov",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Windows.Ai.Copilot.Provider -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_camera",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsCamera -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_weather",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.BingWeather -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_3dviewer",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Microsoft3DViewer -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_stickynotes",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.MicrosoftStickyNotes -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_bing",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.BingSearch -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_todo",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Todos -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_mixedreality",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.MixedReality.Portal -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_officehub",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.MicrosoftOfficeHub -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_people",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.People -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_copilot",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Copilot -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_devhome",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Windows.DevHome -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_soundrecorder",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsSoundRecorder -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_cortana",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.549981C3F5F10 -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_news",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.BingNews -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_xboxgamebar",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.XboxGamingOverlay -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_3dbuilder",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.3DBuilder -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
  {
    id: "apps_ub_whiteboard",
    command: "Get-AppxPackage -AllUsers -Name Microsoft.Whiteboard -ErrorAction SilentlyContinue | Remove-AppxPackage",
  },
];

/**
 * Replaces logical AND operators (&&) with semicolons (;) for PowerShell compatibility.
 * @param {string} cmd - The command string.
 * @returns {string} The command string with replacements.
 */
function wrapCommand(cmd) {
  return cmd.replace(/&&/g, ";");
}

/**
 * Executes a given command in PowerShell.
 * @param {string} command - The command to execute.
 * @returns {Promise<{success: boolean, command: string, message: string}>} A promise resolving with the execution result.
 */
function executeCommand(command) {
  return new Promise((resolve) => {
    log(`Executing command: ${command}`);
    let outputData = "";
    let errorData = "";

    const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", command]);

    psProcess.stdout.on("data", (data) => {
      const output = data.toString().trim();
      outputData += `${output}\n`;
      log(`Output: ${output}`);
    });

    psProcess.stderr.on("data", (data) => {
      const errorOutput = data.toString().trim();
      errorData += `${errorOutput}\n`;
      log(`Error Output: ${errorOutput}`, "warn");
    });

    psProcess.on("error", (error) => {
      log(`Process spawn error: ${error.message}`, "error");
      resolve({
        success: false,
        command,
        message: `Process spawn error: ${error.message}`,
      });
    });

    psProcess.on("close", (code) => {
      log(`Process closed with code: ${code}`);
      const success = code === 0;
      let message = outputData.trim();
      if (errorData.trim()) {
        message += `\nERRORS:\n${errorData.trim()}`;
      }
      if (!message && !success) {
        message = `Process exited with code ${code}.`;
      }
      resolve({ success, command, message });
    });
  });
}

/**
 * Executes a list of commands sequentially.
 * @param {string[]} commands - An array of command strings.
 * @param {Electron.IpcMainEvent} event - The IPC event object.
 * @param {string} responseChannel - The channel to send the response back on.
 */
async function executeCommands(commands, event, responseChannel) {
  const results = [];
  for (const command of commands) {
    try {
      const result = await executeCommand(command);
      results.push(result);
    } catch (err) {
      log(`Error executing command "${command}": ${err.message}`, "error");
      results.push({ success: false, command, message: err.toString() });
    }
  }
  if (!event.sender.isDestroyed()) {
    event.reply(responseChannel, results);
  } else {
    log(`Window destroyed before sending response on ${responseChannel}`, "warn");
  }
}

/**
 * Gets the commands to execute based on selected IDs and options array.
 * @param {string[]} selectedIds - Array of selected option IDs.
 * @param {Array<object>} optionsArray - Array of option objects.
 * @returns {string[]} Array of command strings to execute.
 */
function getCommandsToExecute(selectedIds, optionsArray) {
  const commands = [];
  for (const opt of optionsArray) {
    const isSelected = selectedIds.includes(opt.id);
    let cmd = null;
    if (opt.command && isSelected) {
      cmd = opt.command;
    }
    if (cmd) {
      const wrappedCmd = wrapCommand(cmd);
      if (wrappedCmd) {
        commands.push(wrappedCmd);
      }
    }
  }
  return commands;
}

ipcMain.on("apply-remove-apps", (event, selectedIds) => {
  log(`Received apply-remove-apps with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, removeAppsOptions);
  executeCommands(commands, event, "remove-apps-response");
});

ipcMain.on("apply-useless-bloatware", (event, selectedIds) => {
  log(`Received apply-useless-bloatware with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, uselessBloatwareOptions);
  executeCommands(commands, event, "useless-bloatware-response");
});

/**
 * Checks if an AppX package matching a pattern is installed.
 * @param {string} appId - The internal ID used to find the command.
 * @param {Array<object>} optionsArray - The array of app options to search within.
 * @returns {Promise<{installed: boolean}>} Promise resolving with installation status.
 */
async function checkAppInstallationStatus(appId, optionsArray) {
  let option = null;
  for (const opt of optionsArray) {
    if (opt.id === appId) {
      option = opt;
      break;
    }
  }

  if (!option || !option.command) {
    log(`Option or command not found for app ID: ${appId}`, "warn");
    return { installed: false };
  }

  const match = option.command.match(/-Name\s+(['"])?([^\s'"]+)\1/);
  if (!match || !match[2]) {
    log(`Could not extract package name from command for app ID: ${appId}`, "warn");
    return { installed: false };
  }

  const pattern = match[2];
  const checkCmd = `Get-AppxPackage -Name ${pattern} -ErrorAction SilentlyContinue`;

  return new Promise((resolve) => {
    let outputData = "";
    let errorData = "";
    const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", checkCmd]);

    psProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    psProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    psProcess.on("close", (code) => {
      const installed = code === 0 && outputData.trim().length > 0;
      if (code !== 0) {
        log(`App check command for "${pattern}" failed with code ${code}. Stderr: ${errorData.trim()}`, "warn");
      }
      resolve({ installed });
    });

    psProcess.on("error", (err) => {
      log(`Error spawning process for app check "${pattern}": ${err.message}`, "error");
      resolve({ installed: false });
    });
  });
}

ipcMain.handle("check-remove-app-status", async (event, appId) => {
  return checkAppInstallationStatus(appId, removeAppsOptions);
});

ipcMain.handle("check-app-status", async (event, appId) => {
  return checkAppInstallationStatus(appId, uselessBloatwareOptions);
});
