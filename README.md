# Dumbo Frontend

Aplicación web del Sistema de Ventas y Logística Dumbo. El frontend está desarrollado con Next.js y React, mientras que el backend se mantiene en un proyecto independiente con ASP.NET Core (.NET).

## Tecnologías

| Tecnología | Versión |
|---|---|
| Node.js | 24.22.1 |
| npm | 12.2.1 |
| Next.js | 16.4.6 |
| React / React DOM | 19.3.1 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |
| ESLint | 10.15.0 |

## Requisitos previos

Antes de instalar el proyecto, deben estar disponibles:

- Git.
- Node.js **24.22.1**.
- npm **12.2.1**.

Node.js puede descargarse desde el [sitio oficial](https://nodejs.org/en/download/archive/v24.22.1).

Si utilizas nvm-windows:

```powershell
nvm install 24.22.1
nvm use 24.22.1
```

Para instalar la versión requerida de npm, ejecuta el siguiente comando desde una carpeta fuera del repositorio:

```powershell
npm install --global npm@12.2.1
```

Comprueba las versiones antes de continuar:

```powershell
node --version
npm --version
```

La salida esperada es:

```text
v24.22.1
12.2.1
```

## Instalación

### 1. Clonar el repositorio

La configuración inicial se encuentra en la rama `feat/configuracion-proyecto`:

```powershell
git clone --branch feat/configuracion-proyecto https://github.com/SebastianGalvez02/dumbo-frontend.git
cd dumbo-frontend
```

### 2. Instalar las dependencias

```powershell
npm ci
```

Este comando utiliza `package-lock.json` para reproducir las versiones del proyecto. Si existe una instalación anterior de `node_modules`, la reemplaza.

### 3. Configurar el entorno local

```powershell
Copy-Item .env.example .env
```

- `NEXT_PUBLIC_DATA_SOURCE=mock` utiliza los datos y servicios simulados. Es el modo predeterminado.
- `NEXT_PUBLIC_DATA_SOURCE=api` queda reservado para la conexión con el backend. Hasta que exista el adaptador, la aplicación informa que el modo no está disponible.
- `NEXT_PUBLIC_API_URL` es la URL del backend. El perfil HTTP local de Dumbo utiliza `http://localhost:5033`.

Reinicia el servidor de desarrollo después de cambiar estas variables. Para producción, configúralas antes de ejecutar `npm run build`.

### 4. Iniciar el entorno de desarrollo

```powershell
npm run dev
```

La aplicación estará disponible en:

**http://localhost:3000**

Para detener el servidor, presiona `Ctrl + C` en la terminal.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con recarga automática. |
| `npm run build` | Genera la compilación de producción. |
| `npm start` | Inicia el servidor de producción. Requiere una compilación previa. |
| `npm run lint` | Ejecuta el análisis de código con ESLint. |
| `npm run typecheck` | Comprueba los tipos de TypeScript. |
| `npm audit --audit-level=low` | Consulta vulnerabilidades conocidas de las dependencias. |

## Ejecución en producción

```powershell
npm run build
npm start
```

## Organización del proyecto

```text
dumbo-frontend/
├── public/                 # Recursos estáticos públicos
├── src/
│   └── app/                # Páginas, layouts y estilos de App Router
├── .gitignore              # Exclusiones del control de versiones
├── .npmrc                  # Configuración de npm
├── .nvmrc                  # Versión de Node.js
├── eslint.config.mjs       # Configuración de ESLint
├── next.config.ts          # Configuración de Next.js
├── package.json            # Dependencias y comandos
├── package-lock.json       # Versiones resueltas de las dependencias
├── tsconfig.json           # Configuración de TypeScript
└── README.md
```

Los archivos de `public` se sirven desde la raíz de la aplicación. Por ejemplo, `public/logo.png` está disponible mediante la ruta `/logo.png`.

Las carpetas `node_modules` y `.next` se generan localmente y no deben incluirse en el repositorio.

## Gestión de dependencias

El proyecto utiliza npm como gestor de paquetes. Las versiones de Node.js y npm se comprueban mediante `engines` y `devEngines`, mientras que `.npmrc` activa la validación estricta de los motores y el guardado de versiones exactas.

Para mantener instalaciones reproducibles:

- Conservar `package-lock.json` en el repositorio.
- Utilizar `npm ci` al clonar o recibir cambios en las dependencias.
- Mantener versiones exactas en `package.json`.
- Revisar y entregar juntos los cambios de `package.json` y `package-lock.json`.
- Actualizar React y React DOM conjuntamente, al igual que Next.js y `eslint-config-next`.

El archivo `.nvmrc` documenta la versión de Node.js. En nvm-windows debe seleccionarse explícitamente con `nvm use 24.22.1`.

## Validación de cambios

Antes de entregar cambios, ejecutar:

```powershell
npm run lint
npm run build
npm run typecheck
npm audit --audit-level=low
```

Las actualizaciones de dependencias deben revisarse y validarse antes de integrarse. No se recomienda ejecutar `npm audit fix --force` automáticamente, ya que puede introducir cambios incompatibles.

## Seguridad y configuración

- No incluir contraseñas, tokens ni claves privadas en el código fuente o en el repositorio.
- Las variables con prefijo `NEXT_PUBLIC_` son accesibles desde el navegador y deben contener únicamente información pública.
- La autenticación y autorización de las operaciones protegidas deben validarse en el backend.
- Revisar periódicamente los avisos de seguridad de las dependencias. Las versiones fijas garantizan reproducibilidad, pero requieren mantenimiento.

## Solución de problemas

### Versión de Node.js o npm incompatible

Los errores `EBADENGINE` o `EBADDEVENGINES` indican que las herramientas no cumplen los requisitos del proyecto.

```powershell
node --version
npm --version
```

Selecciona Node.js `24.22.1` e instala npm `12.2.1` desde una carpeta fuera del repositorio antes de repetir `npm ci`.

### Diferencias entre `package.json` y el lockfile

`npm ci` falla si ambos archivos no coinciden. Si modificaste intencionalmente las dependencias, ejecuta `npm install`, revisa el resultado y conserva ambos archivos actualizados.

### Puerto 3000 ocupado

Puedes iniciar el servidor en otro puerto:

```powershell
npm run dev -- --port 3001
```

### PowerShell bloquea `npm.ps1`

Utiliza el ejecutable de Windows:

```powershell
npm.cmd ci
npm.cmd run dev
```
