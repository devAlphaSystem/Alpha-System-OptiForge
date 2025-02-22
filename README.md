# OptiForge

OptiForge is a comprehensive system optimization tool designed to streamline Windows performance, enhance privacy, and maximize system efficiency. Built with NodeJS, it leverages a modular design with multiple optimization categories and system tools to give users fine-grained control over system configurations.

## Table of Contents

- [Features](#features)
- [Installation & Build](#installation--build)
- [Usage](#usage)
- [Disclaimer](#disclaimer)
- [Contact](#contact)

## Features

OptiForge offers a variety of optimizations and tools, including:

- **Apps & Bloatware Removal:**  
  Remove unwanted Windows apps and bloatware (e.g., Calculator, Microsoft Store, Xbox, Cortana, and more) with a simple selection.

- **Privacy Optimizations:**  
  Disable telemetry, activity history, location services, Cortana, and other background services that may affect privacy.

- **Gaming Optimizations:**  
  Enable Game Mode, adjust graphics settings, and tweak networking for an improved gaming experience.

- **Update & Maintenance:**  
  Manage Windows Update settings, clean temporary files, clear caches, and optimize disk performance.

- **System Tools & Tweaks:**  
  Execute system maintenance tools (like SFC, DISM, Disk Cleanup), tweak power settings, and adjust network configurations.

- **Custom Command Execution:**  
  Enter and execute custom commands directly from the interface.

## Installation & Build

1. **Clone the Repository:**

```bash
git clone https://github.com/devAlphaSystem/Alpha-System-OptiForge.git

cd Alpha-System-OptiForge
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Build the Project:**

```bash
npm run build
```

## Usage

**Run the Application:**

After packaging, locate the generated .exe file (typically in a dist or build folder) and run it with administrative privileges.

**Using the Interface:**

Once the executable is running, the application will launch a window with the OptiForge interface. Use the sidebar tabs to navigate through various sections such as Apps & Bloatware, Optimizations, System Tools, and Windows Fixes. You can then:

- Use the “Select All” or “Deselect All” buttons to manage settings quickly.

- Click the apply buttons to execute the desired commands.

- Enter custom commands in the provided input field and execute them.

Note: As the tool applies system-level changes (registry edits and system commands), it must be run with administrative privileges.

## Disclaimer

**Use at your own risk.** Before applying any system modifications, always back up your data. The developers of OptiForge are not liable for any adverse effects or damage caused by its use.
Contact

## Contact

For support or inquiries, please reach out at: support@alphasystem.dev
