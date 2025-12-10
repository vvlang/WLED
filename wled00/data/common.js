var d=document;
var loc = false, locip, locproto = "http:";

// 国际化翻译系统（用于设置页面）
var currentLang = localStorage.getItem('wledLang') || 'zh'; // 默认中文
var i18n = {
	en: {
		// 设置主页面
		back: "Back",
		wifiSettings: "WiFi Settings",
		ledPreferences: "LED Preferences",
		config2D: "2D Configuration",
		userInterface: "User Interface",
		dmxOutput: "DMX Output",
		syncInterface: "Sync Interface",
		timeAndMacros: "Time & Macros",
		usermods: "Usermods",
		securityAndUpdate: "Security & Update",
		// 通用
		save: "Save",
		cancel: "Cancel",
		reset: "Reset",
		enabled: "Enabled",
		disabled: "Disabled",
		// 安全与更新
		securityAndUpdateTitle: "Security & Update Settings",
		checkUpdate: "Check Update Now",
		checkingUpdate: "Checking Update...",
		updateStatus: "Status",
		currentVersion: "Current Version",
		latestVersion: "Latest Version",
		updateAvailable: "Update Available",
		upToDate: "Up to Date",
		unknown: "Unknown",
		checkTimeout: "Check timeout, please try again later",
		setPIN: "Set PIN",
		enter4DigitPIN: "Please enter 4 digits",
		unencryptedTransmission: "⚠ Unencrypted transmission. Be careful when choosing a PIN, do not use your bank, access card, SIM card PIN, etc.!",
		lockOTA: "Lock wireless (OTA) software update",
		passphrase: "Passphrase",
		enableOTANote: "To enable OTA, you also need to enter the correct password for security reasons!",
		changePasswordOnOTA: "You should change the password when enabling OTA.",
		disableOTANote: "Disable OTA when not in use, otherwise attackers can reflash device software!",
		settingsOnlyWhenOTADisabled: "Settings on this page can only be changed when OTA lock is disabled!",
		lockWiFiSettings: "Lock WiFi settings after lock",
		factoryReset: "Factory Reset",
		allSettingsWillBeCleared: "All settings and presets will be cleared.",
		unencryptedTransmissionWarning: "⚠ Unencrypted transmission. Attackers on the same network can intercept form data!",
		manualOTAUpdate: "Manual OTA Update",
		enableArduinoOTA: "Enable ArduinoOTA",
		onlyAllowSameNetwork: "Only allow updates from same network/WiFi",
		vlanWarning: "⚠ If you use multiple VLANs (i.e. IoT or guest network), set a PIN or disable this option.<br>Disabling this option will make your device less secure.",
		enableAutoCheck: "Enable automatic update check",
		autoInstallOnDiscovery: "Auto install when new version is discovered",
		checkInterval: "Check interval (milliseconds, minimum 3600000 = 1 hour)",
		githubRepoOwner: "GitHub Repository Owner",
		githubRepoName: "GitHub Repository Name",
		autoUpdateWarning: "⚠ Auto-update feature will periodically check for new versions from GitHub. Please ensure the repository address is correct.",
		autoUpdate: "Auto Update",
		backupAndRestore: "Backup & Restore",
		restoreWarning: "⚠ Restoring presets/config will overwrite your current presets/config.<br>Wrong upload or config may require factory reset or reflashing ESP.<br>For security reasons, passwords are not backed up.",
		backupPresets: "Backup Presets",
		restorePresets: "Restore Presets",
		backupConfig: "Backup Config",
		restoreConfig: "Restore Config",
		about: "About",
		version: "Version",
		contributors: "Contributors, Dependencies & Special Thanks",
		thankYou: "Thank you very much to everyone who helped me create WLED!",
		licensedUnder: "Licensed under",
		// 欢迎页面
		welcome: "Welcome to WLED!",
		thanksForInstalling: "Thank you for installing my application!",
		nextStep: "Next Step:",
		connectToWiFi: "Connect the module to your local WiFi here!",
		justTrying: "Just trying in AP mode?",
		goToControl: "Go to Control Interface!",
		// 更新页面
		softwareUpdate: "WLED Software Update",
		installedVersion: "Installed Version",
		releaseVersion: "Release Version",
		downloadLatest: "Download Latest Firmware",
		skipValidation: "Skip Firmware Validation",
		update: "Update!",
		revertUpdate: "Revert Update",
		revert: "Revert!",
		loading: "Loading...",
		updating: "Updating...",
		doNotClose: "Please do not close or refresh the page :)",
		bootloaderUpdate: "ESP32 Bootloader Update",
		currentBootloader: "Current Bootloader SHA256",
		warning: "Warning",
		onlyUploadVerified: "Only upload verified ESP32 bootloader files!",
		updateBootloader: "Update Bootloader",
		cannotGetDeviceInfo: "Cannot get device info",
		// 通用页面文本
		yes: "Yes",
		no: "No",
		ok: "OK",
		confirm: "Confirm",
		delete: "Delete",
		edit: "Edit",
		close: "Close",
		open: "Open",
		refresh: "Refresh",
		search: "Search",
		filter: "Filter",
		clear: "Clear",
		apply: "Apply",
		// 用户界面设置
		uiSettings: "User Interface Settings",
		showButtonLabels: "Show Button Labels",
		colorSelectionMethod: "Color Selection Method",
		colorWheel: "Color Wheel",
		rgbSliders: "RGB Sliders",
		quickColorPicker: "Quick Color Picker",
		hexColorInput: "HEX Color Input",
		showBottomBarInPCMode: "Show Bottom Bar in PC Mode",
		showPresetID: "Show Preset ID",
		setSegmentLength: "Set Segment Length Instead of Stop LED",
		hideSegmentPower: "Hide Segment Power and Brightness",
		alwaysExpandFirstSegment: "Always Expand First Segment",
		enableCustomCSS: "Enable Custom CSS",
		enableCustomHolidays: "Enable Custom Holiday List",
		useEffectDefaults: "Use Effect Default Parameters",
		powerButtonPresetOn: "Power Button Preset Override (On)",
		powerButtonPresetOff: "Power Button Preset Override (Off)",
		sortPresetsByID: "Sort Presets by ID",
		backgroundOpacity: "Background Opacity",
		buttonOpacity: "Button Opacity",
		backgroundImageURL: "Background Image URL",
		randomBackground: "Random Background Image",
		grayscale: "Grayscale",
		blur: "Blur",
		backgroundHEXColor: "Background HEX Color",
		serverDescription: "Server Description",
		enableSimplifiedUI: "Enable Simplified UI",
		uiCustomNote: "The following UI customization settings are unique to both the WLED device and this browser.<br>If you use a different browser, device, or WLED IP address, you will need to set them up again.<br>Refresh the main UI to apply changes.",
		uiAppearance: "UI Appearance",
		hateDarkMode: "I hate dark mode",
		why: "Why?",
		backgroundImage: "Background Image",
		remove: "Remove",
		randomBackgroundSettings: "Random Background Image Settings",
		customCSS: "Custom CSS",
		holidays: "Holidays",
		clearLocalStorage: "Clear Local Storage",
		localUISettingsSaved: "Local UI settings saved!",
		cannotAccessLocalStorage: "Cannot access local storage. Please make sure it is enabled in your browser.",
		settingsJSONParseFailed: "Settings JSON parse failed.",
		settingsJSONSaveFailed: "Settings JSON save failed.",
		cleared: "Cleared.",
		// WiFi设置
		wifiSettingsTitle: "WiFi Settings",
		connectToNetwork: "Connect to Existing Network",
		scan: "Scan",
		scanning: "Scanning...",
		wirelessNetworks: "Wireless Networks",
		otherNetwork: "Other Network...",
		saveAndConnect: "Save and Connect",
		dnsServerAddress: "DNS Server Address",
		mdnsAddress: "mDNS Address (leave empty to disable mDNS)",
		clientIP: "Client IP",
		notConnected: "Not Connected",
		configureAP: "Configure Access Point",
		apSSID: "Access Point SSID (leave empty to disable AP)",
		hideAPName: "Hide AP Name",
		apPassword: "AP Password (leave empty for open network)",
		apWiFiChannel: "Access Point WiFi Channel",
		apStartCondition: "AP Start Condition",
		apStartNoConnection: "When no connection after startup",
		apStartDisconnected: "When disconnected",
		apStartAlways: "Always on",
		apStartNever: "Never (not recommended)",
		apStartTemporary: "Temporary (when no connection after startup)",
		apIP: "AP IP",
		notActivated: "Not Activated",
		experimentalFeatures: "Experimental Features",
		force80211g: "Force 802.11g Mode (ESP8266 only)",
		disableWiFiSleep: "Disable WiFi Sleep",
		transmitPower: "Transmit Power",
		networkName: "Network Name (SSID",
		leaveEmptyToDisconnect: ", leave empty to disconnect)",
		networkPassword: "Network Password",
		bssidOptional: "BSSID (optional)",
		staticIP: "Static IP (keep 0.0.0.0 to use DHCP)",
		alsoForEthernet: "<br>Also for Ethernet",
		staticGateway: "Static Gateway",
		staticSubnetMask: "Static Subnet Mask",
		helpConnectionIssues: "Helps with connection issues and audio reactive sync.",
		disableWiFiSleepIncreases: "Disabling WiFi sleep increases power consumption.",
		transmitPowerWarning: "Warning: Modifying transmit power may make the device inaccessible.",
		espnowWireless: "ESP-NOW Wireless",
		firmwareNoESPNOW: "This firmware version does not include ESP-NOW support.",
		enableESPNOW: "Enable ESP-NOW",
		listenViaESPNOW: "Listen for events via ESP-NOW",
		keepDisabledIfNotUsed: "If you don't use remotes or ESP-NOW sync, keep disabled, increases power consumption.",
		lastSeenDevice: "Last seen device",
		none: "None",
		linkedMACAddresses: "Linked MAC addresses (max 10)",
		ethernetType: "Ethernet Type",
		// LED设置
		ledSettingsTitle: "LED Preferences",
		// 时间设置
		timeSettingsTitle: "Time Settings",
		getTimeFromNTP: "Get Time from NTP Server",
		use24HourFormat: "Use 24-Hour Format",
		timezone: "Timezone",
		utcOffset: "UTC Offset",
		seconds: "seconds",
		max18Hours: "(max 18 hours)",
		currentLocalTime: "Current Local Time",
		latitude: "Latitude",
		longitude: "Longitude",
		north: "North",
		south: "South",
		east: "East",
		west: "West",
		getLocation: "Get Location",
		opensInNewTab: "(Opens in new tab, browser only)",
		clock: "Clock",
		analogClockOverlay: "Analog Clock Overlay",
		startLED: "Start LED",
		endLED: "End LED",
		twelveOClockLED: "12 O'Clock LED",
		show5MinuteMarks: "Show 5-Minute Marks",
		secondHand: "Second Hand (trail effect)",
		onlyShowWhenBlack: "Only show clock overlay when all LEDs are pure black",
		countdownMode: "Countdown Mode",
		countdownTarget: "Countdown Target",
		date: "Date",
		time: "Time",
		macroPresets: "Macro Presets",
		macrosMigrated: "Macros Migrated!",
		presetsAsMacros: "Presets can now also be used as macros to save JSON and HTTP API commands.",
		justEnterPresetID: "Just enter the preset ID below!",
		use0ForDefault: "Use 0 for default action instead of preset",
		alexaOnOffPresets: "Alexa On/Off Presets",
		countdownEndPreset: "Countdown End Preset",
		nightlightEndPreset: "Nightlight End Preset",
		buttonActions: "Button Actions",
		pressSwitch: "Press Switch",
		shortPress: "Short Press",
		longPress: "Long Press",
		doubleClick: "Double Click",
		timeControlledPresets: "Time Controlled Presets",
		analogButtonSettings: "Analog Button Settings",
		// 时间设置额外
		enable: "Enable",
		hour: "Hour",
		minute: "Minute",
		runOnWeekdays: "Run on weekdays",
		from: "From",
		to: "To",
		sunrise: "Sunrise",
		sunset: "Sunset",
		monday: "Mon",
		tuesday: "Tue",
		wednesday: "Wed",
		thursday: "Thu",
		friday: "Fri",
		saturday: "Sat",
		sunday: "Sun",
		button: "Button",
		january: "January",
		february: "February",
		march: "March",
		april: "April",
		may: "May",
		june: "June",
		july: "July",
		august: "August",
		september: "September",
		october: "October",
		november: "November",
		december: "December",
		// 2D设置
		config2DTitle: "2D Configuration",
		matrixSize: "Matrix Size (width*height=LED count)",
		ledPanelLayout: "LED Panel Layout",
		panel: "Panel",
		firstLED: "First LED",
		top: "Top",
		bottom: "Bottom",
		left: "Left",
		right: "Right",
		direction: "Direction",
		horizontal: "Horizontal",
		vertical: "Vertical",
		snake: "Snake",
		size: "Size",
		width: "Width",
		height: "Height",
		offsetX: "Offset X",
		offsetY: "Offset Y",
		// 2D设置额外
		stripOrPanel: "Strip or Panel",
		ledStrip1D: "1D LED Strip",
		matrix2D: "2D Matrix",
		matrixGenerator: "Matrix Generator",
		panelSize: "Panel Size (width x height)",
		horizontalPanels: "Horizontal Panels",
		verticalPanels: "Vertical Panels",
		firstPanel: "First Panel",
		fill: "Fill",
		matrixGeneratorWarning: "Pressing \"Fill\" will create a pre-arranged matrix LED panel layout.<br>The values above will <i>not</i> affect the final layout.<br>Warning: You may need to update each panel's parameters after generation.",
		panelSettings: "Panel Settings",
		panelCount: "Panel Count",
		panelDescription: "Matrix consists of 1 or more physical LED panels.<br>Each panel can have different size and/or different LED direction and/or starting point and/or layout.",
		gapFile: "Gap File",
		upload: "Upload",
		gapFileNote: "Note: Gap file is a <b>.json</b> file containing an array with element count equal to matrix size.<br>Value -1 means pixel missing at that position, value 0 means never draw that pixel, value 1 means regular pixel.",
		offsetYLabel: "Y",
		offsetDescription: "(LED count offset from top-left corner)",
		// 同步设置
		wledBroadcast: "WLED Broadcast",
		udpPort: "UDP Port",
		secondPort: "Second Port",
		useESPNOW: "Use ESP-NOW Sync",
		inAPMode: "(in AP mode or without WiFi)",
		espnowDisabled: "ESP-NOW support is disabled.",
		syncGroup: "Sync Group",
		send: "Send",
		receive: "Receive",
		brightness: "Brightness",
		color: "Color",
		effect: "Effect",
		palette: "Palette",
		and: "and",
		segmentOptions: "Segment Options",
		boundary: "Boundary",
		enableSyncOnStart: "Enable sync on startup",
		sendNotificationOnDirectChange: "Send notification on direct change",
		sendNotificationOnButton: "Send notification on button press or IR",
		sendAlexaNotification: "Send Alexa notification",
		sendHueNotification: "Send Philips Hue change notification",
		udpPacketRetransmission: "UDP packet retransmission",
		requireRestart: "Restart required to apply changes.",
		instanceList: "Instance List",
		enableInstanceList: "Enable instance list",
		makeInstanceDiscoverable: "Make this instance discoverable",
		realtime: "Realtime",
		receiveUDPRealtime: "Receive UDP realtime data",
		useMainSegmentOnly: "Use main segment only",
		followLEDMapping: "Follow LED mapping",
		networkDMXInput: "Network DMX Input",
		type: "Type",
		customPort: "Custom Port",
		port: "Port",
		multicast: "Multicast",
		startUniverse: "Start Universe",
		skipOutOfOrderPackets: "Skip out-of-order packets",
		dmxStartAddress: "DMX Start Address",
		dmxSegmentSpacing: "DMX Segment Spacing",
		e131PortPriority: "E1.31 Port Priority",
		dmxMode: "DMX Mode",
		singleRGB: "Single RGB",
		singleDRGB: "Single DRGB",
		effectMode: "Effect",
		effectPlusWhite: "Effect + White",
		effectSegment: "Effect Segment",
		effectSegmentPlusWhite: "Effect Segment + White",
		multiRGB: "Multi RGB",
		dimmerPlusMultiRGB: "Dimmer + Multi RGB",
		multiRGBW: "Multi RGBW",
		preset: "Preset",
		timeout: "Timeout",
		milliseconds: "milliseconds",
		forceMaxBrightness: "Force max brightness",
		disableRealtimeGamma: "Disable realtime gamma correction",
		realtimeLEDOffset: "Realtime LED offset",
		wiredDMXInputPins: "Wired DMX Input Pins",
		dmxRX: "DMX RX",
		dmxTX: "DMX TX",
		dmxEnable: "DMX Enable",
		dmxPort: "DMX Port",
		firmwareNoDMXInput: "This firmware version does not include DMX input support.",
		firmwareNoDMXOutput: "This firmware version does not include DMX output support.",
		alexaVoiceAssistant: "Alexa Voice Assistant",
		firmwareNoAlexa: "This firmware version does not include Alexa support.",
		simulateAlexaDevice: "Simulate Alexa device",
		alexaInvocationName: "Alexa invocation name",
		simulateDevicesForPresets: "Also simulate devices for first",
		presets: "presets",
		mqttHueWarning: "⚠ MQTT and Hue sync both connect to external hosts!<br>This may affect WLED responsiveness.",
		bestResults: "For best results, use only one of these services at a time.",
		orConnectSecondESP: "(Or, connect a second ESP to them and use UDP sync)",
		mqtt: "MQTT",
		firmwareNoMQTT: "This firmware version does not include MQTT support.",
		enableMQTT: "Enable MQTT",
		broker: "Broker",
		mqttCredentialsWarning: "MQTT credentials are sent over insecure connection.<br>Never use MQTT password for other services!",
		username: "Username",
		password: "Password",
		clientID: "Client ID",
		deviceTopic: "Device Topic",
		groupTopic: "Group Topic",
		publishOnButtonPress: "Publish on button press",
		retainBrightnessColorMessages: "Retain brightness and color messages",
		mqttInfo: "MQTT Info",
		philipsHue: "Philips Hue",
		firmwareNoHue: "This firmware version does not include Philips Hue support.",
		findBridgeIP: "You can find bridge IP and light number in the \"About\" section of the hue app.",
		pollHueLights: "Poll Hue light",
		every: "every",
		receiveOnOff: "on/off",
		receiveBrightness: "brightness",
		receiveColor: "color",
		hueBridgeIP: "Hue Bridge IP",
		pressPushlinkButton: "Press the pushlink button on the bridge, then save this page!",
		firstTimeConnection: "(First time connection)",
		hueStatus: "Hue Status",
		disabledInThisVersion: "Disabled in this version",
		serial: "Serial",
		firmwareNoSerial: "This firmware version does not support Serial interface.",
		baudRate: "Baud Rate",
		keepForImprov: "Keep 115200 to use Improv. Some boards may not support high rates.",
		// 用户模块设置
		globalI2CGPIO: "Global I²C GPIO (Hardware)",
		changesRequireRestart: "(Changes require restart!)",
		globalSPIGPIO: "Global SPI GPIO (Hardware)",
		esp32Only: "(ESP32 only, changes require restart!)",
		restartAfterSave: "Restart after save?",
		loadingSettings: "Loading Settings...",
		noUsermodConfig: "No usermod configuration found.",
		pressSaveToInit: "Press <i>Save</i> to initialize default values.",
		noUsermodsInstalled: "No usermods installed.",
		configSaved: "Configuration saved!",
		cannotLoadConfig: "Cannot load configuration.",
		loadingConfig: "Loading configuration...",
		configLoaded: "Configuration loaded",
		loadFailed: "Load failed",
		saving: "Saving...",
		saveSuccess: "Save successful!",
		saveFailed: "Save failed",
		// 文件编辑器
		fileEditor: "WLED File Editor",
		// 消息页面
		message: "WLED Message",
		exampleMessage: "Example message.",
		exampleDetails: "Example details.",
		// 404页面
		notFound: "Not Found",
		notFound404: "404 Not Found",
		akemiDoesntKnow: "Akemi doesn't know where you want to go...",
		returnToControl: "Return to Control Interface",
		// PIN码页面
		pinRequired: "PIN Required",
		enterPin: "Please enter the settings PIN",
		submit: "Submit",
		// DMX映射
		dmxMap: "DMX Map",
		setTo0: "Set to 0",
		red: "Red",
		green: "Green",
		blue: "Blue",
		white: "White",
		shutter: "Shutter",
		setTo255: "Set to 255",
		disabled: "Disabled",
		// 自定义调色板
		customPaletteEditor: "WLED Custom Palette Editor",
		// 文件编辑器按钮
		uploadFile: "Upload File",
		clear: "Clear",
		returnToControl: "Return to Control",
		download: "Download",
		delete: "Delete",
		uploadSuccess: "Upload successful!",
		deleteConfirm: "Delete",
		error: "Error",
		// 自定义调色板编辑器
		customPalette: "Custom Palette",
		warningManyPalettes: "Warning: Adding many custom palettes may cause stability issues, please create a",
		backup: "backup",
		first: "first.",
		clickGradientToAdd: "Click gradient to add. Box = color. Red = delete. Arrow = upload. Pencil = edit.",
		paletteCacheMissing: "Palette cache missing from browser. Please return to main page first.",
		missingCache: "Missing Cache!",
		staticPalette: "Static Palette",
		// 像素艺术转换器
		pixelArtConverter: "WLED Pixel Art Converter",
		convertImageToWLED: "Convert image to WLED JSON (pixel art on WLED matrix)",
		ledSetup: "LED Setup:",
		matrix2D: "2D Matrix",
		snakeR2L: "Snake, first row right to left <-",
		snakeL2R: "Snake, first row left to right ->",
		outputFormat: "Output Format:",
		// 像素魔法工具
		pixelMagicTool: "Pixel Magic Tool",
		// 实时预览2D
		livePreview2D: "WLED Live Preview"
	},
	zh: {
		// 设置主页面
		back: "返回",
		wifiSettings: "WiFi 设置",
		ledPreferences: "LED 偏好设置",
		config2D: "2D 配置",
		userInterface: "用户界面",
		dmxOutput: "DMX 输出",
		syncInterface: "同步接口",
		timeAndMacros: "时间与宏",
		usermods: "用户模块",
		securityAndUpdate: "安全与更新",
		// 通用
		save: "保存",
		cancel: "取消",
		reset: "重置",
		enabled: "启用",
		disabled: "禁用",
		// 安全与更新
		securityAndUpdateTitle: "安全与更新设置",
		checkUpdate: "立即检查更新",
		checkingUpdate: "正在检查更新...",
		updateStatus: "状态",
		currentVersion: "当前版本",
		latestVersion: "最新版本",
		updateAvailable: "有更新可用",
		upToDate: "已是最新版本",
		unknown: "未知",
		checkTimeout: "检查超时，请稍后重试",
		setPIN: "设置PIN码",
		enter4DigitPIN: "请输入4位数字",
		unencryptedTransmission: "⚠ 未加密传输。选择PIN码时请谨慎，不要使用您的银行、门禁、SIM卡等PIN码！",
		lockOTA: "锁定无线(OTA)软件更新",
		passphrase: "密码短语",
		enableOTANote: "要启用OTA，出于安全原因，您还需要输入正确的密码！",
		changePasswordOnOTA: "启用OTA时应更改密码。",
		disableOTANote: "不使用时请禁用OTA，否则攻击者可以重新刷写设备软件！",
		settingsOnlyWhenOTADisabled: "此页面上的设置仅在OTA锁定禁用时才能更改！",
		lockWiFiSettings: "锁定后拒绝访问WiFi设置",
		factoryReset: "恢复出厂设置",
		allSettingsWillBeCleared: "所有设置和预设将被清除。",
		unencryptedTransmissionWarning: "⚠ 未加密传输。同一网络上的攻击者可以拦截表单数据！",
		manualOTAUpdate: "手动OTA更新",
		enableArduinoOTA: "启用ArduinoOTA",
		onlyAllowSameNetwork: "仅允许从同一网络/WiFi更新",
		vlanWarning: "⚠ 如果您使用多个VLAN（即IoT或访客网络），请设置PIN码或禁用此选项。<br>禁用此选项将使您的设备安全性降低。",
		enableAutoCheck: "启用自动检查更新",
		autoInstallOnDiscovery: "发现新版本时自动安装",
		checkInterval: "检查间隔（毫秒，最小3600000=1小时）",
		githubRepoOwner: "GitHub仓库所有者",
		githubRepoName: "GitHub仓库名称",
		autoUpdateWarning: "⚠ 自动更新功能会定期从GitHub检查新版本。请确保仓库地址正确。",
		autoUpdate: "自动更新",
		backupAndRestore: "备份与恢复",
		restoreWarning: "⚠ 恢复预设/配置将覆盖您当前的预设/配置。<br>错误的上传或配置可能需要恢复出厂设置或重新刷写ESP。<br>出于安全原因，密码不会被备份。",
		backupPresets: "备份预设",
		restorePresets: "恢复预设",
		backupConfig: "备份配置",
		restoreConfig: "恢复配置",
		about: "关于",
		version: "版本",
		contributors: "贡献者、依赖项和特别感谢",
		thankYou: "非常感谢所有帮助我创建WLED的人！",
		licensedUnder: "根据",
		// 欢迎页面
		welcome: "欢迎使用WLED！",
		thanksForInstalling: "感谢您安装我的应用程序！",
		nextStep: "下一步：",
		connectToWiFi: "在此将模块连接到您的本地WiFi！",
		justTrying: "只是在AP模式下试用？",
		goToControl: "前往控制界面！",
		// 更新页面
		softwareUpdate: "WLED 软件更新",
		installedVersion: "已安装版本",
		releaseVersion: "发布版本",
		downloadLatest: "下载最新固件",
		skipValidation: "忽略固件验证",
		update: "更新！",
		revertUpdate: "撤销更新",
		revert: "撤销！",
		loading: "正在加载...",
		updating: "正在更新...",
		doNotClose: "请不要关闭或刷新页面 :)",
		bootloaderUpdate: "ESP32 引导程序更新",
		currentBootloader: "当前引导程序 SHA256",
		warning: "警告",
		onlyUploadVerified: "仅上传已验证的ESP32引导程序文件！",
		updateBootloader: "更新引导程序",
		cannotGetDeviceInfo: "无法获取设备信息",
		// 通用页面文本
		yes: "是",
		no: "否",
		ok: "确定",
		confirm: "确认",
		delete: "删除",
		edit: "编辑",
		close: "关闭",
		open: "打开",
		refresh: "刷新",
		search: "搜索",
		filter: "筛选",
		clear: "清除",
		apply: "应用",
		// 用户界面设置
		uiSettings: "用户界面设置",
		showButtonLabels: "显示按钮标签",
		colorSelectionMethod: "颜色选择方法",
		colorWheel: "颜色轮",
		rgbSliders: "RGB滑块",
		quickColorPicker: "快速颜色选择器",
		hexColorInput: "HEX颜色输入",
		showBottomBarInPCMode: "在PC模式下显示底部标签栏",
		showPresetID: "显示预设ID",
		setSegmentLength: "设置段长度而不是停止LED",
		hideSegmentPower: "隐藏段功率和亮度",
		alwaysExpandFirstSegment: "始终展开第一段",
		enableCustomCSS: "启用自定义CSS",
		enableCustomHolidays: "启用自定义节假日列表",
		useEffectDefaults: "使用效果默认参数",
		powerButtonPresetOn: "电源按钮预设覆盖(开启)",
		powerButtonPresetOff: "电源按钮预设覆盖(关闭)",
		sortPresetsByID: "按ID排序预设",
		backgroundOpacity: "背景不透明度",
		buttonOpacity: "按钮不透明度",
		backgroundImageURL: "背景图片URL",
		randomBackground: "随机背景图片",
		grayscale: "灰度",
		blur: "模糊",
		backgroundHEXColor: "背景HEX颜色",
		serverDescription: "服务器描述",
		enableSimplifiedUI: "启用简化UI",
		uiCustomNote: "以下UI自定义设置对于WLED设备和此浏览器都是唯一的。<br>如果使用不同的浏览器、设备或WLED IP地址，您需要重新设置它们。<br>刷新主UI以应用更改。",
		uiAppearance: "UI外观",
		hateDarkMode: "我讨厌暗色模式",
		why: "为什么？",
		backgroundImage: "背景图片",
		remove: "移除",
		randomBackgroundSettings: "随机背景图片设置",
		customCSS: "自定义CSS",
		holidays: "节假日",
		clearLocalStorage: "清除本地存储",
		localUISettingsSaved: "本地UI设置已保存！",
		cannotAccessLocalStorage: "无法访问本地存储。请确保在浏览器中启用了它。",
		settingsJSONParseFailed: "设置JSON解析失败。",
		settingsJSONSaveFailed: "设置JSON保存失败。",
		cleared: "已清除。",
		// WiFi设置
		wifiSettingsTitle: "WiFi 设置",
		connectToNetwork: "连接到现有网络",
		scan: "扫描",
		scanning: "扫描中...",
		wirelessNetworks: "无线网络",
		otherNetwork: "其他网络...",
		saveAndConnect: "保存并连接",
		dnsServerAddress: "DNS服务器地址",
		mdnsAddress: "mDNS地址 (留空则不使用mDNS)",
		clientIP: "客户端IP",
		notConnected: "未连接",
		configureAP: "配置接入点",
		apSSID: "接入点SSID (留空则不启用AP)",
		hideAPName: "隐藏AP名称",
		apPassword: "AP密码 (留空则为开放网络)",
		apWiFiChannel: "接入点WiFi信道",
		apStartCondition: "AP开启条件",
		apStartNoConnection: "启动后无连接时",
		apStartDisconnected: "断开连接时",
		apStartAlways: "始终开启",
		apStartNever: "永不开启 (不推荐)",
		apStartTemporary: "临时 (启动后无连接时)",
		apIP: "AP IP",
		notActivated: "未激活",
		experimentalFeatures: "实验性功能",
		force80211g: "强制802.11g模式 (仅ESP8266)",
		disableWiFiSleep: "禁用WiFi休眠",
		transmitPower: "发射功率",
		networkName: "网络名称 (SSID",
		leaveEmptyToDisconnect: "，留空则不连接",
		networkPassword: "网络密码",
		bssidOptional: "BSSID (可选)",
		staticIP: "静态IP (保持0.0.0.0使用DHCP)",
		alsoForEthernet: "<br>也用于以太网",
		staticGateway: "静态网关",
		staticSubnetMask: "静态子网掩码",
		helpConnectionIssues: "有助于解决连接问题和音频反应同步。",
		disableWiFiSleepIncreases: "禁用WiFi休眠会增加功耗。",
		transmitPowerWarning: "警告: 修改发射功率可能导致设备无法访问。",
		espnowWireless: "ESP-NOW 无线",
		firmwareNoESPNOW: "此固件版本不包含ESP-NOW支持。",
		enableESPNOW: "启用ESP-NOW",
		listenViaESPNOW: "通过ESP-NOW监听事件",
		keepDisabledIfNotUsed: "如果不使用遥控器或ESP-NOW同步，请保持禁用，会增加功耗。",
		lastSeenDevice: "最后看到的设备",
		none: "无",
		linkedMACAddresses: "已链接MAC地址 (最多10个)",
		ethernetType: "以太网类型",
		// LED设置
		ledSettingsTitle: "LED 偏好设置",
		// 时间设置
		timeSettingsTitle: "时间设置",
		getTimeFromNTP: "从NTP服务器获取时间",
		use24HourFormat: "使用24小时格式",
		timezone: "时区",
		utcOffset: "UTC偏移",
		seconds: "秒",
		max18Hours: "(最多18小时)",
		currentLocalTime: "当前本地时间",
		latitude: "纬度",
		longitude: "经度",
		north: "北",
		south: "南",
		east: "东",
		west: "西",
		getLocation: "获取位置",
		opensInNewTab: "(在新标签页打开，仅在浏览器中有效)",
		clock: "时钟",
		analogClockOverlay: "模拟时钟叠加",
		startLED: "起始LED",
		endLED: "结束LED",
		twelveOClockLED: "12点LED",
		show5MinuteMarks: "显示5分钟标记",
		secondHand: "秒针(拖尾效果)",
		onlyShowWhenBlack: "仅在所有LED为纯黑色时显示时钟叠加",
		countdownMode: "倒计时模式",
		countdownTarget: "倒计时目标",
		date: "日期",
		time: "时间",
		macroPresets: "宏预设",
		macrosMigrated: "宏已迁移!",
		presetsAsMacros: "预设现在也可以用作宏来保存JSON和HTTP API命令。",
		justEnterPresetID: "只需在下面输入预设ID！",
		use0ForDefault: "使用0表示默认操作而不是预设",
		alexaOnOffPresets: "Alexa 开/关 预设",
		countdownEndPreset: "倒计时结束预设",
		nightlightEndPreset: "定时灯光结束预设",
		buttonActions: "按钮操作",
		pressSwitch: "按下开关",
		shortPress: "短按",
		longPress: "长按",
		doubleClick: "双击",
		timeControlledPresets: "时间控制预设",
		analogButtonSettings: "模拟按钮设置",
		// 时间设置额外
		enable: "启用",
		hour: "小时",
		minute: "分钟",
		runOnWeekdays: "在工作日运行",
		from: "从",
		to: "到",
		sunrise: "日出",
		sunset: "日落",
		monday: "一",
		tuesday: "二",
		wednesday: "三",
		thursday: "四",
		friday: "五",
		saturday: "六",
		sunday: "日",
		button: "按钮",
		january: "1月",
		february: "2月",
		march: "3月",
		april: "4月",
		may: "5月",
		june: "6月",
		july: "7月",
		august: "8月",
		september: "9月",
		october: "10月",
		november: "11月",
		december: "12月",
		// 2D设置
		config2DTitle: "2D 配置",
		matrixSize: "矩阵尺寸 (宽*高=LED数)",
		ledPanelLayout: "LED面板布局",
		panel: "面板",
		firstLED: "第一个LED",
		top: "顶部",
		bottom: "底部",
		left: "左侧",
		right: "右侧",
		direction: "方向",
		horizontal: "水平",
		vertical: "垂直",
		snake: "蛇形",
		size: "尺寸",
		width: "宽",
		height: "高",
		offsetX: "偏移 X",
		offsetY: "偏移 Y",
		// 2D设置额外
		stripOrPanel: "灯带或面板",
		ledStrip1D: "1D 灯带",
		matrix2D: "2D 矩阵",
		matrixGenerator: "矩阵生成器",
		panelSize: "面板尺寸 (宽x高)",
		horizontalPanels: "水平面板数",
		verticalPanels: "垂直面板数",
		firstPanel: "第一个面板",
		fill: "填充",
		matrixGeneratorWarning: "按\"填充\"将创建预排列矩阵的LED面板布局。<br>上面的值<i>不会</i>影响最终布局。<br>警告: 生成后您可能需要更新每个面板的参数。",
		panelSettings: "面板设置",
		panelCount: "面板数量",
		panelDescription: "矩阵由1个或多个物理LED面板组成。<br>每个面板可以有不同的尺寸和/或不同的LED方向和/或起始点和/或布局。",
		gapFile: "间隙文件",
		upload: "上传",
		gapFileNote: "注意: 间隙文件是一个<b>.json</b>文件，包含一个元素数量等于矩阵大小的数组。<br>值-1表示该位置的像素缺失，值0表示永远不绘制该像素，值1表示常规像素。",
		offsetYLabel: "Y",
		offsetDescription: "(从左上角开始的LED数量偏移)",
		// 同步设置
		wledBroadcast: "WLED 广播",
		udpPort: "UDP端口",
		secondPort: "第二端口",
		useESPNOW: "使用ESP-NOW同步",
		inAPMode: "(在AP模式或无WiFi时)",
		espnowDisabled: "ESP-NOW支持已禁用。",
		syncGroup: "同步组",
		send: "发送",
		receive: "接收",
		brightness: "亮度",
		color: "颜色",
		effect: "效果",
		palette: "调色板",
		and: "和",
		segmentOptions: "段选项",
		boundary: "边界",
		enableSyncOnStart: "启动时启用同步",
		sendNotificationOnDirectChange: "直接更改时发送通知",
		sendNotificationOnButton: "按钮按下或红外时发送通知",
		sendAlexaNotification: "发送Alexa通知",
		sendHueNotification: "发送Philips Hue更改通知",
		udpPacketRetransmission: "UDP数据包重传",
		requireRestart: "需要重启以应用更改。",
		instanceList: "实例列表",
		enableInstanceList: "启用实例列表",
		makeInstanceDiscoverable: "使此实例可被发现",
		realtime: "实时",
		receiveUDPRealtime: "接收UDP实时数据",
		useMainSegmentOnly: "仅使用主段",
		followLEDMapping: "遵循LED映射",
		networkDMXInput: "网络DMX输入",
		type: "类型",
		customPort: "自定义端口",
		port: "端口",
		multicast: "组播",
		startUniverse: "起始宇宙",
		skipOutOfOrderPackets: "跳过乱序数据包",
		dmxStartAddress: "DMX起始地址",
		dmxSegmentSpacing: "DMX段间距",
		e131PortPriority: "E1.31端口优先级",
		dmxMode: "DMX模式",
		singleRGB: "单RGB",
		singleDRGB: "单DRGB",
		effectMode: "效果",
		effectPlusWhite: "效果 + 白色",
		effectSegment: "效果段",
		effectSegmentPlusWhite: "效果段 + 白色",
		multiRGB: "多RGB",
		dimmerPlusMultiRGB: "调光器 + 多RGB",
		multiRGBW: "多RGBW",
		preset: "预设",
		timeout: "超时",
		milliseconds: "毫秒",
		forceMaxBrightness: "强制最大亮度",
		disableRealtimeGamma: "禁用实时gamma校正",
		realtimeLEDOffset: "实时LED偏移",
		wiredDMXInputPins: "有线DMX输入引脚",
		dmxRX: "DMX RX",
		dmxTX: "DMX TX",
		dmxEnable: "DMX使能",
		dmxPort: "DMX端口",
		firmwareNoDMXInput: "此固件版本不包含DMX输入支持。",
		firmwareNoDMXOutput: "此固件版本不包含DMX输出支持。",
		alexaVoiceAssistant: "Alexa语音助手",
		firmwareNoAlexa: "此固件版本不包含Alexa支持。",
		simulateAlexaDevice: "模拟Alexa设备",
		alexaInvocationName: "Alexa调用名称",
		simulateDevicesForPresets: "同时模拟设备以调用前",
		presets: "个预设",
		mqttHueWarning: "⚠ MQTT和Hue同步都连接到外部主机！<br>这可能会影响WLED的响应速度。",
		bestResults: "为获得最佳效果，请一次仅使用其中一项服务。",
		orConnectSecondESP: "(或者，将第二个ESP连接到它们并使用UDP同步)",
		mqtt: "MQTT",
		firmwareNoMQTT: "此固件版本不包含MQTT支持。",
		enableMQTT: "启用MQTT",
		broker: "代理",
		mqttCredentialsWarning: "MQTT凭据通过不安全连接发送。<br>永远不要将MQTT密码用于其他服务！",
		username: "用户名",
		password: "密码",
		clientID: "客户端ID",
		deviceTopic: "设备主题",
		groupTopic: "组主题",
		publishOnButtonPress: "按钮按下时发布",
		retainBrightnessColorMessages: "保留亮度和颜色消息",
		mqttInfo: "MQTT 信息",
		philipsHue: "Philips Hue",
		firmwareNoHue: "此固件版本不包含Philips Hue支持。",
		findBridgeIP: "您可以在hue应用的\"关于\"部分找到桥接器IP和灯光编号。",
		pollHueLights: "轮询Hue灯光",
		every: "每",
		receiveOnOff: "开/关",
		receiveBrightness: "亮度",
		receiveColor: "颜色",
		hueBridgeIP: "Hue桥接器IP",
		pressPushlinkButton: "按下桥接器上的pushlink按钮，然后保存此页面！",
		firstTimeConnection: "(首次连接时)",
		hueStatus: "Hue状态",
		disabledInThisVersion: "在此版本中已禁用",
		serial: "串口",
		firmwareNoSerial: "此固件版本不支持串口接口。",
		baudRate: "波特率",
		keepForImprov: "保持115200以使用Improv。某些板可能不支持高速率。",
		// 用户模块设置
		globalI2CGPIO: "全局 I²C GPIO (硬件)",
		changesRequireRestart: "(更改需要重启！)",
		globalSPIGPIO: "全局 SPI GPIO (硬件)",
		esp32Only: "(仅在ESP32上可更改，更改需要重启！)",
		restartAfterSave: "保存后重启？",
		loadingSettings: "正在加载设置...",
		noUsermodConfig: "未找到用户模块配置。",
		pressSaveToInit: "按<i>保存</i>以初始化默认值。",
		noUsermodsInstalled: "未安装用户模块。",
		configSaved: "配置已保存！",
		cannotLoadConfig: "无法加载配置。",
		loadingConfig: "正在加载配置...",
		configLoaded: "配置已加载",
		loadFailed: "加载失败",
		saving: "正在保存...",
		saveSuccess: "保存成功！",
		saveFailed: "保存失败",
		// HA_Progress相关
		haEntity: "实体",
		haStatus: "状态",
		haError: "错误",
		haRunning: "运行中",
		haDisabled: "已禁用",
		// 文件编辑器
		fileEditor: "WLED 文件编辑器",
		// 消息页面
		message: "WLED 消息",
		exampleMessage: "示例消息。",
		exampleDetails: "示例详情。",
		// 404页面
		notFound: "未找到",
		notFound404: "404 未找到",
		akemiDoesntKnow: "Akemi不知道您要去哪里...",
		returnToControl: "返回控制界面",
		// PIN码页面
		pinRequired: "需要PIN码",
		enterPin: "请输入设置PIN码",
		submit: "提交",
		// DMX映射
		dmxMap: "DMX 映射",
		setTo0: "设置为0",
		red: "红色",
		green: "绿色",
		blue: "蓝色",
		white: "白色",
		shutter: "快门",
		setTo255: "设置为255",
		disabled: "已禁用",
		// 自定义调色板
		customPaletteEditor: "WLED 自定义调色板编辑器",
		// 文件编辑器按钮
		uploadFile: "上传文件",
		clear: "清除",
		returnToControl: "返回控制",
		download: "下载",
		delete: "删除",
		uploadSuccess: "上传成功！",
		deleteConfirm: "删除",
		error: "错误",
		// 自定义调色板编辑器
		customPalette: "自定义调色板",
		warningManyPalettes: "警告: 添加许多自定义调色板可能会导致稳定性问题，请先创建",
		backup: "备份",
		first: "。",
		clickGradientToAdd: "点击渐变添加。方框 = 颜色。红色 = 删除。箭头 = 上传。铅笔 = 编辑。",
		paletteCacheMissing: "调色板缓存从浏览器中丢失。请先返回主页面。",
		missingCache: "缺少缓存！",
		staticPalette: "静态调色板",
		// 像素艺术转换器
		pixelArtConverter: "WLED 像素艺术转换器",
		convertImageToWLED: "将图像转换为WLED JSON（WLED矩阵上的像素艺术）",
		ledSetup: "LED设置:",
		matrix2D: "2D 矩阵",
		snakeR2L: "蛇形，第一行从右到左 <-",
		snakeL2R: "蛇形，第一行从左到右 ->",
		outputFormat: "输出格式:",
		// 像素魔法工具
		pixelMagicTool: "像素魔法工具",
		// 实时预览2D
		livePreview2D: "WLED 实时预览"
	}
};

