// DOM Elements
const urlInput = document.getElementById('url-input');
const getInfoBtn = document.getElementById('get-info-btn');
const videoInfoSection = document.getElementById('video-info');
const outputPathInput = document.getElementById('output-path');
const browseBtn = document.getElementById('browse-btn');
const openFolderBtn = document.getElementById('open-folder-btn');
const formatSelect = document.getElementById('format-select');
const qualitySelect = document.getElementById('quality-select');
const downloadBtn = document.getElementById('download-btn');
const progressSection = document.getElementById('progress-section');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const downloadLog = document.getElementById('download-log');
const statusMessage = document.getElementById('status-message');

// Settings modal elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const cancelSettingsBtn = document.getElementById('cancel-settings');
const defaultPathInput = document.getElementById('default-path');
const browseDefaultBtn = document.getElementById('browse-default-btn');
const defaultFormatSelect = document.getElementById('default-format');
const defaultQualitySelect = document.getElementById('default-quality');

// Video info elements
const videoThumbnail = document.getElementById('video-thumbnail');
const videoTitle = document.getElementById('video-title');
const videoDuration = document.getElementById('video-duration');
const videoUploader = document.getElementById('video-uploader');
const videoViews = document.getElementById('video-views');

// State
let currentVideoInfo = null;
let isDownloading = false;

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await checkYtdlpInstallation();
    await loadSettings();
    setupEventListeners();
    setupDownloadListeners();
});

// Check if yt-dlp is installed
async function checkYtdlpInstallation() {
    try {
        const isInstalled = await window.electronAPI.checkYtdlp();
        if (!isInstalled) {
            showStatus('yt-dlp is not installed. Please install yt-dlp to use this application.', 'error');
            downloadBtn.disabled = true;
        }
    } catch (error) {
        showStatus('Error checking yt-dlp installation.', 'error');
    }
}

