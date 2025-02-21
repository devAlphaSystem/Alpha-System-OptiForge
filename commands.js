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
  {
    id: 'sys_disk_cleanup',
    command: 'cleanmgr /sagerun:1'
  },
  {
    id: 'sys_sfc',
    command: 'sfc /scannow'
  },
  {
    id: 'sys_dism',
    command: 'Dism.exe /Online /Cleanup-Image /RestoreHealth'
  },
  {
    id: 'sys_defrag',
    command: 'defrag C: -w'
  },
  {
    id: 'sys_perfmon',
    command: 'perfmon.exe'
  }
];

const systemTweaksOptions = [
  {
    id: 'adv_sys1',
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'adv_sys2',
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f'
  },
  {
    id: 'adv_sys3',
    command: 'sc.exe config "SysMain" start=disabled'
  },
  {
    id: 'adv_sys4',
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 1 /f'
  },
  {
    id: 'adv_sys5',
    command: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreen /t REG_DWORD /d 1 /f'
  },
  {
    id: 'adv_sys6',
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'adv_sys7',
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager" /v SessionManager /t REG_SZ /d "Optimized" /f'
  },
  {
    id: 'adv_sys8',
    command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_DISK DISKIDLE 0'
  },
  {
    id: 'adv_sys9',
    command: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'adv_sys10',
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v DisableStatusMessages /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v VerboseStatus /t REG_DWORD /d 1 /f'
  },
];

const networkToolsOptions = [
  {
    id: 'net_flush_dns',
    command: 'ipconfig /flushdns'
  },
  {
    id: 'net_reset_adapters',
    command: 'netsh int ip reset'
  },
  {
    id: 'net_release_ip',
    command: 'ipconfig /release'
  },
  {
    id: 'net_renew_ip',
    command: 'ipconfig /renew'
  }
];

const networkTweaksOptions = [
  {
    id: 'adv_net1',
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\QoS\\Parameters" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'adv_net2',
    command: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0 /f'
  },
  {
    id: 'adv_net3',
    command: 'netsh int tcp set global autotuninglevel=normal'
  },
  {
    id: 'adv_net4',
    command: 'netsh int tcp set global chimney=disabled'
  },
  {
    id: 'adv_net5',
    command: 'netsh int tcp set global rss=disabled'
  },
  {
    id: 'adv_net6',
    command: 'netsh int tcp set global autotuninglevel=highlyrestricted'
  },
  {
    id: 'adv_net7',
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\TCPIP6\\Parameters" /v DisabledComponents /t REG_DWORD /d 0xFF /f'
  },
  {
    id: 'adv_net8',
    command: 'netsh int tcp set global autotuninglevel=disabled'
  },
  {
    id: 'adv_net9',
    command: 'dism /online /norestart /disable-feature /featurename:SMB1Protocol'
  }
];

const powerOptions = [
  {
    id: 'power1',
    command: 'powercfg /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 99999999-9999-9999-9999-999999999999; powercfg /setactive 99999999-9999-9999-9999-999999999999'
  },
  {
    id: 'power2',
    command: 'powercfg /hibernate off; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f'
  },
  {
    id: 'power3',
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f'
  },
  {
    id: 'power4',
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f'
  },
  {
    id: 'power5',
    command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ee12f906-d277-404b-b6da-e5fa1a576df5 0'
  },
  {
    id: 'power6',
    command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 893dee8e-2bef-41e0-89c6-b55d0929964c 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 893dee8e-2bef-41e0-89c6-b55d0929964c 100; powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR bc5038f7-23e0-4960-96da-33abaf5935ec 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR bc5038f7-23e0-4960-96da-33abaf5935ec 100'
  },
  {
    id: 'power7',
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\7516b95f-f776-4464-8c53-06167f40cc99\\aded5e82-b909-4619-9949-f5d71dac0bcb" /v ValueMax /t REG_DWORD /d 100 /f'
  },
  {
    id: 'power8',
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\e73a048d-bf27-4f12-9731-8b2076e8891f\\637ea02f-bbcb-4015-8e2c-a1c7b9c0b546" /v ValueMax /t REG_DWORD /d 0 /f'
  },
  {
    id: 'power9',
    command: 'powercfg /setacvalueindex SCHEME_CURRENT SUB_VIDEO 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_VIDEO 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0'
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

ipcMain.on('apply-system-tools', (event, selectedIds) => {
  log('Received apply-system-tools with data: ' + JSON.stringify(selectedIds));
  const commands = systemToolsOptions.filter((opt) => selectedIds.includes(opt.id)).map((opt) => wrapCommand(opt.command));
  executeCommands(commands, event, 'system-tools-response');
});

ipcMain.on('apply-system-tweaks', (event, selectedIds) => {
  log('Received apply-system-tweaks with data: ' + JSON.stringify(selectedIds));
  const commands = systemTweaksOptions.filter((opt) => selectedIds.includes(opt.id)).map((opt) => wrapCommand(opt.command));
  executeCommands(commands, event, 'system-tweaks-response');
});

ipcMain.on('apply-network-tools', (event, selectedIds) => {
  log('Received apply-network-tools with data: ' + JSON.stringify(selectedIds));
  const commands = networkToolsOptions.filter((opt) => selectedIds.includes(opt.id)).map((opt) => wrapCommand(opt.command));
  executeCommands(commands, event, 'network-tools-response');
});

ipcMain.on('apply-network-tweaks', (event, selectedIds) => {
  log('Received apply-network-tweaks with data: ' + JSON.stringify(selectedIds));
  const commands = networkTweaksOptions.filter((opt) => selectedIds.includes(opt.id)).map((opt) => wrapCommand(opt.command));
  executeCommands(commands, event, 'network-tweaks-response');
});

ipcMain.on('apply-power-optimizations', (event, selectedIds) => {
  log('Received apply-power-optimizations with data: ' + JSON.stringify(selectedIds));
  const commands = powerOptions.filter((opt) => selectedIds.includes(opt.id)).map((opt) => wrapCommand(opt.command));
  executeCommands(commands, event, 'power-optimizations-response');
});

ipcMain.on('execute-custom-command', (event, customCmd) => {
  log('Received custom command: ' + customCmd);
  const commands = [wrapCommand(customCmd)];
  executeCommands(commands, event, 'custom-command-response');
});