// 翻译函数
function t(key, defaultValue = '') {
	return i18n[currentLang] && i18n[currentLang][key] ? i18n[currentLang][key] : (i18n['en'][key] || defaultValue || key);
}

// 应用翻译到页面
function applyTranslations() {
	// 更新所有带有 data-i18n 属性的元素
	d.querySelectorAll('[data-i18n]').forEach(el => {
		const key = el.getAttribute('data-i18n');
		// 跳过语言切换按钮本身
		if (el.id === 'langToggle') return;
		// 跳过script、style、noscript等标签
		if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') return;
		// 跳过HTML、BODY、HEAD等关键标签
		if (el.tagName === 'HTML' || el.tagName === 'BODY' || el.tagName === 'HEAD' || el.tagName === 'FORM') return;
		// 确保元素在DOM中且有父节点，且不是根元素
		if (!el.parentNode || el === d.documentElement || el === d.body || el === d.head) return;
		// 确保不是form元素
		if (el.tagName === 'FORM') return;
		try {
			if (el.tagName === 'INPUT' && el.type === 'text' && el.hasAttribute('placeholder')) {
				el.placeholder = t(key);
			} else if (el.hasAttribute('title')) {
				el.title = t(key);
			} else if (el.tagName === 'OPTION') {
				el.textContent = t(key);
			} else {
				// 只更新文本内容，不替换整个元素
				el.textContent = t(key);
			}
		} catch (e) {
			console.error('Translation error for key:', key, 'element:', el.tagName, e);
		}
	});
	
	// 更新所有带有 data-i18n-title 属性的元素
	d.querySelectorAll('[data-i18n-title]').forEach(el => {
		const key = el.getAttribute('data-i18n-title');
		el.title = t(key);
	});
	
	// 更新所有select中的option（带有data-i18n属性）
	d.querySelectorAll('select option[data-i18n]').forEach(opt => {
		const key = opt.getAttribute('data-i18n');
		opt.textContent = t(key);
	});
	
	// 更新所有input的placeholder（带有data-i18n属性）
	d.querySelectorAll('input[data-i18n]').forEach(input => {
		const key = input.getAttribute('data-i18n');
		if (input.type === 'text' || input.type === 'number') {
			input.placeholder = t(key);
		}
	});
	
	// 更新title标签（带有data-i18n属性）
	var titleEl = d.querySelector('title[data-i18n]');
	if (titleEl) {
		const key = titleEl.getAttribute('data-i18n');
		titleEl.textContent = t(key);
	}
	
	// 更新HTML lang属性
	d.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
}

