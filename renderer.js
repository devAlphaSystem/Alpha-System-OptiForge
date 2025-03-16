const { ipcRenderer } = require('electron');
const { execSync } = require('child_process');

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  ipcRenderer.send('renderer-log', message, level);

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

async function updateRemoveAppsStatus(labelEl, appId) {
  let circle = labelEl.querySelector('.status-circle');
  if (!circle) {
    circle = document.createElement('span');
    circle.className = 'status-circle';
    const checkbox = labelEl.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.insertAdjacentElement('afterend', circle);
    } else {
      labelEl.insertBefore(circle, labelEl.firstChild);
    }
  }

  try {
    const result = await ipcRenderer.invoke('check-remove-app-status', appId);
    log(labelEl.innerText + ": " + result.installed);
    circle.style.backgroundColor = result.installed ? 'green' : 'red';
  } catch (error) {
    circle.style.backgroundColor = 'gray';
  }
}

async function updateBloatwareStatus(labelEl, appId) {
  let circle = labelEl.querySelector('.status-circle');
  if (!circle) {
    circle = document.createElement('span');
    circle.className = 'status-circle';
    const checkbox = labelEl.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.insertAdjacentElement('afterend', circle);
    } else {
      labelEl.insertBefore(circle, labelEl.firstChild);
    }
  }

  try {
    const result = await ipcRenderer.invoke('check-app-status', appId);
    log(labelEl.innerText + ": " + result.installed);
    circle.style.backgroundColor = result.installed ? 'green' : 'red';
  } catch (error) {
    circle.style.backgroundColor = 'gray';
  }
}

async function updateOptimizationStatus(labelEl, category, optionId) {
  try {
    const state = await ipcRenderer.invoke('check-optimization-state', category, optionId);
    log(labelEl.innerText + ": " + state);
    if (state === null) {
      const existingCircle = labelEl.querySelector('.status-circle');
      if (existingCircle) {
        existingCircle.remove();
      }
      return;
    }

    let circle = labelEl.querySelector('.status-circle');
    if (!circle) {
      circle = document.createElement('span');
      circle.className = 'status-circle';
      const checkbox = labelEl.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.insertAdjacentElement('afterend', circle);
      } else {
        labelEl.insertBefore(circle, labelEl.firstChild);
      }
    }

    circle.style.backgroundColor = state ? 'green' : 'red';
  } catch (error) {
    const circle = labelEl.querySelector('.status-circle');
    if (circle) {
      circle.style.backgroundColor = 'gray';
    }
  }
}

async function updateFixesStatus(labelEl, category, optionId) {
  try {
    const state = await ipcRenderer.invoke('check-fixes-state', category, optionId);
    log(labelEl.innerText + ": " + state);
    if (state === null) {
      const existingCircle = labelEl.querySelector('.status-circle');
      if (existingCircle) {
        existingCircle.remove();
      }
      return;
    }

    let circle = labelEl.querySelector('.status-circle');
    if (!circle) {
      circle = document.createElement('span');
      circle.className = 'status-circle';
      const checkbox = labelEl.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.insertAdjacentElement('afterend', circle);
      } else {
        labelEl.insertBefore(circle, labelEl.firstChild);
      }
    }

    circle.style.backgroundColor = state ? 'green' : 'red';
  } catch (error) {
    const circle = labelEl.querySelector('.status-circle');
    if (circle) {
      circle.style.backgroundColor = 'gray';
    }
  }
}

async function updateFeaturesStatus(labelEl, category, optionId) {
  try {
    const state = await ipcRenderer.invoke('check-features-state', category, optionId);
    log(labelEl.innerText + ": " + state);
    if (state === null) {
      const existingCircle = labelEl.querySelector('.status-circle');
      if (existingCircle) {
        existingCircle.remove();
      }
      return;
    }

    let circle = labelEl.querySelector('.status-circle');
    if (!circle) {
      circle = document.createElement('span');
      circle.className = 'status-circle';
      const checkbox = labelEl.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.insertAdjacentElement('afterend', circle);
      } else {
        labelEl.insertBefore(circle, labelEl.firstChild);
      }
    }

    circle.style.backgroundColor = state ? 'green' : 'red';
  } catch (error) {
    const circle = labelEl.querySelector('.status-circle');
    if (circle) {
      circle.style.backgroundColor = 'gray';
    }
  }
}

