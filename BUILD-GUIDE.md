# YT-DLP GUI - Cross-Platform Build Setup

¡Tu aplicación YT-DLP GUI ya está configurada para construirse en Linux, Windows y macOS!

## 🎉 ¿Qué hemos logrado?

### ✅ **Configuración Multiplataforma Completa**
- **Linux**: AppImage (portable), DEB (paquete), TAR.GZ (archivo)
- **Windows**: NSIS (instalador), Portable (ejecutable directo)
- **macOS**: DMG (imagen de disco)

### ✅ **Scripts de Construcción**
- Comandos npm específicos para cada plataforma
- Script bash automatizado (`build.sh`)
- GitHub Actions para builds automáticas

### ✅ **Archivos de Configuración**
- `package.json` optimizado para electron-builder
- Configuración de instalador Windows (`installer.nsh`)
- Entitlements para macOS (`entitlements.mac.plist`)
- Flujo de CI/CD con GitHub Actions

## 🚀 Cómo Construir

### Para la Plataforma Actual
```bash
npm run build
```

### Para Plataformas Específicas
```bash
# Linux
npm run build:linux

# Windows (desde cualquier SO)
npm run build:win

# macOS (requiere macOS para firma completa)
npm run build:mac
```

### Para Todas las Plataformas
```bash
npm run build:all
```

### Usando el Script Automatizado
```bash
./build.sh linux
./build.sh windows
./build.sh mac
./build.sh all
```

## 📁 Resultados de Construcción

Los archivos construidos aparecerán en `dist/`:

### Linux
- `YT-DLP GUI-1.0.0.AppImage` - **Aplicación portable** (recomendado)
- `yt-dlp-gui-electron-1.0.0.tar.gz` - Archivo comprimido
- `yt-dlp-gui-electron_1.0.0_amd64.deb` - Paquete Debian (si las dependencias están disponibles)

### Windows
- `YT-DLP GUI Setup 1.0.0.exe` - Instalador NSIS
- `YT-DLP GUI 1.0.0 Portable.exe` - Ejecutable portable

### macOS
- `YT-DLP GUI-1.0.0.dmg` - Imagen de disco para instalación

## 🔧 Estado Actual

### ✅ **Funcionando Perfectamente**
- ✅ Construcción para Linux (AppImage y TAR.GZ probados)
- ✅ Configuración para Windows lista
- ✅ Configuración para macOS lista
- ✅ Scripts de construcción automatizados
- ✅ GitHub Actions configurado

### 📝 **Pendiente (Opcional)**
- Agregar iconos personalizados (actualmente usa iconos por defecto de Electron)
- Firma de código para distribución en tiendas de aplicaciones
- Configuración de actualizaciones automáticas

## 🎨 Agregar Iconos (Opcional)

Para iconos personalizados, crea estos archivos:
```
assets/
├── icon.png     (512x512 - Linux)
├── icon.ico     (Windows, múltiples tamaños)
└── icon.icns    (macOS)
```

Luego descomenta las líneas de iconos en `package.json`.

## 🌍 Distribución

### GitHub Releases
1. Crea un tag: `git tag v1.0.0`
2. Push el tag: `git push origin v1.0.0`
3. GitHub Actions construirá automáticamente para todas las plataformas
4. Los binarios aparecerán en GitHub Releases

### Distribución Manual
- **Linux**: Comparte el `.AppImage` (más compatible)
- **Windows**: Comparte el instalador `.exe` o portable
- **macOS**: Comparte el `.dmg`

## ⚠️ Notas Importantes

1. **yt-dlp Requerido**: Los usuarios deben tener yt-dlp instalado
2. **Construcción Cruzada**: Puedes construir para Windows/Linux desde cualquier SO, pero macOS requiere macOS para firma completa
3. **Dependencias del Sistema**: Algunas construcciones (como .deb) pueden requerir dependencias adicionales del sistema

## 🎯 Próximos Pasos

1. **Probar la aplicación** construida:
   ```bash
   # Ejecutar el AppImage
   ./dist/YT-DLP\ GUI-1.0.0.AppImage
   ```

2. **Subir a GitHub** y crear un release para distribución automática

3. **Agregar iconos personalizados** si deseas una apariencia más profesional

4. **Probar en diferentes plataformas** para asegurar compatibilidad

¡Tu aplicación YT-DLP GUI está lista para ser distribuida en Linux, Windows y macOS! 🎉
