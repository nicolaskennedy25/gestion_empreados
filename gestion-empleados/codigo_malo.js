// =============================================
// codigo_malo.js
// =============================================

var empleados = [];
var vacaciones = [];
var contadorId = 1;
var contadorVacId = 1;

// -----------------------------------------------
// NAVEGACION
// -----------------------------------------------
function mostrarSeccion(id) {
    var secciones = ['inicio', 'empleados', 'registrar', 'reportes', 'vacaciones'];
    for (var i = 0; i < secciones.length; i++) {
        document.getElementById('sec-' + secciones[i]).classList.remove('activa');
        document.getElementById('nav-' + secciones[i]).classList.remove('active');
    }
    document.getElementById('sec-' + id).classList.add('activa');
    document.getElementById('nav-' + id).classList.add('active');

    if (id == 'empleados') renderTablaEmpleados();
    if (id == 'vacaciones') {
        actualizarSelectEmpleados();
        renderTablaVacaciones();
    }
}


// -----------------------------------------------
// PROBLEMA 1: Cálculo de salario diferente
// para cada tipo — lógica duplicada y dispersa,
// sin usar polimorfismo ni estrategia común
// -----------------------------------------------

function calcularSalarioTiempoCompleto(salarioBase) {
    var salario = salarioBase;
    var salud = salario * 0.04;
    var pension = salario * 0.04;
    var salarioFinal = salario - salud - pension;
    // tiempo completo tiene bono del 10%
    var bono = salario * 0.10;
    salarioFinal = salarioFinal + bono;
    // tiempo completo tiene auxilio de transporte completo
    salarioFinal = salarioFinal + 162000;
    return salarioFinal;
}

function calcularSalarioMedioTiempo(salarioBase) {
    var sal = salarioBase;
    var s = sal * 0.04;
    var p = sal * 0.04;
    var resultado = sal - s - p;
    // medio tiempo NO tiene bono
    // medio tiempo tiene solo mitad del auxilio
    resultado = resultado + 81000;
    return resultado;
}

function calcularSalarioContratista(salarioBase) {
    var base = salarioBase;
    // contratista paga retencion en la fuente, no deducciones de nomina
    var retencion = 0;
    if (base > 4000000) {
        retencion = base * 0.11;
    } else if (base > 2000000) {
        retencion = base * 0.06;
    } else {
        retencion = 0;
    }
    // contratista no tiene bono ni auxilio
    var final = base - retencion;
    return final;
}

function calcularSalario(tipo, salarioBase) {
    // mismo if/else repetido en varios lugares del codigo
    if (tipo == 'tiempo_completo') {
        return calcularSalarioTiempoCompleto(parseFloat(salarioBase));
    } else if (tipo == 'medio_tiempo') {
        return calcularSalarioMedioTiempo(parseFloat(salarioBase));
    } else if (tipo == 'contratista') {
        return calcularSalarioContratista(parseFloat(salarioBase));
    }
    return 0;
}


// -----------------------------------------------
// PROBLEMA 2: Validaciones repetidas
// La misma validacion copia-pegada en cada funcion
// -----------------------------------------------

