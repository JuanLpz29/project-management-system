# Sistema de gestión de proyectos

Aplicación web para gestionar de manera fácil los trabajadores y proyectos de una organización.

---

## Cómo ejecutar el proyecto

**Requisitos:** Node.js 18+ y npm.

1. **Backend**:
   ```bash
   cd backend && npm install && npm run dev
   ```
   Servidor en `http://localhost:3001`. La BD SQLite se crea al iniciar.

2. **Frontend** (en otra terminal):
   ```bash
   cd frontend && npm install && npm run dev
   ```
   App en `http://localhost:5173`.

---

## Decisiones técnicas

- **Estructura:** Backend en capas (routes → controllers → services) y frontend por componentes. Prioricé claridad y mantenibilidad sobre abstracciones extra; no hay repositorios ni DTOs.
- **Priorizado:** Cumplir el flujo pedido (CRUD trabajadores, CRUD proyectos, asignar workers a proyectos), validación en formularios, mensajes de error por campo y de éxito, y una UI usable con Tailwind.
- **Dejado fuera:** Autenticación, paginación, tests automatizados, variables de entorno para la URL del API, manejo explícito de errores de red en el frontend y feedback de carga (spinners).

---

## Mejoras futuras

- **Mejorar:** Paginación o búsqueda/filtros en listados; manejo de errores HTTP en el frontend con mensajes al usuario; variables de entorno para la URL del backend. Completar o mejorar la implementación de **GET por ID** y **DELETE** (trabajadores y/o proyectos): hoy el backend no expone esas rutas para workers; se podrían reintroducir en el API y dar soporte en la UI (detalle de worker, botón eliminar con confirmación).
- **Agregar:** Tests (unitarios en servicios, integración en API); autenticación y permisos; confirmación antes de borrar; historial o auditoría de asignaciones.
- **Cambiar:** Migrar a PostgreSQL (o similar) si crece el volumen; considerar React Query o SWR para cache y estado del servidor; extraer lógica de formularios a hooks reutilizables.

---

## Explicación conceptual

**1. ¿Cómo escalarías este sistema si tuviera 10.000 proyectos?**

- Sustituir SQLite por un motor con mejor concurrencia y soporte (PostgreSQL). Índices en columnas de búsqueda/filtro (nombre, fechas, cliente).
- Paginación en el API (`GET /projects?page=1&limit=20`) y en el frontend; evitar cargar toda la lista.
- Si hiciera falta más rendimiento: caché (Redis) para listados frecuentes. Mantener escrituras en una sola instancia de BD.

**2. ¿Qué cambiarías si múltiples usuarios lo usaran al mismo tiempo?**

- Autenticación de usuarios (JWT o sesiones) y un modelo "user" en BD.
- Evitar pisar datos: transacciones donde corresponda; versionado optimista (campo `version` o timestamps) si hubiera edición concurrente del mismo recurso.
- Frontend: no asumir que los datos son “solo míos”; refrescar o suscribirse a cambios (polling, WebSockets o Server-Sent Events) para ver actualizaciones de otros usuarios cuando sea relevante.

**3. ¿Cómo agregarías permisos por rol?**

- Definir roles (ej. `admin`, `manager`, `viewer`) y guardarlos en el usuario (tabla `users` con `role` o tabla `user_roles` si un usuario tiene varios).
- En el backend: middleware que, tras autenticar, compruebe el rol antes de cada ruta (ej. solo `admin` puede borrar proyectos; `manager` puede asignar workers).
- En el frontend: mostrar u ocultar acciones según el rol del usuario (ej. no mostrar “Eliminar” si es `viewer`). Las restricciones reales deben estar siempre en el API; el frontend solo mejora la UX.
