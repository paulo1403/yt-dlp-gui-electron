#!/bin/bash

# Build script for YT-DLP GUI
# Builds the application for Linux, Windows, and macOS

echo "🚀 YT-DLP GUI Build Script"
echo "=========================="
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Available build commands:"
echo ""
echo "For current platform:"
echo "  npm run build          - Build for current platform"
echo "  npm run pack           - Pack without installers"
echo ""
echo "For specific platforms:"
echo "  npm run build:linux    - Build for Linux (AppImage, tar.gz, deb*)"
echo "  npm run build:win      - Build for Windows (NSIS installer, portable)"
echo "  npm run build:mac      - Build for macOS (DMG)"
echo ""
echo "For all platforms:"
echo "  npm run build:all      - Build for all platforms"
echo ""
echo "*Note: .deb package requires additional system dependencies"
echo "       AppImage and tar.gz work without additional setup"
echo ""

# Function to build for specific platform
build_platform() {
    local platform=$1
    echo "🏗️  Building for $platform..."
    
    case $platform in
        "linux")
            npm run build:linux
            ;;
        "windows")
            npm run build:win
            ;;
        "mac")
            npm run build:mac
            ;;
        "all")
            npm run build:all
            ;;
        *)
            echo "❌ Unknown platform: $platform"
            echo "Valid options: linux, windows, mac, all"
            exit 1
            ;;
    esac
}

# Parse command line arguments
if [ $# -eq 0 ]; then
    echo "Usage: $0 [linux|windows|mac|all]"
    echo ""
    echo "Or run the npm commands directly:"
    echo "  npm run build:linux"
    echo "  npm run build:win"
    echo "  npm run build:mac"
    exit 0
fi

# Build for the specified platform
build_platform $1

echo ""
echo "✅ Build completed!"
echo "📁 Check the 'dist/' directory for built applications"
echo ""
echo "Distribution files:"
echo "  Linux:   *.AppImage, *.tar.gz, *.deb"
echo "  Windows: *.exe (installer and portable)"
echo "  macOS:   *.dmg"
