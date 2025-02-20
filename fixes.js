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
  {
    id: 'reset_windows_update',
    command: 'Stop-Service -Name wuauserv -Force; Stop-Service -Name cryptSvc -Force; Stop-Service -Name bits -Force; Stop-Service -Name msiserver -Force; Remove-Item -Path "$env:windir\\SoftwareDistribution\\*" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "$env:windir\\SoftwareDistribution" -Recurse -Force -ErrorAction SilentlyContinue; New-Item -Path "$env:windir\\SoftwareDistribution" -ItemType Directory -Force; Remove-Item -Path "$env:windir\\System32\\catroot2\\*" -Recurse -Force -ErrorAction SilentlyContinue; Remove-Item -Path "$env:windir\\System32\\catroot2" -Recurse -Force -ErrorAction SilentlyContinue; New-Item -Path "$env:windir\\System32\\catroot2" -ItemType Directory -Force; regsvr32 /s wuaueng.dll; regsvr32 /s wuapi.dll; regsvr32 /s wups.dll; regsvr32 /s wups2.dll; regsvr32 /s wuwebv.dll; regsvr32 /s wuauserv.dll; regsvr32 /s wucltux.dll; regsvr32 /s wuaueng1.dll; netsh winsock reset; netsh winsock reset proxy; Start-Service -Name wuauserv; Start-Service -Name cryptSvc; Start-Service -Name bits; Start-Service -Name msiserver; sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth'
  },
  {
    id: 'reset_windows_store',
    command: 'wsreset.exe; Get-AppXPackage -AllUsers | ForEach-Object { Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\\AppXManifest.xml" }'
  },
  {
    id: 'reset_network',
    command: 'netsh int ip reset; netsh winsock reset; ipconfig /flushdns'
  },
  {
    id: 'reset_firewall',
    command: 'netsh advfirewall reset; netsh advfirewall set allprofiles state on'
  },
  {
    id: 'rebuild_icon_cache',
    command: 'Stop-Process -Name explorer -Force; Remove-Item -Path "$env:LOCALAPPDATA\\IconCache.db" -Force -ErrorAction SilentlyContinue; Start-Process explorer'
  },
  {
    id: 'repair_boot_config',
    command: 'bootrec /fixmbr; bootrec /fixboot; bootrec /scanos; bootrec /rebuildbcd'
  },
  {
    id: 'cleanup_component_store',
    command: 'DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase'
  },
  {
    id: 'advanced_system_repair',
    command: 'sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth; DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase'
  },
  {
    id: 'reset_windows_defender',
    command: 'Stop-Service -Name WinDefend -Force; Start-Service -Name WinDefend'
  },
  {
    id: 'clean_temp_files',
    command: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue'
  },
  {
    id: 'reset_security_policy',
    command: 'secedit /configure /db "$env:windir\\security\\database\\secedit.sdb" /cfg "$env:windir\\inf\\defltbase.inf" /areas SECURITYPOLICY'
  },
  {
    id: 'clean_event_logs',
    command: 'wevtutil el | ForEach-Object { wevtutil cl $_ }'
  },
  {
    id: 'optimize_disk',
    command: 'defrag C: /O /U /V'
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

ipcMain.on('apply-windows-fixes', (event, selectedIds) => {
  log('Received apply-windows-fixes with data: ' + JSON.stringify(selectedIds));
  const commands = windowsFixesOptions.filter((opt) => selectedIds.includes(opt.id)).map((opt) => wrapCommand(opt.command));
  executeCommands(commands, event, 'windows-fixes-response');
});
