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
  {
    id: 'privacy1',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy2',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors" /v DisableLocation /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maps" /v AutoUpdateEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors" /v DisableLocation /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maps" /v AutoUpdateEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy3',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy4',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy5',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\WindowsInkWorkspace" /v AllowWindowsInkWorkspace /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\WindowsInkWorkspace" /v AllowWindowsInkWorkspace /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy6',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo" /v DisabledByGroupPolicy /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo" /v DisabledByGroupPolicy /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy7',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Deny /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Allow /f'
  },
  {
    id: 'privacy8',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy9',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Speech_OneCore\\Settings\\VoiceActivation" /v UserPreferenceForAllApps /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Speech_OneCore\\Settings\\VoiceActivation" /v UserPreferenceForAllApps /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy10',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v HarvestContacts /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v HarvestContacts /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy11',
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Remote Assistance" /v fAllowToGetHelp /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Remote Assistance" /v fAllowToGetHelp /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy12',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CurrentVersion\\Device Metadata" /v PreventDeviceMetadataFromNetwork /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CurrentVersion\\Device Metadata" /v PreventDeviceMetadataFromNetwork /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy13',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsConsumerFeatures /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsConsumerFeatures /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy14',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy" /v LetAppsRunInBackground /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy" /v LetAppsRunInBackground /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy15',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy16',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WlanSvc" /v AllowWiFiSenseHotspots /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WlanSvc" /v AllowWiFiSenseHotspots /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy17',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maintenance" /v MaintenanceDisabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maintenance" /v MaintenanceDisabled /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy18',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\PushToInstall" /v DisablePushToInstall /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\PushToInstall" /v DisablePushToInstall /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy19',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\ContentDeliveryManager" /v SubscribedContentEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\ContentDeliveryManager" /v SubscribedContentEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy20',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v RotatingLockScreenEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v RotatingLockScreenEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'privacy21',
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\BitLocker" /v DisableAutoEncryption /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\BitLocker" /v DisableAutoEncryption /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy22',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\EnhancedStorageDevices" /v TCGSecurityActivationDisabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\EnhancedStorageDevices" /v TCGSecurityActivationDisabled /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy23',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v DisableAutomaticRestartSignOn /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v DisableAutomaticRestartSignOn /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy24',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsSpotlightFeatures /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsSpotlightFeatures /t REG_DWORD /d 0 /f'
  },
  {
    id: 'privacy25',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 1 /f'
  }
];

const gamingOptions = [
  {
    id: 'gaming1',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameMode" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameMode" /v AutoGameModeEnabled /t REG_DWORD /d 0 /f'
  },
  {
    id: 'gaming2',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 1 /f'
  },
  {
    id: 'gaming3',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameBar" /v UseNexusForGameBarEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameBar" /v UseNexusForGameBarEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'gaming4',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\DirectX" /v EnableSwapEffectUpgrade /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\DirectX" /v EnableSwapEffectUpgrade /t REG_DWORD /d 1 /f'
  },
  {
    id: 'gaming5',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameDVR" /v WindowedOptimizationsEnabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameDVR" /v WindowedOptimizationsEnabled /t REG_DWORD /d 0 /f'
  },
  {
    id: 'gaming6',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\NVIDIA" /v EnableOldSharpening /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\NVIDIA" /v EnableOldSharpening /t REG_DWORD /d 0 /f'
  },
  {
    id: 'gaming7',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile" /v SystemResponsiveness /t REG_DWORD /d 1 /f'
  },
  {
    id: 'gaming8',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0 /f'
  },
  {
    id: 'gaming9',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d 6 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d 0 /f'
  },
  {
    id: 'gaming10',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d High /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\MultimediaSystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d Normal /f'
  },
  {
    id: 'gaming11',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 0 /f'
  },
  {
    id: 'gaming12',
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 0 /f'
  },
  {
    id: 'gaming13',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\StorageSense" /v AllowStorageSenseGlobal /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\StorageSense" /v AllowStorageSenseGlobal /t REG_DWORD /d 1 /f'
  },
  {
    id: 'gaming14',
    commandOn: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f',
    commandOff: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 0 /f'
  }
];

