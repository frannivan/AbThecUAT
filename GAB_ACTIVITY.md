# Registro de Actividad (GAB ACTIVITY)

## Bitácora de Desarrollo

### Inicio de Proyecto
- **Fecha**: 2025-12-19
- **Acción**: Inicialización de documentos y estructura del proyecto.
- **Detalle**: Se crearon los archivos `MANUAL_TECNICO.md`, `MANUAL_USUARIO.md`, `IMPLEMENTATION_PLAN.md` y este registro. Se definió la arquitectura Angular + Spring Boot.

### In Progress
- **Fecha**: 2025-12-19
- **Acción**: Implementación Fase 1 (Configuración y Landing Page).
- **Detalle**:
    - Backend: Downgrade a Spring Boot 2.7 (Java 11), configuración JWT, Endpoint Contacto.
    - Frontend: Setup TailwindCSS v3, Layout (Header/Footer), Landing Page Completa, Integración con API de Contacto.
    - Builds: Verificados y exitosos para ambos proyectos.

- **Fecha**: 2025-12-19
- **Acción**: Refinamiento Sitio Público.
- **Detalle**:
    - Header: Implementación de menús desplegables (Dropdowns) para Soluciones, Desarrollo, Industrias.
    - Landing: Nueva sección "Why AbTech", Carrusel de Sistemas refinado (Salud, Deportes, Inmobiliaria, RRHH).
    - Chatbot: Widget interactivo con captura de leads.

- **Fecha**: 2025-12-19
- **Acción**: Implementación de Internacionalización (i18n).
- **Detalle**:
    - Dependencia: `@ngx-translate/core`.
    - Assets: Archivos JSON (es.json, en.json) con todos los textos públicos.
    - Header: Switcher de idioma (Banderas MX/US).
    - Componentes: Pipe `translate` aplicado a Hero, Contacto, Why AbTech y Menú.
    - Visual: Hero text white enforced.
    - Fix: Visual (Hero Text White), Loader Path (/assets/i18n/), Logging activado. Fix de path public/assets.
    - Refactor: Renombrado `Lead` service a `LeadService`.
    - i18n Completo: Traducciones aplicadas a Servicios, Sistemas, Tecnología y Chatbot.
    - OMITIDO: Revertido estilo de Hero a Tema Claro (Light Theme) a petición del usuario.
    - Visual: Aplicado tema "Unix/Hacker" (Dark Slate, Neon Green, Mono font) a Hero y Chatbot. Fix de visibilidad.
    - Asset: Generada imagen custom `hero_tech.png` (Abstract Code/Servers) para reemplazar ilustración de personas.
    - Style: Reducción de padding vertical (py-12). Reemplazo de Fondo Negro por Gradient "Midnight Glass" (Slate/Indigo) con efectos Glassmorphism.
    - Config: Verificado `tailwind.config.js` para personalización de colores.
    - Style: Actualizado Hero a gradiente Blue/Orange/Green (Sin morado) y base más clara.
    - Layout: Implementado Hero "Split Screen" (Izquierda Oscura / Derecha Blanca).
    - Asset: Generada `hero_tech_white.png` (Isometric Chameleon Tech on White) para el lado derecho.
    - Style: Compactado Hero al ~70% de altura (py-16 -> py-10, márgenes reducidos).

### Próximos Pasos
1. Implementar Módulo de Administración (CRM).
2. Crear Dashboard de Admin.
3. Integrar Chatbot.
