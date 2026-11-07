"use strict";

// ---------- Comunicación con la API ----------

/**
 * Llama a la API con JSON. Devuelve {ok, estado, datos} si responde bien
 * o {ok: false, estado, detalle, errores} si hay un error.
 */
async function pedirApi(metodo, ruta, cuerpo) {
  const opciones = { method: metodo, headers: {} };
  if (cuerpo !== undefined) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(cuerpo);
  }
  let respuesta;
  try {
    respuesta = await fetch(ruta, opciones);
  } catch {
    return {
      ok: false,
      estado: 0,
      detalle: "No se pudo conectar con el servidor. Verifica que la aplicación esté en ejecución.",
      errores: {},
    };
  }
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);
  if (respuesta.ok) {
    return { ok: true, estado: respuesta.status, datos };
  }
  return {
    ok: false,
    estado: respuesta.status,
    detalle: (datos && datos.detalle) || "Ocurrió un error inesperado. Intenta de nuevo.",
    errores: (datos && datos.errores) || {},
  };
}

// ---------- Mensajes ----------

function mostrarMensaje(texto) {
  document.getElementById("mensajes").textContent = texto || "";
}

function limpiarErrores(formulario) {
  formulario.querySelectorAll(".error-campo").forEach((nodo) => nodo.remove());
  formulario.querySelectorAll("[aria-invalid]").forEach((campo) => {
    campo.removeAttribute("aria-invalid");
    const ids = (campo.getAttribute("aria-describedby") || "")
      .split(" ")
      .filter((id) => id && !id.startsWith("error-"));
    if (ids.length) {
      campo.setAttribute("aria-describedby", ids.join(" "));
    } else {
      campo.removeAttribute("aria-describedby");
    }
  });
}

/** Muestra cada mensaje junto a su campo (atributo data-campo o name igual a la clave). */
function mostrarErroresCampos(formulario, errores) {
  limpiarErrores(formulario);
  Object.entries(errores || {}).forEach(([campo, mensaje]) => {
    const control = formulario.querySelector(`[data-campo="${campo}"], [name="${campo}"]`);
    if (!control) return;
    const idError = `error-${formulario.id}-${campo}`;
    const nodo = document.createElement("span");
    nodo.id = idError;
    nodo.className = "error-campo";
    nodo.textContent = mensaje;
    const ancla = control.closest("fieldset") || control;
    ancla.insertAdjacentElement("afterend", nodo);
    control.setAttribute("aria-invalid", "true");
    const previos = control.getAttribute("aria-describedby");
    control.setAttribute("aria-describedby", previos ? `${previos} ${idError}` : idError);
  });
}

// ---------- Contadores de caracteres (RF-006a) ----------

const segmentador =
  typeof Intl !== "undefined" && Intl.Segmenter
    ? new Intl.Segmenter("es", { granularity: "grapheme" })
    : null;

/** Cuenta caracteres visibles del texto recortado (un emoji compuesto cuenta 1). */
function contarCaracteres(texto) {
  const recortado = (texto || "").trim().normalize("NFC");
  if (segmentador) {
    let cantidad = 0;
    for (const _ of segmentador.segment(recortado)) cantidad += 1;
    return cantidad;
  }
  return [...recortado].length;
}

function actualizarEnvio(formulario) {
  const boton = formulario && formulario.querySelector('[type="submit"]');
  if (!boton) return;
  boton.disabled = formulario.querySelector(".contador--excedido") !== null;
}

/** Muestra "n/máximo" junto al campo, marca el exceso y bloquea el envío sin cortar el texto. */
function conectarContador(campo, maximo) {
  const contador = document.createElement("span");
  contador.id = `contador-${campo.id}`;
  contador.className = "contador";
  campo.insertAdjacentElement("afterend", contador);
  const previos = campo.getAttribute("aria-describedby");
  campo.setAttribute("aria-describedby", previos ? `${previos} ${contador.id}` : contador.id);

  const actualizar = () => {
    const cantidad = contarCaracteres(campo.value);
    const excedido = cantidad > maximo;
    contador.textContent = excedido
      ? `${cantidad}/${maximo} (te pasaste por ${cantidad - maximo})`
      : `${cantidad}/${maximo}`;
    contador.classList.toggle("contador--excedido", excedido);
    actualizarEnvio(campo.form);
  };
  campo.addEventListener("input", actualizar);
  actualizar();
  return actualizar;
}

