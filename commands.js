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

const networkToolsOptions = [
  { id: "net_flush_dns", command: 'ipconfig /flushdns', comment: "Flushing DNS Cache", onerror: "Failed to flush DNS Cache" },
  { id: "net_reset_adapters", command: 'netsh int ip reset', comment: "Resetting Network Adapters", onerror: "Failed to reset Network Adapters" },
  { id: "net_release_ip", command: 'ipconfig /release', comment: "Releasing IP Address", onerror: "Failed to release IP Address" },
  { id: "net_renew_ip", command: 'ipconfig /renew', comment: "Renewing IP Address", onerror: "Failed to renew IP Address" },
];

const maintenanceOptions = [
  { id: "maintenance1", command: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue', comment: "Cleaning temporary files", onerror: "Failed to clean temporary files" },
  { id: "maintenance2", command: 'Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Recurse -Force -ErrorAction SilentlyContinue', comment: "Cleaning prefetch folder", onerror: "Failed to clean prefetch folder" },
  { id: "maintenance3", command: 'Stop-Service wuauserv -ErrorAction SilentlyContinue; ' + 'Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue; ' + 'Start-Service wuauserv -ErrorAction SilentlyContinue', comment: "Clearing Windows Update cache", onerror: "Failed to clear Windows Update cache" },
  { id: "maintenance4", command: 'reg add "HKCU\\Control Panel\\Desktop" /v MinAnimate /t REG_SZ /d 0 /f', comment: "Disabling window animations", onerror: "Failed to disable window animations" },
  { id: "maintenance5", command: 'Clear-RecycleBin -DriveLetter C -Force', comment: "Clearing the Recycle Bin", onerror: "Failed to clear the Recycle Bin" },
  { id: "maintenance6", command: 'wevtutil el | ForEach-Object { wevtutil cl "$_" }', comment: "Clearing all Windows Event Logs", onerror: "Failed to clear Windows Event Logs" },
  { id: "maintenance7", command: 'Remove-Item -Path "C:\\Windows\\Logs\\CBS\\*" -Recurse -Force', comment: "Cleaning CBS Logs", onerror: "Failed to clean CBS logs" },
  { id: "maintenance8", command: 'Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" -Force -ErrorAction SilentlyContinue', comment: "Clearing Thumbnail Cache", onerror: "Failed to clear Thumbnail Cache" },
  { id: "maintenance9", command: 'Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase', comment: "Cleaning WinSxS folder", onerror: "Failed to clean WinSxS folder" }
];

const wrapCommand = (opt) => {
  return opt.command;
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

ipcMain.on('apply-network-tools', (event, selectedIds) => {
  log("Received apply-network-tools with data: " + JSON.stringify(selectedIds));
  const commands = networkToolsOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'network-tools-response');
});

ipcMain.on('apply-maintenance-optimizations', (event, selectedIds) => {
  log("Received apply-maintenance-optimizations with data: " + JSON.stringify(selectedIds));
  const commands = maintenanceOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'maintenance-optimizations-response');
});

ipcMain.on('execute-custom-command', (event, customCmd) => {
  log("Received custom command: " + customCmd);
  executeCommands(customCmd, event, 'custom-command-response');
});
