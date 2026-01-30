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
   ```

### Manejo de Perfiles con Maven
Para ejecutar el backend con un perfil específico (por ejemplo, para conectar a la base de datos de producción desde local):

- **Perfil Local (H2)**:
  ```bash
  ./mvnw spring-boot:run
  ```
- **Perfil UAT (PostgreSQL/Neon)**:
  ```bash
  ./mvnw spring-boot:run -Dspring-boot.run.profiles=uat
  ```

*Nota: También es posible pasar el parámetro de sistema genérico:*
`./mvnw spring-boot:run -Dspring.profiles.active=uat`

3. Frontend:
   ```bash
   cd frontend
   npm install
   ng serve
   ```

## Multi-tenancy (Arquitectura de Esquemas)

Para soportar múltiples demos (tenants) con un único backend, se implementó una estrategia de **Schemas Separados** en PostgreSQL.

### 1. Concepto
Cada aplicación (Demo) tiene su propio esquema en la base de datos (ej. `public`, `barberia`, `canchita`). El backend decide dinámicamente a qué esquema conectarse basándose en el header HTTP `X-Tenant-ID`.

### 2. Archivos Clave Modificados/Creados
La lógica se encuentra en el paquete `com.abtech.backend.config.tenant`:

*   **`TenantContext.java`**: Usa `ThreadLocal` para guardar el ID del tenant actual durante el ciclo de vida de la petición HTTP.
*   **`TenantFilter.java`**: Intercepta todas las peticiones, extrae el header `X-Tenant-ID` y lo guarda en el `TenantContext`.
*   **`SchemaResolver.java`**: Clase de Hibernate (`CurrentTenantIdentifierResolver`) que lee cual es el tenant activo desde el contexto.
*   **`MultiTenantProvider.java`**: Clase de Hibernate (`MultiTenantConnectionProvider`) que ejecuta `SET SEARCH_PATH TO <schema>` en la conexión JDBC antes de cualquier consulta.
*   **`HibernateConfig.java`**: Configuración manual de la `LocalContainerEntityManagerFactoryBean` para activar estas estrategias en lugar de usar la autoconfiguración por defecto de Spring Boot.

### 3. Configuración para Nuevos Demos
1.  **Base de Datos**: Crear manualmente el esquema en Neon/Postgres:
    ```sql
    CREATE SCHEMA nombre_demo;
    ```
2.  **Frontend**: Asegurarse de enviar el header en las peticiones:
    ```javascript
    headers.set('X-Tenant-ID', 'nombre_demo');
    ```

## Solución de Problemas (Troubleshooting)

### Autenticación (Error 401 / Bad Credentials)

#### Síntoma
Al intentar iniciar sesión con un usuario pre-configurado (ej. `admin`), el sistema devuelve `401 Unauthorized` con el mensaje "Bad credentials", incluso si la contraseña parece correcta visualmente.

#### Causa
Spring Security requiere que las contraseñas almacenadas en la base de datos estén **hasheadas** (usando BCrypt), nunca en texto plano.
*   Si se inserta en `data.sql`: `'123456'` (Texto Plano) -> **Error**. El sistema compara `Hash('123456')` contra `'123456'`, lo cual falla.
*   Si se inserta en `data.sql`: `'$2a$10$...'` (BCrypt Hash) -> **Correcto**.

#### Solución Aplicada
Se corrigió el script `src/main/resources/data.sql` para usar un hash BCrypt válido para la contraseña `123456`.

**Procedimiento para generar nuevos usuarios:**
Nunca insertar passwords planos. Usar un generador BCrypt (online o vía test de Java) para obtener el string que empieza con `$2a$`.

#### Nota sobre Init Data
Durante el desarrollo, hubo confusión entre métodos de carga (Java `CommandLineRunner` vs SQL `data.sql`). Se estandarizó el uso de **`src/main/resources/data.sql`** como la única fuente de verdad para datos iniciales, eliminando clases Java redundantes como `DataInitializer` para mantener el código limpio.
