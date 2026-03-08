<?php
/**
 * Notificador — Patrón Observer (simplificado)
 * Genera notificaciones/alertas del sistema.
 */
class Notificador {
    private static array $notificaciones = [];

    public static function agregar(string $tipo, string $mensaje): void {
        self::$notificaciones[] = ['tipo' => $tipo, 'mensaje' => $mensaje, 'ts' => date('Y-m-d H:i:s')];
    }

    public static function notificarRegistro(string $nombre): void {
        self::agregar('success', "Empleado '$nombre' registrado exitosamente.");
    }

    public static function notificarEliminacion(string $nombre): void {
        self::agregar('warning', "Empleado '$nombre' fue desactivado del sistema.");
    }

    public static function notificarNomina(string $periodo): void {
        self::agregar('info', "Nómina del período '$periodo' generada correctamente.");
    }

    public static function obtener(): array {
        return self::$notificaciones;
    }

    public static function limpiar(): void {
        self::$notificaciones = [];
    }
}
?>
