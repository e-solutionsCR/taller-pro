# 📔 Bitácora de Desarrollo - Proyecto TallerPro
**Última actualización:** 04 Feb 2026
**Estado:** Funcional en Producción

---

## 🚀 Resumen de Funcionalidades Implementadas (Sesión Actual)

### 1. 🔍 Búsqueda y Filtros
- **Implementación:** Se agregaron campos de búsqueda y filtro por estado en el Dashboard principal.
- **Detalle:** Busca por código, cliente, cédula o dispositivo. Filtra por estados (RECIBIDO, EN_REPARACION, etc.).

### 2. 👥 Módulo de Clientes
- **Nueva Página:** `/clients`
- **Funcionalidad:** Lista completa de clientes con búsqueda.
- **Detalle Cliente:** Página individual `/clients/[id]` con historial completo de tickets y total gastado.
- **APIs:** `/api/clients/all` y `/api/clients/[id]`.

### 3. 🖨️ Impresión Térmica
- **Componente:** `ThermalPrint.tsx`
- **Funcionalidad:** Imprime recibos optimizados para impresoras de **80mm**.
- **Ubicación:** Botón verde en el detalle del ticket.

### 4. 🔔 Sistema de Notificaciones
- **Componente:** `NotificationPanel.tsx` en el Sidebar.
- **Lógica:** Polling cada 30s para detectar equipos listos, en reparación o nuevos ingresos.

### 5. 📊 Estadísticas Avanzadas
- **Nueva Página:** `/stats`
- **Métricas:** KPI cards, gráficos de barras (tickets por mes, dispositivos comunes) y cálculo de ingresos.

### 6. 📥 Exportación a Excel
- **Componente:** `ExportButton.tsx`
- **Funcionalidad:** Genera un CSV compatible con Excel con todos los tickets del sistema.

### 7. 🛠️ Sistema de Mantenimientos (Catálogos)
- **Nueva Página:** `/configuracion`
- **Funcionalidad:** Gestión CRUD de **Tipos de Dispositivos** y **Marcas**.
- **Integración:** El formulario de "Nuevo Ticket" ahora usa dropdowns dinámicos cargados desde estos catálogos.

### 8. 🛡️ Mantenimiento de Usuarios
- **Nueva Página:** `/users`
- **Funcionalidad:** Alta, baja y modificación de usuarios con roles y contraseñas.
- **Seguridad:** Contraseñas encriptadas con bcrypt.
- **APIs:** CRUD completo en `/api/users`.

### 9. 🔐 Sistema de Autenticación y Seguridad
- **Implementación:** `next-auth` (v4) con Credentials Provider.
- **Login:** Nueva página `/login` con diseño moderno y manejo de errores.
- **Protección:** Middleware (`middleware.ts`) protege todas las rutas excepto login y assets estáticos.
- **Backend:** `lib/auth.ts` con configuración segura y hashing bcrypt.
- **Usuario Admin:** Script `create_admin.js` para generar usuario inicial (admin@tallerpro.com / admin).

---

## 🔧 Desafíos Técnicos y Soluciones (IMPORTANTE LEER)

Esta sección documenta los problemas críticos encontrados y cómo se resolvieron. **Leer esto antes de tocar la infraestructura.**

### 1. 🔌 Conexión a Base de Datos (Docker Network)
- **Problema:** La aplicación no conectaba a la BD usando la IP del gateway `10.0.1.1`.
- **Causa:** La base de datos está en un contenedor con IP dinámica. 
- **Solución:**
  - Se identificó el nombre del contenedor de MariaDB: **`s4c4s0kg00cscg0ks8k8go8o`**.
  - La IP interna correcta era `10.0.1.8` (en ese momento).
  - Se configuró la variable de entorno `DATABASE_URL` usando el **nombre del contenedor** para resolución DNS automática en la red Docker `coolify`.
  - **Connection String:** `mysql://mariadb:XXXXX@s4c4s0kg00cscg0ks8k8go8o:3306/ticketsystem`

### 2. ⚛️ Compatibilidad Prisma 6/7
- **Problema:** Error `P1012` al intentar migrar. Conflicto entre `schema.prisma` y `prisma.config.ts`.
- **Solución:** Se eliminó `prisma.config.ts` y se mantuvo el parámetro `url = env("DATABASE_URL")` en `schema.prisma` para restaurar compatibilidad.

### 3. 📅 Error de Fechas (P2020)
- **Problema:** Prisma lanzaba error `P2020` ("invalid datetime value") al leer los catálogos.
- **Causa:** Al insertar datos manualmente vía SQL, el campo `updatedAt` quedó en `0000-00-00 00:00:00.000` porque no tenía default.
- **Solución:** Ejecución de SQL directo para corregir fechas:
  ```sql
  UPDATE TipoDispositivo SET updatedAt = NOW() WHERE updatedAt = 0;
  UPDATE Marca SET updatedAt = NOW() WHERE updatedAt = 0;
  ```

### 4. 📦 Despliegue de Código en Docker
- **Problema:** Los cambios en el código (`/app`) no se reflejaban en el contenedor.
- **Causa:** El contenedor anterior no tenía el volumen montado correctamente.
- **Solución:** Se recreó el contenedor montando explícitamente el directorio:
  ```bash
  docker run -v /root/taller-pro-manual:/app ...
  ```

---

## 🖥️ Datos de Entorno

- **Ruta del Proyecto Local:** `d:\000_E-solutions\repair-shop-app`
- **Ruta en Servidor:** `/root/taller-pro-manual`
- **IP Servidor:** `217.216.89.248`
- **Puerto App:** `3000` (Expuesto)
- **Contenedor App:** `taller-pro-v1`
- **Red Docker:** `coolify`

---

## 📝 Pendientes / Siguientes Pasos

1. **Seguridad / Login:** Integrar NextAuth con el nuevo modelo de Usuarios.
2. **Facturación Real:** Integración con Hacienda.
3. **Mantenimiento de Clientes:** Completar edición y actualizaciones.

---
**Nota para el Agente:** Si necesitas reiniciar el servidor, usa siempre el comando de docker completo documentado en los logs de la sesión anterior que incluye la red `coolify`, el volumen `/app` y la `DATABASE_URL` con el host correcto.
