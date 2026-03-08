<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../conexion/conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $conn = getConexion();
    $rows = $conn->query("
        SELECT v.*, CONCAT(e.nombre,' ',e.apellido) AS empleado
        FROM vacaciones v JOIN empleados e ON e.id = v.empleado_id
        ORDER BY v.creado_en DESC
    ")->fetch_all(MYSQLI_ASSOC);
    $conn->close();
    echo json_encode($rows);
    exit;
}

if ($method === 'POST') {
    $body   = json_decode(file_get_contents('php://input'), true) ?? [];
    $accion = $body['accion'] ?? '';

    $conn = getConexion();

    if ($accion === 'solicitar') {
        $empId   = (int)$body['empleado_id'];
        $ini     = $body['fecha_inicio'];
        $fin     = $body['fecha_fin'];
        $dias    = (int)$body['dias'];
        $obs     = $body['observacion'] ?? '';

        $stmt = $conn->prepare("INSERT INTO vacaciones (empleado_id,fecha_inicio,fecha_fin,dias,observacion) VALUES (?,?,?,?,?)");
        $stmt->bind_param('isssi', $empId, $ini, $fin, $dias, $obs);
        $ok = $stmt->execute();
        $stmt->close();
        echo json_encode(['exito' => $ok, 'mensaje' => $ok ? 'Solicitud registrada.' : 'Error al registrar.']);

    } elseif ($accion === 'actualizar') {
        $id     = (int)$body['id'];
        $estado = $body['estado'];
        $stmt   = $conn->prepare("UPDATE vacaciones SET estado=? WHERE id=?");
        $stmt->bind_param('si', $estado, $id);
        $ok = $stmt->execute();
        $stmt->close();
        echo json_encode(['exito' => $ok, 'mensaje' => $ok ? "Vacación $estado." : 'Error.']);

    } else {
        echo json_encode(['error' => 'Acción no válida']);
    }

    $conn->close();
    exit;
}

echo json_encode(['error' => 'Método no permitido']);
?>