const updatesOptions = [
  {
    id: 'updates1',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /t REG_DWORD /d 0 /f'
  },
  {
    id: 'updates2',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferFeatureUpdatesPeriodInDays /t REG_DWORD /d 365 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferFeatureUpdatesPeriodInDays /t REG_DWORD /d 0 /f'
  },
  {
    id: 'updates3',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferQualityUpdatesPeriodInDays /t REG_DWORD /d 7 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferQualityUpdatesPeriodInDays /t REG_DWORD /d 0 /f'
  },
  {
    id: 'updates4',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersion /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersionInfo /t REG_SZ /d "10" /f',
    commandOff: 'reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersion /f; reg delete "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersionInfo /f'
  },
  {
    id: 'updates5',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 1 /f'
  },
  {
    id: 'updates6',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v AutoDownload /t REG_DWORD /d 2 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v AutoDownload /t REG_DWORD /d 0 /f'
  },
  {
    id: 'updates7',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Appx" /v AllowAutomaticAppArchiving /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Appx" /v AllowAutomaticAppArchiving /t REG_DWORD /d 1 /f'
  }
];

const servicesOptions = [
  {
    id: 'services1',
    commandOn: 'sc.exe config "AJRouter" start=disabled',
    commandOff: 'sc.exe config "AJRouter" start=auto'
  },
  {
    id: 'services2',
    commandOn: 'sc.exe config "AppVClient" start=disabled',
    commandOff: 'sc.exe config "AppVClient" start=auto'
  },
  {
    id: 'services3',
    commandOn: 'sc.exe config "AssignedAccessManagerSvc" start=disabled',
    commandOff: 'sc.exe config "AssignedAccessManagerSvc" start=auto'
  },
  {
    id: 'services4',
    commandOn: 'sc.exe config "DiagTrack" start=disabled',
    commandOff: 'sc.exe config "DiagTrack" start=auto'
  },
  {
    id: 'services5',
    commandOn: 'sc.exe config "DialogBlockingService" start=disabled',
    commandOff: 'sc.exe config "DialogBlockingService" start=auto'
  },
  {
    id: 'services6',
    commandOn: 'sc.exe config "NetTcpPortSharing" start=disabled',
    commandOff: 'sc.exe config "NetTcpPortSharing" start=auto'
  },
  {
    id: 'services7',
    commandOn: 'sc.exe config "RemoteAccess" start=disabled',
    commandOff: 'sc.exe config "RemoteAccess" start=auto'
  },
  {
    id: 'services8',
    commandOn: 'sc.exe config "RemoteRegistry" start=disabled',
    commandOff: 'sc.exe config "RemoteRegistry" start=auto'
  },
  {
    id: 'services9',
    commandOn: 'sc.exe config "UevAgentService" start=disabled',
    commandOff: 'sc.exe config "UevAgentService" start=auto'
  },
  {
    id: 'services10',
    commandOn: 'sc.exe config "shpamsvc" start=disabled',
    commandOff: 'sc.exe config "shpamsvc" start=auto'
  },
  {
    id: 'services11',
    commandOn: 'sc.exe config "ssh-agent" start=disabled',
    commandOff: 'sc.exe config "ssh-agent" start=auto'
  },
  {
    id: 'services12',
    commandOn: 'sc.exe config "tzautoupdate" start=disabled',
    commandOff: 'sc.exe config "tzautoupdate" start=auto'
  },
  {
    id: 'services13',
    commandOn: 'sc.exe config "uhssvc" start=disabled',
    commandOff: 'sc.exe config "uhssvc" start=auto'
  },
  {
    id: 'services14',
    commandOn: 'sc.exe config "Spooler" start=disabled',
    commandOff: 'sc.exe config "Spooler" start=auto'
  },
  {
    id: 'services15',
    commandOn: 'sc.exe config "bthserv" start=disabled',
    commandOff: 'sc.exe config "bthserv" start=auto'
  },
  {
    id: 'services16',
    commandOn: 'sc.exe config "TermService" start=disabled',
    commandOff: 'sc.exe config "TermService" start=auto'
  }
];

