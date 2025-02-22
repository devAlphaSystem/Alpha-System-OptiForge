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
    command: 'Stop-Service -Name wuauserv,cryptSvc,bits,msiserver -Force; Rename-Item "$env:windir\\SoftwareDistribution" "SoftwareDistribution.old" -Force -ErrorAction SilentlyContinue; Rename-Item "$env:windir\\System32\\catroot2" "catroot2.old" -Force -ErrorAction SilentlyContinue; regsvr32 /s wuaueng.dll; regsvr32 /s wuapi.dll; regsvr32 /s wups.dll; regsvr32 /s wups2.dll; regsvr32 /s wuwebv.dll; regsvr32 /s wuauserv.dll; regsvr32 /s wucltux.dll; netsh int ip reset reset.log; netsh winsock reset catalog; sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth /Source:WIM:X:\\Sources\\Install.wim:1 /LimitAccess; Cleanmgr /sagerun:1'
  },
  {
    id: 'reset_windows_store',
    command: 'Get-AppxPackage -AllUsers | Remove-AppxPackage -AllUsers; Get-AppxProvisionedPackage -Online | Remove-AppxProvisionedPackage -Online; Get-AppXPackage -AllUsers | ForEach-Object { Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\\AppXManifest.xml" -ForceApplicationShutdown }; Remove-Item -Path "$env:LOCALAPPDATA\\Packages\\Microsoft.WindowsStore*" -Recurse -Force'
  },
  {
    id: 'reset_network',
    command: 'netsh int ip reset reset.log; netsh interface ipv4 reset; netsh interface ipv6 reset; ipconfig /release; ipconfig /renew; ipconfig /flushdns; ipconfig /registerdns; Get-NetAdapter | Restart-NetAdapter -Confirm:$false; netsh winhttp reset proxy'
  },
  {
    id: 'reset_firewall',
    command: 'netsh advfirewall reset; netsh advfirewall set allprofiles firewallpolicy "BlockInbound,AllowOutbound"; Set-NetFirewallProfile -All -Enabled True'
  },
  {
    id: 'rebuild_icon_cache',
    command: 'Stop-Process -Name explorer -Force; Remove-Item -Path "$env:LOCALAPPDATA\\IconCache.db" -Force -ErrorAction SilentlyContinue; Start-Process explorer'
  },
  {
    id: 'repair_boot_config',
    command: '$firmware = Get-FirmwareType; if ($firmware -eq "UEFI") { bcdboot C:\\Windows /s S: /f UEFI } else { bootrec /fixmbr; bootrec /fixboot }; bootrec /scanos; bootrec /rebuildbcd'
  },
  {
    id: 'cleanup_component_store',
    command: 'DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase /Defer'
  },
  {
    id: 'advanced_system_repair',
    command: 'sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth /Source:WIM:X:\\Sources\\Install.wim:1 /LimitAccess; DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase /Defer'
  },
  {
    id: 'reset_windows_defender',
    command: 'Stop-Service -Name WinDefend -Force; Start-Service -Name WinDefend; Start-Process "C:\\Program Files\\Windows Defender\\MpCmdRun.exe" -ArgumentList "-RemoveDefinitions -All"; Update-MpSignature'
  },
  {
    id: 'clean_temp_files',
    command: 'Remove-Item -Path "$env:TEMP\\*", "$env:windir\\Temp\\*", "$env:LOCALAPPDATA\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue'
  },
  {
    id: 'reset_security_policy',
    command: 'secedit /configure /db "$env:windir\\security\\database\\secedit.sdb" /cfg "$env:windir\\inf\\defltbase.inf" /areas SECURITYPOLICY; auditpol /clear /yes'
  },
  {
    id: 'clean_event_logs',
    command: 'wevtutil el | ForEach-Object { wevtutil cl $_ }'
  },
  {
    id: 'optimize_disk',
    command: '$diskType = (Get-PhysicalDisk).MediaType; if ($diskType -eq "SSD") { Optimize-Volume C -ReTrim -Verbose } else { defrag C: /O /U /V }'
  },
  {
    id: 'repair_wsl',
    command: 'wsl --update; wsl --shutdown; wsl --install --no-distribution --quiet; wsl --set-default-version 2'
  },
  {
    id: 'reset_printer_spooler',
    command: 'Stop-Service -Name Spooler -Force; Remove-Item -Path "$env:WINDIR\\System32\\spool\\PRINTERS\\*" -Recurse -Force; Start-Service -Name Spooler'
  },
  {
    id: 'reset_audio_services',
    command: 'Stop-Service -Name Audiosrv -Force; Start-Sleep -Seconds 2; regsvr32 /s %SystemRoot%\\System32\\AudioEng.dll; regsvr32 /s %SystemRoot%\\System32\\AudioSes.dll; Start-Service -Name Audiosrv; msdt.exe /id AudioPlaybackDiagnostic'
  }
];

function wrapCommand(cmd) {
  return cmd.replace(/&&/g, ';');
}

function executeCommand(command) {
  return new Promise((resolve) => {
    log(`Executing command: ${command}`);
    let outputData = '';
    const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', command]);

    psProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      outputData += `${output}\n`;
      log(`Output: ${output}`);
    });

    psProcess.stderr.on('data', (data) => {
      const errorOutput = data.toString().trim();
      outputData += `ERROR: ${errorOutput}\n`;
      log(`Error: ${errorOutput}`, 'error');
    });

    psProcess.on('error', (error) => {
      log(`Process error: ${error}`, 'error');
      resolve({ success: false, command, message: error.toString() });
    });

    psProcess.on('close', (code) => {
      log(`Process closed with code: ${code}`);
      resolve({ success: code === 0, command, message: outputData || `Process exited with code ${code}` });
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
  const commands = windowsFixesOptions.map(opt => {
    if (opt.command) { return selectedIds.includes(opt.id) ? wrapCommand(opt.command) : null; }
    const cmd = selectedIds.includes(opt.id) ? opt.commandOn : opt.commandOff;
    return cmd ? wrapCommand(cmd) : null;
  }).filter(cmd => cmd !== null);
  executeCommands(commands, event, 'windows-fixes-response');
});
