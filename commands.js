const { ipcMain } = require("electron");
const { spawn } = require("node:child_process");

function log(message, level = "info") {
  const timestamp = new Date().toISOString();
  switch (level) {
    case "info":
      console.info(`[${timestamp}] INFO: ${message}`);
      break;
    case "warn":
      console.warn(`[${timestamp}] WARN: ${message}`);
      break;
    case "error":
      console.error(`[${timestamp}] ERROR: ${message}`);
      break;
    default:
      console.log(`[${timestamp}] ${message}`);
  }
}

const systemToolsOptions = [
  {
    id: "sys_disk_cleanup",
    command: "cleanmgr /sagerun:1",
  },
  {
    id: "sys_sfc",
    command: "sfc /scannow",
  },
  {
    id: "sys_dism",
    command: "Dism.exe /Online /Cleanup-Image /RestoreHealth",
  },
  {
    id: "sys_defrag",
    command: "defrag C: -w",
  },
  {
    id: "sys_perfmon",
    command: "perfmon.exe",
  },
];

const systemTweaksOptions = [
  {
    id: "adv_sys1",
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "adv_sys2",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Search" /v AllowCortana /t REG_DWORD /d 1 /f',
  },
  {
    id: "adv_sys3",
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\SysMain" /v Start /t REG_DWORD /d 4 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\SysMain" /v Start /t REG_DWORD /d 2 /f',
  },
  {
    id: "adv_sys4",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 0 /f',
  },
  {
    id: "adv_sys5",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreen /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreen /t REG_DWORD /d 0 /f',
  },
  {
    id: "adv_sys6",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "adv_sys7",
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager" /v SessionManager /t REG_SZ /d "Optimized" /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager" /v SessionManager /t REG_SZ /d "Standard" /f',
  },
  {
    id: "adv_sys8",
    command: "powercfg /setacvalueindex SCHEME_CURRENT SUB_DISK DISKIDLE 0",
  },
  {
    id: "adv_sys9",
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "adv_sys10",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v DisableStatusMessages /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v VerboseStatus /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v DisableStatusMessages /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v VerboseStatus /t REG_DWORD /d 0 /f',
  },
];

const networkToolsOptions = [
  {
    id: "net_flush_dns",
    command: "ipconfig /flushdns",
  },
  {
    id: "net_reset_adapters",
    command: "netsh int ip reset",
  },
  {
    id: "net_release_ip",
    command: "ipconfig /release",
  },
  {
    id: "net_renew_ip",
    command: "ipconfig /renew",
  },
];

const networkTweaksOptions = [
  {
    id: "adv_net1",
    commandOn: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\QoS\\Parameters" /v Enabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\QoS\\Parameters" /v Enabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "adv_net2",
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 1 /f',
  },
  {
    id: "adv_net3",
    command: "netsh int tcp set global autotuninglevel=normal",
  },
  {
    id: "adv_net4",
    command: "netsh int tcp set global chimney=disabled",
  },
  {
    id: "adv_net5",
    command: "netsh int tcp set global rss=disabled",
  },
  {
    id: "adv_net6",
    command: "netsh int tcp set global autotuninglevel=highlyrestricted",
  },
  {
    id: "adv_net7",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\TCPIP6\\Parameters" /v DisabledComponents /t REG_DWORD /d 0xFF /f',
  },
  {
    id: "adv_net8",
    command: "netsh int tcp set global autotuninglevel=disabled",
  },
  {
    id: "adv_net9",
    command: "dism /online /norestart /disable-feature /featurename:SMB1Protocol",
  },
];

const powerOptions = [
  {
    id: "power1",
    command: "powercfg /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 99999999-9999-9999-9999-999999999999; powercfg /setactive 99999999-9999-9999-9999-999999999999",
  },
  {
    id: "power2",
    command: 'powercfg /hibernate off; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f',
  },
  {
    id: "power3",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f',
  },
  {
    id: "power4",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f',
  },
  {
    id: "power5",
    command: "powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ee12f906-d277-404b-b6da-e5fa1a576df5 0",
  },
  {
    id: "power6",
    command: "powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 893dee8e-2bef-41e0-89c6-b55d0929964c 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 893dee8e-2bef-41e0-89c6-b55d0929964c 100; powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR bc5038f7-23e0-4960-96da-33abaf5935ec 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR bc5038f7-23e0-4960-96da-33abaf5935ec 100",
  },
  {
    id: "power7",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\7516b95f-f776-4464-8c53-06167f40cc99\\aded5e82-b909-4619-9949-f5d71dac0bcb" /v ValueMax /t REG_DWORD /d 100 /f',
  },
  {
    id: "power8",
    command: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\e73a048d-bf27-4f12-9731-8b2076e8891f\\637ea02f-bbcb-4015-8e2c-a1c7b9c0b546" /v ValueMax /t REG_DWORD /d 0 /f',
  },
  {
    id: "power9",
    command: "powercfg /setacvalueindex SCHEME_CURRENT SUB_VIDEO 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_VIDEO 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0",
  },
];

function wrapCommand(cmd) {
  return cmd.replace(/&&/g, ";");
}

