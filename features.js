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

const userRegistryChanges = [
  {
    id: 'disable_advertising_id',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_input_tipc',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\input\\TIPC" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\input\\TIPC" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_content_subscription_353698',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353698Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353698Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_content_subscription_338388',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338388Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338388Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_content_subscription_338389',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338389Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338389Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_content_subscription_338393_353694_353696',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338393Enabled /t REG_DWORD /d 0 /f; reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353694Enabled /t REG_DWORD /d 0 /f; reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353696Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338393Enabled /t REG_DWORD /d 1 /f; reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353694Enabled /t REG_DWORD /d 1 /f; reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-353696Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_user_profile_engagement_scoobe',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\UserProfileEngagement" /v ScoobeSystemSettingEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\UserProfileEngagement" /v ScoobeSystemSettingEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_clipboard_history',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Clipboard" /v EnableClipboardHistory /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Clipboard" /v EnableClipboardHistory /t REG_DWORD /d 1 /f'
  },
  {
    id: 'deny_user_account_information_access',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Deny /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Allow /f'
  },
  {
    id: 'disable_start_track_progs',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v Start_TrackProgs /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v Start_TrackProgs /t REG_DWORD /d 1 /f'
  },
  {
    id: 'deny_app_diagnostics_access',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics" /v Value /t REG_SZ /d Deny /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics" /v Value /t REG_SZ /d Allow /f'
  },
  {
    id: 'enable_do_not_track_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v ConfigureDoNotTrack /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v ConfigureDoNotTrack /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_payment_method_query_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v PaymentMethodQueryEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v PaymentMethodQueryEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_personalization_reporting_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v PersonalizationReportingEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v PersonalizationReportingEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_address_bar_bing_search_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v AddressBarMicrosoftSearchInBingProviderEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v AddressBarMicrosoftSearchInBingProviderEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_user_feedback_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v UserFeedbackAllowed /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v UserFeedbackAllowed /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_autofill_credit_card_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v AutofillCreditCardEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v AutofillCreditCardEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_autofill_address_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v AutofillAddressEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v AutofillAddressEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_local_providers_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v LocalProvidersEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v LocalProvidersEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_search_suggestions_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v SearchSuggestEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v SearchSuggestEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_edge_shopping_assistant',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v EdgeShoppingAssistantEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v EdgeShoppingAssistantEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_web_widget_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v WebWidgetAllowed /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v WebWidgetAllowed /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_hubs_sidebar_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v HubsSidebarEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v HubsSidebarEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_browser_signin_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v BrowserSignin /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v BrowserSignin /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_microsoft_editor_proofing_edge',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v MicrosoftEditorProofingEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Edge" /v MicrosoftEditorProofingEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'enable_do_not_track_microsoftedge',
    commandOn: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\Main" /v DoNotTrack /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\Main" /v DoNotTrack /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_flip_ahead_microsoftedge',
    commandOn: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\FlipAhead" /v FPEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\FlipAhead" /v FPEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_search_suggestions_microsoftedge',
    commandOn: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\Main" /v ShowSearchSuggestionsGlobal /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\Main" /v ShowSearchSuggestionsGlobal /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_cortana_microsoftedge',
    commandOn: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\ServiceUI" /v EnableCortana /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\ServiceUI" /v EnableCortana /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_search_history_microsoftedge',
    commandOn: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\ServiceUI\\ShowSearchHistory" /ve /t REG_SZ /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\CurrentVersion\\AppContainer\\Storage\\microsoft.microsoftedge_8wekyb3d8bbwe\\MicrosoftEdge\\ServiceUI\\ShowSearchHistory" /ve /t REG_SZ /d 1 /f'
  },
  {
    id: 'disable_office_telemetry',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\common\\clienttelemetry" /v DisableTelemetry /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\common\\clienttelemetry" /v DisableTelemetry /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_office_send_telemetry',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\common\\clienttelemetry" /v SendTelemetry /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\common\\clienttelemetry" /v SendTelemetry /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_office_quality_metrics',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common" /v QMEnable /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common" /v QMEnable /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_office_linkedin_integration',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common" /v LinkedIn /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common" /v LinkedIn /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_office_inline_text_prediction',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\Common\\MailSettings" /v InlineTextPrediction /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\Common\\MailSettings" /v InlineTextPrediction /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_office_osm_logging',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v Enablelogging /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v Enablelogging /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_office_osm_upload',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v EnableUpload /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v EnableUpload /t REG_DWORD /d 1 /f'
  },
  {
    id: 'enable_office_osm_file_obfuscation',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v EnableFileObfuscation /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\osm" /v EnableFileObfuscation /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_office_feedback_surveys',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v SurveyEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v SurveyEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_office_feedback',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_office_feedback_include_email',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v IncludeEmail /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\office\\16.0\\common\\Feedback" /v IncludeEmail /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_setting_sync',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync" /v SyncPolicy /t REG_DWORD /d 5 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync" /v SyncPolicy /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_personalization_sync',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Personalization" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Personalization" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_credentials_sync',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Credentials" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Credentials" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_browser_settings_sync',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\BrowserSettings" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\BrowserSettings" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_language_sync',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Language" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Language" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_accessibility_sync',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Accessibility" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Accessibility" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_windows_sync',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Windows" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SettingSync\\Groups\\Windows" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_cortana_consent',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Windows Search" /v CortanaConsent /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Windows Search" /v CortanaConsent /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_privacy_policy_acceptance',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Personalization\\Settings" /v AcceptedPrivacyPolicy /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Personalization\\Settings" /v AcceptedPrivacyPolicy /t REG_DWORD /d 1 /f'
  },
  {
    id: 'restrict_implicit_ink_collection',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization" /v RestrictImplicitInkCollection /t REG_DWORD /d 0 /f'
  },
  {
    id: 'restrict_implicit_text_collection',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization" /v RestrictImplicitTextCollection /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization" /v RestrictImplicitTextCollection /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_contact_harvesting',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization\\TrainedDataStore" /v HarvestContacts /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\InputPersonalization\\TrainedDataStore" /v HarvestContacts /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_windows_copilot',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v TurnOffWindowsCopilot /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v TurnOffWindowsCopilot /t REG_DWORD /d 0 /f'
  },
  {
    id: 'hide_copilot_button',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v ShowCopilotButton /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v ShowCopilotButton /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_ai_data_analysis',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsAI" /v DisableAIDataAnalysis /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsAI" /v DisableAIDataAnalysis /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_tailored_experiences',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Privacy" /v TailoredExperiencesWithDiagnosticDataEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Privacy" /v TailoredExperiencesWithDiagnosticDataEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_system_pane_suggestions',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SystemPaneSuggestionsEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SystemPaneSuggestionsEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_rotating_lock_screen',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v RotatingLockScreenEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v RotatingLockScreenEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_rotating_lock_screen_overlay',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v RotatingLockScreenOverlayEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v RotatingLockScreenOverlayEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_subscribed_content_338387',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338387Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_toasts_above_lock_screen',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" /v NOC_GLOBAL_SETTING_ALLOW_TOASTS_ABOVE_LOCK /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" /v NOC_GLOBAL_SETTING_ALLOW_TOASTS_ABOVE_LOCK /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_cross_device_experience',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v CrossDeviceEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v CrossDeviceEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_phone_link',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v PhoneLinkEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v PhoneLinkEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_mobility_opted_in',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v OptedIn /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Mobility" /v OptedIn /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_dynamic_search_box',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SearchSettings" /v IsDynamicSearchBoxEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\SearchSettings" /v IsDynamicSearchBoxEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_search_box_suggestions',
    commandOn: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer" /v DisableSearchBoxSuggestions /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer" /v DisableSearchBoxSuggestions /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_people_band',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\People" /v PeopleBand /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\People" /v PeopleBand /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_searchbox_taskbar_mode',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search" /v SearchboxTaskbarMode /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search" /v SearchboxTaskbarMode /t REG_DWORD /d 1 /f'
  },
  {
    id: 'hide_meet_now_button',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v HideSCAMeetNow /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v HideSCAMeetNow /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_siuf_rules',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Siuf\\Rules" /v NumberOfSIUFInPeriod /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Siuf\\Rules" /v NumberOfSIUFInPeriod /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_siuf_period',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Siuf\\Rules" /v PeriodInNanoSeconds /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Siuf\\Rules" /v PeriodInNanoSeconds /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_silent_installed_apps',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SilentInstalledAppsEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SilentInstalledAppsEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_soft_landing',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SoftLandingEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SoftLandingEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_media_player_usage_tracking',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\MediaPlayer\\Preferences" /v UsageTracking /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\MediaPlayer\\Preferences" /v UsageTracking /t REG_DWORD /d 1 /f'
  },
  {
    id: 'hide_desktop_icon_newstartpanel',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\HideDesktopIcons\\NewStartPanel" /v {2cc5ca98-6485-489a-920e-b3e88a6ccce3} /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\HideDesktopIcons\\NewStartPanel" /v {2cc5ca98-6485-489a-920e-b3e88a6ccce3} /t REG_DWORD /d 0 /f'
  }
];

