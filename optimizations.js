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

const privacyOptions = [
  {
    id: "privacy1",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy2",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors" /v DisableLocation /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maps" /v AutoUpdateEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors" /v DisableLocation /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maps" /v AutoUpdateEnabled /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy3",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy4",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy5",
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\WindowsInkWorkspace" /v AllowWindowsInkWorkspace /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\WindowsInkWorkspace" /v AllowWindowsInkWorkspace /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy6",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo" /v DisabledByGroupPolicy /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo" /v DisabledByGroupPolicy /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy7",
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Deny /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Allow /f',
  },
  {
    id: "privacy8",
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy9",
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Speech_OneCore\\Settings\\VoiceActivation" /v UserPreferenceForAllApps /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Speech_OneCore\\Settings\\VoiceActivation" /v UserPreferenceForAllApps /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy10",
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v HarvestContacts /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v HarvestContacts /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy11",
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Remote Assistance" /v fAllowToGetHelp /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Remote Assistance" /v fAllowToGetHelp /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy12",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CurrentVersion\\Device Metadata" /v PreventDeviceMetadataFromNetwork /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CurrentVersion\\Device Metadata" /v PreventDeviceMetadataFromNetwork /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy13",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsConsumerFeatures /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsConsumerFeatures /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy14",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy" /v LetAppsRunInBackground /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy" /v LetAppsRunInBackground /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy15",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy16",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WlanSvc" /v AllowWiFiSenseHotspots /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WlanSvc" /v AllowWiFiSenseHotspots /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy17",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maintenance" /v MaintenanceDisabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maintenance" /v MaintenanceDisabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy18",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\PushToInstall" /v DisablePushToInstall /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\PushToInstall" /v DisablePushToInstall /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy19",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\ContentDeliveryManager" /v SubscribedContentEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\ContentDeliveryManager" /v SubscribedContentEnabled /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy20",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v RotatingLockScreenEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v RotatingLockScreenEnabled /t REG_DWORD /d 1 /f',
  },
  {
    id: "privacy21",
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\BitLocker" /v DisableAutoEncryption /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\BitLocker" /v DisableAutoEncryption /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy22",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\EnhancedStorageDevices" /v TCGSecurityActivationDisabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\EnhancedStorageDevices" /v TCGSecurityActivationDisabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy23",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v DisableAutomaticRestartSignOn /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v DisableAutomaticRestartSignOn /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy24",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsSpotlightFeatures /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsSpotlightFeatures /t REG_DWORD /d 0 /f',
  },
  {
    id: "privacy25",
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 1 /f',
  },
];

const gamingOptions = [
  {
    id: "gaming1",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameMode" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameMode" /v AutoGameModeEnabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "gaming2",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 1 /f',
  },
  {
    id: "gaming3",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameBar" /v UseNexusForGameBarEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameBar" /v UseNexusForGameBarEnabled /t REG_DWORD /d 1 /f',
  },
  {
    id: "gaming4",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\DirectX" /v EnableSwapEffectUpgrade /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\DirectX" /v EnableSwapEffectUpgrade /t REG_DWORD /d 1 /f',
  },
  {
    id: "gaming5",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameDVR" /v WindowedOptimizationsEnabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameDVR" /v WindowedOptimizationsEnabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "gaming6",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\NVIDIA" /v EnableOldSharpening /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\NVIDIA" /v EnableOldSharpening /t REG_DWORD /d 0 /f',
  },
  {
    id: "gaming7",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 1 /f',
  },
  {
    id: "gaming8",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0 /f',
  },
  {
    id: "gaming9",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d 6 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d 0 /f',
  },
  {
    id: "gaming10",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d High /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d Normal /f',
  },
  {
    id: "gaming11",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 0 /f',
  },
  {
    id: "gaming12",
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 0 /f',
  },
  {
    id: "gaming13",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\StorageSense" /v AllowStorageSenseGlobal /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\StorageSense" /v AllowStorageSenseGlobal /t REG_DWORD /d 1 /f',
  },
  {
    id: "gaming14",
    commandOn: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f',
    commandOff: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 0 /f',
  },
];

