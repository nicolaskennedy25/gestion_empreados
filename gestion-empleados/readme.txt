## Código Malo — Code Smells Identificados

| # | Problema | Dónde | Impacto |
|---|----------|-------|---------|
| 1 | Variables globales | líneas 5-8 | Cualquier función modifica el estado sin control |
| 2 | Lógica de cálculo duplicada | líneas 25-75 | Cambiar una regla obliga a editar 3 funciones |
| 3 | Validaciones copia-pegadas | 4 funciones distintas | Bug en validación = arreglar en 4 lugares |
| 4 | Función gigante (generarReporte) | líneas 220-310 | Imposible testear o mantener |
| 5 | If-else repetidos por tipo | múltiples lugares | Agregar un tipo nuevo rompe todo |
| 6 | HTML mezclado con lógica | generarReporte() | Vista y datos acoplados |
| 7 | Sin manejo de errores | todo el archivo | Fragilidad total ante datos inesperados |