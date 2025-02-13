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
  { id: "apps_calc", command: 'Get-AppxPackage -Name Microsoft.WindowsCalculator -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Calculator", onerror: "Failed to remove Calculator" },
  { id: "apps_onedrive", command: 'Get-AppxPackage -Name *OneDrive* -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing OneDrive", onerror: "Failed to remove OneDrive" },
  { id: "apps_xbox", command: 'Get-AppxPackage -Name *Xbox* -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Xbox", onerror: "Failed to remove Xbox" },
  { id: "apps_newoutlook", command: 'Get-AppxPackage -Name Microsoft.OutlookForWindows -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing New Outlook", onerror: "Failed to remove New Outlook" },
  { id: "apps_recall", command: 'Get-AppxPackage -Name *Recall* -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Recall", onerror: "Failed to remove Recall" },
  { id: "apps_groovemusic", command: 'Get-AppxPackage -Name Microsoft.ZuneMusic -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Groove Music", onerror: "Failed to remove Groove Music" },
  { id: "apps_teams", command: 'Get-AppxPackage -Name MSTeams -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Microsoft Teams", onerror: "Failed to remove Microsoft Teams" },
  { id: "apps_mstore", command: 'Get-AppxPackage -Name Microsoft.WindowsStore -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Microsoft Store", onerror: "Failed to remove Microsoft Store" },
  { id: "apps_photos", command: 'Get-AppxPackage -Name Microsoft.Windows.Photos -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Photos", onerror: "Failed to remove Photos" },
  { id: "apps_snipsketch", command: 'Get-AppxPackage -Name Microsoft.ScreenSketch -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Snip & Sketch", onerror: "Failed to remove Snip & Sketch" },
  { id: "apps_paint", command: 'Get-AppxPackage -Name Microsoft.MSPaint -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Paint", onerror: "Failed to remove Paint" },
  { id: "apps_movietv", command: 'Get-AppxPackage -Name Microsoft.ZuneVideo -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Movies & TV", onerror: "Failed to remove Movies & TV" },
  { id: "apps_edge", command: 'Get-AppxPackage -Name Microsoft.MicrosoftEdge -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Microsoft Edge", onerror: "Failed to remove Microsoft Edge" },
  { id: "apps_xboxcore", command: 'Get-AppxPackage -Name Microsoft.XboxApp -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Xbox Core App", onerror: "Failed to remove Xbox Core App" }
];

const uselessBloatwareOptions = [
  { id: "apps_ub_mail", command: 'Get-AppxPackage -Name *Mail* -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Mail and Calendar", onerror: "Failed to remove Mail and Calendar" },
  { id: "apps_ub_maps", command: 'Get-AppxPackage -Name Microsoft.WindowsMaps -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Maps", onerror: "Failed to remove Maps" },
  { id: "apps_ub_skype", command: 'Get-AppxPackage -Name Microsoft.SkypeApp -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Skype", onerror: "Failed to remove Skype" },
  { id: "apps_ub_getstarted", command: 'Get-AppxPackage -Name Microsoft.Getstarted -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Get Started", onerror: "Failed to remove Get Started" },
  { id: "apps_ub_meetnow", command: 'Get-AppxPackage -Name Microsoft.WindowsMeetNow -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Meet Now", onerror: "Failed to remove Meet Now" },
  { id: "apps_ub_phonelink", command: 'Get-AppxPackage -Name Microsoft.YourPhone -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Phone Link", onerror: "Failed to remove Phone Link" },
  { id: "apps_ub_gethelp", command: 'Get-AppxPackage -Name Microsoft.GetHelp -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Get Help", onerror: "Failed to remove Get Help" },
  { id: "apps_ub_family", command: 'Get-AppxPackage -Name MicrosoftCorporationII.MicrosoftFamily -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Microsoft Family", onerror: "Failed to remove Microsoft Family" },
  { id: "apps_ub_paint3d", command: 'Get-AppxPackage -Name Microsoft.Paint3D -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Paint 3D", onerror: "Failed to remove Paint 3D" },
  { id: "apps_ub_feedback", command: 'Get-AppxPackage -Name Microsoft.WindowsFeedbackHub -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Feedback Hub", onerror: "Failed to remove Feedback Hub" },
  { id: "apps_ub_copilotstore", command: 'Get-AppxPackage -Name Microsoft.Copilot_8wekyb3d8bbwe -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Copilot (Store)", onerror: "Failed to remove Copilot (Store)" },
  { id: "apps_ub_clipchamp", command: 'Get-AppxPackage -Name Clipchamp.Clipchamp -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Clipchamp", onerror: "Failed to remove Clipchamp" },
  { id: "apps_ub_onenote", command: 'Get-AppxPackage -Name Microsoft.Office.OneNote -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing OneNote", onerror: "Failed to remove OneNote" },
  { id: "apps_ub_quickassist", command: 'Get-AppxPackage -Name MicrosoftCorporationII.QuickAssist -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Quick Assist", onerror: "Failed to remove Quick Assist" },
  { id: "apps_ub_solitaire", command: 'Get-AppxPackage -Name Microsoft.MicrosoftSolitaireCollection -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Solitaire Collection", onerror: "Failed to remove Solitaire Collection" },
  { id: "apps_ub_powerautomate", command: 'Get-AppxPackage -Name Microsoft.PowerAutomateDesktop -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Power Automate", onerror: "Failed to remove Power Automate" },
  { id: "apps_ub_alarms", command: 'Get-AppxPackage -Name Microsoft.WindowsAlarms -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Alarms & Clock", onerror: "Failed to remove Alarms & Clock" },
  { id: "apps_ub_copilotprov", command: 'Get-AppxPackage -Name Microsoft.Windows.Ai.Copilot.Provider -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Copilot Provider", onerror: "Failed to remove Copilot Provider" },
  { id: "apps_ub_camera", command: 'Get-AppxPackage -Name Microsoft.WindowsCamera -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Camera", onerror: "Failed to remove Camera" },
  { id: "apps_ub_weather", command: 'Get-AppxPackage -Name Microsoft.BingWeather -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Weather", onerror: "Failed to remove Weather" },
  { id: "apps_ub_3dviewer", command: 'Get-AppxPackage -Name Microsoft.Microsoft3DViewer -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing 3D Viewer", onerror: "Failed to remove 3D Viewer" },
  { id: "apps_ub_stickynotes", command: 'Get-AppxPackage -Name Microsoft.MicrosoftStickyNotes -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Sticky Notes", onerror: "Failed to remove Sticky Notes" },
  { id: "apps_ub_bing", command: 'Get-AppxPackage -Name Microsoft.BingSearch -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Bing Search", onerror: "Failed to remove Bing Search" },
  { id: "apps_ub_todo", command: 'Get-AppxPackage -Name Microsoft.Todos -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing To Do", onerror: "Failed to remove To Do" },
  { id: "apps_ub_mixedreality", command: 'Get-AppxPackage -Name Microsoft.MixedReality.Portal -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Mixed Reality Portal", onerror: "Failed to remove Mixed Reality Portal" },
  { id: "apps_ub_officehub", command: 'Get-AppxPackage -Name Microsoft.MicrosoftOfficeHub -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Office Hub", onerror: "Failed to remove Office Hub" },
  { id: "apps_ub_people", command: 'Get-AppxPackage -Name Microsoft.People -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing People", onerror: "Failed to remove People" },
  { id: "apps_ub_copilot", command: 'Get-AppxPackage -Name Microsoft.Copilot -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Copilot", onerror: "Failed to remove Copilot" },
  { id: "apps_ub_devhome", command: 'Get-AppxPackage -Name Microsoft.Windows.DevHome -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Dev Home", onerror: "Failed to remove Dev Home" },
  { id: "apps_ub_soundrecorder", command: 'Get-AppxPackage -Name Microsoft.WindowsSoundRecorder -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Sound Recorder", onerror: "Failed to remove Sound Recorder" },
  { id: "apps_ub_cortana", command: 'Get-AppxPackage -Name Microsoft.549981C3F5F10 -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Cortana", onerror: "Failed to remove Cortana" },
  { id: "apps_ub_news", command: 'Get-AppxPackage -Name Microsoft.BingNews -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing News", onerror: "Failed to remove News" },
  { id: "apps_ub_xboxgamebar", command: 'Get-AppxPackage -Name Microsoft.XboxGamingOverlay -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Xbox Game Bar", onerror: "Failed to remove Xbox Game Bar" },
  { id: "apps_ub_3dbuilder", command: 'Get-AppxPackage -Name Microsoft.3DBuilder -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing 3D Builder", onerror: "Failed to remove 3D Builder" },
  { id: "apps_ub_whiteboard", command: 'Get-AppxPackage -Name Microsoft.Whiteboard -ErrorAction SilentlyContinue | Remove-AppxPackage -AllUsers', comment: "Removing Microsoft Whiteboard", onerror: "Failed to remove Microsoft Whiteboard" }
];

const recommendedAppsOptions = [
  { id: "rec_vlc", command: 'winget install --id=VideoLAN.VLC -e', comment: "Installing VLC Media Player", onerror: "Failed to install VLC Media Player" },
  { id: "rec_7zip", command: 'winget install --id=7zip.7zip -e', comment: "Installing 7‑Zip", onerror: "Failed to install 7‑Zip" },
  { id: "rec_notepadpp", command: 'winget install --id=Notepad++.Notepad++ -e', comment: "Installing Notepad++", onerror: "Failed to install Notepad++" },
  { id: "rec_powertoys", command: 'winget install --id=Microsoft.PowerToys -e', comment: "Installing Microsoft PowerToys", onerror: "Failed to install Microsoft PowerToys" },
  { id: "rec_chrome", command: 'winget install --id=Google.Chrome -e', comment: "Installing Google Chrome", onerror: "Failed to install Google Chrome" },
  { id: "rec_slack", command: 'winget install --id=SlackTechnologies.Slack -e', comment: "Installing Slack", onerror: "Failed to install Slack" },
  { id: "rec_zoom", command: 'winget install --id=Zoom.Zoom -e', comment: "Installing Zoom", onerror: "Failed to install Zoom" },
  { id: "rec_spotify", command: 'winget install --id=Spotify.Spotify -e', comment: "Installing Spotify", onerror: "Failed to install Spotify" },
  { id: "rec_firefox", command: 'winget install --id=Mozilla.Firefox -e', comment: "Installing Firefox", onerror: "Failed to install Firefox" },
  { id: "rec_discord", command: 'winget install --id=Discord.Discord -e', comment: "Installing Discord", onerror: "Failed to install Discord" },
  { id: "rec_vscode", command: 'winget install --id=Microsoft.VisualStudioCode -e', comment: "Installing Visual Studio Code", onerror: "Failed to install Visual Studio Code" }
];

const wrapCommand = (opt) => {
  return `${opt.command};`;
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
    log("Process error: ${error}", 'error');
    event.reply(responseChannel, { success: false, message: error.toString() });
  });
  psProcess.on('close', (code) => {
    log("Process closed with code: " + code);
    event.reply(responseChannel, { success: code === 0, message: outputData || `Process exited with code ${code}` });
  });
}

ipcMain.on('apply-remove-apps', (event, selectedIds) => {
  log("Received apply-remove-apps with data: " + JSON.stringify(selectedIds));
  const commands = removeAppsOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'remove-apps-response');
});

ipcMain.on('apply-useless-bloatware', (event, selectedIds) => {
  log("Received apply-useless-bloatware with data: " + JSON.stringify(selectedIds));
  const commands = uselessBloatwareOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'useless-bloatware-response');
});

ipcMain.on('apply-recommended-apps', (event, selectedIds) => {
  log("Received apply-recommended-apps with data: " + JSON.stringify(selectedIds));
  const commands = recommendedAppsOptions.filter(opt => selectedIds.includes(opt.id)).map(wrapCommand);
  const psCommand = commands.join(";");
  executeCommands(psCommand, event, 'recommended-apps-response');
});
