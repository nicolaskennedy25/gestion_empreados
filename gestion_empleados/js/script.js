/**
 * script.js — utilidades globales
 */

// Marcar enlace activo en la navbar según la URL actual
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
});

/**
 * Formatea un número como moneda colombiana.
 * @param {number} valor
 * @returns {string}
 */
function formatCOP(valor) {
  return '$' + Number(valor).toLocaleString('es-CO', { minimumFractionDigits: 0 });
}

/**
 * Muestra una alerta en el elemento con id "alerta".
 * @param {string} mensaje
 * @param {'success'|'error'|'info'|'warning'} tipo
 */
function mostrarAlerta(mensaje, tipo = 'info') {
  const el = document.getElementById('alerta');
  if (!el) return;
  el.textContent = mensaje;
  el.className = `alerta alerta-${tipo}`;
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  // Auto-ocultar después de 5s
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.className = 'alerta hidden'; }, 5000);
}

/**
 * Helper para fetch con JSON
 * @param {string} url
 * @param {object|null} body  — si es null, hace GET; si no, hace POST
 * @returns {Promise<any>}
 */
async function api(url, body = null) {
  const opts = body
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    : { method: 'GET' };
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
