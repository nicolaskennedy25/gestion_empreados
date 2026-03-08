<?php
require_once __DIR__ . '/EmpleadoFactory.php';
require_once __DIR__ . '/CalculoSalario.php';

/**
 * EmpleadoManager — Patrón Manager/Facade
 * Coordina operaciones complejas sobre empleados.
 */
class EmpleadoManager {

    public function listarEmpleados(): array {
        return EmpleadoFactory::obtenerTodos();
    }

    public function registrarEmpleado(array $datos): array {
        // Validaciones básicas
        foreach (['nombre','apellido','cargo','tipo','salario_base','fecha_ingreso'] as $campo) {
            if (empty($datos[$campo])) {
                return ['exito' => false, 'mensaje' => "El campo '$campo' es obligatorio."];
            }
        }
        $resultado = EmpleadoFactory::crearEmpleado($datos);
        if ($resultado['exito']) {
            return ['exito' => true, 'mensaje' => 'Empleado registrado correctamente.', 'id' => $resultado['id']];
        }
        return ['exito' => false, 'mensaje' => 'Error al registrar el empleado.'];
    }

    public function eliminarEmpleado(int $id): array {
        $ok = EmpleadoFactory::eliminar($id);
        return ['exito' => $ok, 'mensaje' => $ok ? 'Empleado eliminado.' : 'Error al eliminar.'];
    }
}
?>