function checkRemoveAppsStatus() {
  const removeAppsLabels = document.querySelectorAll('#removeAppsSection .checkbox-group label');
  const promises = [];
  removeAppsLabels.forEach((label) => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.value) {
      promises.push(updateRemoveAppsStatus(label, checkbox.value));
    }
  });
  return Promise.all(promises);
}

function checkBloatwareStatus() {
  const bloatwareLabels = document.querySelectorAll('#uselessBloatwareSection .checkbox-group label');
  const promises = [];
  bloatwareLabels.forEach((label) => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.value) {
      promises.push(updateBloatwareStatus(label, checkbox.value));
    }
  });
  return Promise.all(promises);
}

function checkOptimizationStatus(sectionId, category) {
  const optimizationLabels = document.querySelectorAll(`#${sectionId} .checkbox-group label`);
  const promises = [];
  optimizationLabels.forEach(label => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.value) {
      promises.push(updateOptimizationStatus(label, category, checkbox.value));
    }
  });
  return Promise.all(promises);
}

function checkFixesStatus(sectionId, category) {
  const fixesLabels = document.querySelectorAll(`#${sectionId} .checkbox-group label`);
  const promises = [];
  fixesLabels.forEach((label) => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.value) {
      promises.push(updateFixesStatus(label, category, checkbox.value));
    }
  });
  return Promise.all(promises);
}

function checkFeaturesStatus(sectionId, category) {
  const featuresLabels = document.querySelectorAll(`#${sectionId} .checkbox-group label`);
  const promises = [];
  featuresLabels.forEach((label) => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.value) {
      promises.push(updateFeaturesStatus(label, category, checkbox.value));
    }
  });
  return Promise.all(promises);
}

function updateLoadingText(message) {
  const loadingText = document.querySelector('.verbose-text');
  if (loadingText) {
    loadingText.textContent = message;
  }
}

