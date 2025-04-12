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
    if (opt.command) {
      if (isSelected) {
        cmd = opt.command;
      }
    } else if (opt.commandOn && opt.commandOff) {
      cmd = isSelected ? opt.commandOn : opt.commandOff;
    } else if (opt.commandOn) {
      if (isSelected) {
        cmd = opt.commandOn;
      }
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

ipcMain.on("apply-system-tools", (event, selectedIds) => {
  log(`Received apply-system-tools with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, systemToolsOptions);
  executeCommands(commands, event, "system-tools-response");
});

ipcMain.on("apply-system-tweaks", (event, selectedIds) => {
  log(`Received apply-system-tweaks with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, systemTweaksOptions);
  executeCommands(commands, event, "system-tweaks-response");
});

ipcMain.on("apply-network-tools", (event, selectedIds) => {
  log(`Received apply-network-tools with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, networkToolsOptions);
  executeCommands(commands, event, "network-tools-response");
});

ipcMain.on("apply-network-tweaks", (event, selectedIds) => {
  log(`Received apply-network-tweaks with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, networkTweaksOptions);
  executeCommands(commands, event, "network-tweaks-response");
});

ipcMain.on("apply-power-optimizations", (event, selectedIds) => {
  log(`Received apply-power-optimizations with data: ${JSON.stringify(selectedIds)}`);
  const commands = getCommandsToExecute(selectedIds, powerOptions);
  executeCommands(commands, event, "power-optimizations-response");
});

/**
 * Checks the state of a registry value.
 * @param {string} keyPath - The registry key path.
 * @param {string} valueName - The name of the value.
 * @param {string} expectedValue - The expected data for the value.
 * @param {string} valueType - The expected type (e.g., 'REG_DWORD', 'REG_SZ').
 * @returns {Promise<boolean>} True if the current value matches the expected value.
 */
function checkRegistryValue(keyPath, valueName, expectedValue, valueType) {
  return new Promise((resolve) => {
    const queryCmd = `reg query "${keyPath}" /v ${valueName}`;
    let outputData = "";
    let errorData = "";

    const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", queryCmd]);

    psProcess.stdout.on("data", (data) => (outputData += data.toString()));
    psProcess.stderr.on("data", (data) => (errorData += data.toString()));

    psProcess.on("close", (code) => {
      if (code !== 0) {
        log(`Registry query failed for "${keyPath}" /v ${valueName}. Code: ${code}. Stderr: ${errorData.trim()}`, "warn");
        resolve(false);
        return;
      }
      const hexExpected = valueType.toUpperCase() === "REG_DWORD" ? Number.parseInt(expectedValue).toString(16) : null;
      const valuePattern = valueType.toUpperCase() === "REG_DWORD" ? new RegExp(`${valueName}\\s+${valueType}\\s+0x${hexExpected}`, "i") : new RegExp(`${valueName}\\s+${valueType}\\s+${expectedValue}`, "i");

      const valueMatch = outputData.match(valuePattern);
      resolve(!!valueMatch);
    });

    psProcess.on("error", (err) => {
      log(`Error spawning process for registry query "${keyPath}" /v ${valueName}: ${err.message}`, "error");
      resolve(false);
    });
  });
}

/**
 * Checks the start type of a Windows service.
 * @param {string} serviceName - The name of the service.
 * @param {string} expectedStartType - The expected start type ('auto', 'disabled', 'demand').
 * @returns {Promise<boolean>} True if the current start type matches the expected type.
 */
function checkServiceStartType(serviceName, expectedStartType) {
  return new Promise((resolve) => {
    const checkCmd = `sc qc "${serviceName}"`;
    let outputData = "";
    let errorData = "";

    const psProcess = spawn("powershell.exe", ["-NoProfile", "-Command", checkCmd]);

    psProcess.stdout.on("data", (data) => (outputData += data.toString()));
    psProcess.stderr.on("data", (data) => (errorData += data.toString()));

    psProcess.on("close", (code) => {
      if (code !== 0) {
        log(`Service query failed for "${serviceName}". Code: ${code}. Stderr: ${errorData.trim()}`, "warn");
        resolve(false);
        return;
      }

      const startTypeLine = outputData.split("\n").find((line) => line.trim().startsWith("START_TYPE"));

      if (!startTypeLine) {
        log(`Could not find START_TYPE line for service "${serviceName}"`, "warn");
        resolve(false);
        return;
      }

      const currentTypeMatch = startTypeLine.match(/:\s*\d+\s+([\w_]+)/);
      if (!currentTypeMatch) {
        log(`Could not parse START_TYPE line for service "${serviceName}": ${startTypeLine}`, "warn");
        resolve(false);
        return;
      }

      const currentType = currentTypeMatch[1].toLowerCase();
      const expectedType = expectedStartType.toLowerCase();

      const typeMap = {
        auto: "auto_start",
        disabled: "disabled",
        demand: "demand_start",
      };

      resolve(currentType === typeMap[expectedType]);
    });

    psProcess.on("error", (err) => {
      log(`Error spawning process for service query "${serviceName}": ${err.message}`, "error");
      resolve(false);
    });
  });
}

ipcMain.handle("check-fixes-state", async (event, category, optionId) => {
  let option;
  let optionsArray;

  if (category === "systemTweaks") {
    optionsArray = systemTweaksOptions;
  } else if (category === "networkTweaks") {
    optionsArray = networkTweaksOptions;
  } else {
    log(`Unknown category for check-fixes-state: ${category}`, "warn");
    return null;
  }

  for (const opt of optionsArray) {
    if (opt.id === optionId) {
      option = opt;
      break;
    }
  }

  if (!option) {
    log(`Option not found for ID: ${optionId} in category: ${category}`, "warn");
    return null;
  }

  if (option.command || !option.commandOn) {
    return null;
  }

  if (option.commandOn.trim().startsWith("reg add")) {
    const regCommands = option.commandOn
      .split(";")
      .map((cmd) => cmd.trim())
      .filter((cmd) => cmd.startsWith("reg add"));

    if (regCommands.length === 0) {
      log(`No valid 'reg add' commands found for option ${optionId}`, "warn");
      return false;
    }

    for (const command of regCommands) {
      const regex = /reg add "([^"]+)"\s+\/v\s+(\S+)\s+\/t\s+(\S+)\s+\/d\s+(\S+)/i;
      const match = command.match(regex);
      if (!match) {
        log(`Could not parse reg command: ${command}`, "warn");
        return false;
      }

      const [, keyPath, valueName, valueType, expectedValue] = match;
      const isMatch = await checkRegistryValue(keyPath, valueName, expectedValue, valueType);
      if (!isMatch) {
        return false;
      }
    }
    return true;
  }

  if (option.commandOn.trim().startsWith("sc.exe")) {
    const scMatch = option.commandOn.match(/sc\.exe\s+config\s+"([^"]+)"\s+start=(\w+)/i);
    if (!scMatch) {
      log(`Could not parse sc.exe command: ${option.commandOn}`, "warn");
      return false;
    }

    const [, serviceName, expectedStartType] = scMatch;
    return await checkServiceStartType(serviceName, expectedStartType);
  }

  log(`Unsupported command type for state check: ${option.commandOn}`, "warn");
  return false;
});
