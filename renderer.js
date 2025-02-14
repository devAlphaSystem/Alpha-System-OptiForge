const { ipcRenderer } = require('electron');
const os = require('os');

window.addEventListener('DOMContentLoaded', () => {
  const notifier = window.EasyNotificationInstance;

  const navItems = document.querySelectorAll('.nav a');
  const tabContents = document.querySelectorAll('.tab');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      console.info("Navigating to tab:", item.getAttribute('data-tab'));
      navItems.forEach(nav => nav.classList.remove('active'));
      tabContents.forEach(tab => tab.classList.remove('active'));
      item.classList.add('active');
      const targetId = item.getAttribute('data-tab');
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });

  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    header.addEventListener('click', (e) => {
      if (e.target.tagName.toLowerCase() === 'button') return;
      if (content.style.display === 'block' || content.classList.contains('active')) {
        content.style.display = 'none';
        content.classList.remove('active');
      } else {
        content.style.display = 'block';
        content.classList.add('active');
      }
    });
  });

  const setupSelectButtons = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const selectAllBtn = section.querySelector('.select-all');
    const deselectAllBtn = section.querySelector('.deselect-all');
    const checkboxes = section.querySelectorAll('input[type="checkbox"]');

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        checkboxes.forEach(chk => chk.checked = true);
      });
    }
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        checkboxes.forEach(chk => chk.checked = false);
      });
    }
  };

  const sectionsToSetup = [
    'privacySection',
    'gamingSection',
    'updatesSection',
    'powerSection',
    'servicesSection',
    'recommendedAppsSection',
    'removeAppsSection',
    'uselessBloatwareSection',
    'systemToolsSection',
    'networkToolsSection',
    'maintenanceSection',
    'advancedSystemTweaksSection',
    'advancedNetworkTweaksSection'
  ];
  sectionsToSetup.forEach(setupSelectButtons);

  let privacyStartNotificationId = null;
  const applyPrivacyBtn = document.getElementById('applyPrivacyBtn');
  applyPrivacyBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#privacySection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Privacy Optimizations selected:", selected);

    privacyStartNotificationId = notifier.createNotification({
      title: 'Privacy Optimizations',
      message: 'Executing privacy optimizations...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-privacy-optimizations', selected);
  });

  ipcRenderer.on('privacy-optimizations-response', (event, arg) => {
    console.info("Privacy Optimizations Response:", arg);
    if (privacyStartNotificationId) {
      notifier.dismissNotification(privacyStartNotificationId);
      privacyStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Privacy Optimizations',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Privacy Optimizations',
        message: 'Privacy optimizations completed successfully.',
        type: 'success'
      });
    }
  });

  let gamingStartNotificationId = null;
  const applyGamingBtn = document.getElementById('applyGamingBtn');
  applyGamingBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#gamingSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Gaming Optimizations selected:", selected);

    gamingStartNotificationId = notifier.createNotification({
      title: 'Gaming Optimizations',
      message: 'Executing gaming optimizations...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-gaming-optimizations', selected);
  });

  ipcRenderer.on('gaming-optimizations-response', (event, arg) => {
    console.info("Gaming Optimizations Response:", arg);
    if (gamingStartNotificationId) {
      notifier.dismissNotification(gamingStartNotificationId);
      gamingStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Gaming Optimizations',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Gaming Optimizations',
        message: 'Gaming optimizations completed successfully.',
        type: 'success'
      });
    }
  });

  let updatesStartNotificationId = null;
  const applyUpdatesBtn = document.getElementById('applyUpdatesBtn');
  applyUpdatesBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#updatesSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Updates Optimizations selected:", selected);

    updatesStartNotificationId = notifier.createNotification({
      title: 'Updates Optimizations',
      message: 'Executing updates optimizations...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-updates-optimizations', selected);
  });

  ipcRenderer.on('updates-optimizations-response', (event, arg) => {
    console.info("Updates Optimizations Response:", arg);
    if (updatesStartNotificationId) {
      notifier.dismissNotification(updatesStartNotificationId);
      updatesStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Updates Optimizations',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Updates Optimizations',
        message: 'Updates optimizations completed successfully.',
        type: 'success'
      });
    }
  });

  let powerStartNotificationId = null;
  const applyPowerBtn = document.getElementById('applyPowerBtn');
  applyPowerBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#powerSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Power Optimizations selected:", selected);

    powerStartNotificationId = notifier.createNotification({
      title: 'Power Optimizations',
      message: 'Executing power optimizations...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-power-optimizations', selected);
  });

  ipcRenderer.on('power-optimizations-response', (event, arg) => {
    console.info("Power Optimizations Response:", arg);
    if (powerStartNotificationId) {
      notifier.dismissNotification(powerStartNotificationId);
      powerStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Power Optimizations',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Power Optimizations',
        message: 'Power optimizations completed successfully.',
        type: 'success'
      });
    }
  });

  let servicesStartNotificationId = null;
  const applyServicesBtn = document.getElementById('applyServicesBtn');
  applyServicesBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#servicesSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Services Optimizations selected:", selected);

    servicesStartNotificationId = notifier.createNotification({
      title: 'Services Optimizations',
      message: 'Executing services optimizations...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-services-optimizations', selected);
  });

  ipcRenderer.on('services-optimizations-response', (event, arg) => {
    console.info("Services Optimizations Response:", arg);
    if (servicesStartNotificationId) {
      notifier.dismissNotification(servicesStartNotificationId);
      servicesStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Services Optimizations',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Services Optimizations',
        message: 'Services optimizations completed successfully.',
        type: 'success'
      });
    }
  });

  let maintenanceStartNotificationId = null;
  const applyMaintenanceBtn = document.getElementById('applyMaintenanceBtn');
  applyMaintenanceBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#maintenanceSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Maintenance Optimizations selected:", selected);

    maintenanceStartNotificationId = notifier.createNotification({
      title: 'Maintenance Optimizations',
      message: 'Executing maintenance optimizations...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-maintenance-optimizations', selected);
  });

  ipcRenderer.on('maintenance-optimizations-response', (event, arg) => {
    console.info("Maintenance Optimizations Response:", arg);
    if (maintenanceStartNotificationId) {
      notifier.dismissNotification(maintenanceStartNotificationId);
      maintenanceStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Maintenance Optimizations',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Maintenance Optimizations',
        message: 'Maintenance optimizations completed successfully.',
        type: 'success'
      });
    }
  });

  let removeAppsStartNotificationId = null;
  const applyRemoveAppsBtn = document.getElementById('applyRemoveAppsBtn');
  applyRemoveAppsBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#removeAppsSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Remove Apps selected:", selected);

    removeAppsStartNotificationId = notifier.createNotification({
      title: 'Remove Apps',
      message: 'Executing app removal...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-remove-apps', selected);
  });

  ipcRenderer.on('remove-apps-response', (event, arg) => {
    console.info("Remove Apps Response:", arg);
    if (removeAppsStartNotificationId) {
      notifier.dismissNotification(removeAppsStartNotificationId);
      removeAppsStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Remove Apps',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Remove Apps',
        message: 'Apps removed successfully.',
        type: 'success'
      });
    }
  });

  let bloatwareStartNotificationId = null;
  const applyUselessBloatwareBtn = document.getElementById('applyUselessBloatwareBtn');
  applyUselessBloatwareBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#uselessBloatwareSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Useless Bloatware selected:", selected);

    bloatwareStartNotificationId = notifier.createNotification({
      title: 'Useless Bloatware',
      message: 'Executing removal of useless bloatware...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-useless-bloatware', selected);
  });

  ipcRenderer.on('useless-bloatware-response', (event, arg) => {
    console.info("Useless Bloatware Response:", arg);
    if (bloatwareStartNotificationId) {
      notifier.dismissNotification(bloatwareStartNotificationId);
      bloatwareStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Useless Bloatware',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Useless Bloatware',
        message: 'Bloatware removal completed successfully.',
        type: 'success'
      });
    }
  });

  let systemToolsNotificationId = null;
  const applySystemToolsBtn = document.getElementById('applySystemToolsBtn');
  applySystemToolsBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#systemToolsSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("System Tools selected:", selected);

    systemToolsNotificationId = notifier.createNotification({
      title: 'System Tools',
      message: 'Executing system tools...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-system-tools', selected);
  });

  ipcRenderer.on('system-tools-response', (event, arg) => {
    console.info("System Tools Response:", arg);
    if (systemToolsNotificationId) {
      notifier.dismissNotification(systemToolsNotificationId);
      systemToolsNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'System Tools',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'System Tools',
        message: 'System tools executed successfully.',
        type: 'success'
      });
    }
  });

  let networkToolsNotificationId = null;
  const applyNetworkToolsBtn = document.getElementById('applyNetworkToolsBtn');
  applyNetworkToolsBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#networkToolsSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Network Tools selected:", selected);

    networkToolsNotificationId = notifier.createNotification({
      title: 'Network Tools',
      message: 'Executing network tools...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-network-tools', selected);
  });

  ipcRenderer.on('network-tools-response', (event, arg) => {
    console.info("Network Tools Response:", arg);
    if (networkToolsNotificationId) {
      notifier.dismissNotification(networkToolsNotificationId);
      networkToolsNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Network Tools',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Network Tools',
        message: 'Network tools executed successfully.',
        type: 'success'
      });
    }
  });

  let customCommandNotificationId = null;
  const executeCustomCommandBtn = document.getElementById('executeCustomCommandBtn');
  executeCustomCommandBtn.addEventListener('click', () => {
    const customCommandInput = document.getElementById('customCommandInput');
    const customCmd = customCommandInput.value;
    if (!customCmd.trim()) {
      notifier.createNotification({
        title: 'Custom Command',
        message: 'Please enter a command to execute.',
        type: 'warning'
      });
      return;
    }
    console.info("Executing custom command:", customCmd);

    customCommandNotificationId = notifier.createNotification({
      title: 'Custom Command',
      message: 'Executing custom command...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('execute-custom-command', customCmd);
  });

  ipcRenderer.on('custom-command-response', (event, arg) => {
    console.info("Custom Command Response:", arg);
    if (customCommandNotificationId) {
      notifier.dismissNotification(customCommandNotificationId);
      customCommandNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Custom Command',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Custom Command',
        message: 'Custom command executed successfully.',
        type: 'success'
      });
    }
  });

  let advancedSystemStartNotificationId = null;
  const applyAdvancedSystemTweaksBtn = document.getElementById('applyAdvancedSystemTweaksBtn');
  if (applyAdvancedSystemTweaksBtn) {
    applyAdvancedSystemTweaksBtn.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll('#advancedSystemTweaksSection .section-content input[type="checkbox"]');
      const selected = [];
      checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
      console.info("Advanced System Tweaks selected:", selected);

      advancedSystemStartNotificationId = notifier.createNotification({
        title: 'Advanced System Tweaks',
        message: 'Executing advanced system tweaks...',
        type: 'info',
        displayTime: 0,
        persistent: true,
        hasProgressBar: false,
        showTimerBar: false
      });

      ipcRenderer.send('apply-advanced-system-tweaks', selected);
    });
  }

  ipcRenderer.on('advanced-system-tweaks-response', (event, arg) => {
    console.info("Advanced System Tweaks Response:", arg);
    if (advancedSystemStartNotificationId) {
      notifier.dismissNotification(advancedSystemStartNotificationId);
      advancedSystemStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Advanced System Tweaks',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Advanced System Tweaks',
        message: 'Advanced system tweaks completed successfully.',
        type: 'success'
      });
    }
  });

  let advancedNetworkStartNotificationId = null;
  const applyAdvancedNetworkTweaksBtn = document.getElementById('applyAdvancedNetworkTweaksBtn');
  if (applyAdvancedNetworkTweaksBtn) {
    applyAdvancedNetworkTweaksBtn.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll('#advancedNetworkTweaksSection .section-content input[type="checkbox"]');
      const selected = [];
      checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
      console.info("Advanced Network Tweaks selected:", selected);

      advancedNetworkStartNotificationId = notifier.createNotification({
        title: 'Advanced Network Tweaks',
        message: 'Executing advanced network tweaks...',
        type: 'info',
        displayTime: 0,
        persistent: true,
        hasProgressBar: false,
        showTimerBar: false
      });

      ipcRenderer.send('apply-advanced-network-tweaks', selected);
    });
  }

  ipcRenderer.on('advanced-network-tweaks-response', (event, arg) => {
    console.info("Advanced Network Tweaks Response:", arg);
    if (advancedNetworkStartNotificationId) {
      notifier.dismissNotification(advancedNetworkStartNotificationId);
      advancedNetworkStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Advanced Network Tweaks',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Advanced Network Tweaks',
        message: 'Advanced network tweaks completed successfully.',
        type: 'success'
      });
    }
  });

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  function createCollapsibleSection(title, infoObject) {
    const section = document.createElement('div');
    section.classList.add('section');

    const header = document.createElement('div');
    header.classList.add('section-header');
    const h3 = document.createElement('h3');
    h3.textContent = title;
    header.appendChild(h3);
    section.appendChild(header);

    const content = document.createElement('div');
    content.classList.add('section-content');
    content.style.display = 'none';

    const list = document.createElement('ul');
    list.style.listStyleType = 'none';
    list.style.padding = '0';

    for (const key in infoObject) {
      const li = document.createElement('li');
      li.style.margin = '5px 0';
      li.textContent = `${key}: ${infoObject[key]}`;
      list.appendChild(li);
    }

    content.appendChild(list);
    section.appendChild(content);

    header.addEventListener('click', () => {
      if (content.style.display === 'block') {
        content.style.display = 'none';
        content.classList.remove('active');
      } else {
        content.style.display = 'block';
        content.classList.add('active');
      }
    });

    return section;
  }

  const systemInfoTab = document.getElementById('systemInfoTab');
  if (systemInfoTab) {
    const generalInfo = {
      'OS Type': os.type(),
      'Platform': os.platform(),
      'OS Release': os.release(),
      'Architecture': os.arch(),
      'Hostname': os.hostname(),
      'Uptime': formatUptime(os.uptime()),
      'Temporary Directory': os.tmpdir()
    };

    const cpus = os.cpus();
    const cpuInfo = {};
    if (cpus && cpus.length > 0) {
      cpuInfo['Model'] = cpus[0].model;
      cpuInfo['Speed (MHz)'] = cpus[0].speed;
      cpuInfo['Number of Cores'] = cpus.length;
      const times = cpus[0].times;
      cpuInfo['User Time'] = `${times.user} ms`;
      cpuInfo['System Time'] = `${times.sys} ms`;
      cpuInfo['Idle Time'] = `${times.idle} ms`;
      cpuInfo['IRQ Time'] = `${times.irq} ms`;
    } else {
      cpuInfo['Info'] = 'No CPU data available.';
    }

    const memoryInfo = {
      'Total Memory': formatBytes(os.totalmem()),
      'Free Memory': formatBytes(os.freemem())
    };

    const networkObj = {};
    const networkInterfaces = os.networkInterfaces();
    for (const iface in networkInterfaces) {
      const addresses = networkInterfaces[iface].map(addr => `${addr.address} (${addr.family})${addr.internal ? ' [Internal]' : ''}`);
      networkObj[iface] = addresses.join(', ');
    }

    const user = os.userInfo();
    const userInfo = {
      'Username': user.username,
      'Home Directory': user.homedir,
      'Shell': user.shell || 'N/A'
    };

    const versionInfo = {};
    for (const key in process.versions) {
      versionInfo[key] = process.versions[key];
    }

    const generalSection = createCollapsibleSection('General Information', generalInfo);
    const cpuSection = createCollapsibleSection('CPU Information', cpuInfo);
    const memSection = createCollapsibleSection('Memory Information', memoryInfo);
    const netSection = createCollapsibleSection('Network Interfaces', networkObj);
    const userSection = createCollapsibleSection('User Information', userInfo);
    const versSection = createCollapsibleSection('Process Versions', versionInfo);

    systemInfoTab.appendChild(generalSection);
    systemInfoTab.appendChild(cpuSection);
    systemInfoTab.appendChild(memSection);
    systemInfoTab.appendChild(netSection);
    systemInfoTab.appendChild(userSection);
    systemInfoTab.appendChild(versSection);
  }
});
