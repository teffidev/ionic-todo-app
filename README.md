# 📋 Todo App — Prueba Técnica Ionic + Angular

Aplicación de lista de tareas construida con **Ionic 7 + Angular 17 + Firebase Remote Config**, con soporte para compilación nativa en Android e iOS mediante **Capacitor** (sucesor oficial de Cordova).

---

## 📑 Tabla de contenidos

1. [Prerrequisitos](#-prerrequisitos)
2. [Instalación y ejecución local](#-instalación-y-ejecución-local)
3. [Configuración de Firebase](#-configuración-de-firebase)
4. [Feature Flag](#-feature-flag-show_category_filter)
5. [Compilación para Android](#-compilación-para-android)
6. [Compilación para iOS](#-compilación-para-ios)
7. [Generar APK](#-generar-apk)
8. [Probar el APK en emulador](#-probar-el-apk-en-emulador)
9. [Arquitectura del proyecto](#-arquitectura-del-proyecto)
10. [Optimizaciones de rendimiento](#-optimizaciones-de-rendimiento)

---

## 🧰 Prerrequisitos

| Herramienta | Versión | Instalación |
|---|---|---|
| Node.js | 18+ LTS | https://nodejs.org |
| Ionic CLI | 7+ | `npm install -g @ionic/cli` |
| Angular CLI | 17+ | `npm install -g @angular/cli` |
| Android Studio | Hedgehog+ | https://developer.android.com/studio |
| JDK | 17+ | Incluido con Android Studio |

---

## 🚀 Instalación y ejecución local

```bash
# 1. Clona el repositorio
git clone https://github.com/TU_USUARIO/ionic-todo-app.git
cd ionic-todo-app

# 2. Instala dependencias
npm install

# 3. Ejecuta en el navegador
ionic serve
# → Abre automáticamente http://localhost:8100
```

---

## 🔥 Configuración de Firebase

### Paso 1 — Crear el proyecto en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com)
2. Clic en **"Add project"** → escribe un nombre (ej: `todo-app`) → continúa
3. Desactiva Google Analytics si no lo necesitas → **"Create project"**

### Paso 2 — Registrar una Web App

1. En la página principal del proyecto, clic en el ícono **`</>`** (Web)
2. Escribe un nombre (ej: `todo-web`) → **"Register app"**
3. Copia el objeto `firebaseConfig` que aparece

### Paso 3 — Pegar las credenciales en el proyecto

Abre `src/environments/environment.ts` y reemplaza con tus valores:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSy...",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
  }
};
```

Haz lo mismo en `environment.prod.ts` pero con `production: true`.

### Paso 4 — Activar Remote Config

1. Firebase Console → menú izquierdo → **Remote Config**
2. Clic en **"Add parameter"** y completa:

| Campo | Valor |
|---|---|
| Parameter key | `show_category_filter` |
| Data type | `Boolean` |
| Default value | `true` |

3. **"Save"** → **"Publish changes"**

---

## 🎛️ Feature Flag: `show_category_filter`

Controla la visibilidad de la barra de filtros de categorías. Permite activar o desactivar esta funcionalidad **sin publicar una nueva versión de la app**.

### Cómo activarlo/desactivarlo

1. Firebase Console → **Remote Config**
2. Edita el parámetro `show_category_filter`
3. Cambia el valor (`true` = visible / `false` = oculto)
4. Clic en **"Publish changes"**
5. Reinicia la app para que tome el nuevo valor

### Resultado visual

| `show_category_filter = true` | `show_category_filter = false` |
|---|---|
| Aparece la barra de chips (Todas / Personal / Trabajo...) | El header solo muestra el título, sin barra de filtros |
| El usuario puede filtrar tareas por categoría | Las tareas se muestran todas juntas |

### Implementación en el código

```typescript
// home.page.ts — lee el flag al iniciar la página
async ngOnInit() {
  await this.remoteConfigService.initialize();
  this.showCategoryFilter = this.remoteConfigService.getBoolean('show_category_filter');
}
```

```html
<!-- home.page.html — la barra se renderiza SOLO si el flag es true -->
<ion-toolbar *ngIf="showCategoryFilter && categories.length > 0">
  <!-- chips de categorías -->
</ion-toolbar>
```

---

## 🤖 Compilación para Android

### Configuración previa (una sola vez)

1. Instala **Android Studio** desde https://developer.android.com/studio
2. Abre Android Studio → **SDK Manager** → instala:
   - Android SDK Platform API 33+
   - Android SDK Build-Tools
3. Configura variables de entorno en Windows:
   - `ANDROID_HOME` = `C:\Users\TU_USUARIO\AppData\Local\Android\Sdk`
   - Agrega a `PATH`: `%ANDROID_HOME%\tools` y `%ANDROID_HOME%\platform-tools`
4. Verifica con: `adb --version` (debe mostrar la versión sin error)

### Comandos de compilación

```bash
# 1. Compila la app Angular
ionic build

# 2. Copia los archivos al proyecto Android nativo
npx cap sync android

# 3. Abre Android Studio
npx cap open android
```

> **Cordova vs Capacitor:** La prueba menciona Cordova. Este proyecto usa **Capacitor 5**, sucesor oficial de Cordova mantenido por el equipo de Ionic. Ofrece mejor soporte para Android 13+ e iOS 16+ y está activamente mantenido. Los comandos `cap sync` y `cap open` son equivalentes a `cordova prepare` y abrir el proyecto en el IDE.

---

## 🍎 Compilación para iOS

> ⚠️ **Solo es posible en macOS con Xcode 14+**. Es una restricción de Apple independiente del framework.

```bash
sudo gem install cocoapods   # Prerrequisito

ionic build
npx cap sync ios
npx cap open ios             # Abre Xcode
```

En Xcode: **Signing & Capabilities** → selecciona tu equipo → **Product → Archive** para generar el IPA.

---

## 📦 Generar APK

### APK de debug (rápido, para pruebas)

```bash
ionic build
npx cap sync android
cd android
./gradlew assembleDebug
```

Archivo generado en:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### APK firmado (release, para distribución)

1. `npx cap open android` para abrir Android Studio
2. Espera el **Gradle sync** (barra de progreso abajo)
3. Menú **Build → Generate Signed Bundle / APK**
4. Selecciona **APK** → **Next**
5. **"Create new..."** para crear tu keystore:
   - Guarda el `.jks` en un lugar seguro
   - Crea un alias (ej: `todo-key`) y contraseña
6. **Next** → selecciona variant **`release`** → **Finish**
7. Clic en **"locate"** en la notificación para abrir la carpeta

Archivo generado en:
```
android/app/release/app-release.apk
```

---

## 📱 Probar el APK en emulador

### Crear un dispositivo virtual (AVD)

1. Android Studio → **View → Tool Windows → Device Manager**
2. **"Create Virtual Device"**
3. Elige **Pixel 6** → **Next**
4. Descarga la imagen **API 33 (Android 13)** → espera → **Next** → **Finish**
5. Clic en ▶ para iniciar el emulador

### Instalar el APK en el emulador

**Opción A — Drag & Drop:**
Con el emulador abierto, arrastra el archivo `.apk` directamente sobre su pantalla. La instalación ocurre automáticamente.

**Opción B — Línea de comandos:**
```bash
adb devices                  # Verifica que el emulador está corriendo
adb install ruta/app-debug.apk
```

### Probar en dispositivo físico

1. En tu celular: **Ajustes → Acerca del teléfono → toca "Número de compilación" 7 veces**
2. **Ajustes → Opciones de desarrollador → Depuración USB → Activar**
3. Conecta el celular al PC con cable USB → acepta el permiso en el celular
4. En Android Studio tu dispositivo aparece en la barra superior → clic en ▶

### Compartir para evaluación remota

Sube el APK a [appetize.io](https://appetize.io) — emulador web gratuito. Obtienes un link que el evaluador puede usar sin instalar nada.

---

## 🏗️ Arquitectura del proyecto

```
src/
├── app/
│   ├── models/
│   │   ├── task.model.ts              # Interface: id, title, completed, categoryId
│   │   └── category.model.ts          # Interface: id, name, color
│   │
│   ├── services/
│   │   ├── task.service.ts            # CRUD tareas + localStorage + BehaviorSubject
│   │   ├── category.service.ts        # CRUD categorías + localStorage + BehaviorSubject
│   │   └── remote-config.service.ts   # Feature flags con Firebase Remote Config
│   │
│   ├── pages/
│   │   ├── home/                      # Lista de tareas + filtros por categoría
│   │   └── categories/                # Crear, editar y eliminar categorías
│   │
│   ├── app.module.ts                  # Módulo raíz + configuración Firebase
│   └── app-routing.module.ts          # Rutas con lazy loading
│
├── environments/
│   ├── environment.ts                 # Credenciales Firebase (desarrollo)
│   └── environment.prod.ts            # Credenciales Firebase (producción)
│
└── polyfills.ts                       # Zone.js requerido por Angular
```

---

## ⚡ Optimizaciones de rendimiento

### Carga inicial

| Técnica | Código | Beneficio |
|---|---|---|
| **Lazy Loading** | `loadChildren: () => import(...)` | Cada página carga solo cuando el usuario navega a ella |
| **PreloadAllModules** | `preloadingStrategy: PreloadAllModules` | Precarga páginas en background tras la carga inicial |

### Listas grandes

| Técnica | Código | Beneficio |
|---|---|---|
| **trackBy** | `trackBy: trackById` en `*ngFor` | Angular reutiliza nodos DOM; no destruye y recrea la lista completa |
| **OnPush** | `ChangeDetectionStrategy.OnPush` | Solo re-renderiza cuando los datos realmente cambian |

### Memoria

| Técnica | Código | Beneficio |
|---|---|---|
| **Cleanup de suscripciones** | `takeUntil(destroy$)` + `ngOnDestroy` | Cancela automáticamente todas las suscripciones al salir de la página |
| **Estado en RAM** | `BehaviorSubject` | Lee localStorage una sola vez al iniciar; el resto opera en memoria |


## 🛠️ Comandos de referencia rápida

```bash
ionic serve                             # Desarrollo en navegador
ionic build                             # Build de producción
npx cap sync android                    # Sincroniza web → Android
npx cap open android                    # Abre Android Studio
cd android && ./gradlew assembleDebug   # Genera APK de debug
adb install app-debug.apk              # Instala APK en emulador/dispositivo
```

---

## 📦 Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Ionic | 7 | Framework UI móvil |
| Angular | 17 | Framework frontend |
| Capacitor | 5 | Bridge nativo Android/iOS |
| Firebase | 10 | Remote Config (feature flags) |
| AngularFire | 17 | Integración Angular ↔ Firebase |
| RxJS | 7 | Programación reactiva |
| TypeScript | 5 | Tipado estático |

---

## 👩‍💻 Autora

Desarrollado por **Tefi** como prueba técnica para posición de Desarrollador Mobile.
