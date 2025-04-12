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

const windowsFixesOptions = [
  {
    id: "reset_windows_update",
    command: 'Stop-Service -Name wuauserv,cryptSvc,bits,msiserver -Force; Rename-Item "$env:windir\\SoftwareDistribution" "SoftwareDistribution.old" -Force -ErrorAction SilentlyContinue; Rename-Item "$env:windir\\System32\\catroot2" "catroot2.old" -Force -ErrorAction SilentlyContinue; regsvr32 /s wuaueng.dll; regsvr32 /s wuapi.dll; regsvr32 /s wups.dll; regsvr32 /s wups2.dll; regsvr32 /s wuwebv.dll; regsvr32 /s wuauserv.dll; regsvr32 /s wucltux.dll; netsh int ip reset reset.log; netsh winsock reset catalog; sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth; Cleanmgr /sagerun:1',
  },
  {
    id: "reset_windows_store",
    command: 'Get-AppxPackage -AllUsers | Remove-AppxPackage -AllUsers; Get-AppxProvisionedPackage -Online | Remove-AppxProvisionedPackage -Online; Get-AppXPackage -AllUsers | ForEach-Object { Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\\AppXManifest.xml" -ForceApplicationShutdown }; Remove-Item -Path "$env:LOCALAPPDATA\\Packages\\Microsoft.WindowsStore*" -Recurse -Force',
  },
  {
    id: "reset_network",
    command: "netsh int ip reset reset.log; netsh interface ipv4 reset; netsh interface ipv6 reset; ipconfig /release; ipconfig /renew; ipconfig /flushdns; ipconfig /registerdns; Get-NetAdapter | Restart-NetAdapter -Confirm:$false; netsh winhttp reset proxy",
  },
  {
    id: "reset_firewall",
    command: 'netsh advfirewall reset; netsh advfirewall set allprofiles firewallpolicy "BlockInbound,AllowOutbound"; Set-NetFirewallProfile -All -Enabled True',
  },
  {
    id: "rebuild_icon_cache",
    command: 'Stop-Process -Name explorer -Force; Remove-Item -Path "$env:LOCALAPPDATA\\IconCache.db" -Force -ErrorAction SilentlyContinue; Start-Process explorer',
  },
  {
    id: "repair_boot_config",
    command: '$firmware = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control" -Name PEFirmwareType).PEFirmwareType; if ($firmware -eq 2) { bcdboot C:\\Windows /s S: /f UEFI } else { bootrec /fixmbr; bootrec /fixboot }; bootrec /scanos; bootrec /rebuildbcd',
  },
  {
    id: "cleanup_component_store",
    command: "DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase /Defer",
  },
  {
    id: "advanced_system_repair",
    command: "sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth; DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase /Defer",
  },
  {
    id: "reset_windows_defender",
    command: 'Stop-Service -Name WinDefend -Force; Start-Service -Name WinDefend; Start-Process "C:\\Program Files\\Windows Defender\\MpCmdRun.exe" -ArgumentList "-RemoveDefinitions -All" -Wait; Update-MpSignature',
  },
  {
    id: "clean_temp_files",
    command: 'Remove-Item -Path "$env:TEMP\\*", "$env:windir\\Temp\\*", "$env:LOCALAPPDATA\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue',
  },
  {
    id: "reset_security_policy",
    command: 'secedit /configure /db "$env:windir\\security\\database\\secedit.sdb" /cfg "$env:windir\\inf\\defltbase.inf" /areas SECURITYPOLICY; auditpol /clear /yes',
  },
  {
    id: "clean_event_logs",
    command: "wevtutil el | ForEach-Object { wevtutil cl $_ }",
  },
  {
    id: "optimize_disk",
    command: '$partition = Get-Partition -DriveLetter C; $disk = Get-Disk -Number $partition.DiskNumber; if ($disk.MediaType -eq "SSD") { Optimize-Volume C -ReTrim -Verbose } else { defrag C: /O /U /V }',
  },
  {
    id: "repair_wsl",
    command: "wsl --update; wsl --shutdown; wsl --install --no-distribution --quiet; wsl --set-default-version 2",
  },
  {
    id: "reset_printer_spooler",
    command: 'Stop-Service -Name Spooler -Force; Remove-Item -Path "$env:WINDIR\\System32\\spool\\PRINTERS\\*" -Recurse -Force; Start-Service -Name Spooler',
  },
  {
    id: "reset_audio_services",
    command: "Stop-Service -Name Audiosrv -Force; Start-Sleep -Seconds 2; regsvr32 /s $env:SystemRoot\\System32\\AudioEng.dll; regsvr32 /s $env:SystemRoot\\System32\\AudioSes.dll; Start-Service -Name Audiosrv; msdt.exe /id AudioPlaybackDiagnostic",
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

ipcMain.on("apply-windows-fixes", (event, selectedIds) => {
  log(`Received apply-windows-fixes with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, windowsFixesOptions);
  executeCommands(commands, event, "windows-fixes-response");
});
