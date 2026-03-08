<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../metodos/CalculoSalario.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $accion = $_GET['accion'] ?? '';
    if ($accion === 'historial') {
        $periodo = $_GET['periodo'] ?? '';
        echo json_encode(CalculoSalario::obtenerNomina($periodo));
    } else {
        echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}

if ($method === 'POST') {
    $body   = json_decode(file_get_contents('php://input'), true) ?? [];
    $accion = $body['accion'] ?? '';

    if ($accion === 'generar') {
        $empId        = (int)($body['empleado_id'] ?? 0);
        $periodo      = $body['periodo'] ?? '';
        $bonificaciones = (float)($body['bonificaciones'] ?? 0);

        if (!$empId || !$periodo) {
            echo json_encode(['exito' => false, 'mensaje' => 'Empleado y período son obligatorios.']);
            exit;
        }
        echo json_encode(CalculoSalario::calcular($empId, $periodo, $bonificaciones));
    } else {
        echo json_encode(['error' => 'Acción no válida']);
    }
    exit;
}

echo json_encode(['error' => 'Método no permitido']);
?>
