<?php
require_once __DIR__ . '/../conexion/conexion.php';

class CalculoSalario {
    const SALUD   = 0.04;
    const PENSION = 0.04;

    public static function calcular(int $empleadoId, string $periodo, float $bonificaciones = 0): array {
        $conn = getConexion();
        $stmt = $conn->prepare("SELECT salario_base FROM empleados WHERE id=? AND activo=1");
        $stmt->bind_param('i', $empleadoId);
        $stmt->execute();
        $emp = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        if (!$emp) { $conn->close(); return ['exito'=>false,'mensaje'=>'Empleado no encontrado.']; }

        $base        = (float)$emp['salario_base'];
        $deducciones = $base * (self::SALUD + self::PENSION);
        $neto        = $base + $bonificaciones - $deducciones;

        $stmt2 = $conn->prepare("INSERT INTO nomina (empleado_id,periodo,salario_base,bonificaciones,deducciones,salario_neto) VALUES (?,?,?,?,?,?)");
        $stmt2->bind_param('isdddd', $empleadoId, $periodo, $base, $bonificaciones, $deducciones, $neto);
        $ok = $stmt2->execute();
        $stmt2->close(); $conn->close();
        return ['exito'=>$ok,'salario_base'=>$base,'bonificaciones'=>$bonificaciones,'deducciones'=>$deducciones,'salario_neto'=>$neto];
    }

    public static function obtenerNomina(string $periodo=''): array {
        $conn = getConexion();
        if ($periodo) {
            $stmt = $conn->prepare("SELECT n.*, CONCAT(e.nombre,' ',e.apellido) AS empleado, e.cargo FROM nomina n JOIN empleados e ON e.id=n.empleado_id WHERE n.periodo=? ORDER BY n.generado_en DESC");
            $stmt->bind_param('s', $periodo); $stmt->execute();
            $rows = $stmt->get_result()->fetch_all(MYSQLI_ASSOC); $stmt->close();
        } else {
            $rows = $conn->query("SELECT n.*, CONCAT(e.nombre,' ',e.apellido) AS empleado, e.cargo FROM nomina n JOIN empleados e ON e.id=n.empleado_id ORDER BY n.generado_en DESC LIMIT 100")->fetch_all(MYSQLI_ASSOC);
        }
        $conn->close(); return $rows;
    }
}
