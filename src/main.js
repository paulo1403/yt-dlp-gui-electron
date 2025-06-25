const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const Store = require('electron-store');

// Initialize electron store for settings
const store = new Store();

let mainWindow;
let currentDownloadProcess = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'), // Add your icon
    show: false // Don't show until ready
  });

  // Load the app
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for communication with renderer process

// Handle yt-dlp download
ipcMain.handle('download-video', async (event, options) => {
  return new Promise((resolve, reject) => {
    const { 
      url, 
      outputPath, 
      format, 
      quality, 
      audioQuality, 
      audioFormat, 
      speedLimit,
      noPlaylist,
      playlistReverse,
      playlistRandom,
      playlistItems,
      writeSubs,
      writeAutoSubs,
      embedSubs,
      writeThumbnail,
      embedThumbnail,
      writeInfoJson,
      writeDescription,
      embedMetadata,
      sponsorblockMark,
      sponsorblockRemove,
      sponsorblockCategories,
      continueDl,
      noOverwrites,
      ignoreErrors
    } = options;
    
    // Build yt-dlp command arguments
    const args = [url];

    // Output path
    args.push('--output', path.join(outputPath, '%(title)s.%(ext)s'));

    // Format options
    if (format && format !== 'best') {
      if (format === 'audio') {
        args.push('--extract-audio', '--audio-format', audioFormat || 'mp3');
        
        // Audio quality
        if (audioQuality && audioQuality !== 'best') {
          args.push('--audio-quality', audioQuality);
        }
      } else {
        args.push('--remux-video', format);
      }
    }

    // Video quality
    if (quality && quality !== 'best' && format !== 'audio') {
      args.push('--format', `best[height<=${quality}]`);
    }

    // Speed limit
    if (speedLimit) {
      args.push('--limit-rate', speedLimit);
    }

    // Playlist options
    if (noPlaylist) {
      args.push('--no-playlist');
    }
    if (playlistReverse) {
      args.push('--playlist-reverse');
    }
    if (playlistRandom) {
      args.push('--playlist-random');
    }
    if (playlistItems) {
      args.push('--playlist-items', playlistItems);
    }

    // Subtitle options
    if (writeSubs) {
      args.push('--write-subs');
    }
    if (writeAutoSubs) {
      args.push('--write-auto-subs');
    }
    if (embedSubs) {
      args.push('--embed-subs');
    }

    // Metadata and extras
    if (writeThumbnail) {
      args.push('--write-thumbnail');
    }
    if (embedThumbnail) {
      args.push('--embed-thumbnail');
    }
    if (writeInfoJson) {
      args.push('--write-info-json');
    }
    if (writeDescription) {
      args.push('--write-description');
    }
    if (embedMetadata) {
      args.push('--embed-metadata');
    }

    // SponsorBlock options
    if (sponsorblockMark) {
      args.push('--sponsorblock-mark', sponsorblockCategories || 'sponsor');
    }
    if (sponsorblockRemove) {
      args.push('--sponsorblock-remove', sponsorblockCategories || 'sponsor');
    }

    // Download behavior
    if (continueDl) {
      args.push('--continue');
    } else {
      args.push('--no-continue');
    }
    if (noOverwrites) {
      args.push('--no-overwrites');
    }
    if (ignoreErrors) {
      args.push('--ignore-errors');
    }

    console.log('Running yt-dlp with args:', args);

    // Spawn yt-dlp process
    const ytdlp = spawn('yt-dlp', args);
    currentDownloadProcess = ytdlp;
    
    let output = '';
    let error = '';

    ytdlp.stdout.on('data', (data) => {
      const message = data.toString();
      output += message;
      // Send progress updates to renderer
      event.sender.send('download-progress', message);
    });

    ytdlp.stderr.on('data', (data) => {
      const message = data.toString();
      error += message;
      // Send error updates to renderer
      event.sender.send('download-error', message);
    });

    ytdlp.on('close', (code) => {
      currentDownloadProcess = null;
      if (code === 0) {
        resolve({ success: true, output });
      } else if (code === null || code === 130) {
        // Process was killed/cancelled
        reject({ success: false, error: 'Download stopped by user', code });
      } else {
        reject({ success: false, error, code });
      }
    });

    ytdlp.on('error', (err) => {
      currentDownloadProcess = null;
      reject({ success: false, error: err.message });
    });
  });
});

// Handle folder selection
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Handle opening folder in file manager
ipcMain.handle('open-folder', async (event, folderPath) => {
  shell.openPath(folderPath);
});

// Handle getting video info
ipcMain.handle('get-video-info', async (event, url) => {
  return new Promise((resolve, reject) => {
    const args = [
      url,
      '--dump-json',
      '--no-playlist'
    ];

    const ytdlp = spawn('yt-dlp', args);
    let output = '';
    let error = '';

    ytdlp.stdout.on('data', (data) => {
      output += data.toString();
    });

    ytdlp.stderr.on('data', (data) => {
      error += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(output);
          resolve(info);
        } catch (e) {
          reject({ error: 'Failed to parse video info' });
        }
      } else {
        reject({ error });
      }
    });

    ytdlp.on('error', (err) => {
      reject({ error: err.message });
    });
  });
});

// Handle stopping download
ipcMain.handle('stop-download', async () => {
  return new Promise((resolve, reject) => {
    if (currentDownloadProcess) {
      try {
        // Kill the yt-dlp process
        currentDownloadProcess.kill('SIGTERM');
        
        // Give it some time to terminate gracefully, then force kill if needed
        setTimeout(() => {
          if (currentDownloadProcess && !currentDownloadProcess.killed) {
            currentDownloadProcess.kill('SIGKILL');
          }
        }, 5000);
        
        resolve({ success: true });
      } catch (error) {
        reject({ success: false, error: error.message });
      }
    } else {
      resolve({ success: true, message: 'No download in progress' });
    }
  });
});

// Settings management
ipcMain.handle('get-settings', () => {
  return store.get('settings', {
    defaultOutputPath: '',
    defaultFormat: 'best',
    defaultQuality: 'best'
  });
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('settings', settings);
  return true;
});

// Check if yt-dlp is installed
ipcMain.handle('check-ytdlp', async () => {
  return new Promise((resolve) => {
    const ytdlp = spawn('yt-dlp', ['--version']);
    
    ytdlp.on('close', (code) => {
      resolve(code === 0);
    });

    ytdlp.on('error', () => {
      resolve(false);
    });
  });
});
