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

const advancedSystemTweaksOptions = [
  { id: "adv_sys1", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f', comment: "Enabling Fast Boot", onerror: "Failed to enable Fast Boot" },
  { id: "adv_sys2", command: 'reg add "HKCU\\Control Panel\\Desktop" /v MinAnimate /t REG_SZ /d 0 /f', comment: "Disabling System Animations", onerror: "Failed to disable system animations" },
  { id: "adv_sys3", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f', comment: "Disabling Cortana Indexing", onerror: "Failed to disable Cortana indexing" },
  { id: "adv_sys4", command: 'sc config "SysMain" start= disabled', comment: "Disabling Superfetch (SysMain)", onerror: "Failed to disable Superfetch" },
  { id: "adv_sys5", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 1 /f', comment: "Disabling Windows Defender", onerror: "Failed to disable Windows Defender" },
  { id: "adv_sys6", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreen /t REG_DWORD /d 1 /f', comment: "Disabling Lock Screen Notifications", onerror: "Failed to disable lock screen notifications" },
  { id: "adv_sys7", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f', comment: "Disabling Windows Error Reporting", onerror: "Failed to disable error reporting" },
  { id: "adv_sys8", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager" /v SessionManager /t REG_SZ /d "Optimized" /f', comment: "Optimizing Registry Performance", onerror: "Failed to optimize registry performance" },
  { id: "adv_sys9", command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_DISK DISKIDLE /d 0', comment: "Enabling Disk Write Caching", onerror: "Failed to enable disk write caching" },
  { id: "adv_sys10", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f', comment: "Disabling Background App Refresh", onerror: "Failed to disable background app refresh" }
];

const advancedNetworkTweaksOptions = [
  { id: "adv_net1", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\QoS\\Parameters" /v Enabled /t REG_DWORD /d 1 /f', comment: "Enabling QoS Packet Scheduler", onerror: "Failed to enable QoS Packet Scheduler" },
  { id: "adv_net2", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0 /f', comment: "Disabling Network Throttling", onerror: "Failed to disable network throttling" },
  { id: "adv_net3", command: 'netsh int tcp set global autotuninglevel=normal', comment: "Optimizing TCP/IP Stack", onerror: "Failed to optimize TCP/IP stack" },
  { id: "adv_net4", command: 'netsh int tcp set global chimney=disabled', comment: "Disabling TCP Chimney Offload", onerror: "Failed to disable TCP Chimney Offload" },
  { id: "adv_net5", command: 'netsh int tcp set global rss=disabled', comment: "Disabling Receive Side Scaling (RSS)", onerror: "Failed to disable RSS" },
  { id: "adv_net6", command: 'netsh int tcp set global autotuninglevel=highlyrestricted', comment: "Enabling TCP Window Scaling", onerror: "Failed to enable TCP window scaling" },
  { id: "adv_net7", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\TCPIP6\\Parameters" /v DisabledComponents /t REG_DWORD /d 0xFF /f', comment: "Disabling IPv6", onerror: "Failed to disable IPv6" },
  { id: "adv_net8", command: 'netsh dns set cache /flush', comment: "Optimizing DNS Caching", onerror: "Failed to optimize DNS caching" },
  { id: "adv_net9", command: 'netsh int tcp set global autotuninglevel=disabled', comment: "Disabling TCP Auto-Tuning", onerror: "Failed to disable TCP Auto-Tuning" },
  { id: "adv_net10", command: 'dism /online /norestart /disable-feature /featurename:SMB1Protocol', comment: "Disabling SMB1 Protocol", onerror: "Failed to disable SMB1 Protocol" }
];

const wrapCommand = (opt) => {
  return `${opt.command};`;
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
  psProcess.on('error', (error) => {
    log("Process error: ${error}", 'error');
    event.reply(responseChannel, { success: false, message: error.toString() });
  });
  psProcess.on('close', (code) => {
    log("Process closed with code: " + code);
    event.reply(responseChannel, { success: code === 0, message: outputData || `Process exited with code ${code}` });
  });
}

ipcMain.on('apply-advanced-system-tweaks', (event, selectedIds) => {
  log("Received apply-advanced-system-tweaks with data: " + JSON.stringify(selectedIds));
  const commands = advancedSystemTweaksOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'advanced-system-tweaks-response');
});

ipcMain.on('apply-advanced-network-tweaks', (event, selectedIds) => {
  log("Received apply-advanced-network-tweaks with data: " + JSON.stringify(selectedIds));
  const commands = advancedNetworkTweaksOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'advanced-network-tweaks-response');
});
