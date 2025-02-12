const { ipcMain } = require('electron');
const { spawn } = require('child_process');

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

const privacyOptions = [
  { id: "privacy1", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 0 /f', comment: "Disabling Activity History & User Activity Tracking", onerror: "Failed to disable Activity History tracking" },
  { id: "privacy2", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors" /v DisableLocation /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maps" /v AutoUpdateEnabled /t REG_DWORD /d 0 /f', comment: "Disabling Location Services & Maps", onerror: "Failed to disable Location Services" },
  { id: "privacy3", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f', comment: "Disabling Telemetry & Diagnostic Data Collection", onerror: "Failed to disable Telemetry" },
  { id: "privacy4", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 1 /f', comment: "Disabling Feedback & Error Reporting", onerror: "Failed to disable Feedback notifications" },
  { id: "privacy5", command: 'reg add "HKCU\\Software\\Policies\\Microsoft\\WindowsInkWorkspace" /v AllowWindowsInkWorkspace /t REG_DWORD /d 0 /f', comment: "Disabling Windows Ink Workspace", onerror: "Failed to disable Windows Ink Workspace" },
  { id: "privacy6", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo" /v DisabledByGroupPolicy /t REG_DWORD /d 1 /f', comment: "Disabling Advertising ID & Personalized Ads", onerror: "Failed to disable Advertising ID" },
  { id: "privacy7", command: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Deny /f', comment: "Disabling Account Info & Notifications", onerror: "Failed to disable Account Notifications" },
  { id: "privacy8", command: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 1 /f', comment: "Disabling Language & Input Data Collection", onerror: "Failed to disable Input Data Collection" },
  { id: "privacy9", command: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Speech_OneCore\\Settings\\VoiceActivation" /v UserPreferenceForAllApps /t REG_DWORD /d 0 /f', comment: "Disabling Speech Recognition", onerror: "Failed to disable Speech Recognition" },
  { id: "privacy10", command: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v HarvestContacts /t REG_DWORD /d 0 /f', comment: "Disabling Inking & Typing Data Collection", onerror: "Failed to disable Inking & Typing Data Collection" },
  { id: "privacy11", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Remote Assistance" /v fAllowToGetHelp /t REG_DWORD /d 0 /f', comment: "Disabling Remote Assistance", onerror: "Failed to disable Remote Assistance" },
  { id: "privacy12", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CurrentVersion\\Device Metadata" /v PreventDeviceMetadataFromNetwork /t REG_DWORD /d 1 /f', comment: "Disabling Device Metadata Collection", onerror: "Failed to disable Device Metadata Collection" },
  { id: "privacy13", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsConsumerFeatures /t REG_DWORD /d 1 /f', comment: "Disabling Windows Consumer Features", onerror: "Failed to disable Consumer Features" },
  { id: "privacy14", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy" /v LetAppsRunInBackground /t REG_DWORD /d 0 /f', comment: "Disabling Background Apps", onerror: "Failed to disable Background Apps" },
  { id: "privacy15", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f', comment: "Disabling Cortana", onerror: "Failed to disable Cortana" },
  { id: "privacy16", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WlanSvc" /v AllowWiFiSenseHotspots /t REG_DWORD /d 0 /f', comment: "Disabling WiFi Sense Features", onerror: "Failed to disable WiFi Sense" },
  { id: "privacy17", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maintenance" /v MaintenanceDisabled /t REG_DWORD /d 1 /f', comment: "Disabling Automatic Maintenance", onerror: "Failed to disable Automatic Maintenance" },
  { id: "privacy18", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\PushToInstall" /v DisablePushToInstall /t REG_DWORD /d 1 /f', comment: "Disabling Push to Install", onerror: "Failed to disable Push to Install" },
  { id: "privacy19", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\ContentDeliveryManager" /v SubscribedContentEnabled /t REG_DWORD /d 0 /f', comment: "Disabling Ads & Promotional Content", onerror: "Failed to disable Ads" },
  { id: "privacy20", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v RotatingLockScreenEnabled /t REG_DWORD /d 0 /f', comment: "Disabling Lock Screen Features & Slideshows", onerror: "Failed to disable Lock Screen Slideshows" },
  { id: "privacy21", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\BitLocker" /v DisableAutoEncryption /t REG_DWORD /d 1 /f', comment: "Disabling Automatic Bitlocker Drive Encryption", onerror: "Failed to disable Bitlocker AutoEncryption" },
  { id: "privacy22", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\EnhancedStorageDevices" /v TCGSecurityActivationDisabled /t REG_DWORD /d 1 /f', comment: "Disabling TCG Security Device Activation", onerror: "Failed to disable TCG Security Activation" },
  { id: "privacy23", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v DisableAutomaticRestartSignOn /t REG_DWORD /d 1 /f', comment: "Disabling Automatic Restart Sign‐on", onerror: "Failed to disable Automatic Restart Sign‐on" }
];

const gamingOptions = [
  { id: "gaming1", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameMode" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f', comment: "Enabling Game Mode", onerror: "Failed to enable Game Mode" },
  { id: "gaming2", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f', comment: "Disabling Game Bar & Game DVR", onerror: "Failed to disable Game DVR" },
  { id: "gaming3", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameBar" /v UseNexusForGameBarEnabled /t REG_DWORD /d 0 /f', comment: "Disabling Xbox Game Bar Controller Launch", onerror: "Failed to disable Xbox Game Bar launch" },
  { id: "gaming4", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\DirectX" /v EnableSwapEffectUpgrade /t REG_DWORD /d 0 /f', comment: "Disabling Variable Refresh Rate", onerror: "Failed to disable Variable Refresh Rate" },
  { id: "gaming5", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameDVR" /v WindowedOptimizationsEnabled /t REG_DWORD /d 1 /f', comment: "Enabling Windowed Games Optimizations", onerror: "Failed to enable Windowed Games Optimizations" },
  { id: "gaming6", command: 'reg add "HKLM\\SOFTWARE\\Policies\\NVIDIA" /v EnableOldSharpening /t REG_DWORD /d 1 /f', comment: "Enabling Old Nvidia Sharpening", onerror: "Failed to enable old Nvidia sharpening" },
  { id: "gaming7", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f', comment: "Improving Multimedia Responsiveness", onerror: "Failed to adjust multimedia responsiveness" },
  { id: "gaming8", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f', comment: "Adjusting Network for Gaming Performance", onerror: "Failed to adjust network throttling" },
  { id: "gaming9", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d 6 /f', comment: "Increasing CPU & GPU Priority for Gaming", onerror: "Failed to adjust gaming priorities" },
  { id: "gaming10", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d High /f', comment: "Setting Scheduling Category to High", onerror: "Failed to set scheduling category" },
  { id: "gaming11", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f', comment: "Enabling Hardware-Accelerated GPU Scheduling", onerror: "Failed to enable GPU scheduling" },
  { id: "gaming12", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f', comment: "Adjusting Win32 Priority Separation", onerror: "Failed to adjust Win32 priority separation" },
  { id: "gaming13", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\StorageSense" /v AllowStorageSenseGlobal /t REG_DWORD /d 0 /f', comment: "Disabling Storage Sense", onerror: "Failed to disable Storage Sense" }
];

const updatesOptions = [
  { id: "updates1", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /t REG_DWORD /d 1 /f', comment: "Disabling Automatic Updates", onerror: "Failed to disable Automatic Updates" },
  { id: "updates2", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferFeatureUpdatesPeriodInDays /t REG_DWORD /d 365 /f', comment: "Delaying Feature Updates by 365 days", onerror: "Failed to delay Feature Updates" },
  { id: "updates3", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferQualityUpdatesPeriodInDays /t REG_DWORD /d 7 /f', comment: "Delaying Security Updates by 7 days", onerror: "Failed to delay Security Updates" },
  { id: "updates4", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersion /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersionInfo /t REG_SZ /d "10" /f', comment: "Disabling Automatic Upgrade from Win10 to Win11", onerror: "Failed to disable automatic upgrade" },
  { id: "updates5", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f', comment: "Disabling Delivery Optimization", onerror: "Failed to disable Delivery Optimization" },
  { id: "updates6", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v AutoDownload /t REG_DWORD /d 2 /f', comment: "Disabling Auto updates for Store apps", onerror: "Failed to disable auto updates for Store apps" },
  { id: "updates7", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Appx" /v AllowAutomaticAppArchiving /t REG_DWORD /d 0 /f', comment: "Disabling Auto archiving of unused apps", onerror: "Failed to disable auto archiving" }
];

const powerOptions = [
  { id: "power1", command: 'powercfg /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 99999999-9999-9999-9999-999999999999; powercfg /setactive 99999999-9999-9999-9999-999999999999', comment: "Applying Ultimate Power Plan (Max Performance)", onerror: "Failed to set Ultimate Power Plan" },
  { id: "power2", command: 'powercfg /hibernate off; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f', comment: "Disabling Hibernate, Sleep, and Fast Boot", onerror: "Failed to disable Hibernate/Sleep/Fast Boot" },
  { id: "power3", command: 'reg add "HKLM\\SYSTEM\\ControlSet001\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f', comment: "Unparking CPU Cores", onerror: "Failed to unpark CPU cores" },
  { id: "power4", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f', comment: "Disabling Power Throttling", onerror: "Failed to disable Power Throttling" },
  { id: "power5", command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_USB 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_USB 0', comment: "Disabling USB Selective Suspend", onerror: "Failed to disable USB Selective Suspend" },
  { id: "power6", command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PCIEXPRESS 0', comment: "Disabling PCI Express Link State Power Management", onerror: "Failed to disable PCI Express power management" },
  { id: "power7", command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100; powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMAX 100', comment: "Setting Processor State Always at 100%", onerror: "Failed to set processor state to 100%" },
  { id: "power8", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\7516b95f-f776-4464-8c53-06167f40cc99\\aded5e82-b909-4619-9949-f5d71dac0bcb" /v ValueMax /t REG_DWORD /d 100 /f', comment: "Setting Display Brightness to 100%", onerror: "Failed to set display brightness to 100%" },
  { id: "power9", command: 'echo "Battery Saver will be disabled"', comment: "Disabling Battery Saver", onerror: "Failed to disable Battery Saver" },
  { id: "power10", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\e73a048d-bf27-4f12-9731-8b2076e8891f\\637ea02f-bbcb-4015-8e2c-a1c7b9c0b546" /v ValueMax /t REG_DWORD /d 0 /f', comment: "Disabling Critical Battery Actions", onerror: "Failed to disable Critical Battery Actions" }
];

const servicesOptions = [
  { id: "services1", command: 'sc config "AJRouter" start= disabled', comment: "Disabling AllJoyn Router Service", onerror: "Failed to disable AllJoyn Router Service" },
  { id: "services2", command: 'sc config "AppVClient" start= disabled', comment: "Disabling Application Virtualization Client", onerror: "Failed to disable Application Virtualization Client" },
  { id: "services3", command: 'sc config "AssignedAccessManagerSvc" start= disabled', comment: "Disabling Assigned Access Manager Service", onerror: "Failed to disable Assigned Access Manager Service" },
  { id: "services4", command: 'sc config "DiagTrack" start= disabled', comment: "Disabling Connected User Experiences and Telemetry", onerror: "Failed to disable Connected User Experiences and Telemetry" },
  { id: "services5", command: 'sc config "DialogBlockingService" start= disabled', comment: "Disabling Dialog Blocking Service", onerror: "Failed to disable Dialog Blocking Service" },
  { id: "services6", command: 'sc config "NetTcpPortSharing" start= disabled', comment: "Disabling Net.Tcp Port Sharing Service", onerror: "Failed to disable Net.Tcp Port Sharing Service" },
  { id: "services7", command: 'sc config "RemoteAccess" start= disabled', comment: "Disabling Remote Access Connection Manager", onerror: "Failed to disable Remote Access Connection Manager" },
  { id: "services8", command: 'sc config "RemoteRegistry" start= disabled', comment: "Disabling Remote Registry Service", onerror: "Failed to disable Remote Registry Service" },
  { id: "services9", command: 'sc config "UevAgentService" start= disabled', comment: "Disabling User Experience Virtualization Service", onerror: "Failed to disable User Experience Virtualization Service" },
  { id: "services10", command: 'sc config "shpamsvc" start= disabled', comment: "Disabling Shared Protection Access Manager", onerror: "Failed to disable Shared Protection Access Manager" },
  { id: "services11", command: 'sc config "ssh-agent" start= disabled', comment: "Disabling OpenSSH Authentication Agent", onerror: "Failed to disable OpenSSH Authentication Agent" },
  { id: "services12", command: 'sc config "tzautoupdate" start= disabled', comment: "Disabling Auto Time Zone Updater", onerror: "Failed to disable Auto Time Zone Updater" },
  { id: "services13", command: 'sc config "uhssvc" start= disabled', comment: "Disabling Microsoft Update Health Service", onerror: "Failed to disable Microsoft Update Health Service" }
];

const maintenanceOptions = [
  { id: "maintenance1", command: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force', comment: "Cleaning temporary files", onerror: "Failed to clean temporary files" },
  { id: "maintenance2", command: 'Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Recurse -Force', comment: "Cleaning prefetch folder", onerror: "Failed to clean prefetch folder" },
  { id: "maintenance3", command: 'Stop-Service wuauserv; Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force; Start-Service wuauserv', comment: "Clearing Windows Update cache", onerror: "Failed to clear Windows Update cache" },
  { id: "maintenance4", command: 'defrag C: -w', comment: "Defragmenting drive C:", onerror: "Failed to defragment drive C:" },
  { id: "maintenance5", command: 'reg add "HKCU\\Control Panel\\Desktop" /v MinAnimate /t REG_SZ /d 0 /f', comment: "Disabling window animations", onerror: "Failed to disable window animations" }
];

const escapeAmpersands = (str) => str.replace(/&/g, '`&');
const wrapCommand = (opt) => {
  const safeComment = escapeAmpersands(opt.comment);
  const safeOnError = escapeAmpersands(opt.onerror);
  return `echo "${safeComment}"; ${opt.command}; if (-not $?) { echo "${safeOnError}" }`;
};

function executeCommands(command, event, responseChannel) {
  log("Executing command: " + command);
  let outputData = "";
  const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', command]);
  psProcess.stdout.on('data', (data) => {
    outputData += data.toString().trim() + "\n";
  });
  psProcess.stderr.on('data', (data) => {
    outputData += "ERROR: " + data.toString().trim() + "\n";
  });
  psProcess.on('close', (code) => {
    log("Process closed with code: " + code);
    event.reply(responseChannel, { success: code === 0, message: outputData || `Process exited with code ${code}` });
  });
}

ipcMain.on('apply-privacy-optimizations', (event, selectedIds) => {
  log("Received apply-privacy-optimizations with data: " + JSON.stringify(selectedIds));
  const commands = privacyOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'privacy-optimizations-response');
});

ipcMain.on('apply-gaming-optimizations', (event, selectedIds) => {
  log("Received apply-gaming-optimizations with data: " + JSON.stringify(selectedIds));
  const commands = gamingOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'gaming-optimizations-response');
});

ipcMain.on('apply-updates-optimizations', (event, selectedIds) => {
  log("Received apply-updates-optimizations with data: " + JSON.stringify(selectedIds));
  const commands = updatesOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'updates-optimizations-response');
});

ipcMain.on('apply-power-optimizations', (event, selectedIds) => {
  log("Received apply-power-optimizations with data: " + JSON.stringify(selectedIds));
  const commands = powerOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'power-optimizations-response');
});

ipcMain.on('apply-services-optimizations', (event, selectedIds) => {
  log("Received apply-services-optimizations with data: " + JSON.stringify(selectedIds));
  const commands = servicesOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'services-optimizations-response');
});

ipcMain.on('apply-maintenance-optimizations', (event, selectedIds) => {
  log("Received apply-maintenance-optimizations with data: " + JSON.stringify(selectedIds));
  const commands = maintenanceOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'maintenance-optimizations-response');
});