async function initializeStatusChecks() {
  updateLoadingText('Checking NuGet package provider...');
  try {
    const nugetCheck = execSync(`powershell -ExecutionPolicy Bypass -Command "Get-PackageProvider -Name NuGet -ListAvailable | Where-Object { $_.Version -ge [version]'2.8.5.201' } | Select-Object -First 1"`).toString();
    if (!nugetCheck.trim()) {
      updateLoadingText('Installing NuGet package provider...');
      log('Installing NuGet package provider...');
      execSync('powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force -Scope CurrentUser"');
    } else {
      log('NuGet package provider already installed.');
      updateLoadingText('NuGet package provider already installed.');
    }
  } catch (error) {
    log('Error checking/installing NuGet: ' + error, 'error');
  }

  updateLoadingText('Checking PSWindowsUpdate module...');
  try {
    const pswuCheck = execSync('powershell -ExecutionPolicy Bypass -Command "Get-Module -ListAvailable PSWindowsUpdate | Select-Object -First 1"').toString();
    if (!pswuCheck.trim()) {
      updateLoadingText('Installing PSWindowsUpdate module...');
      log('Installing PSWindowsUpdate module...');
      execSync('powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Install-Module PSWindowsUpdate -Force -Scope CurrentUser -SkipPublisherCheck -AllowClobber"');
    } else {
      log('PSWindowsUpdate module already installed.');
      updateLoadingText('PSWindowsUpdate module already installed.');
    }
  } catch (error) {
    log('Error checking/installing PSWindowsUpdate: ' + error, 'error');
  }

  updateLoadingText('Checking remove apps status...');
  await checkRemoveAppsStatus();

  updateLoadingText('Checking bloatware status...');
  await checkBloatwareStatus();

  updateLoadingText('Checking privacy optimizations...');
  await checkOptimizationStatus('privacySection', 'privacy');

  updateLoadingText('Checking gaming optimizations...');
  await checkOptimizationStatus('gamingSection', 'gaming');

  updateLoadingText('Checking update optimizations...');
  await checkOptimizationStatus('updatesSection', 'updates');

  updateLoadingText('Checking services optimizations...');
  await checkOptimizationStatus('servicesSection', 'services');

  updateLoadingText('Checking system tweaks...');
  await checkFixesStatus('systemTweaksSection', 'systemTweaks');

  updateLoadingText('Checking network tweaks...');
  await checkFixesStatus('networkTweaksSection', 'networkTweaks');

  updateLoadingText('Checking Windows Features status...');
  await checkFeaturesStatus('userFeaturesSection', 'userFeatures');
  await checkFeaturesStatus('machineFeaturesSection', 'machineFeatures');

  updateLoadingText('All checks completed!');
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.add('hidden');
    setTimeout(() => {
      spinner.style.display = 'none';
      spinner.classList.remove('hidden');
    }, 300);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const notifier = window.EasyNotificationInstance;

  notifier.clearAllNotifications();

  initializeStatusChecks();

  const navItems = document.querySelectorAll('.nav a');
  const tabContents = document.querySelectorAll('.tab');

  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      log('Navigating to tab: ' + item.getAttribute('data-tab'));

      navItems.forEach((nav) => nav.classList.remove('active'));
      tabContents.forEach((tab) => tab.classList.remove('active'));

      item.classList.add('active');
      const targetId = item.getAttribute('data-tab');
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });

  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => {
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

  function setupSelectButtons(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const selectAllBtn = section.querySelector('.select-all');
    const deselectAllBtn = section.querySelector('.deselect-all');
    const checkboxes = section.querySelectorAll('input[type="checkbox"]');

    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        checkboxes.forEach((chk) => { chk.checked = true; });
      });
    }

    if (deselectAllBtn) {
      deselectAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        checkboxes.forEach((chk) => { chk.checked = false; });
      });
    }
  }

  const sectionsToSetup = [
    'privacySection',
    'gamingSection',
    'updatesSection',
    'powerSection',
    'servicesSection',
    'removeAppsSection',
    'uselessBloatwareSection',
    'systemToolsSection',
    'networkToolsSection',
    'maintenanceSection',
    'systemTweaksSection',
    'networkTweaksSection',
    'windowsFixesSection',
    'userFeaturesSection',
    'machineFeaturesSection'
  ];
  sectionsToSetup.forEach(setupSelectButtons);

  let privacyStartNotificationId = null;
  const applyPrivacyBtn = document.getElementById('applyPrivacyBtn');
  applyPrivacyBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#privacySection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Privacy Optimizations selected: ' + selected);

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
    log('Privacy Optimizations Response: ' + JSON.stringify(arg, null, 2));
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
    checkOptimizationStatus('privacySection', 'privacy');
  });

  let gamingStartNotificationId = null;
  const applyGamingBtn = document.getElementById('applyGamingBtn');
  applyGamingBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#gamingSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Gaming Optimizations selected: ' + selected);

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
    log('Gaming Optimizations Response: ' + JSON.stringify(arg, null, 2));
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
    checkOptimizationStatus('gamingSection', 'gaming');
  });

  let updatesStartNotificationId = null;
  const applyUpdatesBtn = document.getElementById('applyUpdatesBtn');
  applyUpdatesBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#updatesSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Updates Optimizations selected: ' + selected);

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
    log('Updates Optimizations Response: ' + JSON.stringify(arg, null, 2));
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
    checkOptimizationStatus('updatesSection', 'updates');
  });

  let powerStartNotificationId = null;
  const applyPowerBtn = document.getElementById('applyPowerBtn');
  applyPowerBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#powerSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Power Optimizations selected: ' + selected);

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
    log('Power Optimizations Response: ' + JSON.stringify(arg, null, 2));
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
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Services Optimizations selected: ' + selected);

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
    log('Services Optimizations Response: ' + JSON.stringify(arg, null, 2));
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
    checkOptimizationStatus('servicesSection', 'services');
  });

  let maintenanceStartNotificationId = null;
  const applyMaintenanceBtn = document.getElementById('applyMaintenanceBtn');
  applyMaintenanceBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#maintenanceSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Maintenance Optimizations selected: ' + selected);

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
    log('Maintenance Optimizations Response: ' + JSON.stringify(arg, null, 2));
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
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Remove Apps selected: ' + selected);

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
    log('Remove Apps Response: ' + JSON.stringify(arg, null, 2));
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
    checkRemoveAppsStatus();
  });

  let bloatwareStartNotificationId = null;
  const applyUselessBloatwareBtn = document.getElementById('applyUselessBloatwareBtn');
  applyUselessBloatwareBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#uselessBloatwareSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Useless Bloatware selected: ' + selected);

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
    log('Useless Bloatware Response: ' + JSON.stringify(arg, null, 2));
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
    checkBloatwareStatus();
  });

  let systemToolsNotificationId = null;
  const applySystemToolsBtn = document.getElementById('applySystemToolsBtn');
  applySystemToolsBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#systemToolsSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('System Tools selected: ' + selected);

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
    log('System Tools Response: ' + + JSON.stringify(arg, null, 2));
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
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Network Tools selected: ' + selected);

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
    log('Network Tools Response: ' + JSON.stringify(arg, null, 2));
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

  let systemStartNotificationId = null;
  const applySystemTweaksBtn = document.getElementById('applySystemTweaksBtn');
  if (applySystemTweaksBtn) {
    applySystemTweaksBtn.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll('#systemTweaksSection .section-content input[type="checkbox"]');
      const selected = [];
      checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
      log('System Tweaks selected: ' + selected);

      systemStartNotificationId = notifier.createNotification({
        title: 'System Tweaks',
        message: 'Executing system tweaks...',
        type: 'info',
        displayTime: 0,
        persistent: true,
        hasProgressBar: false,
        showTimerBar: false
      });

      ipcRenderer.send('apply-system-tweaks', selected);
    });
  }

  ipcRenderer.on('system-tweaks-response', (event, arg) => {
    log('System Tweaks Response: ' + JSON.stringify(arg, null, 2));
    if (systemStartNotificationId) {
      notifier.dismissNotification(systemStartNotificationId);
      systemStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'System Tweaks',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'System Tweaks',
        message: 'System tweaks completed successfully.',
        type: 'success'
      });
    }
    checkFixesStatus('systemTweaksSection', 'systemTweaks');
  });

  let networkStartNotificationId = null;
  const applyNetworkTweaksBtn = document.getElementById('applyNetworkTweaksBtn');
  if (applyNetworkTweaksBtn) {
    applyNetworkTweaksBtn.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll('#networkTweaksSection .section-content input[type="checkbox"]');
      const selected = [];
      checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
      log('Network Tweaks selected: ' + selected);

      networkStartNotificationId = notifier.createNotification({
        title: 'Network Tweaks',
        message: 'Executing network tweaks...',
        type: 'info',
        displayTime: 0,
        persistent: true,
        hasProgressBar: false,
        showTimerBar: false
      });

      ipcRenderer.send('apply-network-tweaks', selected);
    });
  }

  ipcRenderer.on('network-tweaks-response', (event, arg) => {
    log('Network Tweaks Response: ' + JSON.stringify(arg, null, 2));
    if (networkStartNotificationId) {
      notifier.dismissNotification(networkStartNotificationId);
      networkStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Network Tweaks',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Network Tweaks',
        message: 'Network tweaks completed successfully.',
        type: 'success'
      });
    }
    checkFixesStatus('networkTweaksSection', 'networkTweaks');
  });

  let windowsFixesNotificationId = null;
  const applyWindowsFixesBtn = document.getElementById('applyWindowsFixesBtn');
  applyWindowsFixesBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#windowsFixesSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Windows Fixes selected: ' + selected);

    windowsFixesNotificationId = window.EasyNotificationInstance.createNotification({
      title: 'Windows Fixes',
      message: 'Executing Windows fixes...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-windows-fixes', selected);
  });

  ipcRenderer.on('windows-fixes-response', (event, arg) => {
    log('Windows Fixes Response: ' + JSON.stringify(arg, null, 2));
    if (windowsFixesNotificationId) {
      window.EasyNotificationInstance.dismissNotification(windowsFixesNotificationId);
      windowsFixesNotificationId = null;
    }
    if (arg && arg.error) {
      window.EasyNotificationInstance.createNotification({
        title: 'Windows Fixes',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      window.EasyNotificationInstance.createNotification({
        title: 'Windows Fixes',
        message: 'Windows fixes executed successfully.',
        type: 'success'
      });
    }
  });

  let userWindowsFeaturesNotificationId = null;
  const applyUserWindowsFeaturesBtn = document.getElementById('applyUserFeaturesBtn');
  applyUserWindowsFeaturesBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#userFeaturesSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('User Windows Features selected: ' + selected);

    userWindowsFeaturesNotificationId = window.EasyNotificationInstance.createNotification({
      title: 'User Windows Features',
      message: 'Executing User Windows features...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-user-windows-features', selected);
  });

  ipcRenderer.on('user-windows-features-response', (event, arg) => {
    log('User Windows Features Response: ' + JSON.stringify(arg, null, 2));
    if (userWindowsFeaturesNotificationId) {
      window.EasyNotificationInstance.dismissNotification(userWindowsFeaturesNotificationId);
      userWindowsFeaturesNotificationId = null;
    }
    if (arg && arg.error) {
      window.EasyNotificationInstance.createNotification({
        title: 'User Windows Features',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      window.EasyNotificationInstance.createNotification({
        title: 'User Windows Features',
        message: 'Windows features executed successfully.',
        type: 'success'
      });
    }
    checkFeaturesStatus('userFeaturesSection', 'userFeatures');
  });

  let machineWindowsFeaturesNotificationId = null;
  const applyMachineWindowsFeaturesBtn = document.getElementById('applyMachineFeaturesBtn');
  applyMachineWindowsFeaturesBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#machineFeaturesSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach((chk) => { if (chk.checked) selected.push(chk.value); });
    log('Machine Windows Features selected: ' + selected);

    machineWindowsFeaturesNotificationId = window.EasyNotificationInstance.createNotification({
      title: 'Machine Windows Features',
      message: 'Executing Machine Windows features...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false
    });

    ipcRenderer.send('apply-machine-windows-features', selected);
  });

  ipcRenderer.on('machine-windows-features-response', (event, arg) => {
    log('Machine Windows Features Response: ' + JSON.stringify(arg, null, 2));
    if (machineWindowsFeaturesNotificationId) {
      window.EasyNotificationInstance.dismissNotification(machineWindowsFeaturesNotificationId);
      machineWindowsFeaturesNotificationId = null;
    }
    if (arg && arg.error) {
      window.EasyNotificationInstance.createNotification({
        title: 'Machine Windows Features',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      window.EasyNotificationInstance.createNotification({
        title: 'Machine Windows Features',
        message: 'Windows features executed successfully.',
        type: 'success'
      });
    }
    checkFeaturesStatus('machineFeaturesSection', 'machineFeatures');
  });

  document.getElementById('showLogsBtn')?.addEventListener('click', () => {
    ipcRenderer.send('show-logs');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('minimize-button')?.addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
  });

  document.getElementById('close-button')?.addEventListener('click', () => {
    ipcRenderer.send('window-close');
  });
});
