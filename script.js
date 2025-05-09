const commandMapping = {
  apps_calc: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsCalculator -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_onedrive: "Get-AppxPackage -AllUsers -Name *OneDrive* -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_xbox: "Get-AppxPackage -AllUsers -Name *Xbox* -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_newoutlook: "Get-AppxPackage -AllUsers -Name Microsoft.OutlookForWindows -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_recall: "Get-AppxPackage -AllUsers -Name *Recall* -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_groovemusic: "Get-AppxPackage -AllUsers -Name Microsoft.ZuneMusic -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_teams: "Get-AppxPackage -AllUsers -Name MSTeams -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_mstore: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsStore -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_photos: "Get-AppxPackage -AllUsers -Name Microsoft.Windows.Photos -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_snipsketch: "Get-AppxPackage -AllUsers -Name Microsoft.ScreenSketch -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_paint: "Get-AppxPackage -AllUsers -Name Microsoft.MSPaint -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_movietv: "Get-AppxPackage -AllUsers -Name Microsoft.ZuneVideo -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_edge: "Get-AppxPackage -AllUsers -Name Microsoft.MicrosoftEdge -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_xboxcore: "Get-AppxPackage -AllUsers -Name Microsoft.XboxApp -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_mail: "Get-AppxPackage -AllUsers -Name *Mail* -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_maps: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsMaps -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_skype: "Get-AppxPackage -AllUsers -Name Microsoft.SkypeApp -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_getstarted: "Get-AppxPackage -AllUsers -Name Microsoft.Getstarted -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_meetnow: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsMeetNow -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_phonelink: "Get-AppxPackage -AllUsers -Name Microsoft.YourPhone -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_gethelp: "Get-AppxPackage -AllUsers -Name Microsoft.GetHelp -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_family: "Get-AppxPackage -AllUsers -Name MicrosoftCorporationII.MicrosoftFamily -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_paint3d: "Get-AppxPackage -AllUsers -Name Microsoft.Paint3D -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_feedback: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsFeedbackHub -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_copilotstore: "Get-AppxPackage -AllUsers -Name Microsoft.Copilot_8wekyb3d8bbwe -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_clipchamp: "Get-AppxPackage -AllUsers -Name Clipchamp.Clipchamp -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_onenote: "Get-AppxPackage -AllUsers -Name Microsoft.Office.OneNote -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_quickassist: "Get-AppxPackage -AllUsers -Name MicrosoftCorporationII.QuickAssist -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_solitaire: "Get-AppxPackage -AllUsers -Name Microsoft.MicrosoftSolitaireCollection -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_powerautomate: "Get-AppxPackage -AllUsers -Name Microsoft.PowerAutomateDesktop -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_alarms: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsAlarms -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_copilotprov: "Get-AppxPackage -AllUsers -Name Microsoft.Windows.Ai.Copilot.Provider -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_camera: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsCamera -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_weather: "Get-AppxPackage -AllUsers -Name Microsoft.BingWeather -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_3dviewer: "Get-AppxPackage -AllUsers -Name Microsoft.Microsoft3DViewer -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_stickynotes: "Get-AppxPackage -AllUsers -Name Microsoft.MicrosoftStickyNotes -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_bing: "Get-AppxPackage -AllUsers -Name Microsoft.BingSearch -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_todo: "Get-AppxPackage -AllUsers -Name Microsoft.Todos -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_mixedreality: "Get-AppxPackage -AllUsers -Name Microsoft.MixedReality.Portal -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_officehub: "Get-AppxPackage -AllUsers -Name Microsoft.MicrosoftOfficeHub -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_people: "Get-AppxPackage -AllUsers -Name Microsoft.People -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_copilot: "Get-AppxPackage -AllUsers -Name Microsoft.Copilot -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_devhome: "Get-AppxPackage -AllUsers -Name Microsoft.Windows.DevHome -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_soundrecorder: "Get-AppxPackage -AllUsers -Name Microsoft.WindowsSoundRecorder -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_cortana: "Get-AppxPackage -AllUsers -Name Microsoft.549981C3F5F10 -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_news: "Get-AppxPackage -AllUsers -Name Microsoft.BingNews -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_xboxgamebar: "Get-AppxPackage -AllUsers -Name Microsoft.XboxGamingOverlay -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_3dbuilder: "Get-AppxPackage -AllUsers -Name Microsoft.3DBuilder -ErrorAction SilentlyContinue | Remove-AppxPackage",
  apps_ub_whiteboard: "Get-AppxPackage -AllUsers -Name Microsoft.Whiteboard -ErrorAction SilentlyContinue | Remove-AppxPackage",
  sys_disk_cleanup: "cleanmgr /sagerun:1",
  sys_sfc: "sfc /scannow",
  sys_dism: "Dism.exe /Online /Cleanup-Image /RestoreHealth",
  sys_defrag: "defrag C: -w",
  sys_perfmon: "perfmon.exe",
  adv_sys1: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 1 /f',
  adv_sys2: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f',
  adv_sys3: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\SysMain" /v Start /t REG_DWORD /d 4 /f',
  adv_sys4: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender" /v DisableAntiSpyware /t REG_DWORD /d 1 /f',
  adv_sys5: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreen /t REG_DWORD /d 1 /f',
  adv_sys6: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f',
  adv_sys7: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager" /v SessionManager /t REG_SZ /d "Optimized" /f',
  adv_sys8: "powercfg /setacvalueindex SCHEME_CURRENT SUB_DISK DISKIDLE 0",
  adv_sys9: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications" /v GlobalUserDisabled /t REG_DWORD /d 1 /f',
  adv_sys10: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v DisableStatusMessages /t REG_DWORD /d 0 /f; reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System" /v VerboseStatus /t REG_DWORD /d 1 /f',
  net_flush_dns: "ipconfig /flushdns",
  net_reset_adapters: "netsh int ip reset",
  net_release_ip: "ipconfig /release",
  net_renew_ip: "ipconfig /renew",
  adv_net1: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\QoS\\Parameters" /v Enabled /t REG_DWORD /d 1 /f',
  adv_net2: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 0 /f',
  adv_net3: "netsh int tcp set global autotuninglevel=normal",
  adv_net4: "netsh int tcp set global chimney=disabled",
  adv_net5: "netsh int tcp set global rss=disabled",
  adv_net6: "netsh int tcp set global autotuninglevel=highlyrestricted",
  adv_net7: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\TCPIP6\\Parameters" /v DisabledComponents /t REG_DWORD /d 0xFF /f',
  adv_net8: "netsh int tcp set global autotuninglevel=disabled",
  adv_net9: "dism /online /norestart /disable-feature /featurename:SMB1Protocol",
  power1: "powercfg /duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 99999999-9999-9999-9999-999999999999; powercfg /setactive 99999999-9999-9999-9999-999999999999",
  power2: 'powercfg /hibernate off; reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power" /v HiberbootEnabled /t REG_DWORD /d 0 /f',
  power3: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533251-82be-4824-96c1-47b60b740d00\\0cc5b647-c1df-4637-891a-dec35c318583" /v ValueMax /t REG_DWORD /d 100 /f',
  power4: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling" /v PowerThrottlingOff /t REG_DWORD /d 1 /f',
  power5: "powercfg /setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ee12f906-d277-404b-b6da-e5fa1a576df5 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ee12f906-d277-404b-b6da-e5fa1a576df5 0",
  power6: "powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 893dee8e-2bef-41e0-89c6-b55d0929964c 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 893dee8e-2bef-41e0-89c6-b55d0929964c 100; powercfg /setacvalueindex SCHEME_CURRENT SUB_PROCESSOR bc5038f7-23e0-4960-96da-33abaf5935ec 100; powercfg /setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR bc5038f7-23e0-4960-96da-33abaf5935ec 100",
  power7: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\7516b95f-f776-4464-8c53-06167f40cc99\\aded5e82-b909-4619-9949-f5d71dac0bcb" /v ValueMax /t REG_DWORD /d 100 /f',
  power8: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\e73a048d-bf27-4f12-9731-8b2076e8891f\\637ea02f-bbcb-4015-8e2c-a1c7b9c0b546" /v ValueMax /t REG_DWORD /d 0 /f',
  power9: "powercfg /setacvalueindex SCHEME_CURRENT SUB_VIDEO 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0; powercfg /setdcvalueindex SCHEME_CURRENT SUB_VIDEO 3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e 0",
  disable_advertising_id: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v Enabled /t REG_DWORD /d 0 /f',
  disable_input_tipc: 'reg add "HKCU\\Software\\Microsoft\\input\\TIPC" /v Enabled /t REG_DWORD /d 0 /f',
  disable_content_subscription_353698: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353698Enabled /t REG_DWORD /d 0 /f',
  disable_content_subscription_338388: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338388Enabled /t REG_DWORD /d 0 /f',
  disable_content_subscription_338389: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338389Enabled /t REG_DWORD /d 0 /f',
  disable_content_subscription_338393_353694_353696: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338393Enabled /t REG_DWORD /d 0 /f; reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353694Enabled /t REG_DWORD /d 0 /f; reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353696Enabled /t REG_DWORD /d 0 /f',
  disable_user_profile_engagement_scoobe: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\UserProfileEngagement" /v ScoobeSystemSettingEnabled /t REG_DWORD /d 0 /f',
  disable_clipboard_history: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v AllowClipboardHistory /t REG_DWORD /d 0 /f',
  deny_user_account_information_access: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Deny /f',
  disable_start_track_progs: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v Start_TrackProgs /t REG_DWORD /d 0 /f',
  deny_app_diagnostics_access: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics" /v Value /t REG_SZ /d Deny /f',
  enable_do_not_track_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v ConfigureDoNotTrack /t REG_DWORD /d 1 /f',
  disable_payment_method_query_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v PaymentMethodQueryEnabled /t REG_DWORD /d 0 /f',
  disable_personalization_reporting_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v PersonalizationReportingEnabled /t REG_DWORD /d 0 /f',
  disable_address_bar_bing_search_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AddressBarMicrosoftSearchInBingProviderEnabled /t REG_DWORD /d 0 /f',
  disable_user_feedback_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v UserFeedbackAllowed /t REG_DWORD /d 0 /f',
  disable_autofill_credit_card_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AutofillCreditCardEnabled /t REG_DWORD /d 0 /f',
  disable_autofill_address_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AutofillAddressEnabled /t REG_DWORD /d 0 /f',
  disable_local_providers_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v LocalProvidersEnabled /t REG_DWORD /d 0 /f',
  disable_search_suggestions_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v SearchSuggestEnabled /t REG_DWORD /d 0 /f',
  disable_edge_shopping_assistant: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v EdgeShoppingAssistantEnabled /t REG_DWORD /d 0 /f',
  disable_web_widget_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v WebWidgetAllowed /t REG_DWORD /d 0 /f',
  disable_hubs_sidebar_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v HubsSidebarEnabled /t REG_DWORD /d 0 /f',
  disable_browser_signin_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v BrowserSignin /t REG_DWORD /d 0 /f',
  disable_microsoft_editor_proofing_edge: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v MicrosoftEditorProofingEnabled /t REG_DWORD /d 0 /f',
  enable_do_not_track_microsoftedge: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\Main" /v DoNotTrack /t REG_DWORD /d 1 /f',
  disable_flip_ahead_microsoftedge: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\FlipAhead" /v FPEnabled /t REG_DWORD /d 0 /f',
  disable_search_suggestions_microsoftedge: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\Main" /v ShowSearchSuggestionsGlobal /t REG_DWORD /d 0 /f',
  disable_cortana_microsoftedge: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\ServiceUI" /v EnableCortana /t REG_DWORD /d 0 /f',
  disable_search_history_microsoftedge: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\ServiceUI\\ShowSearchHistory" /ve /t REG_SZ /d 0 /f',
  disable_office_telemetry: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\common\\clienttelemetry" /v DisableTelemetry /t REG_DWORD /d 1 /f',
  disable_office_send_telemetry: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\common\\clienttelemetry" /v SendTelemetry /t REG_DWORD /d 0 /f',
  disable_office_quality_metrics: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common" /v QMEnable /t REG_DWORD /d 0 /f',
  disable_office_linkedin_integration: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common" /v LinkedIn /t REG_DWORD /d 0 /f',
  disable_office_inline_text_prediction: 'reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\Common\\MailSettings" /v InlineTextPrediction /t REG_DWORD /d 0 /f',
  disable_office_osm_logging: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v Enablelogging /t REG_DWORD /d 0 /f',
  disable_office_osm_upload: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v EnableUpload /t REG_DWORD /d 0 /f',
  enable_office_osm_file_obfuscation: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v EnableFileObfuscation /t REG_DWORD /d 1 /f',
  disable_office_feedback_surveys: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v SurveyEnabled /t REG_DWORD /d 0 /f',
  disable_office_feedback: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v Enabled /t REG_DWORD /d 0 /f',
  disable_office_feedback_include_email: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v IncludeEmail /t REG_DWORD /d 0 /f',
  disable_setting_sync: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync" /v SyncPolicy /t REG_DWORD /d 5 /f',
  disable_personalization_sync: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Personalization" /v Enabled /t REG_DWORD /d 0 /f',
  disable_credentials_sync: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Credentials" /v Enabled /t REG_DWORD /d 0 /f',
  disable_browser_settings_sync: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\BrowserSettings" /v Enabled /t REG_DWORD /d 0 /f',
  disable_language_sync: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Language" /v Enabled /t REG_DWORD /d 0 /f',
  disable_accessibility_sync: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Accessibility" /v Enabled /t REG_DWORD /d 0 /f',
  disable_windows_sync: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Windows" /v Enabled /t REG_DWORD /d 0 /f',
  disable_cortana_consent: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Windows Search" /v CortanaConsent /t REG_DWORD /d 0 /f',
  disable_privacy_policy_acceptance: 'reg add "HKCU\\Software\\Microsoft\\Personalization\\Settings" /v AcceptedPrivacyPolicy /t REG_DWORD /d 0 /f',
  restrict_implicit_ink_collection: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 1 /f',
  restrict_implicit_text_collection: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization" /v RestrictImplicitTextCollection /t REG_DWORD /d 1 /f',
  disable_contact_harvesting: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization\\TrainedDataStore" /v HarvestContacts /t REG_DWORD /d 0 /f',
  disable_windows_copilot: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v TurnOffWindowsCopilot /t REG_DWORD /d 1 /f',
  hide_copilot_button: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v ShowCopilotButton /t REG_DWORD /d 0 /f',
  disable_ai_data_analysis: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v DisableAIDataAnalysis /t REG_DWORD /d 1 /f',
  disable_tailored_experiences: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Privacy" /v TailoredExperiencesWithDiagnosticDataEnabled /t REG_DWORD /d 0 /f',
  disable_system_pane_suggestions: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SystemPaneSuggestionsEnabled /t REG_DWORD /d 0 /f',
  disable_rotating_lock_screen: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v RotatingLockScreenEnabled /t REG_DWORD /d 0 /f',
  disable_rotating_lock_screen_overlay: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v RotatingLockScreenOverlayEnabled /t REG_DWORD /d 0 /f',
  disable_subscribed_content_338387: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 0 /f',
  disable_toasts_above_lock_screen: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" /v NOC_GLOBAL_SETTING_ALLOW_TOASTS_ABOVE_LOCK /t REG_DWORD /d 0 /f',
  disable_cross_device_experience: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v CrossDeviceEnabled /t REG_DWORD /d 0 /f',
  disable_phone_link: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v PhoneLinkEnabled /t REG_DWORD /d 0 /f',
  disable_mobility_opted_in: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v OptedIn /t REG_DWORD /d 0 /f',
  disable_dynamic_search_box: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SearchSettings" /v IsDynamicSearchBoxEnabled /t REG_DWORD /d 0 /f',
  disable_search_box_suggestions: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer" /v DisableSearchBoxSuggestions /t REG_DWORD /d 1 /f',
  disable_people_band: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\People" /v PeopleBand /t REG_DWORD /d 0 /f',
  disable_searchbox_taskbar_mode: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search" /v SearchboxTaskbarMode /t REG_DWORD /d 0 /f',
  hide_meet_now_button: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v HideSCAMeetNow /t REG_DWORD /d 1 /f',
  disable_siuf_rules: 'reg add "HKCU\\Software\\Microsoft\\Siuf\\Rules" /v NumberOfSIUFInPeriod /t REG_DWORD /d 0 /f',
  disable_siuf_period: 'reg add "HKCU\\Software\\Microsoft\\Siuf\\Rules" /v PeriodInNanoSeconds /t REG_DWORD /d 0 /f',
  disable_silent_installed_apps: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SilentInstalledAppsEnabled /t REG_DWORD /d 0 /f',
  disable_soft_landing: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SoftLandingEnabled /t REG_DWORD /d 0 /f',
  disable_media_player_usage_tracking: 'reg add "HKCU\\Software\\Microsoft\\MediaPlayer\\Preferences" /v UsageTracking /t REG_DWORD /d 0 /f',
  hide_desktop_icon_newstartpanel: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\HideDesktopIcons\\NewStartPanel" /v {2cc5ca98-6485-489a-920e-b3e88a6ccce3} /t REG_DWORD /d 1 /f',
  prevent_handwriting_data_sharing: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\TabletPC" /v PreventHandwritingDataSharing /t REG_DWORD /d 1 /f',
  prevent_handwriting_error_reports: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\HandwritingErrorReports" /v PreventHandwritingErrorReports /t REG_DWORD /d 1 /f',
  disable_appcompat_inventory: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v DisableInventory /t REG_DWORD /d 1 /f',
  disable_lock_screen_camera: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreenCamera /t REG_DWORD /d 1 /f',
  disable_advertising_info: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v Enabled /t REG_DWORD /d 0 /f',
  disable_bluetooth_advertising: 'reg add "HKLM\\SOFTWARE\\Microsoft\\PolicyManager\\current\\device\\Bluetooth" /v AllowAdvertising /t REG_DWORD /d 0 /f',
  disable_ceip: 'reg add "HKLM\\SOFTWARE\\Microsoft\\SQMClient\\Windows" /v CEIPEnable /t REG_DWORD /d 0 /f',
  disable_message_sync: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Messaging" /v AllowMessageSync /t REG_DWORD /d 0 /f',
  disable_windows_error_reporting: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f',
  disable_activity_feed: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 0 /f',
  disable_publish_user_activities: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v PublishUserActivities /t REG_DWORD /d 0 /f',
  disable_upload_user_activities: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v UploadUserActivities /t REG_DWORD /d 0 /f',
  disable_cross_device_clipboard: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v AllowCrossDeviceClipboard /t REG_DWORD /d 0 /f',
  disable_password_reveal: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CredUI" /v DisablePasswordReveal /t REG_DWORD /d 1 /f',
  disable_user_activity_reporting: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v DisableUAR /t REG_DWORD /d 1 /f',
  disable_diagtrack_service: 'reg add "HKLM\\System\\CurrentControlSet\\Services\\DiagTrack" /v Start /t REG_DWORD /d 4 /f',
  disable_dmwappushservice: 'reg add "HKLM\\System\\CurrentControlSet\\Services\\dmwappushservice" /v Start /t REG_DWORD /d 4 /f',
  disable_autologger_diagtrack_listener: 'reg add "HKLM\\System\\CurrentControlSet\\Control\\WMI\\Autologger\\AutoLogger-Diagtrack-Listener" /v Start /t REG_DWORD /d 0 /f',
  disable_address_bar_dropdown_edge: 'reg add "HKLM\\SOFTWARE\\Microsoft\\PolicyManager\\current\\device\\Browser\\AllowAddressBarDropdown" /v AllowAddressBarDropdown /t REG_DWORD /d 0 /f',
  disable_input_personalization: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\InputPersonalization" /v AllowInputPersonalization /t REG_DWORD /d 0 /f',
  disable_search_location_access: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowSearchToUseLocation" /v AllowSearchToUseLocation /t REG_DWORD /d 0 /f',
  disable_web_search: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\DisableWebSearch" /v DisableWebSearch /t REG_DWORD /d 1 /f',
  disable_connected_search_web: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\ConnectedSearchUseWeb" /v ConnectedSearchUseWeb /t REG_DWORD /d 0 /f',
  disable_speech_model_download: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Speech_OneCore\\Preferences\\ModelDownloadAllowed" /v ModelDownloadAllowed /t REG_DWORD /d 0 /f',
  disable_cloud_search: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowCloudSearch" /v AllowCloudSearch /t REG_DWORD /d 0 /f',
  disable_cortana_above_lock: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowCortanaAboveLock" /v AllowCortanaAboveLock /t REG_DWORD /d 0 /f',
  disable_dynamic_content_in_wsb: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\EnableDynamicContentInWSB" /v EnableDynamicContentInWSB /t REG_DWORD /d 0 /f',
  disable_recall_enablement: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v AllowRecallEnablement /t REG_DWORD /d 0 /f',
  disable_image_creator: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Paint" /v DisableImageCreator /t REG_DWORD /d 1 /f',
  disable_location: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableLocation" /v DisableLocation /t REG_DWORD /d 1 /f',
  disable_windows_location_provider: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableWindowsLocationProvider" /v DisableWindowsLocationProvider /t REG_DWORD /d 1 /f',
  disable_location_scripting: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableLocationScripting" /v DisableLocationScripting /t REG_DWORD /d 1 /f',
  disable_telemetry: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\AllowTelemetry" /v AllowTelemetry /t REG_DWORD /d 0 /f',
  disable_telemetry_data_collection: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection\\AllowTelemetry" /v AllowTelemetry /t REG_DWORD /d 0 /f',
  disable_ait_enable: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v AITEnable /t REG_DWORD /d 0 /f',
  limit_diagnostic_log_collection: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\LimitDiagnosticLogCollection" /v LimitDiagnosticLogCollection /t REG_DWORD /d 1 /f',
  disable_one_settings_downloads: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\DisableOneSettingsDownloads" /v DisableOneSettingsDownloads /t REG_DWORD /d 1 /f',
  disable_delivery_optimization: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config\\DODownloadMode" /v DODownloadMode /t REG_DWORD /d 0 /f',
  disable_delivery_optimization_policy: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f',
  disable_system_settings_download_mode: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization" /v SystemSettingsDownloadMode /t REG_DWORD /d 0 /f',
  disable_speech_model_update: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Speech" /v AllowSpeechModelUpdate /t REG_DWORD /d 0 /f',
  disable_mmx: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableMmx /t REG_DWORD /d 0 /f',
  disable_feedback_notifications: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 1 /f',
  disable_remote_assistance: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services" /v fAllowToGetHelp /t REG_DWORD /d 0 /f',
  disable_remote_desktop_connections: 'reg add "HKLM\\System\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f',
  disable_news_and_interests: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Feeds" /v EnableFeeds /t REG_DWORD /d 0 /f',
  reset_windows_update: 'Stop-Service -Name wuauserv,cryptSvc,bits,msiserver -Force; Rename-Item "$env:windir\\SoftwareDistribution" "SoftwareDistribution.old" -Force -ErrorAction SilentlyContinue; Rename-Item "$env:windir\\System32\\catroot2" "catroot2.old" -Force -ErrorAction SilentlyContinue; regsvr32 /s wuaueng.dll; regsvr32 /s wuapi.dll; regsvr32 /s wups.dll; regsvr32 /s wups2.dll; regsvr32 /s wuwebv.dll; regsvr32 /s wuauserv.dll; regsvr32 /s wucltux.dll; netsh int ip reset reset.log; netsh winsock reset catalog; sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth; Cleanmgr /sagerun:1',
  reset_windows_store: 'Get-AppxPackage -AllUsers | Remove-AppxPackage -AllUsers; Get-AppxProvisionedPackage -Online | Remove-AppxProvisionedPackage -Online; Get-AppXPackage -AllUsers | ForEach-Object { Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\\AppXManifest.xml" -ForceApplicationShutdown }; Remove-Item -Path "$env:LOCALAPPDATA\\Packages\\Microsoft.WindowsStore*" -Recurse -Force',
  reset_network: "netsh int ip reset reset.log; netsh interface ipv4 reset; netsh interface ipv6 reset; ipconfig /release; ipconfig /renew; ipconfig /flushdns; ipconfig /registerdns; Get-NetAdapter | Restart-NetAdapter -Confirm:$false; netsh winhttp reset proxy",
  reset_firewall: 'netsh advfirewall reset; netsh advfirewall set allprofiles firewallpolicy "BlockInbound,AllowOutbound"; Set-NetFirewallProfile -All -Enabled True',
  rebuild_icon_cache: 'Stop-Process -Name explorer -Force; Remove-Item -Path "$env:LOCALAPPDATA\\IconCache.db" -Force -ErrorAction SilentlyContinue; Start-Process explorer',
  repair_boot_config: '$firmware = (Get-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control" -Name PEFirmwareType).PEFirmwareType; if ($firmware -eq 2) { bcdboot C:\\Windows /s S: /f UEFI } else { bootrec /fixmbr; bootrec /fixboot }; bootrec /scanos; bootrec /rebuildbcd',
  cleanup_component_store: "DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase /Defer",
  advanced_system_repair: "sfc /scannow; DISM /Online /Cleanup-Image /RestoreHealth; DISM /Online /Cleanup-Image /StartComponentCleanup /ResetBase /Defer",
  reset_windows_defender: 'Stop-Service -Name WinDefend -Force; Start-Service -Name WinDefend; Start-Process "C:\\Program Files\\Windows Defender\\MpCmdRun.exe" -ArgumentList "-RemoveDefinitions -All" -Wait; Update-MpSignature',
  clean_temp_files: 'Remove-Item -Path "$env:TEMP\\*", "$env:windir\\Temp\\*", "$env:LOCALAPPDATA\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue',
  reset_security_policy: 'secedit /configure /db "$env:windir\\security\\database\\secedit.sdb" /cfg "$env:windir\\inf\\defltbase.inf" /areas SECURITYPOLICY; auditpol /clear /yes',
  clean_event_logs: "wevtutil el | ForEach-Object { wevtutil cl $_ }",
  optimize_disk: '$partition = Get-Partition -DriveLetter C; $disk = Get-Disk -Number $partition.DiskNumber; if ($disk.MediaType -eq "SSD") { Optimize-Volume C -ReTrim -Verbose } else { defrag C: /O /U /V }',
  repair_wsl: "wsl --update; wsl --shutdown; wsl --install --no-distribution --quiet; wsl --set-default-version 2",
  reset_printer_spooler: 'Stop-Service -Name Spooler -Force; Remove-Item -Path "$env:WINDIR\\System32\\spool\\PRINTERS\\*" -Recurse -Force; Start-Service -Name Spooler',
  reset_audio_services: "Stop-Service -Name Audiosrv -Force; Start-Sleep -Seconds 2; regsvr32 /s $env:SystemRoot\\System32\\AudioEng.dll; regsvr32 /s $env:SystemRoot\\System32\\AudioSes.dll; Start-Service -Name Audiosrv; msdt.exe /id AudioPlaybackDiagnostic",
  privacy1: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 0 /f',
  privacy2: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors" /v DisableLocation /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maps" /v AutoUpdateEnabled /t REG_DWORD /d 0 /f',
  privacy3: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f',
  privacy4: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 1 /f',
  privacy5: 'reg add "HKCU\\Software\\Policies\\Microsoft\\WindowsInkWorkspace" /v AllowWindowsInkWorkspace /t REG_DWORD /d 0 /f',
  privacy6: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo" /v DisabledByGroupPolicy /t REG_DWORD /d 1 /f',
  privacy7: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Deny /f',
  privacy8: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 1 /f',
  privacy9: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Speech_OneCore\\Settings\\VoiceActivation" /v UserPreferenceForAllApps /t REG_DWORD /d 0 /f',
  privacy10: 'reg add "HKCU\\Software\\Policies\\Microsoft\\InputPersonalization" /v HarvestContacts /t REG_DWORD /d 0 /f',
  privacy11: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Remote Assistance" /v fAllowToGetHelp /t REG_DWORD /d 0 /f',
  privacy12: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CurrentVersion\\Device Metadata" /v PreventDeviceMetadataFromNetwork /t REG_DWORD /d 1 /f',
  privacy13: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsConsumerFeatures /t REG_DWORD /d 1 /f',
  privacy14: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppPrivacy" /v LetAppsRunInBackground /t REG_DWORD /d 0 /f',
  privacy15: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search" /v AllowCortana /t REG_DWORD /d 0 /f',
  privacy16: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WlanSvc" /v AllowWiFiSenseHotspots /t REG_DWORD /d 0 /f',
  privacy17: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Maintenance" /v MaintenanceDisabled /t REG_DWORD /d 1 /f',
  privacy18: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\PushToInstall" /v DisablePushToInstall /t REG_DWORD /d 1 /f',
  privacy19: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\ContentDeliveryManager" /v SubscribedContentEnabled /t REG_DWORD /d 0 /f',
  privacy20: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v RotatingLockScreenEnabled /t REG_DWORD /d 0 /f',
  privacy21: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\BitLocker" /v DisableAutoEncryption /t REG_DWORD /d 1 /f',
  privacy22: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\EnhancedStorageDevices" /v TCGSecurityActivationDisabled /t REG_DWORD /d 1 /f',
  privacy23: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v DisableAutomaticRestartSignOn /t REG_DWORD /d 1 /f',
  privacy24: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsSpotlightFeatures /t REG_DWORD /d 1 /f',
  privacy25: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 0 /f',
  gaming1: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameMode" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f',
  gaming2: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f',
  gaming3: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameBar" /v UseNexusForGameBarEnabled /t REG_DWORD /d 0 /f',
  gaming4: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\DirectX" /v EnableSwapEffectUpgrade /t REG_DWORD /d 0 /f',
  gaming5: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\GameDVR" /v WindowedOptimizationsEnabled /t REG_DWORD /d 1 /f',
  gaming6: 'reg add "HKLM\\SOFTWARE\\Policies\\NVIDIA" /v EnableOldSharpening /t REG_DWORD /d 1 /f',
  gaming7: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile" /v SystemResponsiveness /t REG_DWORD /d 0 /f',
  gaming8: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile" /v NetworkThrottlingIndex /t REG_DWORD /d 10 /f',
  gaming9: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "GPU Priority" /t REG_DWORD /d 8 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Priority" /t REG_DWORD /d 6 /f',
  gaming10: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Multimedia\\SystemProfile\\Tasks\\Games" /v "Scheduling Category" /t REG_SZ /d High /f',
  gaming11: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GraphicsDrivers" /v HwSchMode /t REG_DWORD /d 2 /f',
  gaming12: 'reg add "HKLM\\SYSTEM\\CurrentControlSet\\Control\\PriorityControl" /v Win32PrioritySeparation /t REG_DWORD /d 38 /f',
  gaming13: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\StorageSense" /v AllowStorageSenseGlobal /t REG_DWORD /d 0 /f',
  gaming14: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_FSEBehaviorMode /t REG_DWORD /d 2 /f',
  updates1: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /t REG_DWORD /d 1 /f',
  updates2: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferFeatureUpdatesPeriodInDays /t REG_DWORD /d 365 /f',
  updates3: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate\\AU" /v DeferQualityUpdatesPeriodInDays /t REG_DWORD /d 7 /f',
  updates4: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersion /t REG_DWORD /d 1 /f; reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsUpdate" /v TargetReleaseVersionInfo /t REG_SZ /d "21H2" /f',
  updates5: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f',
  updates6: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\WindowsStore" /v AutoDownload /t REG_DWORD /d 2 /f',
  updates7: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Appx" /v AllowAutomaticAppArchiving /t REG_DWORD /d 0 /f',
  services1: 'sc.exe config "AppVClient" start=disabled',
  services2: 'sc.exe config "AssignedAccessManagerSvc" start=disabled',
  services3: 'sc.exe config "DiagTrack" start=disabled',
  services4: 'sc.exe config "DialogBlockingService" start=disabled',
  services5: 'sc.exe config "NetTcpPortSharing" start=disabled',
  services6: 'sc.exe config "RemoteAccess" start=disabled',
  services7: 'sc.exe config "RemoteRegistry" start=disabled',
  services8: 'sc.exe config "UevAgentService" start=disabled',
  services9: 'sc.exe config "shpamsvc" start=disabled',
  services10: 'sc.exe config "ssh-agent" start=disabled',
  services11: 'sc.exe config "tzautoupdate" start=disabled',
  services12: 'sc.exe config "Spooler" start=disabled',
  services13: 'sc.exe config "bthserv" start=disabled',
  services14: 'sc.exe config "TermService" start=disabled',
  maintenance1: 'Remove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue; exit 0',
  maintenance2: 'Remove-Item -Path "C:\\Windows\\Prefetch\\*" -Recurse -Force -ErrorAction SilentlyContinue; exit 0',
  maintenance3: 'Stop-Service wuauserv -ErrorAction SilentlyContinue; Remove-Item -Path "C:\\Windows\\SoftwareDistribution\\Download\\*" -Recurse -Force -ErrorAction SilentlyContinue; Start-Service wuauserv -ErrorAction SilentlyContinue; exit 0',
  maintenance4: "Clear-RecycleBin -DriveLetter C -Force -ErrorAction SilentlyContinue; exit 0",
  maintenance5: 'wevtutil el | ForEach-Object { wevtutil cl "$_" 2>&1 | Out-Null }; exit 0',
  maintenance6: 'Remove-Item -Path "C:\\Windows\\Logs\\CBS\\*" -Recurse -Force -ErrorAction SilentlyContinue; exit 0',
  maintenance7: 'Remove-Item -Path "$env:LOCALAPPDATA\\Microsoft\\Windows\\Explorer\\thumbcache_*.db" -Force -ErrorAction SilentlyContinue; exit 0',
  maintenance8: "Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase; exit 0",
};

