# Estándar Corporativo de Arquitectura y Diseño de Software

**Versión:** 2.0
**Estado:** VIGENTE
**Alcance:** AbTech, BarberShop, LaCanchita, CasaVida, LoteMaster

Este documento define **formalmente** los patrones de diseño, la arquitectura de referencia y la estrategia de implementación para todo el ecosistema de aplicaciones. Su cumplimiento es obligatorio para garantizar la escalabilidad, mantenibilidad y coherencia técnica.

---

## 1. Arquitectura de Referencia (Reference Architecture)

Se adopta una **Arquitectura en Capas (Layered Architecture)** estricta para el Backend y una **Arquitectura Modular Basada en Componentes** para el Frontend.

### 1.1 Patrón Arquitectónico del Backend (Spring Boot)

El backend debe implementar los siguientes patrones de diseño GoF y Enterprise:

1.  **Controller Pattern (Presentation Layer)**:
    *   **Responsabilidad**: Manejar peticiones HTTP, validar entradas y serializar respuestas.
    *   **Restricción**: NO debe contener lógica de negocio ni acceso a datos directo.
2.  **Service Layer Pattern (Business Layer)**:
    *   **Responsabilidad**: Orquestar transacciones, aplicar reglas de negocio y validaciones complejas.
    *   **Patrón**: `Business Delegate`. Los controladores solo hablan con Servicios.
3.  **Repository Pattern (Persistence Layer)**:
    *   **Responsabilidad**: Abstraer el acceso a datos. Uso estricto de Interfaces (`JpaRepository`).
4.  **Data Transfer Object (DTO) Pattern**:
    *   **Regla de Oro**: NUNCA exponer entidades JPA (`@Entity`) directamente en los controladores. Siempre mapear a DTOs (`Request` y `Response`).
    *   **Objetivo**: Desacoplar el esquema de base de datos de la API pública.

### 1.2 Estrategia de Seguridad (RBAC y JWT)

La seguridad no es un módulo, es una capa transversal.

*   **Autenticación**: Stateless mediante **JWT (JSON Web Tokens)**.
*   **Autorización**: **RBAC (Role-Based Access Control)**.

#### Matriz de Roles Estándar

| Rol Lógico | Descripción | Nivel de Acceso | Contexto de Uso |
| :--- | :--- | :--- | :--- |
| `ROLE_ADMIN` | Administrador del Sistema | **Total**. Lectura/Escritura en todos los módulos. | Configuración, Gestión de Usuarios, Reportes Financieros. |
| `ROLE_USER` | Usuario Registrado / Cliente | **Limitado**. Solo a sus propios recursos. | Ver sus compras, citas, editar su perfil. |
| `ROLE_STAFF` | Empleado / Operador | **Operativo**. Gestión del día a día. | Barberos (ver agenda), Vendedores (crear leads). |
| `ROLE_PUBLIC` | Visitante Anónimo | **Público**. Solo lectura en endpoints seguros. | Ver Landing Page, Consultar disponibilidad, Catálogo. |

> **Nota Técnica**: `ROLE_PUBLIC` es un concepto lógico. En Spring Security, estos endpoints se configuran como `.permitAll()`, pero conceptualmente deben tratarse como un nivel de acceso definido.

---

## 2. Análisis de Aplicaciones y Estrategia ERP/CRM

A continuación, se define la naturaleza de cada proyecto y su configuración recomendada para operar como un negocio escalable.

### 2.1 AbTech (The Core)
*   **Tipo**: **CRM Corporativo (Customer Relationship Management)**.
*   **Objetivo**: Centralizar la operación comercial de la empresa de tecnología.
*   **Módulos Clave (Must Have)**:
    *   **Lead Pipeline**: Gestión visual de prospectos (Kanban).
    *   **Project Tracker**: Seguimiento de hitos de entrega de software.
*   **Patrón de Diseño**: Implementación de referencia completa.