function executeCommand(command) {
  return new Promise((resolve) => {
    log(`Executing command: ${command}`);
    let outputData = "";
    const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", command]);

    psProcess.stdout.on("data", (data) => {
      const output = data.toString().trim();
      outputData += `${output}\n`;
      log(`Output: ${output}`);
    });

    psProcess.stderr.on("data", (data) => {
      const errorOutput = data.toString().trim();
      outputData += `ERROR: ${errorOutput}\n`;
      log(`Error: ${errorOutput}`, "error");
    });

    psProcess.on("error", (error) => {
      log(`Process error: ${error}`, "error");
      resolve({ success: false, command, message: error.toString() });
    });

    psProcess.on("close", (code) => {
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

ipcMain.on("apply-system-tools", (event, selectedIds) => {
  log(`Received apply-system-tools with data: ${JSON.stringify(selectedIds)}`);
  const commands = systemToolsOptions
    .map((opt) => {
      if (opt.command) {
        return selectedIds.includes(opt.id) ? wrapCommand(opt.command) : null;
      }
      const cmd = selectedIds.includes(opt.id) ? opt.commandOn : opt.commandOff;
      return cmd ? wrapCommand(cmd) : null;
    })
    .filter((cmd) => cmd !== null);
  executeCommands(commands, event, "system-tools-response");
});

ipcMain.on("apply-system-tweaks", (event, selectedIds) => {
  log(`Received apply-system-tweaks with data: ${JSON.stringify(selectedIds)}`);
  const commands = systemTweaksOptions
    .map((opt) => {
      if (opt.command) {
        return selectedIds.includes(opt.id) ? wrapCommand(opt.command) : null;
      }
      const cmd = selectedIds.includes(opt.id) ? opt.commandOn : opt.commandOff;
      return cmd ? wrapCommand(cmd) : null;
    })
    .filter((cmd) => cmd !== null);
  executeCommands(commands, event, "system-tweaks-response");
});

ipcMain.on("apply-network-tools", (event, selectedIds) => {
  log(`Received apply-network-tools with data: ${JSON.stringify(selectedIds)}`);
  const commands = networkToolsOptions
    .map((opt) => {
      if (opt.command) {
        return selectedIds.includes(opt.id) ? wrapCommand(opt.command) : null;
      }
      const cmd = selectedIds.includes(opt.id) ? opt.commandOn : opt.commandOff;
      return cmd ? wrapCommand(cmd) : null;
    })
    .filter((cmd) => cmd !== null);
  executeCommands(commands, event, "network-tools-response");
});

ipcMain.on("apply-network-tweaks", (event, selectedIds) => {
  log(`Received apply-network-tweaks with data: ${JSON.stringify(selectedIds)}`);
  const commands = networkTweaksOptions
    .map((opt) => {
      if (opt.command) {
        return selectedIds.includes(opt.id) ? wrapCommand(opt.command) : null;
      }
      const cmd = selectedIds.includes(opt.id) ? opt.commandOn : opt.commandOff;
      return cmd ? wrapCommand(cmd) : null;
    })
    .filter((cmd) => cmd !== null);
  executeCommands(commands, event, "network-tweaks-response");
});

ipcMain.on("apply-power-optimizations", (event, selectedIds) => {
  log(`Received apply-power-optimizations with data: ${JSON.stringify(selectedIds)}`);
  const commands = powerOptions
    .map((opt) => {
      if (opt.command) {
        return selectedIds.includes(opt.id) ? wrapCommand(opt.command) : null;
      }
      const cmd = selectedIds.includes(opt.id) ? opt.commandOn : opt.commandOff;
      return cmd ? wrapCommand(cmd) : null;
    })
    .filter((cmd) => cmd !== null);
  executeCommands(commands, event, "power-optimizations-response");
});

ipcMain.handle("check-fixes-state", async (event, category, optionId) => {
  let option;
  if (category === "systemTweaks") {
    option = systemTweaksOptions.find((opt) => opt.id === optionId);
  } else if (category === "networkTweaks") {
    option = networkTweaksOptions.find((opt) => opt.id === optionId);
  }
  if (!option || option.command) return null;

  if (option.commandOn.startsWith("reg add")) {
    const regex = /reg add "([^"]+)"\s+\/v\s+(\S+)\s+\/t\s+REG_DWORD\s+\/d\s+(\d+)/i;
    const match = option.commandOn.match(regex);
    if (!match) return false;

    const [_, keyPath, valueName, expectedValue] = match;
    const queryCmd = `reg query "${keyPath}" /v ${valueName}`;

    return new Promise((resolve) => {
      let outputData = "";
      const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", queryCmd]);

      psProcess.stdout.on("data", (data) => (outputData += data.toString()));
      psProcess.stderr.on("data", (data) => (outputData += data.toString()));
      psProcess.on("close", () => {
        const valueMatch = outputData.match(new RegExp(`${valueName}\\s+REG_DWORD\\s+0x${Number.parseInt(expectedValue).toString(16)}`, "i"));
        resolve(!!valueMatch);
      });
      psProcess.on("error", () => resolve(false));
    });
  }

  if (option.commandOn.startsWith("sc.exe")) {
    const scMatch = option.commandOn.match(/sc\.exe config "([^"]+)" start=(\w+)/i);
    if (!scMatch) return false;

    const serviceName = scMatch[1];
    const expectedStartType = scMatch[2].toLowerCase();

    const expectedCodeMap = { auto: "2", disabled: "4", demand: "3", "delayed-auto": "2" };
    const expectedCode = expectedCodeMap[expectedStartType];
    if (!expectedCode) return false;

    const checkCmd = `sc qc "${serviceName}"`;

    return new Promise((resolve) => {
      let outputData = "";
      const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", checkCmd]);

      psProcess.stdout.on("data", (data) => (outputData += data.toString()));
      psProcess.stderr.on("data", (data) => (outputData += data.toString()));
      psProcess.on("close", () => {
        const startTypeLine = outputData.split("\n").find((line) => line.includes("START_TYPE"));
        if (!startTypeLine) {
          resolve(false);
          return;
        }
        const currentCode = startTypeLine.split(":")[1].trim().split(/\s+/)[0];
        resolve(currentCode === expectedCode);
      });
      psProcess.on("error", () => resolve(false));
    });
  }

  return false;
});