const machineRegistryChanges = [
  {
    id: 'prevent_handwriting_data_sharing',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\TabletPC" /v PreventHandwritingDataSharing /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\TabletPC" /v PreventHandwritingDataSharing /t REG_DWORD /d 0 /f'
  },
  {
    id: 'prevent_handwriting_error_reports',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\HandwritingErrorReports" /v PreventHandwritingErrorReports /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\HandwritingErrorReports" /v PreventHandwritingErrorReports /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_appcompat_inventory',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v DisableInventory /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v DisableInventory /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_lock_screen_camera',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreenCamera /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Personalization" /v NoLockScreenCamera /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_advertising_info',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v Enabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo" /v Enabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_bluetooth_advertising',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\PolicyManager\\current\\device\\Bluetooth" /v AllowAdvertising /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\PolicyManager\\current\\device\\Bluetooth" /v AllowAdvertising /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_ceip',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\SQMClient\\Windows" /v CEIPEnable /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\SQMClient\\Windows" /v CEIPEnable /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_message_sync',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Messaging" /v AllowMessageSync /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Messaging" /v AllowMessageSync /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_windows_error_reporting',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting" /v Disabled /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_activity_feed',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableActivityFeed /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_publish_user_activities',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v PublishUserActivities /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v PublishUserActivities /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_upload_user_activities',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v UploadUserActivities /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v UploadUserActivities /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_clipboard_history',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v AllowClipboardHistory /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v AllowClipboardHistory /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_cross_device_clipboard',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v AllowCrossDeviceClipboard /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v AllowCrossDeviceClipboard /t REG_DWORD /d 1 /f'
  },
  {
    id: 'deny_user_account_information_access',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Deny /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\userAccountInformation" /v Value /t REG_SZ /d Allow /f'
  },
  {
    id: 'deny_app_diagnostics_access',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics" /v Value /t REG_SZ /d Deny /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\appDiagnostics" /v Value /t REG_SZ /d Allow /f'
  },
  {
    id: 'disable_password_reveal',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CredUI" /v DisablePasswordReveal /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CredUI" /v DisablePasswordReveal /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_user_activity_reporting',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v DisableUAR /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v DisableUAR /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_diagtrack_service',
    commandOn: 'reg add "HKLM\\System\\CurrentControlSet\\Services\\DiagTrack" /v Start /t REG_DWORD /d 4 /f',
    commandOff: 'reg add "HKLM\\System\\CurrentControlSet\\Services\\DiagTrack" /v Start /t REG_DWORD /d 2 /f'
  },
  {
    id: 'disable_dmwappushservice',
    commandOn: 'reg add "HKLM\\System\\CurrentControlSet\\Services\\dmwappushservice" /v Start /t REG_DWORD /d 4 /f',
    commandOff: 'reg add "HKLM\\System\\CurrentControlSet\\Services\\dmwappushservice" /v Start /t REG_DWORD /d 2 /f'
  },
  {
    id: 'disable_autologger_diagtrack_listener',
    commandOn: 'reg add "HKLM\\System\\CurrentControlSet\\Control\\WMI\\Autologger\\AutoLogger-Diagtrack-Listener" /v Start /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\System\\CurrentControlSet\\Control\\WMI\\Autologger\\AutoLogger-Diagtrack-Listener" /v Start /t REG_DWORD /d 1 /f'
  },
  {
    id: 'enable_do_not_track_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v ConfigureDoNotTrack /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v ConfigureDoNotTrack /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_payment_method_query_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v PaymentMethodQueryEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v PaymentMethodQueryEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_personalization_reporting_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v PersonalizationReportingEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v PersonalizationReportingEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_address_bar_bing_search_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AddressBarMicrosoftSearchInBingProviderEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AddressBarMicrosoftSearchInBingProviderEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_user_feedback_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v UserFeedbackAllowed /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v UserFeedbackAllowed /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_autofill_credit_card_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AutofillCreditCardEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AutofillCreditCardEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_autofill_address_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AutofillAddressEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v AutofillAddressEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_local_providers_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v LocalProvidersEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v LocalProvidersEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_search_suggestions_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v SearchSuggestEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v SearchSuggestEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_edge_shopping_assistant',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v EdgeShoppingAssistantEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v EdgeShoppingAssistantEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_web_widget_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v WebWidgetAllowed /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v WebWidgetAllowed /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_hubs_sidebar_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v HubsSidebarEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v HubsSidebarEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_browser_signin_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v BrowserSignin /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v BrowserSignin /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_microsoft_editor_proofing_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v MicrosoftEditorProofingEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v MicrosoftEditorProofingEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_address_bar_dropdown_edge',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\PolicyManager\\current\\device\\Browser\\AllowAddressBarDropdown" /v AllowAddressBarDropdown /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\PolicyManager\\current\\device\\Browser\\AllowAddressBarDropdown" /v AllowAddressBarDropdown /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_input_personalization',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\InputPersonalization" /v AllowInputPersonalization /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\InputPersonalization" /v AllowInputPersonalization /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_search_location_access',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowSearchToUseLocation" /v AllowSearchToUseLocation /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowSearchToUseLocation" /v AllowSearchToUseLocation /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_web_search',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\DisableWebSearch" /v DisableWebSearch /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\DisableWebSearch" /v DisableWebSearch /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_connected_search_web',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\ConnectedSearchUseWeb" /v ConnectedSearchUseWeb /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\ConnectedSearchUseWeb" /v ConnectedSearchUseWeb /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_speech_model_download',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Speech_OneCore\\Preferences\\ModelDownloadAllowed" /v ModelDownloadAllowed /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Speech_OneCore\\Preferences\\ModelDownloadAllowed" /v ModelDownloadAllowed /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_cloud_search',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowCloudSearch" /v AllowCloudSearch /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowCloudSearch" /v AllowCloudSearch /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_cortana_above_lock',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowCortanaAboveLock" /v AllowCortanaAboveLock /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\AllowCortanaAboveLock" /v AllowCortanaAboveLock /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_dynamic_content_in_wsb',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\EnableDynamicContentInWSB" /v EnableDynamicContentInWSB /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search\\EnableDynamicContentInWSB" /v EnableDynamicContentInWSB /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_windows_copilot',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v TurnOffWindowsCopilot /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v TurnOffWindowsCopilot /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_recall_enablement',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v AllowRecallEnablement /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v AllowRecallEnablement /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_image_creator',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Paint" /v DisableImageCreator /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Paint" /v DisableImageCreator /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_ai_data_analysis',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v DisableAIDataAnalysis /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsAI" /v DisableAIDataAnalysis /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_location',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableLocation" /v DisableLocation /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableLocation" /v DisableLocation /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_windows_location_provider',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableWindowsLocationProvider" /v DisableWindowsLocationProvider /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableWindowsLocationProvider" /v DisableWindowsLocationProvider /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_location_scripting',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableLocationScripting" /v DisableLocationScripting /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors\\DisableLocationScripting" /v DisableLocationScripting /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_telemetry',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\AllowTelemetry" /v AllowTelemetry /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\AllowTelemetry" /v AllowTelemetry /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_telemetry_data_collection',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection\\AllowTelemetry" /v AllowTelemetry /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\DataCollection\\AllowTelemetry" /v AllowTelemetry /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_ait_enable',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v AITEnable /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AppCompat" /v AITEnable /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_tailored_experiences',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Privacy" /v TailoredExperiencesWithDiagnosticDataEnabled /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Privacy" /v TailoredExperiencesWithDiagnosticDataEnabled /t REG_DWORD /d 1 /f'
  },
  {
    id: 'limit_diagnostic_log_collection',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\LimitDiagnosticLogCollection" /v LimitDiagnosticLogCollection /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\LimitDiagnosticLogCollection" /v LimitDiagnosticLogCollection /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_one_settings_downloads',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\DisableOneSettingsDownloads" /v DisableOneSettingsDownloads /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection\\DisableOneSettingsDownloads" /v DisableOneSettingsDownloads /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_delivery_optimization',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config\\DODownloadMode" /v DODownloadMode /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization\\Config\\DODownloadMode" /v DODownloadMode /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_delivery_optimization_policy',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization" /v DODownloadMode /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_system_settings_download_mode',
    commandOn: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization" /v SystemSettingsDownloadMode /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\DeliveryOptimization" /v SystemSettingsDownloadMode /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_speech_model_update',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Speech" /v AllowSpeechModelUpdate /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Speech" /v AllowSpeechModelUpdate /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_mmx',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableMmx /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableMmx /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_feedback_notifications',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v DoNotShowFeedbackNotifications /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_remote_assistance',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services" /v fAllowToGetHelp /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows NT\\Terminal Services" /v fAllowToGetHelp /t REG_DWORD /d 1 /f'
  },
  {
    id: 'disable_remote_desktop_connections',
    commandOn: 'reg add "HKLM\\System\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\System\\CurrentControlSet\\Control\\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f'
  },
  {
    id: 'hide_meet_now_button',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v HideSCAMeetNow /t REG_DWORD /d 1 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\Explorer" /v HideSCAMeetNow /t REG_DWORD /d 0 /f'
  },
  {
    id: 'disable_news_and_interests',
    commandOn: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Feeds" /v EnableFeeds /t REG_DWORD /d 0 /f',
    commandOff: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Feeds" /v EnableFeeds /t REG_DWORD /d 1 /f'
  }
];

