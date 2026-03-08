# 🚀 Gestión de Empleados — Guía de Instalación

## Estructura del proyecto

```
gestion_empleados/
├── conexion/
│   └── conexion.php          ← ⚠️ CONFIGURA AQUÍ TU BD
├── api/
│   ├── empleados.php         ← Endpoint CRUD empleados
│   ├── reportes.php          ← Endpoint nómina
│   └── vacaciones.php        ← Endpoint vacaciones
├── metodos/
│   ├── EmpleadoFactory.php
│   ├── EmpleadoManager.php
│   ├── CalculoSalario.php
│   ├── BeneficioDecorator.php
│   ├── NominaAdapter.php
│   └── Notificador.php
├── paginas/
│   ├── empleados.html        ← Lista de empleados
│   ├── registrar.html        ← Registrar empleado
│   ├── reportes.html         ← Nómina y reportes
│   └── vacaciones.html       ← Gestión de vacaciones
├── css/estilos.css
├── js/script.js
├── sql/gestion_empleados.sql ← Script SQL para crear la BD
└── index.html
```

---

## Paso 1 — Crear la base de datos

1. Abre **phpMyAdmin** (o MySQL Workbench).
2. Importa el archivo `sql/gestion_empleados.sql`.
3. Esto crea la BD `gestion_empleados` con las tablas y datos de prueba.

---

## Paso 2 — Configurar la conexión

Abre `conexion/conexion.php` y edita:

```php
define('DB_HOST', 'localhost');   // casi siempre localhost
define('DB_USER', 'root');        // tu usuario de MySQL
define('DB_PASS', '');            // tu contraseña (vacía por defecto en XAMPP)
define('DB_NAME', 'gestion_empleados');
```

---

## Paso 3 — Ejecutar el proyecto

Coloca la carpeta `gestion_empleados` dentro de:
- **XAMPP:** `C:/xampp/htdocs/`
- **WAMP:** `C:/wamp64/www/`
- **Linux:** `/var/www/html/`

Luego abre en el navegador:
```
http://localhost/gestion_empleados/
```

---

## ❗ Problema frecuente: "Error de conexión"

| Causa | Solución |
|-------|---------|
| MySQL no está corriendo | Inicia el servicio MySQL en XAMPP/WAMP |
| Usuario/contraseña incorrectos | Edita `conexion/conexion.php` |
| Base de datos no existe | Ejecuta `sql/gestion_empleados.sql` |
| PHP no instalado / versión antigua | Requiere PHP 7.4+ con extensión `mysqli` |

Para verificar la conexión, visita directamente:
```
http://localhost/gestion_empleados/api/empleados.php?accion=listar
```
Debe devolver un JSON con los empleados. Si muestra un error PHP, revisa los datos en `conexion.php`.
