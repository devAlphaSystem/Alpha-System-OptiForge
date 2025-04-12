const { ipcRenderer } = require("electron");
const { execSync } = require("node:child_process");

/**
 * Logs a message via IPC to the main process.
 * @param {string} message - The message to log.
 * @param {string} [level="info"] - The log level ('info', 'warn', 'error').
 */
function log(message, level = "info") {
  ipcRenderer.send("renderer-log", message, level);
}

/**
 * Updates the status indicator for a "Remove Apps" checkbox.
 * @param {HTMLElement} labelEl - The label element containing the checkbox.
 * @param {string} appId - The ID of the app option.
 */
async function updateRemoveAppsStatus(labelEl, appId) {
  let circle = labelEl.querySelector(".status-circle");
  if (!circle) {
    circle = document.createElement("span");
    circle.className = "status-circle";
    const checkbox = labelEl.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.insertAdjacentElement("afterend", circle);
    } else {
      labelEl.insertBefore(circle, labelEl.firstChild);
    }
  }

  circle.style.backgroundColor = "orange";
  try {
    const result = await ipcRenderer.invoke("check-remove-app-status", appId);
    log(`Remove App Status - ${labelEl.innerText.trim()}: ${result.installed}`);
    circle.style.backgroundColor = result.installed ? "green" : "red";
  } catch (error) {
    log(`Error checking remove app status for ${appId}: ${error.message}`, "error");
    circle.style.backgroundColor = "gray";
  }
}

/**
 * Updates the status indicator for a "Bloatware" checkbox.
 * @param {HTMLElement} labelEl - The label element containing the checkbox.
 * @param {string} appId - The ID of the app option.
 */
async function updateBloatwareStatus(labelEl, appId) {
  let circle = labelEl.querySelector(".status-circle");
  if (!circle) {
    circle = document.createElement("span");
    circle.className = "status-circle";
    const checkbox = labelEl.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.insertAdjacentElement("afterend", circle);
    } else {
      labelEl.insertBefore(circle, labelEl.firstChild);
    }
  }

  circle.style.backgroundColor = "orange";
  try {
    const result = await ipcRenderer.invoke("check-app-status", appId);
    log(`Bloatware Status - ${labelEl.innerText.trim()}: ${result.installed}`);
    circle.style.backgroundColor = result.installed ? "green" : "red";
  } catch (error) {
    log(`Error checking bloatware status for ${appId}: ${error.message}`, "error");
    circle.style.backgroundColor = "gray";
  }
}

/**
 * Updates the status indicator for an optimization checkbox.
 * @param {HTMLElement} labelEl - The label element containing the checkbox.
 * @param {string} category - The optimization category.
 * @param {string} optionId - The ID of the optimization option.
 */
async function updateOptimizationStatus(labelEl, category, optionId) {
  let circle = labelEl.querySelector(".status-circle");
  const checkbox = labelEl.querySelector('input[type="checkbox"]');

  try {
    const state = await ipcRenderer.invoke("check-optimization-state", category, optionId);
    log(`Optimization Status [${category}] - ${labelEl.innerText.trim()}: ${state}`);

    if (state === null) {
      if (circle) {
        circle.remove();
      }
      return;
    }

    if (!circle) {
      circle = document.createElement("span");
      circle.className = "status-circle";
      if (checkbox) {
        checkbox.insertAdjacentElement("afterend", circle);
      } else {
        labelEl.insertBefore(circle, labelEl.firstChild);
      }
    }

    circle.style.backgroundColor = state ? "green" : "red";
  } catch (error) {
    log(`Error checking optimization status for ${category}/${optionId}: ${error.message}`, "error");
    if (circle) {
      circle.style.backgroundColor = "gray";
    } else if (checkbox) {
      circle = document.createElement("span");
      circle.className = "status-circle";
      circle.style.backgroundColor = "gray";
      checkbox.insertAdjacentElement("afterend", circle);
    }
  }
}

/**
 * Updates the status indicator for a system/network tweak checkbox.
 * @param {HTMLElement} labelEl - The label element containing the checkbox.
 * @param {string} category - The tweak category ('systemTweaks' or 'networkTweaks').
 * @param {string} optionId - The ID of the tweak option.
 */
