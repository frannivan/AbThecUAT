# Análisis de Costos (Actualizado: Opciones Básicas)

Si tu objetivo es tener **10 demos** (portafolio) y no clientes reales pagando, el plan anterior es muy caro ($109).

Para demos, el reto es el **Backend (Java)**, que consume mucha RAM. Aquí tienes 2 caminos "Básicos" para lograrlo por menos de **$10 USD al mes**:

## 🛠️ Opción A: "El Servidor Único" (VPS) - Costo: ~$7-12 USD/mes
En lugar de pagar por cada app en la nube (PaaS), rentas una sola computadora potente en la nube (VPS) y metes todo ahí.

*   **Proveedor**: Hetzner (CPX21) o DigitalOcean (Droplet de $12).
*   **Capacidad**: Necesitas unos **4GB de RAM** mínimio para correr 10 Spring Boot apps juntas.
*   **Arquitectura**: Docker.
    *   1 Contenedor con Nginx (recibe el tráfico).
    *   10 Contenedores Backend (Spring Boot).
*   **Base de Datos**: Puedes instalar Postgres en el mismo servidor (Gratis) o seguir usando Neon Free.
*   **Frontend**: Sigue en Vercel (Gratis).
*   **Pros**: Muy barato. Tú controlas todo.
*   **Contras**: Tú administras el servidor (Linux, seguridad, actualizaciones).

## 🧠 Opción B: "Ingeniería Inteligente" (Gratis)
Si las 10 apps son "del mismo tipo" (ej: CRMs, Agendas, Dashboards), puedes usar **1 Solo Backend** para todas.

*   **Vercel**: 10 Proyectos Frontend distintos (`cliente1.vercel.app`, `cliente2.vercel.app`).
*   **Render**: **1 Solo Backend** (Gratis).
*   **El Truco**: Todos los frontends se conectan al mismo backend.
    *   El backend detecta quién le habla y filtra los datos: "Ah, vienes de `cliente1.vercel.app`, te doy los leads de la empresa 1".
*   **Costo Total**: **$0 USD**.
*   **Pros**: Gratis de por vida y mantenible.
*   **Contras**: Requiere programar un poco de lógica "Multi-tenant" en tu Java.

## 🏆 Resumen Recomendado para Portafolio

1.  **Vercel**: Plan Hobby (Gratis). Sube tus 10 frontends sin miedo.
2.  **Neon**: Plan Free (Gratis). Crea muchas bases de datos en tu proyecto único.
3.  **Backend**:
    *   Si sabes Linux: **VPS de $7 USD**.
    *   Si prefieres programar: **Opción B (1 Backend compartido)**.

De esta forma puedes tener tu imperio de 10 aplicaciones funcionando por casi nada.

---

# 👨‍💻 Guía de Implementación: Opción B (Backend Compartido)

Aquí tienes el paso a paso técnico para modificar tu proyecto actual y convertirlo en un sistema "Multi-Tenant" (Multi-inquilino) para tus demos.

## 1. Modificar la Base de Datos (Backend)

Necesitamos saber a qué demo pertenece cada dato (Lead, Cliente, etc.).
Agregaremos un campo `app_id` a tus entidades principales.

**En `Lead.java` (y otras entidades):**
```java
@Column(name = "app_id")
private String appId; // Ej: "demo-abtech", "demo-barberia"
```

**En `LeadRepository.java`:**
```java
// Filtrar siempre por appId
List<Lead> findByAppId(String appId);
long countByAppId(String appId);
```

**En `LeadService.java`:**
```java
// Al guardar, asegurar que el lead tenga el ID correcto
public Lead createLead(Lead lead, String appId) {
    lead.setAppId(appId);
    return leadRepository.save(lead);
}

// Al buscar, traer solo los de esa app
public List<Lead> getLeadsByApp(String appId) {
    return leadRepository.findByAppId(appId);
}
```

## 2. Identificar el Origen (Backend)

¿Cómo sabe el Backend quién le habla? Usaremos un **Header HTTP personalizado**.

**En `WebConfig.java` (o un Filtro):**
Intercepta todas las peticiones y extrae el header `X-App-ID`.

**En tus Controladores (`AdminController.java`):**
```java
@GetMapping("/leads")
public List<Lead> getAllLeads(@RequestHeader("X-App-ID") String appId) {
    return leadService.getLeadsByApp(appId);
}
```

## 3. Configurar los Frontends (Angular)

Cada demo tendrá su propia "identidad".

**En `environment.ts` (Demo 1: AbTech):**
```typescript
export const environment = {
    production: true,
    apiUrl: 'https://backend-compartido.onrender.com/api',
    appId: 'demo-abtech' // <--- IDENTIFICADOR ÚNICO
};
```

**En `environment.ts` (Demo 2: Barbería):**
```typescript
export const environment = {
    // ...
    appId: 'demo-barberia'
};
```

**En `AdminService.ts` (Interceptor):**
Agrega el header automáticamente a todas las llamadas.
```typescript
private getHeaders() {
    return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'X-App-ID': environment.appId // <--- MAGIA AQUÍ
    });
}
```

## 4. Resultado Final

1.  El usuario entra a `abtech.vercel.app`.
2.  Angular envía petición al Backend con header `X-App-ID: demo-abtech`.
3.  Java recibe el header, busca en la BD solo los leads que tengan `app_id = "demo-abtech"`.
4.  Java responde solo con esos datos.
5.  **¡Listo!** El mismo backend sirve a 10 sitios diferentes sin mezclar la información.

## 5. Comparativa de Aislamiento: ¿Qué es "Mejor"?

Tienes razón: separar los datos es **más limpio y seguro**. Pero hay niveles de separación con costos distintos:

| Nivel | Estrategia | ¿Cómo se ve en la BD? | Complejidad Java | Recomendado para... |
| :--- | :--- | :--- | :--- | :--- |
| **Básico** | **Shared Table** (`app_id`) | Una tabla gigante mezclada. | 🟢 Baja (1 hora) | Demos, MVPs. |
| **Medio** | **Schemas** (Esquemas) | Carpetas separadas: `abtech.leads`, `barber.leads`. | 🟡 Media (Configurar Hibernate) | SaaS Profesional. |
| **Alto** | **Database / User** | Bases totalmente distintas. | 🔴 Alta (Routing Datasource) | Bancos, Datos Críticos. |

### La Opción "Medio": Esquemas (Schemas)
Si no quieres mezclar datos pero tampoco quieres la complejidad extrema de múltiples bases de datos, usa **Schemas**.

1.  En tu BD creas "carpetas":
    *   `CREATE SCHEMA abtech;`
    *   `CREATE SCHEMA barberia;`
2.  En Java, configuras Hibernate para que haga `SET SEARCH_PATH TO abtech` automáticamente cuando detecta el header.

**Veredicto Final:**
*   Sigue con **`app_id`** si quieres terminar hoy.
*   Pásate a **Schemas** si quieres aprender arquitectura de software avanzada (te tomará unos días configurarlo).
