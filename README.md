# YT-DLP GUI

A modern, user-friendly GUI for yt-dlp built with Electron. Download videos and audio from YouTube and other platforms with an intuitive interface.

## Features

- 🎥 **Video Downloads**: Download videos in various formats and qualities
- 🎵 **Audio Extraction**: Extract audio in MP3 format
- 📱 **Modern UI**: Clean, responsive interface with dark mode support
- ⚙️ **Customizable Settings**: Configure default download paths and formats
- 📊 **Real-time Progress**: Live download progress with detailed logs
- 🔍 **Video Info**: Preview video information before downloading
- 📁 **File Management**: Quick access to download folders

## Prerequisites

- **yt-dlp**: Make sure yt-dlp is installed and available in your system PATH
  ```bash
  # Install via pip
  pip install yt-dlp
  
  # Or via package manager (Ubuntu/Debian)
  sudo apt install yt-dlp
  
  # Or via Homebrew (macOS)
  brew install yt-dlp
  ```

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Building
```bash
# Build for current platform
npm run build

# Create distributable package
npm run dist
```

## How to Use

1. **Enter Video URL**: Paste a video URL from YouTube or other supported platforms
2. **Get Video Info**: Click "Get Info" to preview video details
3. **Choose Settings**: 
   - Select download location
   - Choose format (video/audio)
   - Select quality
4. **Download**: Click the download button and monitor progress

## Supported Platforms

The application supports downloading from any platform that yt-dlp supports, including:
- YouTube
- Vimeo
- Twitch
- TikTok
- And many more...

## Settings

Access settings via the gear icon to configure:
- Default download path
- Default format preferences
- Default quality settings

## File Structure

```
yt-dlp-gui-electron/
├── src/
│   ├── main.js           # Main Electron process
│   ├── preload.js        # Preload script for security
│   └── renderer/         # Frontend files
│       ├── index.html    # Main UI
│       ├── styles.css    # Styling
│       └── app.js        # Frontend logic
├── assets/               # Application assets
├── package.json          # Project configuration
└── README.md            # This file
```

## Development

The application is built with:
- **Electron**: Cross-platform desktop app framework
- **Node.js**: Backend runtime
- **HTML/CSS/JavaScript**: Frontend technologies
- **yt-dlp**: Command-line video downloader

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Troubleshooting

### yt-dlp not found
- Ensure yt-dlp is installed and in your system PATH
- Try running `yt-dlp --version` in terminal to verify installation

### Download failures
- Check internet connection
- Verify the video URL is accessible
- Some videos may have restrictions or require special handling

### Permission issues
- Ensure write permissions for the selected download directory
- On Linux/macOS, you may need to adjust folder permissions

## Support

For issues and feature requests, please create an issue in the repository.