async function updateFixesStatus(labelEl, category, optionId) {
  let circle = labelEl.querySelector(".status-circle");
  const checkbox = labelEl.querySelector('input[type="checkbox"]');

  try {
    const state = await ipcRenderer.invoke("check-fixes-state", category, optionId);
    log(`Fixes Status [${category}] - ${labelEl.innerText.trim()}: ${state}`);

    if (state === null) {
      if (circle) {
        circle.remove();
      }
      return;
    }

    if (!circle) {
      circle = document.createElement("span");
      circle.className = "status-circle";
      if (checkbox) {
        checkbox.insertAdjacentElement("afterend", circle);
      } else {
        labelEl.insertBefore(circle, labelEl.firstChild);
      }
    }

    circle.style.backgroundColor = state ? "green" : "red";
  } catch (error) {
    log(`Error checking fixes status for ${category}/${optionId}: ${error.message}`, "error");
    if (circle) {
      circle.style.backgroundColor = "gray";
    } else if (checkbox) {
      circle = document.createElement("span");
      circle.className = "status-circle";
      circle.style.backgroundColor = "gray";
      checkbox.insertAdjacentElement("afterend", circle);
    }
  }
}

/**
 * Updates the status indicator for a Windows feature checkbox.
 * @param {HTMLElement} labelEl - The label element containing the checkbox.
 * @param {string} category - The feature category ('userFeatures' or 'machineFeatures').
 * @param {string} optionId - The ID of the feature option.
 */
async function updateFeaturesStatus(labelEl, category, optionId) {
  let circle = labelEl.querySelector(".status-circle");
  const checkbox = labelEl.querySelector('input[type="checkbox"]');

  try {
    const state = await ipcRenderer.invoke("check-features-state", category, optionId);
    log(`Features Status [${category}] - ${labelEl.innerText.trim()}: ${state}`);

    if (state === null) {
      if (circle) {
        circle.remove();
      }
      return;
    }

    if (!circle) {
      circle = document.createElement("span");
      circle.className = "status-circle";
      if (checkbox) {
        checkbox.insertAdjacentElement("afterend", circle);
      } else {
        labelEl.insertBefore(circle, labelEl.firstChild);
      }
    }

    circle.style.backgroundColor = state ? "green" : "red";
  } catch (error) {
    log(`Error checking features status for ${category}/${optionId}: ${error.message}`, "error");
    if (circle) {
      circle.style.backgroundColor = "gray";
    } else if (checkbox) {
      circle = document.createElement("span");
      circle.className = "status-circle";
      circle.style.backgroundColor = "gray";
      checkbox.insertAdjacentElement("afterend", circle);
    }
  }
}

/**
 * Checks the status of all "Remove Apps" items.
 * @returns {Promise<void[]>} A promise that resolves when all checks are complete.
 */
function checkRemoveAppsStatus() {
  const removeAppsLabels = document.querySelectorAll("#removeAppsSection .checkbox-group label");
  const promises = [];
  for (const label of removeAppsLabels) {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox?.value) {
      promises.push(updateRemoveAppsStatus(label, checkbox.value));
    }
  }
  return Promise.all(promises);
}

/**
 * Checks the status of all "Bloatware" items.
 * @returns {Promise<void[]>} A promise that resolves when all checks are complete.
 */
function checkBloatwareStatus() {
  const bloatwareLabels = document.querySelectorAll("#uselessBloatwareSection .checkbox-group label");
  const promises = [];
  for (const label of bloatwareLabels) {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox?.value) {
      promises.push(updateBloatwareStatus(label, checkbox.value));
    }
  }
  return Promise.all(promises);
}

/**
 * Checks the status of all optimization items in a given section.
 * @param {string} sectionId - The ID of the section element.
 * @param {string} category - The optimization category.
 * @returns {Promise<void[]>} A promise that resolves when all checks are complete.
 */
function checkOptimizationStatus(sectionId, category) {
  const optimizationLabels = document.querySelectorAll(`#${sectionId} .checkbox-group label`);
  const promises = [];
  for (const label of optimizationLabels) {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox?.value) {
      promises.push(updateOptimizationStatus(label, category, checkbox.value));
    }
  }
  return Promise.all(promises);
}