function registrarEmpleado() {
    // validacion — copiada identica en solicitarVacaciones y generarReporte
    var nombre   = document.getElementById('reg-nombre').value;
    var apellido = document.getElementById('reg-apellido').value;
    var cargo    = document.getElementById('reg-cargo').value;
    var tipo     = document.getElementById('reg-tipo').value;
    var salario  = document.getElementById('reg-salario').value;
    var fecha    = document.getElementById('reg-fecha').value;

    if (nombre == '' || nombre == null || nombre == undefined) {
        mostrarAlerta('alerta-reg', 'El nombre es obligatorio', 'error');
        return;
    }
    if (nombre.length < 2) {
        mostrarAlerta('alerta-reg', 'El nombre es muy corto', 'error');
        return;
    }
    if (apellido == '' || apellido == null || apellido == undefined) {
        mostrarAlerta('alerta-reg', 'El apellido es obligatorio', 'error');
        return;
    }
    if (apellido.length < 2) {
        mostrarAlerta('alerta-reg', 'El apellido es muy corto', 'error');
        return;
    }
    if (cargo == '' || cargo == null || cargo == undefined) {
        mostrarAlerta('alerta-reg', 'El cargo es obligatorio', 'error');
        return;
    }
    if (tipo == '' || tipo == null || tipo == undefined) {
        mostrarAlerta('alerta-reg', 'Selecciona un tipo de contrato', 'error');
        return;
    }
    if (salario == '' || salario == null || salario == undefined) {
        mostrarAlerta('alerta-reg', 'El salario es obligatorio', 'error');
        return;
    }
    if (salario <= 0) {
        mostrarAlerta('alerta-reg', 'El salario debe ser mayor a 0', 'error');
        return;
    }
    if (fecha == '' || fecha == null || fecha == undefined) {
        mostrarAlerta('alerta-reg', 'La fecha es obligatoria', 'error');
        return;
    }

    var salarioCalculado = calcularSalario(tipo, salario);

    empleados.push({
        id: contadorId,
        nombre: nombre,
        apellido: apellido,
        cargo: cargo,
        tipo: tipo,
        salarioBase: parseFloat(salario),
        salarioCalculado: salarioCalculado,
        fecha: fecha
    });
    contadorId++;

    mostrarAlerta('alerta-reg', 'Empleado registrado correctamente', 'ok');
    document.getElementById('reg-nombre').value   = '';
    document.getElementById('reg-apellido').value = '';
    document.getElementById('reg-cargo').value    = '';
    document.getElementById('reg-tipo').value     = '';
    document.getElementById('reg-salario').value  = '';
    document.getElementById('reg-fecha').value    = '';
}

function eliminarEmpleado(id) {
    // validacion — MISMA validacion de id copiada aqui otra vez
    if (id == '' || id == null || id == undefined) {
        alert('ID invalido');
        return;
    }
    if (id <= 0) {
        alert('ID debe ser mayor a 0');
        return;
    }
    if (!confirm('¿Deseas eliminar este empleado?')) return;

    var nuevos = [];
    for (var i = 0; i < empleados.length; i++) {
        if (empleados[i].id != id) nuevos.push(empleados[i]);
    }
    empleados = nuevos;
    renderTablaEmpleados();
    actualizarSelectEmpleados();
}

function solicitarVacaciones() {
    // validacion — MISMA validacion copiada por tercera vez
    var empId = document.getElementById('vac-empleado').value;
    var ini   = document.getElementById('vac-inicio').value;
    var fin   = document.getElementById('vac-fin').value;
    var dias  = parseInt(document.getElementById('vac-dias').value);

    if (empId == '' || empId == null || empId == undefined) {
        mostrarAlerta('alerta-vac', 'Selecciona un empleado', 'error');
        return;
    }
    if (ini == '' || ini == null || ini == undefined) {
        mostrarAlerta('alerta-vac', 'La fecha de inicio es obligatoria', 'error');
        return;
    }
    if (fin == '' || fin == null || fin == undefined) {
        mostrarAlerta('alerta-vac', 'La fecha fin es obligatoria', 'error');
        return;
    }
    if (dias == '' || dias == null || dias == undefined) {
        mostrarAlerta('alerta-vac', 'Los dias son obligatorios', 'error');
        return;
    }
    if (dias <= 0) {
        mostrarAlerta('alerta-vac', 'Los dias deben ser mayor a 0', 'error');
        return;
    }

    var emp = null;
    for (var i = 0; i < empleados.length; i++) {
        if (empleados[i].id == empId) emp = empleados[i];
    }

    vacaciones.push({
        id: contadorVacId,
        empleadoId: parseInt(empId),
        empleado: emp ? emp.nombre + ' ' + emp.apellido : '?',
        inicio: ini,
        fin: fin,
        dias: dias,
        estado: 'pendiente'
    });
    contadorVacId++;

    mostrarAlerta('alerta-vac', 'Solicitud registrada correctamente', 'ok');
    document.getElementById('vac-empleado').value = '';
    document.getElementById('vac-inicio').value   = '';
    document.getElementById('vac-fin').value      = '';
    document.getElementById('vac-dias').value     = '';
    renderTablaVacaciones();
}

