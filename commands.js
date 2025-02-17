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

const systemToolsOptions = [
  { id: "sys_disk_cleanup", command: 'cleanmgr /sagerun:1', comment: "Running Disk Cleanup", onerror: "Failed to run Disk Cleanup" },
  { id: "sys_sfc", command: 'sfc /scannow', comment: "Running System File Checker (SFC)", onerror: "Failed to run SFC" },
  { id: "sys_dism", command: 'Dism.exe /Online /Cleanup-Image /RestoreHealth', comment: "Running DISM RestoreHealth", onerror: "Failed to run DISM RestoreHealth" },
  { id: "sys_defrag", command: 'defrag C: -w', comment: "Running Disk Defragmentation", onerror: "Failed to defragment drive C:" },
  { id: "sys_perfmon", command: 'perfmon.exe', comment: "Launching Performance Monitor", onerror: "Failed to launch Performance Monitor" }
];

const systemTweaksOptions = [
  { id: "adv_sys1", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f', comment: "Enabling Fast Boot", onerror: "Failed to enable Fast Boot" },
  { id: "adv_sys2", command: 'reg add "HKCU\\Control Panel\\Desktop" /v MinAnimate /t REG_SZ /d 0 /f', comment: "Disabling System Animations", onerror: "Failed to disable system animations" },
  { id: "adv_sys3", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f', comment: "Disabling Cortana Indexing", onerror: "Failed to disable Cortana indexing" },
  { id: "adv_sys4", command: 'sc.exe config "SysMain" start=disabled', comment: "Disabling Superfetch (SysMain)", onerror: "Failed to disable Superfetch" },
  { id: "adv_sys5", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 1 /f', comment: "Disabling Windows Defender", onerror: "Failed to disable Windows Defender" },
  { id: "adv_sys6", command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreen /t REG_DWORD /d 1 /f', comment: "Disabling Lock Screen Notifications", onerror: "Failed to disable lock screen notifications" },
  { id: "adv_sys7", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f', comment: "Disabling Windows Error Reporting", onerror: "Failed to disable error reporting" },
  { id: "adv_sys8", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager" /v SessionManager /t REG_SZ /d "Optimized" /f', comment: "Optimizing Registry Performance", onerror: "Failed to optimize registry performance" },
  { id: "adv_sys9", command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_DISK DISKIDLE 0', comment: "Enabling Disk Write Caching", onerror: "Failed to enable disk write caching" },
  { id: "adv_sys10", command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f', comment: "Disabling Background App Refresh", onerror: "Failed to disable background app refresh" }
];
const networkToolsOptions = [
  { id: "net_flush_dns", command: 'ipconfig /flushdns', comment: "Flushing DNS Cache", onerror: "Failed to flush DNS Cache" },
  { id: "net_reset_adapters", command: 'netsh int ip reset', comment: "Resetting Network Adapters", onerror: "Failed to reset Network Adapters" },
  { id: "net_release_ip", command: 'ipconfig /release', comment: "Releasing IP Address", onerror: "Failed to release IP Address" },
  { id: "net_renew_ip", command: 'ipconfig /renew', comment: "Renewing IP Address", onerror: "Failed to renew IP Address" },
];

const networkTweaksOptions = [
  { id: "adv_net1", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\QoS\\Parameters" /v Enabled /t REG_DWORD /d 1 /f', comment: "Enabling QoS Packet Scheduler", onerror: "Failed to enable QoS Packet Scheduler" },
  { id: "adv_net2", command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0 /f', comment: "Disabling Network Throttling", onerror: "Failed to disable network throttling" },
  { id: "adv_net3", command: 'netsh int tcp set global autotuninglevel=normal', comment: "Optimizing TCP/IP Stack", onerror: "Failed to optimize TCP/IP stack" },
  { id: "adv_net4", command: 'netsh int tcp set global chimney=disabled', comment: "Disabling TCP Chimney Offload", onerror: "Failed to disable TCP Chimney Offload" },
  { id: "adv_net5", command: 'netsh int tcp set global rss=disabled', comment: "Disabling Receive Side Scaling (RSS)", onerror: "Failed to disable RSS" },
  { id: "adv_net6", command: 'netsh int tcp set global autotuninglevel=highlyrestricted', comment: "Enabling TCP Window Scaling", onerror: "Failed to enable TCP window scaling" },
  { id: "adv_net7", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\TCPIP6\\Parameters" /v DisabledComponents /t REG_DWORD /d 0xFF /f', comment: "Disabling IPv6", onerror: "Failed to disable IPv6" },
  { id: "adv_net8", command: 'ipconfig /flushdns', comment: "Optimizing DNS Caching", onerror: "Failed to optimize DNS caching" },
  { id: "adv_net9", command: 'netsh int tcp set global autotuninglevel=disabled', comment: "Disabling TCP Auto-Tuning", onerror: "Failed to disable TCP Auto-Tuning" },
  { id: "adv_net10", command: 'dism /online /norestart /disable-feature /featurename:SMB1Protocol', comment: "Disabling SMB1 Protocol", onerror: "Failed to disable SMB1 Protocol" }
];

const powerOptions = [
  { id: "power1", command: 'powercfg /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 99999999-9999-9999-9999-999999999999; powercfg /setactive 99999999-9999-9999-9999-999999999999', comment: "Applying Ultimate Power Plan (Max Performance)", onerror: "Failed to set Ultimate Power Plan" },
  { id: "power2", command: 'powercfg /hibernate off; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f', comment: "Disabling Hibernate, Sleep, and Fast Boot", onerror: "Failed to disable Hibernate/Sleep/Fast Boot" },
  { id: "power3", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f', comment: "Unparking CPU Cores", onerror: "Failed to unpark CPU cores" },
  { id: "power4", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f', comment: "Disabling Power Throttling", onerror: "Failed to disable Power Throttling" },
  { id: "power5", command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ee12f906-d277-404b-b6da-e5fa1a576df5 0', comment: "Disabling PCI Express Link State Power Management", onerror: "Failed to disable PCI Express power management" },
  { id: "power6", command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 893dee8e-2bef-41e0-89c6-b55d0929964c 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 893dee8e-2bef-41e0-89c6-b55d0929964c 100; powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR bc5038f7-23e0-4960-96da-33abaf5935ec 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR bc5038f7-23e0-4960-96da-33abaf5935ec 100', comment: "Setting Processor State Always at 100%", onerror: "Failed to set processor state to 100%" },
  { id: "power7", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\7516b95f-f776-4464-8c53-06167f40cc99\\aded5e82-b909-4619-9949-f5d71dac0bcb" /v ValueMax /t REG_DWORD /d 100 /f', comment: "Setting Display Brightness to 100%", onerror: "Failed to set display brightness to 100%" },
  { id: "power8", command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\e73a048d-bf27-4f12-9731-8b2076e8891f\\637ea02f-bbcb-4015-8e2c-a1c7b9c0b546" /v ValueMax /t REG_DWORD /d 0 /f', comment: "Disabling Critical Battery Actions", onerror: "Failed to disable Critical Battery Actions" },
  { id: "power9", command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_VIDEO 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_VIDEO 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0', comment: "Disabling Adaptive Brightness", onerror: "Failed to disable Adaptive Brightness" }
];

const wrapCommand = (opt) => opt.command;

function executeCommands(command, event, responseChannel) {
  log("Executing command: " + command);
  let outputData = "";
  const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', command]);
  psProcess.stdout.on('data', (data) => { outputData += data.toString().trim() + "\n"; });
  psProcess.stderr.on('data', (data) => { outputData += "ERROR: " + data.toString().trim() + "\n"; });
  psProcess.on('error', (error) => {
    log("Process error: " + error, 'error');
    event.reply(responseChannel, { success: false, message: error.toString() });
  });
  psProcess.on('close', (code) => {
    log("Process closed with code: " + code);
    event.reply(responseChannel, { success: code === 0, message: outputData || `Process exited with code ${code}` });
  });
}

ipcMain.on('apply-system-tools', (event, selectedIds) => {
  log("Received apply-system-tools with data: " + JSON.stringify(selectedIds));
  const commands = systemToolsOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'system-tools-response');
});

ipcMain.on('apply-system-tweaks', (event, selectedIds) => {
  log("Received apply-system-tweaks with data: " + JSON.stringify(selectedIds));
  const commands = systemTweaksOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'system-tweaks-response');
});

ipcMain.on('apply-network-tools', (event, selectedIds) => {
  log("Received apply-network-tools with data: " + JSON.stringify(selectedIds));
  const commands = networkToolsOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'network-tools-response');
});

ipcMain.on('apply-network-tweaks', (event, selectedIds) => {
  log("Received apply-network-tweaks with data: " + JSON.stringify(selectedIds));
  const commands = networkTweaksOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'network-tweaks-response');
});

ipcMain.on('apply-power-optimizations', (event, selectedIds) => {
  log("Received apply-power-optimizations with data: " + JSON.stringify(selectedIds));
  const commands = powerOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'power-optimizations-response');
});

ipcMain.on('execute-custom-command', (event, customCmd) => {
  log("Received custom command: " + customCmd);
  executeCommands(customCmd, event, 'custom-command-response');
});
