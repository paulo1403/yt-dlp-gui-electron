# YT-DLP GUI

A modern, user-friendly graphical interface for [yt-dlp](https://github.com/yt-dlp/yt-dlp) built with Electron. Download videos and audio from YouTube and many other platforms with ease.

## Features

- 🎥 **Video & Audio Downloads** - Support for multiple formats and qualities
- 🖼️ **Video Information Preview** - Thumbnail, title, duration, and more
- ⚙️ **Advanced Options** - Playlist controls, subtitles, metadata, SponsorBlock
- 🎨 **Modern UI** - Clean, responsive design that works on all screen sizes
- 💾 **Settings Management** - Save your preferred download location and formats
- 📊 **Real-time Progress** - Live download progress with detailed logs
- 🛑 **Download Control** - Start, stop, and manage downloads
- 🧹 **Clean Interface** - Easy-to-use buttons to clear completed downloads

## Prerequisites

Before using YT-DLP GUI, you need to have `yt-dlp` installed on your system:

### Linux
```bash
# Using pip
pip install yt-dlp

# Or using package manager (Ubuntu/Debian)
sudo apt update && sudo apt install yt-dlp

# Or using snap
sudo snap install yt-dlp
```

### Windows
```powershell
# Using pip
pip install yt-dlp

# Or download from GitHub releases
# https://github.com/yt-dlp/yt-dlp/releases
```

### macOS
```bash
# Using Homebrew
brew install yt-dlp

# Or using pip
pip install yt-dlp
```

## Download

Download the latest release for your platform from the [Releases](https://github.com/your-username/yt-dlp-gui-electron/releases) page:

- **Linux**: `.AppImage`, `.deb`, `.rpm`, or `.tar.gz`
- **Windows**: `.exe` installer, portable `.exe`, or `.zip`
- **macOS**: `.dmg` or `.zip`

## Development

### Requirements

- Node.js 16 or higher
- npm or yarn
- yt-dlp installed globally

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/yt-dlp-gui-electron.git
cd yt-dlp-gui-electron
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

### Building

#### Build for Current Platform
```bash
npm run build
```

#### Build for Specific Platforms
```bash
# Linux
npm run build:linux

# Windows
npm run build:win

# macOS
npm run build:mac
```

#### Build for All Platforms
```bash
npm run build:all
```

#### Development Builds (unpacked)
```bash
# Current platform
npm run pack

# Specific platforms
npm run pack:linux
npm run pack:win
npm run pack:mac
```

### Build Outputs

Built applications will be available in the `dist/` directory:

- **Linux**: 
  - `*.AppImage` - Portable application
  - `*.deb` - Debian/Ubuntu package
  - `*.rpm` - Red Hat/Fedora package
  - `*.tar.gz` - Archive

- **Windows**:
  - `*.exe` - NSIS installer
  - `*-portable.exe` - Portable executable
  - `*-win.zip` - Archive

- **macOS**:
  - `*.dmg` - Disk image
  - `*-mac.zip` - Archive

## Cross-Platform Building

You can build for other platforms from your current OS, but there are some limitations:

- **From Linux**: Can build for Linux, Windows, and macOS
- **From Windows**: Can build for Windows and Linux (macOS requires macOS)
- **From macOS**: Can build for all platforms

### Building on Linux for All Platforms

```bash
# Install Wine for Windows builds (optional)
sudo apt install wine

# Build for all platforms
npm run build:all
```

## Project Structure

```
yt-dlp-gui-electron/
├── src/
│   ├── main.js          # Main Electron process
│   ├── preload.js       # Preload script for secure IPC
│   └── renderer/        # Frontend files
│       ├── index.html   # Main UI
│       ├── styles.css   # Styling
│       └── app.js       # Frontend logic
├── assets/              # Icons and resources
├── dist/               # Built applications
├── installer.nsh      # Windows installer customization
└── package.json       # Project configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test them
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - The powerful command-line program this GUI is built for
- [Electron](https://electronjs.org/) - Framework for building cross-platform desktop apps
- [electron-builder](https://www.electron.build/) - Complete solution to package and build Electron apps

## Support

If you encounter any issues or have questions:

1. Check if `yt-dlp` is properly installed and accessible from the command line
2. Check the [Issues](https://github.com/your-username/yt-dlp-gui-electron/issues) page
3. Create a new issue with details about your problem

## Supported Platforms

- **Linux**: x64, ARM64
- **Windows**: x64, x86 (32-bit)
- **macOS**: x64 (Intel), ARM64 (Apple Silicon)