function cambiarEstadoVacacion(id, estado) {
    for (var i = 0; i < vacaciones.length; i++) {
        if (vacaciones[i].id == id) {
            vacaciones[i].estado = estado;
        }
    }
    renderTablaVacaciones();
}


// -----------------------------------------------
// PROBLEMA 3: Función gigante de reportes
// Cálculos, estadísticas, conteos y construcción
// del HTML todo mezclado en una sola función
// -----------------------------------------------

function generarReporte() {
    // validacion — MISMA validacion copiada cuarta vez
    if (empleados == null || empleados == undefined) {
        alert('No hay datos');
        return;
    }
    if (empleados.length == 0) {
        document.getElementById('contenido-reporte').innerHTML =
          '<div class="card" style="text-align:center;color:var(--muted);padding:3rem">No hay empleados para generar reporte</div>';
        return;
    }

    // contar por tipo
    var totalTC = 0, totalMT = 0, totalCO = 0;
    for (var i = 0; i < empleados.length; i++) {
        if (empleados[i].tipo == 'tiempo_completo') totalTC++;
        else if (empleados[i].tipo == 'medio_tiempo') totalMT++;
        else if (empleados[i].tipo == 'contratista')  totalCO++;
    }

    // sumar salarios por tipo
    var sumaTC = 0, sumaMT = 0, sumaCO = 0;
    for (var j = 0; j < empleados.length; j++) {
        if (empleados[j].tipo == 'tiempo_completo') sumaTC += empleados[j].salarioCalculado;
        if (empleados[j].tipo == 'medio_tiempo')    sumaMT += empleados[j].salarioCalculado;
        if (empleados[j].tipo == 'contratista')     sumaCO += empleados[j].salarioCalculado;
    }

    // promedios por tipo
    var promTC = totalTC > 0 ? sumaTC / totalTC : 0;
    var promMT = totalMT > 0 ? sumaMT / totalMT : 0;
    var promCO = totalCO > 0 ? sumaCO / totalCO : 0;

    // totales generales, maximo, minimo
    var totalGeneral = 0, promGeneral = 0;
    var salMaximo = 0, salMinimo = 999999999;
    var nombreMax = '', nombreMin = '';
    for (var k = 0; k < empleados.length; k++) {
        totalGeneral += empleados[k].salarioCalculado;
        if (empleados[k].salarioCalculado > salMaximo) {
            salMaximo = empleados[k].salarioCalculado;
            nombreMax = empleados[k].nombre + ' ' + empleados[k].apellido;
        }
        if (empleados[k].salarioCalculado < salMinimo) {
            salMinimo = empleados[k].salarioCalculado;
            nombreMin = empleados[k].nombre + ' ' + empleados[k].apellido;
        }
    }
    promGeneral = totalGeneral / empleados.length;

    // empleado mas antiguo y mas reciente
    var fechaAntigua = empleados[0].fecha, nombreAntiguo = empleados[0].nombre + ' ' + empleados[0].apellido;
    var fechaReciente = empleados[0].fecha, nombreReciente = empleados[0].nombre + ' ' + empleados[0].apellido;
    for (var m = 1; m < empleados.length; m++) {
        if (empleados[m].fecha < fechaAntigua) {
            fechaAntigua  = empleados[m].fecha;
            nombreAntiguo = empleados[m].nombre + ' ' + empleados[m].apellido;
        }
        if (empleados[m].fecha > fechaReciente) {
            fechaReciente  = empleados[m].fecha;
            nombreReciente = empleados[m].nombre + ' ' + empleados[m].apellido;
        }
    }

    // construir HTML del reporte — mezclado con toda la logica de arriba
    var html = '';
    html += '<div class="card"><h3>// resumen general — ' + new Date().toLocaleDateString('es-CO') + '</h3>';
    html += '<div class="reporte-grid">';
    html += '<div class="stat-box"><span class="val">' + empleados.length + '</span><span class="lbl">Total Empleados</span></div>';
    html += '<div class="stat-box"><span class="val">$' + Math.round(totalGeneral / 1000) + 'K</span><span class="lbl">Total Nómina</span></div>';
    html += '<div class="stat-box"><span class="val">$' + Math.round(promGeneral / 1000) + 'K</span><span class="lbl">Promedio Salario</span></div>';
    html += '<div class="stat-box"><span class="val">' + totalTC + '</span><span class="lbl">Tiempo Completo</span></div>';
    html += '<div class="stat-box"><span class="val">' + totalMT + '</span><span class="lbl">Medio Tiempo</span></div>';
    html += '<div class="stat-box"><span class="val">' + totalCO + '</span><span class="lbl">Contratistas</span></div>';
    html += '</div>';
    html += '<p style="font-size:.85rem;color:var(--muted);margin-bottom:.35rem">💰 Salario más alto: <b style="color:var(--success)">' + nombreMax + '</b> ($' + salMaximo.toLocaleString('es-CO') + ')</p>';
    html += '<p style="font-size:.85rem;color:var(--muted);margin-bottom:.35rem">📉 Salario más bajo: <b style="color:var(--accent2)">' + nombreMin + '</b> ($' + salMinimo.toLocaleString('es-CO') + ')</p>';
    html += '<p style="font-size:.85rem;color:var(--muted);margin-bottom:.35rem">📅 Más antiguo: <b>' + nombreAntiguo + '</b> (' + fechaAntigua + ')</p>';
    html += '<p style="font-size:.85rem;color:var(--muted)">🆕 Más reciente: <b>' + nombreReciente + '</b> (' + fechaReciente + ')</p>';
    html += '</div>';

    html += '<div class="card"><h3>// por tipo de contrato</h3><div class="table-wrap"><table>';
    html += '<thead><tr><th>Tipo</th><th>Cantidad</th><th>Total Salarios</th><th>Promedio</th></tr></thead><tbody>';
    html += '<tr><td>Tiempo Completo</td><td>' + totalTC + '</td><td>$' + sumaTC.toLocaleString('es-CO') + '</td><td>$' + Math.round(promTC).toLocaleString('es-CO') + '</td></tr>';
    html += '<tr><td>Medio Tiempo</td><td>'    + totalMT + '</td><td>$' + sumaMT.toLocaleString('es-CO') + '</td><td>$' + Math.round(promMT).toLocaleString('es-CO') + '</td></tr>';
    html += '<tr><td>Contratista</td><td>'     + totalCO + '</td><td>$' + sumaCO.toLocaleString('es-CO') + '</td><td>$' + Math.round(promCO).toLocaleString('es-CO') + '</td></tr>';
    html += '</tbody></table></div></div>';

    html += '<div class="card"><h3>// detalle por empleado</h3><div class="table-wrap"><table>';
    html += '<thead><tr><th>Nombre</th><th>Tipo</th><th>Salario Base</th><th>Salario Calculado</th><th>Diferencia</th></tr></thead><tbody>';
    for (var p = 0; p < empleados.length; p++) {
        var dif = empleados[p].salarioCalculado - empleados[p].salarioBase;
        var col = dif >= 0 ? 'var(--success)' : 'var(--accent2)';
        html += '<tr>';
        html += '<td>' + empleados[p].nombre + ' ' + empleados[p].apellido + '</td>';
        html += '<td>' + empleados[p].tipo.replace('_', ' ') + '</td>';
        html += '<td>$' + empleados[p].salarioBase.toLocaleString('es-CO') + '</td>';
        html += '<td>$' + empleados[p].salarioCalculado.toLocaleString('es-CO') + '</td>';
        html += '<td style="color:' + col + '">$' + dif.toLocaleString('es-CO') + '</td>';
        html += '</tr>';
    }
    html += '</tbody></table></div></div>';

    document.getElementById('contenido-reporte').innerHTML = html;
}