const updatesOptions = [
  {
    id: "updates1",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /t REG_DWORD /d 0 /f',
  },
  {
    id: "updates2",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferFeatureUpdatesPeriodInDays /t REG_DWORD /d 365 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferFeatureUpdatesPeriodInDays /t REG_DWORD /d 0 /f',
  },
  {
    id: "updates3",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferQualityUpdatesPeriodInDays /t REG_DWORD /d 7 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferQualityUpdatesPeriodInDays /t REG_DWORD /d 0 /f',
  },
  {
    id: "updates4",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersion /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersionInfo /t REG_SZ /d "21H2" /f',
    commandOff: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersion /f; reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersionInfo /f',
  },
  {
    id: "updates5",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 1 /f',
  },
  {
    id: "updates6",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v AutoDownload /t REG_DWORD /d 2 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v AutoDownload /t REG_DWORD /d 0 /f',
  },
  {
    id: "updates7",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Appx" /v AllowAutomaticAppArchiving /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Appx" /v AllowAutomaticAppArchiving /t REG_DWORD /d 1 /f',
  },
];

const servicesOptions = [
  {
    id: "services1",
    commandOn: 'sc.exe config "AppVClient" start=disabled',
    commandOff: 'sc.exe config "AppVClient" start=auto',
  },
  {
    id: "services2",
    commandOn: 'sc.exe config "AssignedAccessManagerSvc" start=disabled',
    commandOff: 'sc.exe config "AssignedAccessManagerSvc" start=auto',
  },
  {
    id: "services3",
    commandOn: 'sc.exe config "DiagTrack" start=disabled',
    commandOff: 'sc.exe config "DiagTrack" start=auto',
  },
  {
    id: "services4",
    commandOn: 'sc.exe config "DialogBlockingService" start=disabled',
    commandOff: 'sc.exe config "DialogBlockingService" start=auto',
  },
  {
    id: "services5",
    commandOn: 'sc.exe config "NetTcpPortSharing" start=disabled',
    commandOff: 'sc.exe config "NetTcpPortSharing" start=auto',
  },
  {
    id: "services6",
    commandOn: 'sc.exe config "RemoteAccess" start=disabled',
    commandOff: 'sc.exe config "RemoteAccess" start=auto',
  },
  {
    id: "services7",
    commandOn: 'sc.exe config "RemoteRegistry" start=disabled',
    commandOff: 'sc.exe config "RemoteRegistry" start=auto',
  },
  {
    id: "services8",
    commandOn: 'sc.exe config "UevAgentService" start=disabled',
    commandOff: 'sc.exe config "UevAgentService" start=auto',
  },
  {
    id: "services9",
    commandOn: 'sc.exe config "shpamsvc" start=disabled',
    commandOff: 'sc.exe config "shpamsvc" start=auto',
  },
  {
    id: "services10",
    commandOn: 'sc.exe config "ssh-agent" start=disabled',
    commandOff: 'sc.exe config "ssh-agent" start=auto',
  },
  {
    id: "services11",
    commandOn: 'sc.exe config "tzautoupdate" start=disabled',
    commandOff: 'sc.exe config "tzautoupdate" start=auto',
  },
  {
    id: "services12",
    commandOn: 'sc.exe config "Spooler" start=disabled',
    commandOff: 'sc.exe config "Spooler" start=auto',
  },
  {
    id: "services13",
    commandOn: 'sc.exe config "bthserv" start=disabled',
    commandOff: 'sc.exe config "bthserv" start=auto',
  },
  {
    id: "services14",
    commandOn: 'sc.exe config "TermService" start=disabled',
    commandOff: 'sc.exe config "TermService" start=auto',
  },
];

