# Guía de Configuración: Chatbot Local

Se ha modificado el flujo del chatbot para incluir la preferencia de contacto (WhatsApp o Correo) y la captura del número telefónico.

## Archivos Modificados

1.  **Lógica del Componente:** [chatbot.ts](file:///Users/franivan/Documents/ProyectosWeb/AbTech/frontend/src/app/components/landing/chatbot/chatbot.ts)
    *   **Configuración del Flujo**: El método `selectOption` ahora detecta cuando el usuario elige "Hablar con Humano" y activa el estado `isWaitingForContactMethod`.
    *   **Nuevos Métodos**:
        *   `selectContactMethod(method)`: Maneja la transición según la elección del usuario.
        *   `submitPhone()`: Procesa el número de WhatsApp y muestra el mensaje final.
    *   **Validación**: Se añadió una validación de formato para el número telefónico en el constructor (`phoneForm`).

2.  **Plantilla (Vista):** [chatbot.html](file:///Users/franivan/Documents/ProyectosWeb/AbTech/frontend/src/app/components/landing/chatbot/chatbot.html)
    *   **Botones de Selección**: Se añadieron botones para "WHATSAPP" y "CORREO" que aparecen dinámicamente.
    *   **Input de Teléfono**: Se añadió un campo de entrada tipo `tel` que solo se activa si se selecciona WhatsApp.

## Cómo Personalizar los Textos

Si deseas cambiar los mensajes del Bot, revisa los siguientes puntos en `chatbot.ts`:

-   **Pregunta de contacto**: Línea ~76 (dentro de `selectOption`).
-   **Solicitud de número**: Línea ~87 (dentro de `selectContactMethod`).
-   **Confirmación final (Email)**: Línea ~89.
-   **Confirmación final (WhatsApp)**: Línea ~100 (dentro de `submitPhone`).

> [!NOTE]
> Estos cambios han sido aplicados **solo de manera local** y no han sido enviados al repositorio de Git (UAT), cumpliendo con tu solicitud.
