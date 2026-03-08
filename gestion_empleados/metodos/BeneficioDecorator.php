<?php
/**
 * BeneficioDecorator — Patrón Decorator
 * Agrega beneficios adicionales al salario.
 */
class BeneficioDecorator {
    private float $salarioBase;
    private array $beneficios = [];

    public function __construct(float $salarioBase) {
        $this->salarioBase = $salarioBase;
    }

    public function agregarBonoBienvenida(float $monto): self {
        $this->beneficios[] = ['nombre' => 'Bono Bienvenida', 'monto' => $monto];
        return $this;
    }

    public function agregarBonoProductividad(float $porcentaje): self {
        $monto = $this->salarioBase * ($porcentaje / 100);
        $this->beneficios[] = ['nombre' => "Bono Productividad ({$porcentaje}%)", 'monto' => $monto];
        return $this;
    }

    public function agregarAuxilioTransporte(float $monto = 162000): self {
        $this->beneficios[] = ['nombre' => 'Auxilio de Transporte', 'monto' => $monto];
        return $this;
    }

    public function agregarBonoCumpleanos(float $monto = 50000): self {
        $this->beneficios[] = ['nombre' => 'Bono Cumpleaños', 'monto' => $monto];
        return $this;
    }

    public function calcularTotal(): array {
        $total = $this->salarioBase;
        foreach ($this->beneficios as $b) {
            $total += $b['monto'];
        }
        return [
            'salario_base' => $this->salarioBase,
            'beneficios'   => $this->beneficios,
            'total'        => $total,
        ];
    }
}
?>