// ---------- Estado de la interfaz ----------

const MAXIMO_NOMBRE_MATERIA = 50;

const estado = {
  colores: [],
  materias: [],
  tareas: [],
};

function colorPorId(idColor) {
  return estado.colores.find((color) => color.id === idColor);
}

/** La bienvenida solo se muestra cuando todavía no hay materias ni tareas. */
function actualizarBienvenida() {
  const vacio = estado.materias.length === 0 && estado.tareas.length === 0;
  document.getElementById("bienvenida").hidden = !vacio;
}

// ---------- Colores ----------

function crearMuestraColor(color) {
  const muestra = document.createElement("span");
  muestra.className = "muestra-color";
  muestra.style.backgroundColor = color ? color.hex : "transparent";
  muestra.setAttribute("aria-hidden", "true");
  return muestra;
}

function crearOpcionColor(color, indice) {
  const etiqueta = document.createElement("label");
  etiqueta.className = "opcion-color";
  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "color";
  radio.value = color.id;
  radio.checked = indice === 0;
  const nombre = document.createElement("span");
  nombre.textContent = color.nombre;
  etiqueta.append(radio, crearMuestraColor(color), nombre);
  return etiqueta;
}

async function cargarColores() {
  const resultado = await pedirApi("GET", "/api/colores");
  if (!resultado.ok) {
    mostrarMensaje(resultado.detalle);
    return;
  }
  estado.colores = resultado.datos;
  const contenedor = document.getElementById("opciones-color");
  contenedor.replaceChildren(...estado.colores.map(crearOpcionColor));
}

// ---------- Materias ----------

function crearElementoMateria(materia) {
  const color = colorPorId(materia.color);
  const elemento = document.createElement("li");
  elemento.className = "materia";
  const nombre = document.createElement("span");
  nombre.className = "materia__nombre";
  nombre.textContent = materia.nombre;
  const nombreColor = document.createElement("span");
  nombreColor.className = "materia__color";
  nombreColor.textContent = color ? color.nombre : materia.color;
  elemento.append(crearMuestraColor(color), nombre, nombreColor);
  return elemento;
}

function pintarMaterias() {
  const lista = document.getElementById("lista-materias");
  lista.replaceChildren(...estado.materias.map(crearElementoMateria));
  actualizarBienvenida();
}

async function cargarMaterias() {
  const resultado = await pedirApi("GET", "/api/materias");
  if (!resultado.ok) {
    mostrarMensaje(resultado.detalle);
    return;
  }
  estado.materias = resultado.datos;
  pintarMaterias();
}

function leerFormularioMateria(formulario) {
  const colorElegido = formulario.querySelector('input[name="color"]:checked');
  return {
    nombre: formulario.elements.nombre.value,
    color: colorElegido ? colorElegido.value : null,
  };
}

async function enviarMateria(evento, actualizarContador) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const resultado = await pedirApi("POST", "/api/materias", leerFormularioMateria(formulario));
  if (!resultado.ok) {
    // El duplicado (409) no trae "errores": se muestra también junto al campo del nombre.
    const errores = resultado.estado === 409 ? { nombre: resultado.detalle } : resultado.errores;
    mostrarErroresCampos(formulario, errores);
    mostrarMensaje(resultado.detalle);
    formulario.elements.nombre.focus();
    return;
  }
  limpiarErrores(formulario);
  formulario.elements.nombre.value = "";
  actualizarContador();
  mostrarMensaje(`Materia «${resultado.datos.nombre}» registrada.`);
  await cargarMaterias();
  formulario.elements.nombre.focus();
}

function conectarFormularioMateria() {
  const formulario = document.getElementById("form-materia");
  const actualizarContador = conectarContador(
    document.getElementById("materia-nombre"),
    MAXIMO_NOMBRE_MATERIA,
  );
  formulario.addEventListener("submit", (evento) => enviarMateria(evento, actualizarContador));
}

// ---------- Inicio ----------

async function iniciar() {
  conectarFormularioMateria();
  await cargarColores();
  await cargarMaterias();
}

document.addEventListener("DOMContentLoaded", iniciar);
