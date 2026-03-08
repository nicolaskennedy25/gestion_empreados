<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../metodos/EmpleadoManager.php';

$manager = new EmpleadoManager();
$method  = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $accion = $_GET['accion'] ?? '';
    if ($accion === 'listar') {
        echo json_encode($manager->listarEmpleados());
    } elseif ($accion === 'obtener' && isset($_GET['id'])) {
        echo json_encode(EmpleadoFactory::obtenerPorId((int)$_GET['id']));
    } else {
        echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}

if ($method === 'POST') {
    $body   = json_decode(file_get_contents('php://input'), true) ?? [];
    $accion = $body['accion'] ?? '';

    if ($accion === 'registrar') {
        echo json_encode($manager->registrarEmpleado($body));
    } elseif ($accion === 'eliminar') {
        echo json_encode($manager->eliminarEmpleado((int)$body['id']));
    } else {
        echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}

echo json_encode(['error' => 'Método no permitido']);
?>
