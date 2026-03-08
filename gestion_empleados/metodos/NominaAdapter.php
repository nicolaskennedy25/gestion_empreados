<?php
require_once __DIR__ . '/CalculoSalario.php';

/**
 * NominaAdapter — Patrón Adapter
 * Adapta los datos de nómina para exportarlos en distintos formatos.
 */
class NominaAdapter {

    public static function paraTablaHTML(array $filas): string {
        if (empty($filas)) return '<p class="text-center text-muted">No hay registros.</p>';
        $html  = '<table class="table table-striped table-hover">';
        $html .= '<thead><tr><th>Empleado</th><th>Cargo</th><th>Período</th><th>Salario Base</th><th>Bonificaciones</th><th>Deducciones</th><th>Salario Neto</th></tr></thead><tbody>';
        foreach ($filas as $r) {
            $html .= "<tr>
                <td>{$r['empleado']}</td>
                <td>{$r['cargo']}</td>
                <td>{$r['periodo']}</td>
                <td>$" . number_format($r['salario_base'],2) . "</td>
                <td>$" . number_format($r['bonificaciones'],2) . "</td>
                <td>$" . number_format($r['deducciones'],2) . "</td>
                <td><strong>$" . number_format($r['salario_neto'],2) . "</strong></td>
            </tr>";
        }
        $html .= '</tbody></table>';
        return $html;
    }

    public static function paraJSON(array $filas): string {
        return json_encode($filas, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }

    public static function paraCSV(array $filas): string {
        if (empty($filas)) return '';
        $cols = array_keys($filas[0]);
        $csv  = implode(',', $cols) . "\n";
        foreach ($filas as $r) {
            $csv .= implode(',', array_values($r)) . "\n";
        }
        return $csv;
    }
}
?>