function wrapCommand(cmd) {
  return cmd.replace(/&&/g, ';');
}

function executeCommand(command) {
  return new Promise((resolve) => {
    log(`Executing command: ${command}`);
    let outputData = '';
    const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', command]);

    psProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      outputData += `${output}\n`;
      log(`Output: ${output}`);
    });

    psProcess.stderr.on('data', (data) => {
      const errorOutput = data.toString().trim();
      outputData += `ERROR: ${errorOutput}\n`;
      log(`Error: ${errorOutput}`, 'error');
    });

    psProcess.on('error', (error) => {
      log(`Process error: ${error}`, 'error');
      resolve({ success: false, command, message: error.toString() });
    });

    psProcess.on('close', (code) => {
      log(`Process closed with code: ${code}`);
      resolve({ success: code === 0, command, message: outputData || `Process exited with code ${code}` });
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

ipcMain.on('apply-user-windows-features', (event, selectedIds) => {
  log('Received apply-user-windows-features with data: ' + JSON.stringify(selectedIds));
  const commands = userRegistryChanges.map(opt => {
    if (opt.command) { return selectedIds.includes(opt.id) ? wrapCommand(opt.command) : null; }
    const cmd = selectedIds.includes(opt.id) ? opt.commandOn : opt.commandOff;
    return cmd ? wrapCommand(cmd) : null;
  }).filter(cmd => cmd !== null);
  executeCommands(commands, event, 'user-windows-features-response');
});

ipcMain.on('apply-machine-windows-features', (event, selectedIds) => {
  log('Received apply-machine-windows-features with data: ' + JSON.stringify(selectedIds));
  const commands = machineRegistryChanges.map(opt => {
    if (opt.command) { return selectedIds.includes(opt.id) ? wrapCommand(opt.command) : null; }
    const cmd = selectedIds.includes(opt.id) ? opt.commandOn : opt.commandOff;
    return cmd ? wrapCommand(cmd) : null;
  }).filter(cmd => cmd !== null);
  executeCommands(commands, event, 'machine-windows-features-response');
});

ipcMain.handle('check-features-state', async (event, category, optionId) => {
  let optionsArray;
  if (category === 'userFeatures') {
    optionsArray = userRegistryChanges;
  } else if (category === 'machineFeatures') {
    optionsArray = machineRegistryChanges;
  } else {
    return false;
  }

  const option = optionsArray.find(opt => opt.id === optionId);
  if (!option || !option.commandOn) return null;

  const commands = option.commandOn.split(';').map(cmd => cmd.trim());

  const results = await Promise.all(commands.map(async (command) => {
    if (!command.startsWith('reg add')) return false;

    const regex = /reg add "([^"]+)"\s+\/v\s+(\S+)\s+\/t\s+(\S+)\s+\/d\s+(\S+)/i;
    const match = command.match(regex);
    if (!match) return false;

    const [_, keyPath, valueName, valueType, expectedValue] = match;
    const queryCmd = `reg query "${keyPath}" /v ${valueName}`;

    return new Promise(resolve => {
      let outputData = '';
      const psProcess = spawn('powershell.exe', ['-NoProfile', '-Command', queryCmd]);

      psProcess.stdout.on('data', data => outputData += data.toString());
      psProcess.stderr.on('data', data => outputData += data.toString());
      psProcess.on('close', () => {
        const valuePattern = valueType === 'REG_DWORD' ? `${valueName}\\s+${valueType}\\s+0x${parseInt(expectedValue).toString(16)}` : `${valueName}\\s+${valueType}\\s+${expectedValue}`;

        const valueMatch = outputData.match(new RegExp(valuePattern, 'i'));
        resolve(!!valueMatch);
      });
      psProcess.on('error', () => resolve(false));
    });
  }));

  return results.every(result => result === true);
});