document.addEventListener("DOMContentLoaded", () => {
  const labels = document.querySelectorAll(".checkbox-group label");
  for (const label of labels) {
    const checkbox = label.querySelector('input[type="checkbox"]');
    if (checkbox && commandMapping[checkbox.value]) {
      const infoIcon = document.createElement("i");
      infoIcon.className = "fa fa-code info-icon";
      infoIcon.setAttribute("data-command", commandMapping[checkbox.value]);
      label.appendChild(infoIcon);
    }
  }

  const modal = document.getElementById("commandModal");
  const commandCodeElem = document.getElementById("commandCode");
  const closeBtn = modal?.querySelector(".close");
  const copyCommandBtn = document.getElementById("copyCommandBtn");

  const infoIcons = document.querySelectorAll(".info-icon");
  for (const icon of infoIcons) {
    icon.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const command = event.target.getAttribute("data-command");
      if (commandCodeElem) {
        commandCodeElem.textContent = command;
      }
      if (modal) {
        modal.style.display = "flex";
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (modal) {
        modal.style.display = "none";
      }
    });
  }

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  if (copyCommandBtn && commandCodeElem) {
    copyCommandBtn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(commandCodeElem.textContent)
        .then(() => {
          if (window.EasyNotificationInstance) {
            window.EasyNotificationInstance.createNotification({
              title: "Copy Command",
              message: "Command Copied to Clipboard",
              type: "success",
            });
          } else {
            alert("Command Copied to Clipboard");
          }
        })
        .catch((err) => {
          console.error("Failed to copy command: ", err);
          if (window.EasyNotificationInstance) {
            window.EasyNotificationInstance.createNotification({
              title: "Copy Error",
              message: "Failed to copy command.",
              type: "danger",
            });
          } else {
            alert("Failed to copy command.");
          }
        });
    });
  }

  const subTabs = document.querySelectorAll(".sub-tab");
  for (const tab of subTabs) {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const parentTabContainer = tab.closest(".tab");
      if (!parentTabContainer) return;

      const targetId = tab.dataset.subtab;

      const currentSubTabs = parentTabContainer.querySelectorAll(".sub-tab");
      const currentSubContents = parentTabContainer.querySelectorAll(".sub-tab-content");

      for (const t of currentSubTabs) t.classList.remove("active");
      for (const c of currentSubContents) c.classList.remove("active");

      tab.classList.add("active");
      const targetContent = parentTabContainer.querySelector(`#${targetId}`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  }
});