/**
 * Checks the status of all fix/tweak items in a given section.
 * @param {string} sectionId - The ID of the section element.
 * @param {string} category - The fix/tweak category.
 * @returns {Promise<void[]>} A promise that resolves when all checks are complete.
 */
function checkFixesStatus(sectionId, category) {
  const fixesLabels = document.querySelectorAll(`#${sectionId} .checkbox-group label`);
  const promises = [];
  for (const label of fixesLabels) {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox?.value) {
      promises.push(updateFixesStatus(label, category, checkbox.value));
    }
  }
  return Promise.all(promises);
}

/**
 * Checks the status of all Windows feature items in a given section.
 * @param {string} sectionId - The ID of the section element.
 * @param {string} category - The feature category.
 * @returns {Promise<void[]>} A promise that resolves when all checks are complete.
 */
function checkFeaturesStatus(sectionId, category) {
  const featuresLabels = document.querySelectorAll(`#${sectionId} .checkbox-group label`);
  const promises = [];
  for (const label of featuresLabels) {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox?.value) {
      promises.push(updateFeaturesStatus(label, category, checkbox.value));
    }
  }
  return Promise.all(promises);
}

/**
 * Updates the text content of the loading overlay's verbose text element.
 * @param {string} message - The message to display.
 */
function updateLoadingText(message) {
  const loadingText = document.querySelector(".verbose-text");
  if (loadingText) {
    loadingText.textContent = message;
  }
}

/**
 * Initializes status checks for all relevant sections after ensuring prerequisites.
 */
async function initializeStatusChecks() {
  const spinner = document.getElementById("loadingSpinner");
  if (!spinner) return;

  spinner.style.display = "flex";

  updateLoadingText("Checking NuGet package provider...");
  try {
    const nugetCheck = execSync(`powershell -ExecutionPolicy Bypass -Command "Get-PackageProvider -Name NuGet -ListAvailable | Where-Object { $_.Version -ge [version]'2.8.5.201' } | Select-Object -First 1"`).toString();
    if (!nugetCheck.trim()) {
      updateLoadingText("Installing NuGet package provider...");
      log("NuGet package provider not found or outdated. Installing...");
      execSync('powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force -Scope CurrentUser"');
      log("NuGet package provider installed.");
    } else {
      log("NuGet package provider is up to date.");
      updateLoadingText("NuGet package provider OK.");
    }
  } catch (error) {
    log(`Error checking/installing NuGet: ${error}`, "error");
    updateLoadingText("Error checking/installing NuGet.");
  }

  updateLoadingText("Checking PSWindowsUpdate module...");
  try {
    const pswuCheck = execSync('powershell -ExecutionPolicy Bypass -Command "Get-Module -ListAvailable PSWindowsUpdate | Select-Object -First 1"').toString();
    if (!pswuCheck.trim()) {
      updateLoadingText("Installing PSWindowsUpdate module...");
      log("PSWindowsUpdate module not found. Installing...");
      execSync('powershell -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Install-Module PSWindowsUpdate -Force -Scope CurrentUser -SkipPublisherCheck -AllowClobber"');
      log("PSWindowsUpdate module installed.");
    } else {
      log("PSWindowsUpdate module already installed.");
      updateLoadingText("PSWindowsUpdate module OK.");
    }
  } catch (error) {
    log(`Error checking/installing PSWindowsUpdate: ${error}`, "error");
    updateLoadingText("Error checking/installing PSWindowsUpdate.");
  }

  const checkTasks = [
    { text: "Checking remove apps status...", task: checkRemoveAppsStatus },
    { text: "Checking bloatware status...", task: checkBloatwareStatus },
    {
      text: "Checking privacy optimizations...",
      task: () => checkOptimizationStatus("privacySection", "privacy"),
    },
    {
      text: "Checking gaming optimizations...",
      task: () => checkOptimizationStatus("gamingSection", "gaming"),
    },
    {
      text: "Checking update optimizations...",
      task: () => checkOptimizationStatus("updatesSection", "updates"),
    },
    {
      text: "Checking services optimizations...",
      task: () => checkOptimizationStatus("servicesSection", "services"),
    },
    {
      text: "Checking system tweaks...",
      task: () => checkFixesStatus("systemTweaksSection", "systemTweaks"),
    },
    {
      text: "Checking network tweaks...",
      task: () => checkFixesStatus("networkTweaksSection", "networkTweaks"),
    },
    {
      text: "Checking user features status...",
      task: () => checkFeaturesStatus("userFeaturesSection", "userFeatures"),
    },
    {
      text: "Checking machine features status...",
      task: () => checkFeaturesStatus("machineFeaturesSection", "machineFeatures"),
    },
  ];

  for (const item of checkTasks) {
    updateLoadingText(item.text);
    await item.task();
  }

  updateLoadingText("All checks completed!");
  spinner.classList.add("hidden");
  setTimeout(() => {
    spinner.style.display = "none";
    spinner.classList.remove("hidden");
  }, 300);
}

