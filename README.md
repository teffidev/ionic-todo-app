# Ionic To-Do App 📋

Aplicación móvil de lista de tareas construida con **Ionic + Angular**, desarrollada como prueba técnica para evaluar habilidades en desarrollo móvil híbrido.

## Tabla de contenidos

- [Descripción del proyecto](#descripción-del-proyecto)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Compilación para Android e iOS](#compilación-para-android-e-ios)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Firebase y Remote Config](#firebase-y-remote-config)
- [Nota técnica: Angular 20 + Ionic 8](#nota-técnica-angular-20--ionic-8)

---

## Descripción del proyecto

Aplicación híbrida (Android/iOS/Web) que permite gestionar tareas con soporte de categorías y control de funcionalidades mediante Firebase Remote Config.

**Funcionalidades principales:**

- Agregar, editar y eliminar tareas
- Marcar tareas como completadas
- Crear, editar y eliminar categorías con colores personalizados
- Asignar una categoría a cada tarea
- Filtrar tareas por categoría
- Feature flag vía Firebase Remote Config para activar/desactivar el filtro de categorías
- Persistencia local con `localStorage`
- Soporte para modo claro y oscuro

---

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| Ionic | 8.x |
| Angular | 20.x |
| Capacitor | 8.x |
| Angular Fire | 20.x |
| TypeScript | 5.9.x |
| Firebase Remote Config | — |

---

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18+ y npm
- **JDK 21** (requerido por Capacitor 8 — versiones superiores no son compatibles)
- **Android Studio** con Android SDK configurado
- **Ionic CLI**: `npm install -g @ionic/cli`

> ⚠️ **Importante:** Capacitor 8 requiere exactamente **JDK 21**. Si tienes una versión diferente instalada, configura `JAVA_HOME` apuntando al JDK 21 y agrega esta línea en `android/gradle.properties`:
> ```properties
> org.gradle.java.home=C:\\Program Files\\Eclipse Adoptium\\jdk-21.x.x.x-hotspot
> ```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/teffidev/ionic-todo-app.git
cd ionic-todo-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en el navegador (desarrollo)

```bash
ionic serve
```

La aplicación estará disponible en `http://localhost:8100`.

Para simular un dispositivo móvil, abre DevTools (`F12`) → activa el modo responsive (`Ctrl + Shift + M`) → selecciona **Pixel 7** o **Galaxy S20**.

### 4. Ejecutar en dispositivo Android con live reload

```bash
ionic capacitor run android -l --external
```

> El dispositivo debe tener activada la **Depuración USB** en Opciones de desarrollador.

---

## Compilación para Android e iOS

### Android

```bash
# 1. Generar el build web
ionic build

# 2. Sincronizar con el proyecto nativo
npx cap sync android

# 3. Abrir en Android Studio
npx cap open android
```

En Android Studio: **Build → Generate Signed APK** para generar el APK de producción.

### iOS

```bash
ionic build
npx cap sync ios
npx cap open ios
```

En Xcode: selecciona el target, conecta un dispositivo o simulador y ejecuta. Para generar el IPA: **Product → Archive**.

> ⚠️ La compilación de iOS requiere macOS y Xcode instalados.

---

## Estructura del proyecto

```
ionic-todo-app/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   ├── task.model.ts          # Interfaz Task
│   │   │   └── category.model.ts      # Interfaz Category + CATEGORY_COLORS
│   │   ├── pages/
│   │   │   ├── home/                  # Página principal — lista de tareas
│   │   │   │   ├── home.page.ts
│   │   │   │   ├── home.page.html
│   │   │   │   ├── home.page.scss
│   │   │   │   └── home.module.ts
│   │   │   └── categories/            # Página de categorías
│   │   │       ├── categories.page.ts
│   │   │       ├── categories.page.html
│   │   │       ├── categories.page.scss
│   │   │       └── categories.module.ts
│   │   ├── services/
│   │   │   ├── task.service.ts        # CRUD de tareas + persistencia local
│   │   │   ├── category.service.ts    # CRUD de categorías + persistencia local
│   │   │   └── remote-config.service.ts # Firebase Remote Config
│   │   ├── app-routing.module.ts
│   │   ├── app.module.ts
│   │   └── app.component.ts
│   ├── environments/
│   │   ├── environment.ts             # Config Firebase (desarrollo)
│   │   └── environment.prod.ts        # Config Firebase (producción)
│   ├── theme/
│   │   └── variables.scss             # Tokens de diseño y tema
│   └── global.scss                    # Estilos globales
├── android/                           # Proyecto nativo Android
├── ios/                               # Proyecto nativo iOS
├── capacitor.config.ts
└── package.json
```

---

## Firebase y Remote Config

La aplicación usa **Firebase Remote Config** para controlar funcionalidades en tiempo real sin necesidad de publicar una nueva versión.

### Feature flag implementado

| Parámetro | Tipo | Valor por defecto | Efecto |
|---|---|---|---|
| `show_category_filter` | `boolean` | `true` | Muestra u oculta la barra de filtros por categoría en la pantalla principal |

### Cómo probar el feature flag

1. Abre [Firebase Console](https://console.firebase.google.com) → tu proyecto → **Remote Config**
2. Edita el parámetro `show_category_filter`
3. Cambia el valor a `false` y haz clic en **Publicar cambios**
4. Recarga la aplicación completamente (`Ctrl + Shift + R` en web, o cierra y abre en móvil)
5. La barra de filtros desaparecerá de la pantalla principal
6. Vuelve a `true` → publica → recarga → los filtros reaparecen

### Configuración Firebase

El archivo `src/environments/environment.ts` contiene la configuración de Firebase. Para conectar tu propio proyecto, reemplaza los valores con los de tu consola de Firebase:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
  }
};
```

---

## Nota técnica: Angular 20 + Ionic 8

Esta aplicación usa **Angular 20** junto con **Ionic 8**, una combinación reciente donde los Web Components de Ionic (`ion-page`, `ion-content`, etc.) no se registran automáticamente como directivas Angular a través de `IonicModule`.

**Soluciones aplicadas:**

**1. `CUSTOM_ELEMENTS_SCHEMA` en los módulos de página**

Permite que Angular reconozca los elementos Web Component de Ionic sin marcarlos como error en el compilador:

```typescript
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  // ...
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```

**2. `defineCustomElements` en `main.ts`**

Registra manualmente los Web Components de Ionic con el browser:

```typescript
import { defineCustomElements } from '@ionic/core/loader';
defineCustomElements(window);
```

**3. Clase `ion-page` vía `host` en el componente**

En lugar de envolver el template en `<ion-page>`, se aplica la clase directamente al host del componente para que Ionic gestione correctamente el stack de navegación:

```typescript
@Component({
  host: { class: 'ion-page' }
})
```

**4. Estilos base de `ion-page` en `global.scss`**

Ionic no inyecta automáticamente los estilos de posicionamiento para `ion-page` en esta combinación de versiones, por lo que se definen manualmente:

```scss
.ion-page {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  background: var(--ion-background-color);
  contain: layout size style;
}

.ion-page-hidden {
  display: none !important;
}
```

---

*Desarrollado por [Estefanía](https://github.com/teffidev)*