### 2.2 LoteMaster
*   **Tipo**: **DMS (Dealership Management System)**.
*   **Vertical**: Venta Automotriz.
*   **Estrategia de Negocio (Desking)**: El sistema debe enfocarse en la **Utilidad Neta**.
    *   **Requerimiento Crítico**: Módulo de "Refurbishment" (Reacondicionamiento). Cada gasto en taller debe sumarse al costo del inventario para calcular el margen real al momento de la venta.
    *   **Seguridad**: `ROLE_PUBLIC` ve el catálogo. `ROLE_ADMIN` ve los costos y márgenes.

### 2.3 CasaVida
*   **Tipo**: **Real Estate ERP**.
*   **Vertical**: Bienes Raíces y Crédito.
*   **Estrategia de Negocio**: Gestión de Inventario de Tierra y Crédito Hipotecario.
    *   **Requerimiento Crítico**: Motor Financiero. Capacidad de generar tablas de amortización, manejar intereses moratorios y generar estados de cuenta en PDF.
    *   **Seguridad**: `ROLE_USER` es crítico aquí para el "Portal de Cliente" donde descargan sus recibos.

### 2.4 LaCanchita
*   **Tipo**: **Facility Management & Booking System**.
*   **Vertical**: Deportes y Recreación.
*   **Estrategia de Negocio**: Maximización de Ocupación.
    *   **Requerimiento Crítico**: Motor de Agenda (Scheduler) a prueba de fallos (prevención de double-booking).
    *   **Diferenciador Visual**: Uso de componentes gráficos ricos (`SoccerFieldWrapper`) para mejorar la UX.

### 2.5 BarberShop
*   **Tipo**: **Service Booking & POS**.
*   **Vertical**: Servicios Personales / Retail.
*   **Estrategia de Negocio**: Gestión de Tiempo y Punto de Venta.
    *   **Requerimiento Crítico**: Agenda Multitenant (múltiples barberos) y POS para venta de insumos (gel, cera) en sitio.

---

## 3. Matriz de Cumplimiento Técnico (Compliance Matrix)

Auditoría del estado actual de los proyectos frente a este estándar.

| Criterio | AbTech | LoteMaster | CasaVida | LaCanchita | BarberShop |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Separación Backend/Frontend** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Uso de DTOs** | ✅ | ✅ | ✅ | ✅ | ⚠️ (Revisar) |
| **Naming Conv. (Java)** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Naming Conv. (DB)** | `snake_case` | `snake_case` | `snake_case` | `snake_case` | `snake_case` |
| **Dockeritzación** | ✅ | ✅ | ⚠️ (Pendiente) | ✅ | ⚠️ (Pendiente) |
| **Manual Técnico** | ✅ | ✅ | ✅ | ✅ | ❌ (Falta) |
| **Estado Global** | **GOLD** | **GOLD** | **SILVER** | **SILVER** | **BRONZE** |

---

## 4. Guía de Implementación y Mantenimiento

### 4.1 Estructura de Directorios Estándar

```text
/ (Root)
├── backend/            # Spring Boot Application
│   ├── Dockerfile
│   └── src/main/java/com/[empresa]/[proyecto]/
│       ├── config/     # Security, Swagger, CORS
│       ├── controller/ # REST Endpoints
│       ├── dto/        # Data Transfer Objects
│       ├── model/      # JPA Entities
│       ├── repository/ # Spring Data JPA Interfaces
│       └── service/    # Business Logic
├── frontend/           # Angular Application
│   ├── vercel.json     # Configuración de despliegue
│   └── src/app/
│       ├── core/       # Guards, Interceptors, Singleton Services
│       ├── shared/     # Componentes UI reutilizables
│       └── features/   # Módulos por dominio (auth, admin, dashboard)
├── docs/               # Documentación adicional
├── MANUAL_TECNICO.md
└── MANUAL_USUARIO.md
```

### 4.2 Flujo de CI/CD Estándar
1.  **Commit** a `main`.
2.  **GitHub Actions / Render Hook**: Dispara build de Docker para Backend.
3.  **Vercel GitHub Integration**: Dispara build automático de Frontend (Angular).

---

**Aprobado por:** Arquitectura de Software - Antigravity Agent
**Fecha de Actualización:** Diciembre 2025