const maintenanceOptions = [
  {
    id: 'maintenance1',
    commandOn: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue',
    commandOff: 'echo "No maintenance action performed"'
  },
  {
    id: 'maintenance2',
    commandOn: 'Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Recurse -Force -ErrorAction SilentlyContinue',
    commandOff: 'echo "No maintenance action performed"'
  },
  {
    id: 'maintenance3',
    commandOn: 'Stop-Service wuauserv -ErrorAction SilentlyContinue; Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue; Start-Service wuauserv -ErrorAction SilentlyContinue',
    commandOff: 'echo "No maintenance action performed"'
  },
  {
    id: 'maintenance4',
    commandOn: 'Clear-RecycleBin -DriveLetter C -Force',
    commandOff: 'echo "No maintenance action performed"'
  },
  {
    id: 'maintenance5',
    commandOn: 'wevtutil el | ForEach-Object { wevtutil cl "$_" }',
    commandOff: 'echo "No maintenance action performed"'
  },
  {
    id: 'maintenance6',
    commandOn: 'Remove-Item -Path "C:\\Windows\\Logs\\CBS\\*" -Recurse -Force',
    commandOff: 'echo "No maintenance action performed"'
  },
  {
    id: 'maintenance7',
    commandOn: 'Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" -Force -ErrorAction SilentlyContinue',
    commandOff: 'echo "No maintenance action performed"'
  },
  {
    id: 'maintenance8',
    commandOn: 'Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase',
    commandOff: 'echo "No maintenance action performed"'
  }
];

function wrapCommand(cmd) {
  return cmd.replace(/&&/g, ';');
}

function executeCommand(command) {
  return new Promise((resolve) => {
    log('Executing command: ' + command);
    let outputData = '';
    const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', command]);

    psProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      outputData += output + '\n';
      log(`Output: ${output}`);
    });

    psProcess.stderr.on('data', (data) => {
      const errorOutput = data.toString().trim();
      outputData += 'ERROR: ' + errorOutput + '\n';
      log(`Error: ${errorOutput}`, 'error');
    });

    psProcess.on('error', (error) => {
      log('Process error: ' + error, 'error');
      resolve({ success: false, command, message: error.toString() });
    });

    psProcess.on('close', (code) => {
      log('Process closed with code: ' + code);
      if (code === 0) {
        resolve({ success: true, command, message: outputData });
      } else {
        resolve({ success: false, command, message: outputData || `Process exited with code ${code}` });
      }
    });
  });
}

async function executeCommands(commands, event, responseChannel) {
  const results = [];
  for (const command of commands) {
    try {
      const result = await executeCommand(command);
      results.push(result);
    } catch (err) {
      results.push({ success: false, command, message: err.toString() });
    }
  }
  event.reply(responseChannel, results);
}

ipcMain.on('apply-privacy-optimizations', (event, selectedIds) => {
  log('Received apply-privacy-optimizations with data: ' + JSON.stringify(selectedIds));
  const commands = privacyOptions.map((opt) => { if (selectedIds.includes(opt.id)) return wrapCommand(opt.commandOn); return wrapCommand(opt.commandOff); });
  executeCommands(commands, event, 'privacy-optimizations-response');
});

ipcMain.on('apply-gaming-optimizations', (event, selectedIds) => {
  log('Received apply-gaming-optimizations with data: ' + JSON.stringify(selectedIds));
  const commands = gamingOptions.map((opt) => { if (selectedIds.includes(opt.id)) return wrapCommand(opt.commandOn); return wrapCommand(opt.commandOff); });
  executeCommands(commands, event, 'gaming-optimizations-response');
});