// Load settings from storage
async function loadSettings() {
    try {
        const settings = await window.electronAPI.getSettings();
        
        if (settings.defaultOutputPath) {
            outputPathInput.value = settings.defaultOutputPath;
            openFolderBtn.style.display = 'inline-block';
        }
        
        formatSelect.value = settings.defaultFormat || 'best';
        qualitySelect.value = settings.defaultQuality || 'best';
        
        // Load into settings modal
        defaultPathInput.value = settings.defaultOutputPath || '';
        defaultFormatSelect.value = settings.defaultFormat || 'best';
        defaultQualitySelect.value = settings.defaultQuality || 'best';
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Save settings to storage
async function saveSettings() {
    try {
        const settings = {
            defaultOutputPath: defaultPathInput.value,
            defaultFormat: defaultFormatSelect.value,
            defaultQuality: defaultQualitySelect.value
        };
        
        await window.electronAPI.saveSettings(settings);
        
        // Update current form
        if (settings.defaultOutputPath && !outputPathInput.value) {
            outputPathInput.value = settings.defaultOutputPath;
            openFolderBtn.style.display = 'inline-block';
        }
        
        formatSelect.value = settings.defaultFormat;
        qualitySelect.value = settings.defaultQuality;
        
        showStatus('Settings saved successfully!', 'success');
        settingsModal.style.display = 'none';
        
    } catch (error) {
        showStatus('Error saving settings.', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // URL input and get info
    getInfoBtn.addEventListener('click', getVideoInfo);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            getVideoInfo();
        }
    });
    
    // Browse for output folder
    browseBtn.addEventListener('click', selectOutputFolder);
    openFolderBtn.addEventListener('click', openOutputFolder);
    
    // Download button
    downloadBtn.addEventListener('click', startDownload);
    
    // Settings modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });
    
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    cancelSettingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    browseDefaultBtn.addEventListener('click', async () => {
        const folderPath = await window.electronAPI.selectFolder();
        if (folderPath) {
            defaultPathInput.value = folderPath;
        }
    });
    
    // Close modal when clicking outside
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // Enable download button when URL and path are set
    const checkDownloadReady = () => {
        downloadBtn.disabled = !urlInput.value.trim() || !outputPathInput.value.trim() || isDownloading;
    };
    
    urlInput.addEventListener('input', checkDownloadReady);
    outputPathInput.addEventListener('change', checkDownloadReady);
}

// Setup download progress listeners
function setupDownloadListeners() {
    window.electronAPI.onDownloadProgress((data) => {
        updateDownloadProgress(data);
        appendToLog(data);
    });
    
    window.electronAPI.onDownloadError((data) => {
        appendToLog(data, 'error');
    });
}

// Get video information
async function getVideoInfo() {
    const url = urlInput.value.trim();
    if (!url) {
        showStatus('Please enter a video URL.', 'error');
        return;
    }
    
    getInfoBtn.disabled = true;
    getInfoBtn.innerHTML = '<div class="spinner"></div> Getting Info...';
    
    try {
        currentVideoInfo = await window.electronAPI.getVideoInfo(url);
        displayVideoInfo(currentVideoInfo);
        showStatus('Video information loaded successfully!', 'success');
    } catch (error) {
        showStatus('Error getting video information. Please check the URL.', 'error');
        videoInfoSection.style.display = 'none';
    } finally {
        getInfoBtn.disabled = false;
        getInfoBtn.innerHTML = 'Get Info';
    }
}

// Display video information
function displayVideoInfo(info) {
    videoThumbnail.src = info.thumbnail || '';
    videoTitle.textContent = info.title || 'Unknown Title';
    videoDuration.textContent = formatDuration(info.duration) || 'Unknown';
    videoUploader.textContent = info.uploader || 'Unknown';
    videoViews.textContent = formatNumber(info.view_count) || 'Unknown';
    
    videoInfoSection.style.display = 'block';
}

// Select output folder
async function selectOutputFolder() {
    const folderPath = await window.electronAPI.selectFolder();
    if (folderPath) {
        outputPathInput.value = folderPath;
        openFolderBtn.style.display = 'inline-block';
        
        // Check if download button should be enabled
        downloadBtn.disabled = !urlInput.value.trim() || !outputPathInput.value.trim() || isDownloading;
    }
}

// Open output folder
async function openOutputFolder() {
    const folderPath = outputPathInput.value;
    if (folderPath) {
        await window.electronAPI.openFolder(folderPath);
    }
}

// Start download
async function startDownload() {
    const url = urlInput.value.trim();
    const outputPath = outputPathInput.value.trim();
    const format = formatSelect.value;
    const quality = qualitySelect.value;
    
    if (!url || !outputPath) {
        showStatus('Please enter a URL and select an output folder.', 'error');
        return;
    }
    
    isDownloading = true;
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<div class="spinner"></div> Downloading...';
    
    progressSection.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Starting download...';
    downloadLog.textContent = '';
    
    try {
        const options = {
            url,
            outputPath,
            format,
            quality
        };
        
        const result = await window.electronAPI.downloadVideo(options);
        
        if (result.success) {
            progressFill.style.width = '100%';
            progressText.textContent = 'Download completed successfully!';
            showStatus('Download completed successfully!', 'success');
        }
        
    } catch (error) {
        progressText.textContent = 'Download failed!';
        showStatus(`Download failed: ${error.error || 'Unknown error'}`, 'error');
    } finally {
        isDownloading = false;
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = 'Download';
    }
}

// Update download progress
function updateDownloadProgress(data) {
    const progressMatch = data.match(/(\d+(?:\.\d+)?)%/);
    if (progressMatch) {
        const percentage = parseFloat(progressMatch[1]);
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Downloading... ${percentage}%`;
    }
    
    // Check for completion indicators
    if (data.includes('100%') || data.includes('finished')) {
        progressFill.style.width = '100%';
        progressText.textContent = 'Processing...';
    }
}

// Append to download log
function appendToLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}\n`;
    downloadLog.textContent += logEntry;
    downloadLog.scrollTop = downloadLog.scrollHeight;
}

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 5000);
    }
}

// Utility functions
function formatDuration(seconds) {
    if (!seconds) return 'Unknown';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

function formatNumber(num) {
    if (!num) return 'Unknown';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return num.toString();
    }
}
