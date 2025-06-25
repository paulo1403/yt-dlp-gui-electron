const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const Store = require('electron-store');

// Initialize electron store for settings
const store = new Store();

let mainWindow;

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
    const { url, outputPath, format, quality } = options;
    
    // Build yt-dlp command arguments
    const args = [
      url,
      '--output', path.join(outputPath, '%(title)s.%(ext)s')
    ];

    // Add format options if specified
    if (format && format !== 'best') {
      if (format === 'audio') {
        args.push('--extract-audio', '--audio-format', 'mp3');
      } else {
        args.push('--format', format);
      }
    }

    // Add quality options if specified
    if (quality && quality !== 'best') {
      args.push('--format', `best[height<=${quality}]`);
    }

    // Add additional useful options
    args.push(
      '--no-playlist', // Download single video even if URL contains playlist
      '--write-info-json', // Write video metadata
      '--write-thumbnail', // Download thumbnail
      '--embed-subs', // Embed subtitles if available
      '--write-auto-sub' // Write auto-generated subtitles
    );

    console.log('Running yt-dlp with args:', args);

    // Spawn yt-dlp process
    const ytdlp = spawn('yt-dlp', args);
    
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
      if (code === 0) {
        resolve({ success: true, output });
      } else {
        reject({ success: false, error, code });
      }
    });

    ytdlp.on('error', (err) => {
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
