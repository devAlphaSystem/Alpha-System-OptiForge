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

const removeAppsOptions = [
  {
    id: 'apps_calc',
    command: 'Get-AppxPackage -Name Microsoft.WindowsCalculator -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_onedrive',
    command: 'Get-AppxPackage -Name *OneDrive* -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_xbox',
    command: 'Get-AppxPackage -Name *Xbox* -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_newoutlook',
    command: 'Get-AppxPackage -Name Microsoft.OutlookForWindows -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_recall',
    command: 'Get-AppxPackage -Name *Recall* -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_groovemusic',
    command: 'Get-AppxPackage -Name Microsoft.ZuneMusic -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_teams',
    command: 'Get-AppxPackage -Name MSTeams -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_mstore',
    command: 'Get-AppxPackage -Name Microsoft.WindowsStore -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_photos',
    command: 'Get-AppxPackage -Name Microsoft.Windows.Photos -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_snipsketch',
    command: 'Get-AppxPackage -Name Microsoft.ScreenSketch -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_paint',
    command: 'Get-AppxPackage -Name Microsoft.MSPaint -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_movietv',
    command: 'Get-AppxPackage -Name Microsoft.ZuneVideo -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_edge',
    command: 'Get-AppxPackage -Name Microsoft.MicrosoftEdge -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_xboxcore',
    command: 'Get-AppxPackage -Name Microsoft.XboxApp -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  }
];

const uselessBloatwareOptions = [
  {
    id: 'apps_ub_mail',
    command: 'Get-AppxPackage -Name *Mail* -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_maps',
    command: 'Get-AppxPackage -Name Microsoft.WindowsMaps -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_skype',
    command: 'Get-AppxPackage -Name Microsoft.SkypeApp -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_getstarted',
    command: 'Get-AppxPackage -Name Microsoft.Getstarted -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_meetnow',
    command: 'Get-AppxPackage -Name Microsoft.WindowsMeetNow -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_phonelink',
    command: 'Get-AppxPackage -Name Microsoft.YourPhone -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_gethelp',
    command: 'Get-AppxPackage -Name Microsoft.GetHelp -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_family',
    command: 'Get-AppxPackage -Name MicrosoftCorporationII.MicrosoftFamily -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_paint3d',
    command: 'Get-AppxPackage -Name Microsoft.Paint3D -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_feedback',
    command: 'Get-AppxPackage -Name Microsoft.WindowsFeedbackHub -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_copilotstore',
    command: 'Get-AppxPackage -Name Microsoft.Copilot_8wekyb3d8bbwe -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_clipchamp',
    command: 'Get-AppxPackage -Name Clipchamp.Clipchamp -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_onenote',
    command: 'Get-AppxPackage -Name Microsoft.Office.OneNote -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_quickassist',
    command: 'Get-AppxPackage -Name MicrosoftCorporationII.QuickAssist -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_solitaire',
    command: 'Get-AppxPackage -Name Microsoft.MicrosoftSolitaireCollection -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_powerautomate',
    command: 'Get-AppxPackage -Name Microsoft.PowerAutomateDesktop -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_alarms',
    command: 'Get-AppxPackage -Name Microsoft.WindowsAlarms -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_copilotprov',
    command: 'Get-AppxPackage -Name Microsoft.Windows.Ai.Copilot.Provider -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_camera',
    command: 'Get-AppxPackage -Name Microsoft.WindowsCamera -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_weather',
    command: 'Get-AppxPackage -Name Microsoft.BingWeather -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_3dviewer',
    command: 'Get-AppxPackage -Name Microsoft.Microsoft3DViewer -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_stickynotes',
    command: 'Get-AppxPackage -Name Microsoft.MicrosoftStickyNotes -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_bing',
    command: 'Get-AppxPackage -Name Microsoft.BingSearch -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_todo',
    command: 'Get-AppxPackage -Name Microsoft.Todos -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_mixedreality',
    command: 'Get-AppxPackage -Name Microsoft.MixedReality.Portal -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_officehub',
    command: 'Get-AppxPackage -Name Microsoft.MicrosoftOfficeHub -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_people',
    command: 'Get-AppxPackage -Name Microsoft.People -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_copilot',
    command: 'Get-AppxPackage -Name Microsoft.Copilot -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_devhome',
    command: 'Get-AppxPackage -Name Microsoft.Windows.DevHome -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_soundrecorder',
    command: 'Get-AppxPackage -Name Microsoft.WindowsSoundRecorder -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_cortana',
    command: 'Get-AppxPackage -Name Microsoft.549981C3F5F10 -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_news',
    command: 'Get-AppxPackage -Name Microsoft.BingNews -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_xboxgamebar',
    command: 'Get-AppxPackage -Name Microsoft.XboxGamingOverlay -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_3dbuilder',
    command: 'Get-AppxPackage -Name Microsoft.3DBuilder -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  },
  {
    id: 'apps_ub_whiteboard',
    command: 'Get-AppxPackage -Name Microsoft.Whiteboard -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers'
  }
];

function wrapCommand(opt) {
  return opt.command.replace(/&&/g, ';');
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

ipcMain.on('apply-remove-apps', (event, selectedIds) => {
  log('Received apply-remove-apps with data: ' + JSON.stringify(selectedIds));
  const commands = removeAppsOptions.filter((opt) => selectedIds.includes(opt.id)).map(wrapCommand);
  executeCommands(commands, event, 'remove-apps-response');
});

ipcMain.on('apply-useless-bloatware', (event, selectedIds) => {
  log('Received apply-useless-bloatware with data: ' + JSON.stringify(selectedIds));
  const commands = uselessBloatwareOptions.filter((opt) => selectedIds.includes(opt.id)).map(wrapCommand);
  executeCommands(commands, event, 'useless-bloatware-response');
});

ipcMain.handle('check-remove-app-status', async (event, appId) => {
  const option = removeAppsOptions.find((opt) => opt.id === appId);
  if (!option) {
    return { installed: false };
  }
  const match = option.command.match(/-Name\s+(['"])?([^\s'"]+)\1/);
  if (!match) {
    return { installed: false };
  }

  const pattern = match[2];
  const checkCmd = `Get-AppxPackage -Name ${pattern} -ErrorAction SilentlyContinue`;

  return new Promise((resolve) => {
    let outputData = '';
    const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', checkCmd]);

    psProcess.stdout.on('data', (data) => {
      outputData += data.toString().trim();
    });

    psProcess.stderr.on('data', (data) => {
      outputData += data.toString().trim();
    });

    psProcess.on('close', () => {
      resolve({ installed: outputData.length > 0 });
    });

    psProcess.on('error', () => {
      resolve({ installed: false });
    });
  });
});

ipcMain.handle('check-app-status', async (event, appId) => {
  const option = uselessBloatwareOptions.find((opt) => opt.id === appId);
  if (!option) {
    return { installed: false };
  }
  const match = option.command.match(/-Name\s+(['"])?([^\s'"]+)\1/);
  if (!match) {
    return { installed: false };
  }

  const pattern = match[2];
  const checkCmd = `Get-AppxPackage -Name ${pattern} -ErrorAction SilentlyContinue`;

  return new Promise((resolve) => {
    let outputData = '';
    const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', checkCmd]);

    psProcess.stdout.on('data', (data) => {
      outputData += data.toString().trim();
    });

    psProcess.stderr.on('data', (data) => {
      outputData += data.toString().trim();
    });

    psProcess.on('close', () => {
      resolve({ installed: outputData.length > 0 });
    });

    psProcess.on('error', () => {
      resolve({ installed: false });
    });
  });
});
