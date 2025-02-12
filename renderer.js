const { ipcRenderer } = require('electron');

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
    'maintenanceSection',
    'removeAppsSection',
    'uselessBloatwareSection',
    'recommendedAppsSection'
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
      showTimerBar: false,
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
      showTimerBar: false,
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
      showTimerBar: false,
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
      showTimerBar: false,
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
      showTimerBar: false,
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
      showTimerBar: false,
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
      showTimerBar: false,
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
      showTimerBar: false,
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

  let recommendedAppsStartNotificationId = null;
  const applyRecommendedAppsBtn = document.getElementById('applyRecommendedAppsBtn');
  applyRecommendedAppsBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#recommendedAppsSection .section-content input[type="checkbox"]');
    const selected = [];
    checkboxes.forEach(chk => { if (chk.checked) selected.push(chk.value); });
    console.info("Recommended Apps selected:", selected);

    recommendedAppsStartNotificationId = notifier.createNotification({
      title: 'Recommended Apps',
      message: 'Executing installation of recommended apps...',
      type: 'info',
      displayTime: 0,
      persistent: true,
      hasProgressBar: false,
      showTimerBar: false,
    });

    ipcRenderer.send('apply-recommended-apps', selected);
  });
  ipcRenderer.on('recommended-apps-response', (event, arg) => {
    console.info("Recommended Apps Response:", arg);
    if (recommendedAppsStartNotificationId) {
      notifier.dismissNotification(recommendedAppsStartNotificationId);
      recommendedAppsStartNotificationId = null;
    }
    if (arg && arg.error) {
      notifier.createNotification({
        title: 'Recommended Apps',
        message: `Error: ${arg.error}`,
        type: 'danger'
      });
    } else {
      notifier.createNotification({
        title: 'Recommended Apps',
        message: 'Recommended apps installed successfully.',
        type: 'success'
      });
    }
  });
});
