; Custom NSIS installer script for YT-DLP GUI

; Check if yt-dlp is installed
!macro customInit
  ; Check for yt-dlp installation
  ExecWait "yt-dlp --version" $0
  ${If} $0 != 0
    MessageBox MB_YESNO|MB_ICONQUESTION "yt-dlp is not installed or not found in PATH.$\n$\nYT-DLP GUI requires yt-dlp to function properly.$\n$\nWould you like to continue with the installation anyway?$\n$\nYou can install yt-dlp later from: https://github.com/yt-dlp/yt-dlp" IDYES continue
    Abort
    continue:
  ${EndIf}
!macroend

; Custom finish page
!macro customFinishPage
  ; Create desktop shortcut
  CreateShortcut "$DESKTOP\YT-DLP GUI.lnk" "$INSTDIR\${PRODUCT_FILENAME}.exe"
  
  ; Add to Windows PATH (optional)
  ; EnVar::SetHKCU
  ; EnVar::AddValue "PATH" "$INSTDIR"
!macroend

; Uninstaller customizations
!macro customUnInit
  ; Remove desktop shortcut
  Delete "$DESKTOP\YT-DLP GUI.lnk"
!macroend