// -----------------------------------------------
// HELPERS DE RENDER
// -----------------------------------------------

function renderTablaEmpleados() {
    var tbody = document.getElementById('bodyEmpleados');
    if (empleados.length == 0) {
        tbody.innerHTML = '<tr><td class="empty-row" colspan="8">No hay empleados registrados</td></tr>';
        return;
    }
    var html = '';
    for (var i = 0; i < empleados.length; i++) {
        var e = empleados[i];
        var badgeClass = e.tipo == 'tiempo_completo' ? 'badge-tc' : (e.tipo == 'medio_tiempo' ? 'badge-mt' : 'badge-co');
        var badgeLabel = e.tipo == 'tiempo_completo' ? 'T.C.' : (e.tipo == 'medio_tiempo' ? 'M.T.' : 'CON');
        html += '<tr>';
        html += '<td>' + e.id + '</td>';
        html += '<td>' + e.nombre + ' ' + e.apellido + '</td>';
        html += '<td>' + e.cargo + '</td>';
        html += '<td><span class="badge ' + badgeClass + '">' + badgeLabel + '</span></td>';
        html += '<td>$' + e.salarioBase.toLocaleString('es-CO') + '</td>';
        html += '<td>$' + e.salarioCalculado.toLocaleString('es-CO') + '</td>';
        html += '<td>' + e.fecha + '</td>';
        html += '<td><button class="btn btn-danger btn-sm" onclick="eliminarEmpleado(' + e.id + ')">✕</button></td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
}

function renderTablaVacaciones() {
    var tbody = document.getElementById('bodyVacaciones');
    if (vacaciones.length == 0) {
        tbody.innerHTML = '<tr><td class="empty-row" colspan="6">No hay solicitudes</td></tr>';
        return;
    }
    var html = '';
    for (var i = 0; i < vacaciones.length; i++) {
        var v = vacaciones[i];
        var estadoColor = v.estado == 'aprobada' ? 'var(--success)' : (v.estado == 'rechazada' ? 'var(--accent2)' : 'var(--warning)');
        html += '<tr>';
        html += '<td>' + v.empleado + '</td>';
        html += '<td>' + v.inicio + '</td>';
        html += '<td>' + v.fin + '</td>';
        html += '<td>' + v.dias + '</td>';
        html += '<td style="color:' + estadoColor + ';font-weight:700;text-transform:uppercase;font-size:.8rem">' + v.estado + '</td>';
        html += '<td>';
        if (v.estado == 'pendiente') {
            html += '<button class="btn btn-sm btn-primary" style="margin-right:4px" onclick="cambiarEstadoVacacion(' + v.id + ', \'aprobada\')">✓</button>';
            html += '<button class="btn btn-sm btn-danger" onclick="cambiarEstadoVacacion(' + v.id + ', \'rechazada\')">✕</button>';
        } else {
            html += '—';
        }
        html += '</td>';
        html += '</tr>';
    }
    tbody.innerHTML = html;
}

function actualizarSelectEmpleados() {
    var sel = document.getElementById('vac-empleado');
    sel.innerHTML = '<option value="">-- Seleccionar --</option>';
    for (var i = 0; i < empleados.length; i++) {
        sel.innerHTML += '<option value="' + empleados[i].id + '">' + empleados[i].nombre + ' ' + empleados[i].apellido + '</option>';
    }
}

function calcularDias() {
    var ini = document.getElementById('vac-inicio').value;
    var fin = document.getElementById('vac-fin').value;
    if (ini && fin) {
        var diff = (new Date(fin) - new Date(ini)) / 86400000;
        document.getElementById('vac-dias').value = diff > 0 ? diff : 0;
    }
}

function mostrarAlerta(id, msg, tipo) {
    var el = document.getElementById(id);
    el.textContent = msg;
    el.className = 'alerta alerta-' + tipo + ' visible';
    clearTimeout(el._t);
    el._t = setTimeout(function() { el.className = 'alerta'; }, 4000);
}