// 切换语言
// 初始化语言切换按钮
function initLangToggle() {
	var langToggle = d.getElementById('langToggle');
	if (langToggle) {
		langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
	}
}

function toggleLanguage() {
	// 防止重复调用
	if (d.body && d.body.classList && d.body.classList.contains('translating')) return;
	if (d.body && d.body.classList) d.body.classList.add('translating');
	
	currentLang = currentLang === 'zh' ? 'en' : 'zh';
	localStorage.setItem('wledLang', currentLang);
	
	try {
		applyTranslations();
		// 更新语言切换按钮文本
		initLangToggle();
	} catch (e) {
		console.error('Language toggle error:', e);
		// 恢复语言设置
		currentLang = currentLang === 'zh' ? 'en' : 'zh';
		localStorage.setItem('wledLang', currentLang);
	} finally {
		if (d.body && d.body.classList) d.body.classList.remove('translating');
	}
}

function H(pg="")   { window.open("https://kno.wled.ge/"+pg); }
function GH()       { window.open("https://github.com/wled-dev/WLED"); }
function gId(c)     { return d.getElementById(c); } // getElementById
function cE(e)      { return d.createElement(e); } // createElement
function gEBCN(c)   { return d.getElementsByClassName(c); } // getElementsByClassName
function gN(s)      { return d.getElementsByName(s)[0]; } // getElementsByName
function isE(o)     { return Object.keys(o).length === 0; } // isEmpty
function isO(i)     { return (i && typeof i === 'object' && !Array.isArray(i)); } // isObject
function isN(n)     { return !isNaN(parseFloat(n)) && isFinite(n); } // isNumber
// https://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer
function isF(n)     { return n === +n && n !== (n|0); } // isFloat
function isI(n)     { return n === +n && n === (n|0); } // isInteger
function toggle(el) { gId(el).classList.toggle("hide"); let n = gId('No'+el); if (n) n.classList.toggle("hide"); }
function tooltip(cont=null) {
	d.querySelectorAll((cont?cont+" ":"")+"[title]").forEach((element)=>{
		element.addEventListener("pointerover", ()=>{
			// save title
			element.setAttribute("data-title", element.getAttribute("title"));
			const tooltip = d.createElement("span");
			tooltip.className = "tooltip";
			tooltip.textContent = element.getAttribute("title");

			// prevent default title popup
			element.removeAttribute("title");

			let { top, left, width } = element.getBoundingClientRect();

			d.body.appendChild(tooltip);

			const { offsetHeight, offsetWidth } = tooltip;

			const offset = element.classList.contains("sliderwrap") ? 4 : 10;
			top -= offsetHeight + offset;
			left += (width - offsetWidth) / 2;

			tooltip.style.top = top + "px";
			tooltip.style.left = left + "px";
			tooltip.classList.add("visible");
		});

		element.addEventListener("pointerout", ()=>{
			d.querySelectorAll('.tooltip').forEach((tooltip)=>{
				tooltip.classList.remove("visible");
				d.body.removeChild(tooltip);
			});
			// restore title
			element.setAttribute("title", element.getAttribute("data-title"));
		});
	});
};
// https://www.educative.io/edpresso/how-to-dynamically-load-a-js-file-in-javascript
function loadJS(FILE_URL, async = true, preGetV = undefined, postGetV = undefined) {
	let scE = d.createElement("script");
	scE.setAttribute("src", FILE_URL);
	scE.setAttribute("type", "text/javascript");
	scE.setAttribute("async", async);
	d.body.appendChild(scE);
	// success event 
	scE.addEventListener("load", () => {
		//console.log("File loaded");
		if (preGetV) preGetV();
		GetV();
		if (postGetV) postGetV();
	});
	// error event
	scE.addEventListener("error", (ev) => {
		console.log("Error on loading file", ev);
		alert("Loading of configuration script failed.\nIncomplete page data!");
	});
}
function getLoc() {
	let l = window.location;
	if (l.protocol == "file:") {
		loc = true;
		locip = localStorage.getItem('locIp');
		if (!locip) {
			locip = prompt("File Mode. Please enter WLED IP!");
			localStorage.setItem('locIp', locip);
		}
	} else {
		// detect reverse proxy
		let path = l.pathname;
		let paths = path.slice(1,path.endsWith('/')?-1:undefined).split("/");
		if (paths.length > 1) paths.pop(); // remove subpage (or "settings")
		if (paths.length > 0 && paths[paths.length-1]=="settings") paths.pop(); // remove "settings"
		if (paths.length > 1) {
			locproto = l.protocol;
			loc = true;
			locip = l.hostname + (l.port ? ":" + l.port : "") + "/" + paths.join('/');
		}
	}
}
function getURL(path) { return (loc ? locproto + "//" + locip : "") + path; }
function B()          { window.open(getURL("/settings"),"_self"); }
var timeout;
function showToast(text, error = false) {
	var x = gId("toast");
	if (!x) return;
	x.innerHTML = text;
	x.className = error ? "error":"show";
	clearTimeout(timeout);
	x.style.animation = 'none';
	timeout = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2900);
}
function uploadFile(fileObj, name) {
	var req = new XMLHttpRequest();
	req.addEventListener('load', function(){showToast(this.responseText,this.status >= 400)});
	req.addEventListener('error', function(e){showToast(e.stack,true);});
	req.open("POST", "/upload");
	var formData = new FormData();
	formData.append("data", fileObj.files[0], name);
	req.send(formData);
	fileObj.value = '';
	return false;
}
// connect to WebSocket, use parent WS or open new
function connectWs(onOpen) {
	try {
		if (top.window.ws && top.window.ws.readyState === WebSocket.OPEN) {
			if (onOpen) onOpen();
			return top.window.ws;
		}
	} catch (e) {}

	getLoc(); // ensure globals (loc, locip, locproto) are up to date
	let url = loc ? getURL('/ws').replace("http","ws") : "ws://"+window.location.hostname+"/ws";
	let ws = new WebSocket(url);
	ws.binaryType = "arraybuffer";
	if (onOpen) { ws.onopen = onOpen; }
	try { top.window.ws = ws; } catch (e) {} // store in parent for reuse
	return ws;
}

