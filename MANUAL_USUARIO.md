# Manual de Usuario - AbTech

## Introducción
Bienvenido al manual de uso de la plataforma AbTech. Este sistema consta de un sitio web público y un panel de administración (CRM).

## Sitio Público
Accesible para cualquier visitante en la ruta raíz (`/`).
- **Navegación**: Menú interactivo (responsive) que lleva a las secciones: Inicio, Soluciones, Desarrollo, Industrias, Contacto.
- **Secciones Informativas**:
    - **Hero**: Propuesta de valor.
    - **Soluciones**: Tarjetas con servicios principales.
    - **Sistemas**: Carrusel visual de proyectos previos.
    - **Tecnología**: Stack tecnológico utilizado.
- **Contacto**: Formulario validado al final de la página. Al enviar, la información se guarda automáticamente en el CRM para seguimiento.
- **Chatbot (Asistente Virtual)**: Ubicado en la esquina inferior derecha. Permite capturar datos de contacto (nombre, email, interés) de manera conversacional si el usuario prefiere no usar el formulario estático.
## Panel de Administración (CRM)
El CRM es el motor interno para gestionar el crecimiento de AbTech. El flujo sigue un **Embudo de Ventas (Funnel)**:

### 1. Leads (Prospectos)
Ubicados en `admin/leads`. Son todos los contactos iniciales capturados desde el formulario o el chatbot.
- **Acción**: El administrador debe contactar al lead. Si hay interés real, se cambia el estado a `QUALIFIED`.

### 2. Oportunidades
Ubicadas en `admin/opportunities`. Aquí aparecen automáticamente todos los leads marcados como `QUALIFIED`.
- **Etiqueta NUEVA**: Las oportunidades calificadas en las últimas 24 horas muestran un distintivo azul pulsante.
- **Conversión**: Para cerrar el trato, cambia el estado a `CONVERTED`. Esto activará la creación automática de una ficha de Cliente.

### 3. Clientes
Ubicados en `admin/clients`. Contiene la base de datos de empresas o personas que ya trabajan con AbTech.
- **Detalle**: Permite ver la información histórica del cliente que fue extraída del lead original.

### 4. Dashboard (Métricas)
Proporciona una vista rápida de la salud del negocio:
- **Total de Leads**: Volumen total de prospectos (con conteo de los que aún no se leen).
- **Oportunidades**: Cuántos negocios están en etapa de calificación.
- **Total Clientes**: Cuántas conversiones exitosas se han logrado.

## Guía de Despliegue y Configuración

Esta sección detalla los pasos técnicos realizados para poner la plataforma en línea en un entorno de pruebas (UAT).

### 1. Base de Datos (Neon PostgreSQL)
Se utiliza **Neon.tech** para hospedar la base de datos PostgreSQL de manera gratuita y escalable.
- **Configuración local/UAT**: Los datos de conexión están definidos en `src/main/resources/application-uat.properties`.
- **Acceso**: Host, Usuario y Contraseña se manejan mediante variables de entorno para mayor seguridad.

### 2. Backend (Render con Docker)
El servidor Spring Boot está desplegado en **Render.com** utilizando un contenedor Docker.
- **Dockerfile**: Ubicado en `/backend/Dockerfile`. Utiliza la imagen `eclipse-temurin:11` para garantizar compatibilidad.
- **Variables de Entorno Cruciales**:
    - `SPRING_PROFILES_ACTIVE`: Se debe establecer en `uat` para que el backend use la base de datos Neon en lugar de la local H2.
    - `DB_URL`/`DB_USER`/`DB_PASSWORD`: Datos de conexión a Neon.
- **Comando de Inicio**: Gestionado automáticamente por el Dockerfile (`ENTRYPOINT ["java", "-jar", "app.jar"]`).

### 3. Frontend (Vercel)
La aplicación Angular está desplegada en **Vercel** con integración continua desde GitHub.
- **Configuración de Proyecto**:
    - **Root Directory**: `frontend`
    - **Fruit Preset**: Angular
    - **Output Directory**: `dist/browser` (Configuración manual necesaria en Vercel Settings).
- **Enrutamiento SPA**: El archivo `vercel.json` gestiona que todas las rutas internas de Angular redirijan al `index.html` para evitar errores 404.
- **Proxy de API**: `vercel.json` tiene configurado un "rewrite" para que todas las llamadas a `/api/*` se redirijan automáticamente a la URL del backend en Render (`https://abthecuat.onrender.com/api/*`).

### 4. Flujo de Actualización
Cualquier cambio subido a la rama `main` de GitHub disparará automáticamente:
1.  Un nuevo "Build" y "Deploy" en Vercel para el Frontend.
2.  Un nuevo "Build" del contenedor Docker y despliegue en Render para el Backend.
