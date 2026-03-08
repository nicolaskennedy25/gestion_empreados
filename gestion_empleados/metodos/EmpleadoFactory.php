<?php
require_once __DIR__ . '/../conexion/conexion.php';

/**
 * EmpleadoFactory — Patrón Factory
 * Gestiona la creación y lectura de empleados en la BD.
 */
class EmpleadoFactory {

    public static function crearEmpleado(array $datos): array {
        $conn = getConexion();
        $stmt = $conn->prepare("
            INSERT INTO empleados (nombre, apellido, cargo, tipo, salario_base, fecha_ingreso, email, telefono)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            'ssssdsss',
            $datos['nombre'], $datos['apellido'], $datos['cargo'],
            $datos['tipo'],   $datos['salario_base'], $datos['fecha_ingreso'],
            $datos['email'],  $datos['telefono']
        );
        $ok = $stmt->execute();
        $id = $conn->insert_id;
        $stmt->close();
        $conn->close();
        return ['exito' => $ok, 'id' => $id];
    }

    public static function obtenerTodos(): array {
        $conn = getConexion();
        $result = $conn->query("SELECT * FROM empleados WHERE activo = 1 ORDER BY nombre");
        $empleados = $result->fetch_all(MYSQLI_ASSOC);
        $conn->close();
        return $empleados;
    }

    public static function obtenerPorId(int $id): ?array {
        $conn = getConexion();
        $stmt = $conn->prepare("SELECT * FROM empleados WHERE id = ? AND activo = 1");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $emp = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        $conn->close();
        return $emp;
    }

    public static function actualizar(int $id, array $datos): bool {
        $conn = getConexion();
        $stmt = $conn->prepare("
            UPDATE empleados SET nombre=?, apellido=?, cargo=?, tipo=?, salario_base=?, email=?, telefono=?
            WHERE id=?
        ");
        $stmt->bind_param(
            'ssssdss i',
            $datos['nombre'], $datos['apellido'], $datos['cargo'],
            $datos['tipo'],   $datos['salario_base'],
            $datos['email'],  $datos['telefono'], $id
        );
        $ok = $stmt->execute();
        $stmt->close();
        $conn->close();
        return $ok;
    }

    public static function eliminar(int $id): bool {
        $conn = getConexion();
        $stmt = $conn->prepare("UPDATE empleados SET activo=0 WHERE id=?");
        $stmt->bind_param('i', $id);
        $ok = $stmt->execute();
        $stmt->close();
        $conn->close();
        return $ok;
    }
}
?>
