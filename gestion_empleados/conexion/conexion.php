<?php
// =============================================
//  CONFIGURACIÓN DE CONEXIÓN A LA BASE DE DATOS
// =============================================
// ⚠️ Cambia estos valores según tu entorno:

define('DB_HOST', 'localhost');
define('DB_USER', 'root');       // Tu usuario de MySQL
define('DB_PASS', '');           // Tu contraseña de MySQL
define('DB_NAME', 'gestion_empleados');
define('DB_PORT', 3306);

function getConexion() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode([
            'error' => true,
            'mensaje' => 'Error de conexión: ' . $conn->connect_error
        ]));
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}
?>
