const { ipcMain } = require('electron');
const { execSync } = require('child_process');

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

const HEALTH_CHECKS = {
  bloatware: {
    weight: 20,
    check: () => {
      try {
        const bloatwareApps = uselessBloatwareOptions;
        const installed = bloatwareApps.filter(app => {
          const packageName = app.command.match(/-Name\s+'?([^'\s]+)/)[1];
          const checkCmd = `powershell -ExecutionPolicy Bypass -Command "Get-AppxPackage -Name ${packageName} -ErrorAction SilentlyContinue | Select-Object -Property Name"`;
          return execSync(checkCmd, { stdio: 'pipe' }).toString().trim().length > 0;
        }).length;
        return { passed: installed <= 5, message: `${installed} bloatware apps found` };
      } catch (error) {
        return { passed: false, message: 'Check failed' };
      }
    }
  },
  diskHealth: {
    weight: 15,
    check: () => {
      try {
        const output = execSync('powershell -ExecutionPolicy Bypass -Command "wmic volume get DriveLetter,Capacity,FreeSpace | findstr C:"').toString();
        const [capacity, freeSpace] = output.match(/\d+/g);
        const freeGB = (freeSpace / 1e9).toFixed(1);
        const totalGB = (capacity / 1e9).toFixed(1);
        return { passed: freeGB > 5, message: `Free space: ${freeGB}GB / ${totalGB}GB` };
      } catch (error) {
        return { passed: false, message: 'Check failed' };
      }
    }
  },
  tempFiles: {
    weight: 10,
    check: () => {
      try {
        const tempSize = execSync('powershell -ExecutionPolicy Bypass -Command "(Get-ChildItem $env:TEMP -Recurse | Measure-Object -Property Length -Sum).Sum"').toString();
        const sizeGB = (parseInt(tempSize) / 1e9).toFixed(1);
        return { passed: sizeGB < 1, message: `Temp files: ${sizeGB}GB` };
      } catch (error) {
        return { passed: false, message: 'Check failed' };
      }
    }
  },
  updates: {
    weight: 10,
    check: () => {
      try {
        const updates = execSync('powershell -ExecutionPolicy Bypass -Command "Import-Module PSWindowsUpdate; Get-WindowsUpdate -IsInstalled:$false"').toString();
        return { passed: !updates.includes('Update'), message: updates.includes('Update') ? 'Updates pending' : 'Up to date' };
      } catch (error) {
        return { passed: false, message: 'Check failed - ' + error.message.split('\n')[0] };
      }
    }
  },
  startupPrograms: {
    weight: 5,
    check: () => {
      try {
        const startupCount = execSync('powershell -Command "Get-CimInstance Win32_StartupCommand | Measure-Object | Select-Object -ExpandProperty Count"').toString().trim();
        const count = parseInt(startupCount) || 0;
        return { passed: count <= 5, message: `${count} startup programs` };
      } catch (error) {
        return { passed: false, message: 'Check failed' };
      }
    }
  },
  antivirusStatus: {
    weight: 10,
    check: () => {
      try {
        const status = execSync('powershell -Command "(Get-MpComputerStatus).AntivirusEnabled"').toString().trim();
        return { passed: status === 'True', message: status === 'True' ? 'Enabled' : 'Disabled' };
      } catch (error) {
        return { passed: false, message: 'Check failed' };
      }
    }
  },
  firewallStatus: {
    weight: 10,
    check: () => {
      try {
        const output = execSync('netsh advfirewall show allprofiles state').toString();
        return { passed: !output.includes('OFF'), message: output.includes('OFF') ? 'Disabled' : 'Enabled' };
      } catch (error) {
        return { passed: false, message: 'Check failed' };
      }
    }
  },
  systemUptime: {
    weight: 10,
    check: () => {
      try {
        const bootTime = execSync('powershell -Command "(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime"').toString().trim();
        const uptimeDays = (Date.now() - new Date(bootTime)) / 86400000;
        return { passed: uptimeDays < 7, message: `Uptime: ${uptimeDays.toFixed(1)} days` };
      } catch (error) {
        return { passed: false, message: 'Check failed' };
      }
    }
  },
  dnsSettings: {
    weight: 5,
    check: () => {
      try {
        const dns = execSync('powershell -Command "Get-DnsClientServerAddress -AddressFamily IPv4 | Select-Object -ExpandProperty ServerAddresses"').toString();
        const goodDNS = ['8.8.8.8', '1.1.1.1', '9.9.9.9'];
        return { passed: goodDNS.some(server => dns.includes(server)), message: goodDNS.some(server => dns.includes(server)) ? 'Secure DNS' : 'Default DNS' };
      } catch (error) {
        return { passed: false, message: 'Check failed' };
      }
    }
  }
};

ipcMain.handle('check-system-health', async (event) => {
  const checks = [];
  let totalScore = 0;

  for (const [name, { weight, check }] of Object.entries(HEALTH_CHECKS)) {
    const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
    event.sender.send('health-check-progress', `Checking System Health: ${formattedName}...`);

    try {
      const result = check();
      const points = result.passed ? weight : 0;
      checks.push({ name: formattedName, weight, passed: result.passed, message: result.message, points });
      totalScore += points;
    } catch (error) {
      checks.push({ name: formattedName, weight, passed: false, message: 'Check failed', points: 0 });
    }
  }

  return {
    score: Math.min(totalScore, 100),
    status: totalScore > 90 ? 'Excellent' : totalScore > 70 ? 'Good' : totalScore > 50 ? 'Fair' : 'Poor',
    statusColor: totalScore > 90 ? '#2ecc71' : totalScore > 70 ? '#f1c40f' : totalScore > 50 ? '#e67e22' : '#e74c3c',
    checks
  };
});