// send LED colors to ESP using WebSocket and DDP protocol (RGB)
// ws: WebSocket object
// start: start pixel index
// len: number of pixels to send
// colors: Uint8Array with RGB values (3*len bytes)
function sendDDP(ws, start, len, colors) {
	if (!colors || colors.length < len * 3) return false; // not enough color data
	let maxDDPpx = 472; // must fit into one WebSocket frame of 1428 bytes, DDP header is 10+1 bytes -> 472 RGB pixels
	//let maxDDPpx = 172; // ESP8266: must fit into one WebSocket frame of 528 bytes -> 172 RGB pixels TODO: add support for ESP8266?
	if (!ws || ws.readyState !== WebSocket.OPEN) return false;
	// send in chunks of maxDDPpx
	for (let i = 0; i < len; i += maxDDPpx) {
		let cnt = Math.min(maxDDPpx, len - i);
		let off = (start + i) * 3; // DDP pixel offset in bytes
		let dLen = cnt * 3;
		let cOff = i * 3; // offset in color buffer
		let pkt = new Uint8Array(11 + dLen); // DDP header is 10 bytes, plus 1 byte for WLED websocket protocol indicator
		pkt[0] = 0x02; // DDP protocol indicator for WLED websocket. Note: below DDP protocol bytes are offset by 1
		pkt[1] = 0x40; // flags: 0x40 = no push, 0x41 = push (i.e. render), note: this is DDP protocol byte 0
		pkt[2] = 0x00; // reserved
		pkt[3] = 0x01; // 1 = RGB (currently only supported mode)
		pkt[4] = 0x01; // destination id (not used but 0x01 is default output)
		pkt[5] = (off >> 24) & 255; // DDP protocol 4-7 is offset
		pkt[6] = (off >> 16) & 255;
		pkt[7] = (off >> 8) & 255;
		pkt[8] = off & 255;
		pkt[9] = (dLen >> 8) & 255; // DDP protocol 8-9 is data length
		pkt[10] = dLen & 255;
		pkt.set(colors.subarray(cOff, cOff + dLen), 11);
		if(i + cnt >= len) {
			pkt[1] = 0x41;  //if this is last packet, set the "push" flag to render the frame
		}
		try {
			ws.send(pkt.buffer);
		} catch (e) {
			console.error(e);
			return false;
		}
	}
	return true;
}
