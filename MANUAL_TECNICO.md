# Manual Técnico - AbTech

## Visión General
Este documento detalla la arquitectura, tecnologías y configuración del sistema AbTech (Sitio Corporativo + CRM).

## Tecnologías
- **Frontend**: Angular 17+ (Standalone Components)
  - **Styling**: TailwindCSS v3.4 (Custom Palette)
  - **HTTP Management**: Angular HttpClient (Fetch API)
  - **Internationalization (i18n)**: `@ngx-translate/core` with JSON loaders (ES/EN).
- **Backend**: Spring Boot 2.7.18 (Java 11 compatible)
- **Base de Datos**: 
  - **Local**: H2 (Memoria/Archivo)
  - **Pruebas (UAT)**: PostgreSQL (Neon.tech) con SSL
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: Spring Security

## Infraestructura y Despliegue (Cloud)

El sistema utiliza una arquitectura distribuida en la nube para el entorno de pruebas (UAT).

### 1. Base de Datos (Neon)
- **Proveedor**: Neon.tech (Serverless PostgreSQL).
- **Configuración de Seguridad**: Conexión obligatoria vía SSL (`sslmode=require`).
- **Persistencia**: Manejada mediante esquemas automáticos de JPA Hibernate (`ddl-auto: update`).

### 2. Backend (Render)
- **Tecnología**: Contenedor Docker (Dockerización propia).
- **Entorno**: Java 11 (Eclipse Temurin).
- **Gestión de Entornos**: Uso de **Spring Profiles**. 
  - El perfil activo en Render es `uat`, el cual carga el archivo `application-uat.properties`.
  - Este perfil sobrescribe la configuración de H2 para apuntar a la base de datos de Neon mediante variables de entorno (`DB_URL`, `DB_USER`, `DB_PASSWORD`).
- **Exposición**: El servicio corre en el puerto `8080` (mapeado dinámicamente por Render).

### 3. Frontend (Vercel)
- **Tecnología**: Angular Static Web Hosting.
- **Configuración de Compilación**:
  - `Root Directory`: `frontend`
  - `Output Directory`: `dist/browser`
- **Proxy Inverso (Vercel Core)**: Se utiliza el motor de Vercel (`vercel.json`) para actuar como puente (Reverse Proxy).
  - Cualquier petición a `/api/*` es capturada por Vercel y redirigida a la URL del backend en Render. 
  - Esto evita problemas de CORS y permite que el frontend no tenga URLs hardcoreadas en el código TypeScript.

## Pipeline de CI/CD
El despliegue es automático (Continuous Deployment) mediante GitHub:
1.  **Push a `main`**: Dispara los Webhooks de Vercel y Render.
2.  **Build (Docker/Angular)**: Se generan los artefactos de producción (`.jar` y archivos estáticos).
3.  **Zero-Downtime Deploy**: Las plataformas reemplazan las versiones anteriores solo después de que el nuevo Build sea exitoso.

## Implementación de Internacionalización (i18n)
El sistema utiliza **ngx-translate** para el manejo dinámico de idiomas (Español/Inglés).

### Configuración
- **Librerías**: `@ngx-translate/core`, `@ngx-translate/http-loader`.
- **Loader**: Configurado en `app.config.ts` mediante `HttpLoaderFactory` para cargar archivos JSON vía HttpClient.
- **Ruta de Recursos**: `src/assets/i18n/`
  - `es.json`: Español (Idioma default).
  - `en.json`: Inglés.

### Uso en Componentes
1. **Lógica (TS)**: Inyección de `TranslateService` para cambiar el idioma activo (`this.translate.use('en')`). Implementado en `Header` component.
2. **Vistas (HTML)**: Uso del pipe `translate` para claves de texto (ej. `{{ 'HEADER.SOLUTIONS' | translate }}`).

## Arquitectura
El sistema sigue una arquitectura de API REST monolítica modularizada.
- `backend`: Servidor API que maneja lógica de negocio, seguridad y persistencia jpa.
- `frontend`: SPA (Single Page Application) modularizada.

### Estructura Frontend
- `components/layout`: Header (con Language Switcher), Footer.
- `components/landing`:
  - `hero`: Sección principal con i18n.
  - `services`: Grid de servicios.
  - `systems-carousel`: Portfolio de sistemas (Salud, Deportes, etc.).
  - `why-abtech`: Propuesta de valor.
  - `technology`: Stack tecnológico.
  - `contact`: Formulario con validación y traducción.
  - `chatbot`: Widget flotante para captura de leads.
- `pages/landing`: Componente principal que orquesta las secciones.
- `services`: `LeadService` para comunicación HTTP con el backend.

## API Endpoints
### Público
- `POST /api/public/contact`: Recibe datos del formulario de contacto (Nombre, Email, Industria, Mensaje).

### Admin (Requiere Header `Authorization: Bearer <token>`)
- `POST /api/auth/signin`: Inicia sesión y obtiene JWT.
- `POST /api/auth/signup`: Registro de usuarios (Admin only).
- `GET /api/admin/leads`: Listar todos los leads capturados.
- `GET /api/admin/leads/{id}`: Ver detalle de lead.

## Configuración Local
1. Prerrequisitos: Java 11+, Node.js 18+, Maven.
2. Backend:
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   ng serve
   ```
