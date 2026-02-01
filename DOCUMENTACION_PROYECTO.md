# 📋 Documentación del Proyecto Phoenix ERP

Este documento describe la configuración inicial, archivos creados y comandos utilizados para el proyecto **Phoenix ERP** - un sistema de gestión de inventario multi-sucursal.

---

## 📂 Estructura de Archivos

### 1. `docker-compose.yml`

**Propósito:** Orquestación de contenedores Docker para la base de datos y la interfaz de administración.

**Contenido:**

- **Servicio `db`:** PostgreSQL 16 Alpine
  - Usuario: `admin_user`
  - Base de datos: `phoenix_inventory`
  - Puerto expuesto: `5432`
  - Volumen persistente: `postgres_data`
  - Script de inicialización: `init.sql` (montado automáticamente)

- **Servicio `pgadmin`:** Interfaz gráfica para PostgreSQL
  - Acceso web: `http://localhost:5050`
  - Email: `admin@phoenix.com`
  - Contraseña: `admin`

- **Red:** `phoenix_network` (tipo bridge) para comunicación entre contenedores

**Correcciones aplicadas:**

- ✅ Indentación YAML correcta (servicios anidados bajo `services`)
- ✅ Sintaxis de volúmenes y redes arreglada
- ✅ Comentarios ortográficos corregidos

---

### 2. `init.sql`

**Propósito:** Script de inicialización de la base de datos que se ejecuta automáticamente al crear el contenedor de PostgreSQL.

**Estructura de la base de datos:**

#### Tablas principales:

1. **`companies`** (Empresas/Tenants)
   - Entidad raíz del sistema multi-empresa
   - Campos: `id`, `name`, `tax_id`, `is_active`, etc.

2. **`users`** (Usuarios)
   - Gestión de usuarios por empresa
   - Roles: `super_admin`, `admin`, `manager`, `staff`
   - Autenticación con `password_hash`

3. **`branches`** (Sucursales)
   - Ubicaciones físicas por empresa
   - Soporte para sucursal principal (`is_main`)
   - Código único por sucursal (`branch_code`)

4. **`products`** (Catálogo de Productos)
   - SKU único por empresa
   - Soporte para servicios sin stock físico
   - Metadatos flexibles en formato JSONB
   - Alerta de stock mínimo

5. **`stock_levels`** (Niveles de Inventario Actuales)
   - Estado actual del stock por producto y sucursal
   - Cantidad con precisión decimal (15,2)
   - Constraint único: un producto por sucursal

6. **`inventory_movements`** (Movimientos de Inventario)
   - Historial completo de transacciones
   - Tipos: `INBOUND`, `OUTBOUND`, `TRANSFER_IN`, `TRANSFER_OUT`, `ADJUSTMENT`, `SALE`, `RETURN`
   - Datos financieros: `unit_cost`, `total_cost`
   - Auditoría: quién y cuándo realizó cada movimiento

#### Características especiales:

- ✅ Extensión UUID para claves primarias seguras
- ✅ Cascadas de eliminación configuradas (`ON DELETE CASCADE`)
- ✅ Índices optimizados para consultas frecuentes
- ✅ Timestamps automáticos con zona horaria (`timestamptz`)
- ✅ Constraints de integridad y valores únicos

---

### 3. `.gitignore`

**Propósito:** Excluir archivos sensibles y generados del control de versiones.

**Exclusiones:**

- **Node.js:** `node_modules/`, `dist/`, `npm-debug.log`
- **Variables de entorno:** `.env`, `.env.local`
- **Docker:** `postgres_data/`, `pgadmin_data/`, `*.log`
- **Sistema:** `.DS_Store`, `Thumbs.db`
- **IDEs:** `.vscode/`, `.idea/`

---

## 🐳 Comandos Docker Utilizados

### 1. `docker logs phoenix_db`

**Propósito:** Verificar los logs del contenedor de PostgreSQL.

**Cuándo usar:**

- Comprobar que la base de datos inició correctamente
- Verificar que el script `init.sql` se ejecutó sin errores
- Diagnosticar problemas de conexión o configuración

**Salida esperada:**

```
PostgreSQL init process complete; ready for start up.
database system is ready to accept connections
```

---

### 2. Comandos implícitos (probablemente ejecutados):

#### `docker-compose up -d`

Levanta todos los servicios en segundo plano.

```bash
docker-compose up -d
```

#### `docker-compose down`

Detiene y elimina los contenedores (mantiene volúmenes).

```bash
docker-compose down
```

#### `docker ps`

Lista contenedores activos.

```bash
docker ps
```

---

## 📝 Comandos Git Utilizados

### `git push -u origin develop`

**Propósito:** Subir la rama `develop` al repositorio remoto y configurarla como upstream.

**Desglose del comando:**

- `git push`: Envía commits locales al remoto
- `-u`: Establece el tracking (upstream) de la rama
- `origin`: Nombre del repositorio remoto (por convención)
- `develop`: Nombre de la rama que se está subiendo

**Resultado:**

- ✅ Código y configuración respaldados en el repositorio remoto
- ✅ Futuras operaciones `git pull` y `git push` funcionarán sin especificar rama

---

## 🚀 Flujo de Trabajo Resumido

1. **Configuración inicial:**

   ```bash
   # Crear archivos: docker-compose.yml, init.sql, .gitignore
   ```

2. **Levantar infraestructura:**

   ```bash
   docker-compose up -d
   ```

3. **Verificar logs:**

   ```bash
   docker logs phoenix_db
   ```

4. **Acceder a pgAdmin:**
   - URL: `http://localhost:5050`
   - Configurar conexión a `phoenix_db` (host: `db`, puerto: `5432`)

5. **Versionado:**
   ```bash
   git add .
   git commit -m "feat: configuración inicial de Docker y base de datos"
   git push -u origin develop
   ```

---

## 🔧 Próximos Pasos Sugeridos

- [ ] Crear API REST (Node.js/Express o Python/FastAPI)
- [ ] Implementar autenticación JWT
- [ ] Desarrollar frontend (React/Vue/Angular)
- [ ] Agregar seeders para datos de prueba
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Documentar API con Swagger/OpenAPI

---

## 📌 Notas Técnicas

**Stack tecnológico:**

- **Base de datos:** PostgreSQL 16
- **Gestión de contenedores:** Docker + Docker Compose
- **Control de versiones:** Git (rama `develop`)
- **Arquitectura:** Multi-tenant (por empresa)

**Seguridad:**

- ⚠️ Cambiar credenciales antes de producción
- ⚠️ Usar variables de entorno para secretos
- ⚠️ Implementar hashing de passwords (bcrypt/argon2)
- ⚠️ Configurar SSL/TLS para conexiones a base de datos

---

**Fecha de creación:** Febrero 2026  
**Autor:** Phoenix ERP Team
