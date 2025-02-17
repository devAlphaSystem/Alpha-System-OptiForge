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

const windowsFixesOptions = [
  { id: "reset_windows_update", command: "Stop-Service -Name wuauserv -Force; Stop-Service -Name cryptSvc -Force; Stop-Service -Name bits -Force; Stop-Service -Name msiserver -Force; Remove-Item -Path \"$env:windir\\SoftwareDistribution\\*\" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path \"$env:windir\\SoftwareDistribution\" -Recurse -Force -ErrorAction SilentlyContinue; New-Item -Path \"$env:windir\\SoftwareDistribution\" -ItemType Directory -Force; Remove-Item -Path \"$env:windir\\System32\\catroot2\\*\" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path \"$env:windir\\System32\\catroot2\" -Recurse -Force -ErrorAction SilentlyContinue; New-Item -Path \"$env:windir\\System32\\catroot2\" -ItemType Directory -Force; regsvr32 /s wuaueng.dll; regsvr32 /s wuapi.dll; regsvr32 /s wups.dll; regsvr32 /s wups2.dll; regsvr32 /s wuwebv.dll; regsvr32 /s wuauserv.dll; regsvr32 /s wucltux.dll; regsvr32 /s wuaueng1.dll; netsh winsock reset; netsh winsock reset proxy; Start-Service -Name wuauserv; Start-Service -Name cryptSvc; Start-Service -Name bits; Start-Service -Name msiserver; sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth", comment: "Reset Windows Update components, clear cache, re-register DLLs, reset Winsock, and perform system integrity checks", onerror: "Failed to reset Windows Update" },
  { id: "reset_windows_store", command: "wsreset.exe; Get-AppXPackage -AllUsers | ForEach-Object { Add-AppxPackage -DisableDevelopmentMode -Register \"$($_.InstallLocation)\\AppXManifest.xml\" }", comment: "Reset Windows Store cache and re-register all built-in apps", onerror: "Failed to reset Windows Store" },
  { id: "reset_network", command: "netsh int ip reset; netsh winsock reset; ipconfig /flushdns", comment: "Reset network settings including TCP/IP stack, Winsock, and DNS cache", onerror: "Failed to reset network settings" },
  { id: "reset_firewall", command: "netsh advfirewall reset; netsh advfirewall set allprofiles state on", comment: "Reset Windows Firewall to default settings and ensure it's enabled", onerror: "Failed to reset Windows Firewall" },
  { id: "rebuild_icon_cache", command: "Stop-Process -Name explorer -Force; Remove-Item -Path \"$env:LOCALAPPDATA\\IconCache.db\" -Force -ErrorAction SilentlyContinue; Start-Process explorer", comment: "Rebuild the Windows Icon Cache to fix corrupted or missing icons", onerror: "Failed to rebuild icon cache" },
  { id: "repair_boot_config", command: "bootrec /fixmbr; bootrec /fixboot; bootrec /scanos; bootrec /rebuildbcd", comment: "Repair Boot Configuration Data (BCD) to fix boot-related issues", onerror: "Failed to repair Boot Configuration Data" },
  { id: "cleanup_component_store", command: "DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase", comment: "Clean up the component store to reduce disk space usage and remove outdated components", onerror: "Failed to clean up the component store" },
  { id: "advanced_system_repair", command: "sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth; DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase", comment: "Perform an advanced repair by checking system files, restoring health, and cleaning up the component store", onerror: "Failed advanced system repair" },
  { id: "reset_windows_defender", command: "Stop-Service -Name WinDefend -Force; Start-Service -Name WinDefend", comment: "Restart Windows Defender services to resolve potential issues with the antivirus component", onerror: "Failed to reset Windows Defender" },
  { id: "clean_temp_files", command: "Remove-Item -Path \"$env:TEMP\\*\" -Recurse -Force -ErrorAction SilentlyContinue", comment: "Clean up temporary files from the Temp folder to free up disk space and remove clutter", onerror: "Failed to clean temporary files" },
  { id: "reset_security_policy", command: "secedit /configure /db \"$env:windir\\security\\database\\secedit.sdb\" /cfg \"$env:windir\\inf\\defltbase.inf\" /areas SECURITYPOLICY", comment: "Reset Windows security policies to default settings", onerror: "Failed to reset security policies" },
  { id: "clean_event_logs", command: "wevtutil el | ForEach-Object { wevtutil cl $_ }", comment: "Clean up Windows Event Logs to remove clutter and possible corrupt entries", onerror: "Failed to clean event logs" },
  { id: "optimize_disk", command: "defrag C: /O /U /V", comment: "Optimize and defragment the system drive", onerror: "Failed to optimize disk" }
];

const wrapCommand = (opt) => {
  return opt.command.replace(/&&/g, ';');
};

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    log("Executing command: " + command);
    let outputData = "";
    const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', command]);
    psProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      outputData += output + "\n";
      log(`Output: ${output}`);
    });
    psProcess.stderr.on('data', (data) => {
      const errorOutput = data.toString().trim();
      outputData += "ERROR: " + errorOutput + "\n";
      log(`Error: ${errorOutput}`, 'error');
    });
    psProcess.on('error', (error) => {
      log("Process error: " + error, 'error');
      reject(error);
    });
    psProcess.on('close', (code) => {
      log("Process closed with code: " + code);
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

ipcMain.on('apply-windows-fixes', (event, selectedIds) => {
  log("Received apply-windows-fixes with data: " + JSON.stringify(selectedIds));
  const commands = windowsFixesOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  executeCommands(commands, event, 'windows-fixes-response');
});