ipcMain.on('apply-updates-optimizations', (event, selectedIds) => {
  log('Received apply-updates-optimizations with data: ' + JSON.stringify(selectedIds));
  const commands = updatesOptions.map((opt) => { if (selectedIds.includes(opt.id)) return wrapCommand(opt.commandOn); return wrapCommand(opt.commandOff); });
  executeCommands(commands, event, 'updates-optimizations-response');
});

ipcMain.on('apply-services-optimizations', (event, selectedIds) => {
  log('Received apply-services-optimizations with data: ' + JSON.stringify(selectedIds));
  const commands = servicesOptions.map((opt) => { if (selectedIds.includes(opt.id)) return wrapCommand(opt.commandOn); return wrapCommand(opt.commandOff); });
  executeCommands(commands, event, 'services-optimizations-response');
});

ipcMain.on('apply-maintenance-optimizations', (event, selectedIds) => {
  log('Received apply-maintenance-optimizations with data: ' + JSON.stringify(selectedIds));
  const commands = maintenanceOptions.map((opt) => { if (selectedIds.includes(opt.id)) return wrapCommand(opt.commandOn); return wrapCommand(opt.commandOff); });
  executeCommands(commands, event, 'maintenance-optimizations-response');
});

ipcMain.handle('check-optimization-state', async (event, category, optionId) => {
  if (category === 'services') {
    const option = servicesOptions.find((opt) => opt.id === optionId);
    if (!option) return false;

    const regex = /sc\.exe\s+config\s+"([^"]+)"\s+start=(\S+)/i;
    const match = option.commandOn.match(regex);
    if (!match) return false;

    const serviceName = match[1];
    const expectedState = match[2].toLowerCase();

    return new Promise((resolve) => {
      let outputData = '';
      const scProcess = spawn('sc.exe', ['qc', serviceName], { shell: true });

      scProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      scProcess.stderr.on('data', (data) => {
        outputData += data.toString();
      });

      scProcess.on('close', () => {
        const startTypeRegex = /START_TYPE\s*:\s*\d+\s+(\w+)/i;
        const typeMatch = outputData.match(startTypeRegex);
        if (typeMatch) {
          const actualState = typeMatch[1].toLowerCase();
          if (actualState === expectedState) {
            return resolve(true);
          }
        }
        if (outputData.toLowerCase().includes(expectedState)) {
          return resolve(true);
        }
        resolve(false);
      });

      scProcess.on('error', (err) => {
        resolve(false);
      });
    });
  } else if (category === 'privacy' || category === 'gaming' || category === 'updates') {
    let option;
    if (category === 'privacy') {
      option = privacyOptions.find((opt) => opt.id === optionId);
    } else if (category === 'gaming') {
      option = gamingOptions.find((opt) => opt.id === optionId);
    } else if (category === 'updates') {
      option = updatesOptions.find((opt) => opt.id === optionId);
    }
    if (!option) return false;

    const regex = /reg add "([^"]+)"\s+\/v\s+(\S+)\s+\/t\s+REG_DWORD\s+\/d\s+(\d+)/i;
    const match = option.commandOn.match(regex);
    if (!match) return false;

    const keyPath = match[1];
    const valueName = match[2];
    const expectedValue = match[3];
    const queryCmd = `reg query "${keyPath}" /v ${valueName}`;

    return new Promise((resolve) => {
      let outputData = '';
      const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', queryCmd]);

      psProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      psProcess.stderr.on('data', (data) => {
        outputData += data.toString();
      });

      psProcess.on('close', () => {
        resolve(outputData.includes(expectedValue));
      });

      psProcess.on('error', () => {
        resolve(false);
      });
    });
  }

  return false;
});
