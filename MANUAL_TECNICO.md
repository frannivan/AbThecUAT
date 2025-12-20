# Manual Técnico - AbTech

## Visión General
Este documento detalla la arquitectura, tecnologías y configuración del sistema AbTech (Sitio Corporativo + CRM).

## Tecnologías
- **Frontend**: Angular 17+ (Standalone Components)
  - **Styling**: TailwindCSS v3.4 (Custom Palette)
  - **HTTP Management**: Angular HttpClient (Fetch API)
  - **Internationalization (i18n)**: `@ngx-translate/core` with JSON loaders (ES/EN).
- **Backend**: Spring Boot 2.7.18 (Java 11 compatible)
- **Base de Datos**: H2 (Memoria/Archivo)
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: Spring Security

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