const maintenanceOptions = [
  {
    id: "maintenance1",
    commandOn: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue; exit 0',
    commandOff: 'echo "No maintenance action performed"',
  },
  {
    id: "maintenance2",
    commandOn: 'Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Recurse -Force -ErrorAction SilentlyContinue; exit 0',
    commandOff: 'echo "No maintenance action performed"',
  },
  {
    id: "maintenance3",
    commandOn: 'Stop-Service wuauserv -ErrorAction SilentlyContinue; Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue; Start-Service wuauserv -ErrorAction SilentlyContinue; exit 0',
    commandOff: 'echo "No maintenance action performed"',
  },
  {
    id: "maintenance4",
    commandOn: "Clear-RecycleBin -DriveLetter C -Force -ErrorAction SilentlyContinue; exit 0",
    commandOff: 'echo "No maintenance action performed"',
  },
  {
    id: "maintenance5",
    commandOn: 'wevtutil el | ForEach-Object { wevtutil cl "$_" 2>&1 | Out-Null }; exit 0',
    commandOff: 'echo "No maintenance action performed"',
  },
  {
    id: "maintenance6",
    commandOn: 'Remove-Item -Path "C:\\Windows\\Logs\\CBS\\*" -Recurse -Force -ErrorAction SilentlyContinue; exit 0',
    commandOff: 'echo "No maintenance action performed"',
  },
  {
    id: "maintenance7",
    commandOn: 'Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" -Force -ErrorAction SilentlyContinue; exit 0',
    commandOff: 'echo "No maintenance action performed"',
  },
  {
    id: "maintenance8",
    commandOn: "Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase; exit 0",
    commandOff: 'echo "No maintenance action performed"',
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
    if (opt.command) {
      if (isSelected) {
        cmd = opt.command;
      }
    } else if (opt.commandOn && opt.commandOff) {
      cmd = isSelected ? opt.commandOn : opt.commandOff;
    } else if (opt.commandOn) {
      if (isSelected) {
        cmd = opt.commandOn;
      }
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

ipcMain.on("apply-privacy-optimizations", (event, selectedIds) => {
  log(`Received apply-privacy-optimizations with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, privacyOptions);
  executeCommands(commands, event, "privacy-optimizations-response");
});

ipcMain.on("apply-gaming-optimizations", (event, selectedIds) => {
  log(`Received apply-gaming-optimizations with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, gamingOptions);
  executeCommands(commands, event, "gaming-optimizations-response");
});

ipcMain.on("apply-updates-optimizations", (event, selectedIds) => {
  log(`Received apply-updates-optimizations with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, updatesOptions);
  executeCommands(commands, event, "updates-optimizations-response");
});

ipcMain.on("apply-services-optimizations", (event, selectedIds) => {
  log(`Received apply-services-optimizations with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, servicesOptions);
  executeCommands(commands, event, "services-optimizations-response");
});

ipcMain.on("apply-maintenance-optimizations", (event, selectedIds) => {
  log(`Received apply-maintenance-optimizations with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, maintenanceOptions);
  executeCommands(commands, event, "maintenance-optimizations-response");
});

/**
 * Checks the state of a registry value.
 * @param {string} keyPath - The registry key path.
 * @param {string} valueName - The name of the value.
 * @param {string} expectedValue - The expected data for the value.
 * @param {string} valueType - The expected type (e.g., 'REG_DWORD', 'REG_SZ').
 * @returns {Promise<boolean>} True if the current value matches the expected value.
 */
function checkRegistryValue(keyPath, valueName, expectedValue, valueType) {
  return new Promise((resolve) => {
    const queryCmd = `reg query "${keyPath}" /v ${valueName}`;
    let outputData = "";
    let errorData = "";

    const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", queryCmd]);

    psProcess.stdout.on("data", (data) => (outputData += data.toString()));
    psProcess.stderr.on("data", (data) => (errorData += data.toString()));

    psProcess.on("close", (code) => {
      if (code !== 0) {
        log(`Registry query failed for "${keyPath}" /v ${valueName}. Code: ${code}. Stderr: ${errorData.trim()}`, "warn");
        resolve(false);
        return;
      }

      const upperValueType = valueType.toUpperCase();
      let valuePattern;

      if (upperValueType === "REG_DWORD") {
        const hexExpected = `0x${Number.parseInt(expectedValue).toString(16)}`;
        valuePattern = new RegExp(`${valueName}\\s+${valueType}\\s+${hexExpected}`, "i");
      } else if (upperValueType === "REG_SZ" && valueName === "/ve") {
        valuePattern = new RegExp(`\\(Default\\)\\s+REG_SZ\\s+${expectedValue}`, "i");
      } else {
        valuePattern = new RegExp(`${valueName}\\s+${valueType}\\s+${expectedValue}`, "i");
      }

      const valueMatch = outputData.match(valuePattern);
      resolve(!!valueMatch);
    });

    psProcess.on("error", (err) => {
      log(`Error spawning process for registry query "${keyPath}" /v ${valueName}: ${err.message}`, "error");
      resolve(false);
    });
  });
}

/**
 * Checks the start type of a Windows service.
 * @param {string} serviceName - The name of the service.
 * @param {string} expectedStartType - The expected start type ('auto', 'disabled', 'demand').
 * @returns {Promise<boolean>} True if the current start type matches the expected type.
 */
function checkServiceStartType(serviceName, expectedStartType) {
  return new Promise((resolve) => {
    const checkCmd = `sc qc "${serviceName}"`;
    let outputData = "";
    let errorData = "";

    const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", checkCmd]);

    psProcess.stdout.on("data", (data) => (outputData += data.toString()));
    psProcess.stderr.on("data", (data) => (errorData += data.toString()));

    psProcess.on("close", (code) => {
      if (code !== 0) {
        log(`Service query failed for "${serviceName}". Code: ${code}. Stderr: ${errorData.trim()}`, "warn");
        resolve(false);
        return;
      }

      const startTypeLine = outputData.split("\n").find((line) => line.trim().startsWith("START_TYPE"));

      if (!startTypeLine) {
        log(`Could not find START_TYPE line for service "${serviceName}"`, "warn");
        resolve(false);
        return;
      }

      const currentTypeMatch = startTypeLine.match(/:\s*\d+\s+([\w_]+)/);
      if (!currentTypeMatch) {
        log(`Could not parse START_TYPE line for service "${serviceName}": ${startTypeLine}`, "warn");
        resolve(false);
        return;
      }

      const currentType = currentTypeMatch[1].toLowerCase();
      const expectedType = expectedStartType.toLowerCase();

      const typeMap = {
        auto: "auto_start",
        disabled: "disabled",
        demand: "demand_start",
      };

      resolve(currentType === typeMap[expectedType]);
    });

    psProcess.on("error", (err) => {
      log(`Error spawning process for service query "${serviceName}": ${err.message}`, "error");
      resolve(false);
    });
  });
}

ipcMain.handle("check-optimization-state", async (event, category, optionId) => {
  let option = null;
  let optionsArray = null;
  let checkType = null;

  switch (category) {
    case "privacy":
      optionsArray = privacyOptions;
      checkType = "registry";
      break;
    case "gaming":
      optionsArray = gamingOptions;
      checkType = "registry";
      break;
    case "updates":
      optionsArray = updatesOptions;
      checkType = "registry";
      break;
    case "services":
      optionsArray = servicesOptions;
      checkType = "service";
      break;
    case "maintenance":
      return null;
    default:
      log(`Unknown category for check-optimization-state: ${category}`, "warn");
      return null;
  }

  for (const opt of optionsArray) {
    if (opt.id === optionId) {
      option = opt;
      break;
    }
  }

  if (!option) {
    log(`Option not found for ID: ${optionId} in category: ${category}`, "warn");
    return null;
  }

  if (!option.commandOn) {
    return null;
  }

  if (checkType === "registry") {
    const regCommands = option.commandOn
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.startsWith("reg add"));

    if (regCommands.length === 0) {
      log(`No valid 'reg add' commands found for option ${optionId}`, "warn");
      return false;
    }

    for (const command of regCommands) {
      const regex = /reg add "([^"]+)"\s+\/v\s+(\S+)\s+\/t\s+(\S+)\s+\/d\s+(.+)\s+\/f/i;
      const match = command.match(regex);
      if (!match) {
        log(`Could not parse reg command for state check: ${command}`, "warn");
        return false;
      }
      const [, keyPath, valueName, valueType, expectedValueRaw] = match;
      const expectedValue = expectedValueRaw.trim();
      const isMatch = await checkRegistryValue(keyPath, valueName, expectedValue, valueType);
      if (!isMatch) return false;
    }
    return true;
  }

  if (checkType === "service") {
    const scMatch = option.commandOn.match(/sc\.exe\s+config\s+"([^"]+)"\s+start=(\w+)/i);
    if (!scMatch) {
      log(`Could not parse sc.exe command: ${option.commandOn}`, "warn");
      return false;
    }
    const [, serviceName, expectedStartType] = scMatch;
    return await checkServiceStartType(serviceName, expectedStartType);
  }

  log(`Unsupported check type for category ${category}`, "warn");
  return false;
});