/**
 * Sets up event listeners for the main application UI.
 */
function setupUIEventListeners() {
  const notifier = window.EasyNotificationInstance;
  if (!notifier) {
    log("EasyNotificationInstance not found", "error");
    return;
  }
  notifier.clearAllNotifications();

  const navItems = document.querySelectorAll(".nav a");
  const tabContents = document.querySelectorAll(".tab");

  for (const item of navItems) {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item.getAttribute("data-tab");
      log(`Navigating to tab: ${targetId}`);

      for (const nav of navItems) nav.classList.remove("active");
      for (const tab of tabContents) tab.classList.remove("active");

      item.classList.add("active");
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add("active");
      }
    });
  }

  const sectionsToSetup = ["privacySection", "gamingSection", "updatesSection", "powerSection", "servicesSection", "removeAppsSection", "uselessBloatwareSection", "systemToolsSection", "networkToolsSection", "maintenanceSection", "systemTweaksSection", "networkTweaksSection", "windowsFixesSection", "userFeaturesSection", "machineFeaturesSection"];

  for (const sectionId of sectionsToSetup) {
    const section = document.getElementById(sectionId);
    if (!section) continue;

    const selectAllBtn = section.querySelector(".select-all");
    const deselectAllBtn = section.querySelector(".deselect-all");
    const checkboxes = section.querySelectorAll('input[type="checkbox"]');

    if (selectAllBtn) {
      selectAllBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        for (const chk of checkboxes) chk.checked = true;
      });
    }

    if (deselectAllBtn) {
      deselectAllBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        for (const chk of checkboxes) chk.checked = false;
      });
    }
  }

  /**
   * Generic function to handle applying changes for a section.
   * @param {string} buttonId - The ID of the apply button.
   * @param {string} sectionSelector - CSS selector for the section content.
   * @param {string} ipcSendChannel - IPC channel to send selected IDs.
   * @param {string} ipcResponseChannel - IPC channel to listen for response.
   * @param {string} notificationTitle - Title for notifications.
   * @param {Function} [statusCheckFn] - Optional function to re-run status checks.
   */
  function setupApplyButton(buttonId, sectionSelector, ipcSendChannel, ipcResponseChannel, notificationTitle, statusCheckFn) {
    const applyBtn = document.getElementById(buttonId);
    if (!applyBtn) return;

    let notificationId = null;

    applyBtn.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll(`${sectionSelector} input[type="checkbox"]`);
      const selected = [];
      for (const chk of checkboxes) {
        if (chk.checked) {
          selected.push(chk.value);
        }
      }
      log(`Applying ${notificationTitle} with selected IDs: ${JSON.stringify(selected)}`);

      if (notificationId) notifier.dismissNotification(notificationId);
      notificationId = notifier.createNotification({
        title: notificationTitle,
        message: `Executing ${notificationTitle.toLowerCase()}...`,
        type: "info",
        displayTime: 0,
        persistent: true,
        hasProgressBar: false,
        showTimerBar: false,
      });

      ipcRenderer.send(ipcSendChannel, selected);
    });

    ipcRenderer.on(ipcResponseChannel, (event, results) => {
      log(`${notificationTitle} Response: ${JSON.stringify(results, null, 2)}`);
      if (notificationId) {
        notifier.dismissNotification(notificationId);
        notificationId = null;
      }

      const hasError = results.some((res) => !res.success);
      const messages = results.map((res) => `[${res.success ? "OK" : "FAIL"}] ${res.command}:\n${res.message}`).join("\n---\n");

      notifier.createNotification({
        title: notificationTitle,
        message: hasError ? `${notificationTitle} completed with errors. Check logs for details.` : `${notificationTitle} completed successfully.`,
        type: hasError ? "danger" : "success",
      });

      if (statusCheckFn) {
        statusCheckFn();
      }
    });
  }

  setupApplyButton("applyPrivacyBtn", "#privacySection .section-content", "apply-privacy-optimizations", "privacy-optimizations-response", "Privacy Optimizations", () => checkOptimizationStatus("privacySection", "privacy"));
  setupApplyButton("applyGamingBtn", "#gamingSection .section-content", "apply-gaming-optimizations", "gaming-optimizations-response", "Gaming Optimizations", () => checkOptimizationStatus("gamingSection", "gaming"));
  setupApplyButton("applyUpdatesBtn", "#updatesSection .section-content", "apply-updates-optimizations", "updates-optimizations-response", "Updates Optimizations", () => checkOptimizationStatus("updatesSection", "updates"));
  setupApplyButton("applyPowerBtn", "#powerSection .section-content", "apply-power-optimizations", "power-optimizations-response", "Power Optimizations");
  setupApplyButton("applyServicesBtn", "#servicesSection .section-content", "apply-services-optimizations", "services-optimizations-response", "Services Optimizations", () => checkOptimizationStatus("servicesSection", "services"));
  setupApplyButton("applyMaintenanceBtn", "#maintenanceSection .section-content", "apply-maintenance-optimizations", "maintenance-optimizations-response", "Maintenance Optimizations");
  setupApplyButton("applyRemoveAppsBtn", "#removeAppsSection .section-content", "apply-remove-apps", "remove-apps-response", "Remove Apps", checkRemoveAppsStatus);
  setupApplyButton("applyUselessBloatwareBtn", "#uselessBloatwareSection .section-content", "apply-useless-bloatware", "useless-bloatware-response", "Useless Bloatware", checkBloatwareStatus);
  setupApplyButton("applySystemToolsBtn", "#systemToolsSection .section-content", "apply-system-tools", "system-tools-response", "System Tools");
  setupApplyButton("applyNetworkToolsBtn", "#networkToolsSection .section-content", "apply-network-tools", "network-tools-response", "Network Tools");
  setupApplyButton("applySystemTweaksBtn", "#systemTweaksSection .section-content", "apply-system-tweaks", "system-tweaks-response", "System Tweaks", () => checkFixesStatus("systemTweaksSection", "systemTweaks"));
  setupApplyButton("applyNetworkTweaksBtn", "#networkTweaksSection .section-content", "apply-network-tweaks", "network-tweaks-response", "Network Tweaks", () => checkFixesStatus("networkTweaksSection", "networkTweaks"));
  setupApplyButton("applyWindowsFixesBtn", "#windowsFixesSection .section-content", "apply-windows-fixes", "windows-fixes-response", "Windows Fixes");
  setupApplyButton("applyUserFeaturesBtn", "#userFeaturesSection .section-content", "apply-user-windows-features", "user-windows-features-response", "User Windows Features", () => checkFeaturesStatus("userFeaturesSection", "userFeatures"));
  setupApplyButton("applyMachineFeaturesBtn", "#machineFeaturesSection .section-content", "apply-machine-windows-features", "machine-windows-features-response", "Machine Windows Features", () => checkFeaturesStatus("machineFeaturesSection", "machineFeatures"));

  const showLogsBtn = document.getElementById("showLogsBtn");
  if (showLogsBtn) {
    showLogsBtn.addEventListener("click", () => {
      ipcRenderer.send("show-logs");
    });
  }

  const minimizeButton = document.getElementById("minimize-button");
  if (minimizeButton) {
    minimizeButton.addEventListener("click", () => {
      ipcRenderer.send("window-minimize");
    });
  }

  const closeButton = document.getElementById("close-button");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      ipcRenderer.send("window-close");
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initializeStatusChecks();
  setupUIEventListeners();
});
