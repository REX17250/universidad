# Guía Rápida de Validación: Organizador de Tareas Académicas UPB

**Funcionalidad**: `001-organizador-tareas` | **Fecha**: 2026-10-26 | **Plan**: [plan.md](./plan.md)

Esta guía explica cómo instalar, ejecutar y comprobar de punta a punta que la funcionalidad
cumple la especificación. Los detalles de endpoints y reglas están en
[contracts/api-rest.md](./contracts/api-rest.md) y [data-model.md](./data-model.md).

## Requisitos previos

- Python 3.12 instalado (`python --version` → `3.12.x`).
- Un navegador moderno (Chrome, Edge o Firefox actualizados).

## Instalación (desde la raíz del repositorio)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1          # En Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
```

## Ejecutar las pruebas automatizadas (comando único, Principio II)

```powershell
pytest
```

**Resultado esperado**: todas las pruebas pasan (0 fallidas). Revisión de estilo:

```powershell
ruff check . ; ruff format --check .
```

## Ejecutar la aplicación

```powershell
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Abrir `http://127.0.0.1:8000`. La base de datos se crea en `datos/organizador.db`.

---

## Escenarios de validación de punta a punta

Cada escenario indica la historia de usuario (US) y los requisitos (RF / CE) que comprueba.

### V1. Materias (US1 · RF-001 a RF-003, RF-022)

1. Con la aplicación vacía → se ve un mensaje de bienvenida que guía a registrar una materia.
2. Registrar "Cálculo I" con color azul → aparece en el listado de materias con su color.
3. Registrar "  cálculo i  " → se rechaza con el mensaje de nombre duplicado en español.
4. Intentar guardar con nombre vacío o solo espacios → mensaje "El nombre de la materia es
   obligatorio."
5. Escribir 51 caracteres en el nombre → el contador muestra "51/50" y no se permite guardar; el
   texto no se corta.
6. Detener y volver a iniciar `uvicorn`, recargar la página → la materia sigue ahí (CE-005).

### V2. Tareas, orden y estados (US2 · RF-006 a RF-016, CE-003)

1. Sin materias, intentar crear una tarea → se indica que primero se registre una materia y se
   ofrece hacerlo (RF-010).
2. Con "Física I", crear tareas con entrega: ayer, dentro de 30 horas, dentro de 3 días y dentro de
   5 días sin hora → el listado las muestra en ese orden con los estados *Vencida*, *Urgente*,
   *Pendiente*, *Pendiente*; la última muestra la hora 23:59.
3. Comprobar que *Vencida* y *Urgente* se distinguen con texto o ícono, no solo por color
   (RF-014).
4. Enviar el formulario con título, materia y fecha vacíos → se señala cada campo faltante.
5. Introducir una fecha inexistente (por ejemplo, con la API: `"2026-02-30"`) → mensaje de fecha
   inválida.
6. Crear una tarea que venza dentro de 2 minutos y esperar con la página abierta → en ≤ 1 minuto
   tras la hora de entrega cambia a *Vencida* sin recargar (RF-016).
7. Los límites exactos (48 h justas, minuto de entrega) se verifican con las pruebas automáticas
   de `calcular_estado` con reloj fijo.

### V3. Completar (US3 · RF-015, RF-017)

1. Marcar como completada una tarea *Urgente* → se muestra como completada y pierde la etiqueta.
2. Desmarcarla → recupera *Urgente*.

### V4. Filtros (US4 · RF-018 a RF-021)

1. Filtrar por "Cálculo I" → solo sus tareas, en orden por fecha.
2. Filtrar por estado "pendiente" → no aparecen urgentes ni vencidas.
3. Combinar "Física I" + "urgente" → solo urgentes de Física I.
4. Filtros sin resultados → mensaje "No hay tareas para estos filtros" con opción de quitarlos.
5. "Quitar filtros" (una acción) → vuelven a verse todas.

### V5. Editar y eliminar (US5 · RF-004, RF-005, RF-009)

1. Cambiar la fecha de una tarea de 5 días a mañana → cambia de posición y pasa a *Urgente*.
2. Cambiar el color de una materia → todas sus tareas muestran el nuevo color.
3. Eliminar una tarea y confirmar → desaparece.
4. Eliminar una materia con 3 tareas → la advertencia menciona 3 tareas; al cancelar no cambia
   nada; al confirmar desaparecen la materia y sus 3 tareas.
5. Con un filtro activo por esa materia, eliminarla → el filtro se quita automáticamente.

### V6. Validación directa en el servidor (Principio IV)

Con la aplicación en marcha, abrir `http://127.0.0.1:8000/docs` y enviar a `POST /api/tareas` un
título de 101 caracteres o un `materia_id` inexistente → respuesta `422` con
`{"detalle": ..., "errores": {...}}` en español, aunque se omita la validación del navegador.

### V7. Accesibilidad y diseño responsivo (Principio V · RF-025, puerta de calidad 3)

1. En las herramientas del navegador, vista de 360 px de ancho → sin desplazamiento horizontal ni
   contenido cortado. Repetir en vista de escritorio.
2. Recorrer toda la aplicación solo con teclado (Tab, Shift+Tab, Enter, Espacio, Esc en los
   diálogos) → todas las acciones son posibles y el foco siempre es visible.
3. Cada campo tiene etiqueta asociada; los mensajes de error se anuncian (región `aria-live`).
4. Verificar el contraste AA del texto sobre cada color de la paleta (por ejemplo, con Lighthouse
   o la skill `a11y-check`).

### V8. Rendimiento (CE-004)

Cargar 200 tareas (por ejemplo, con un script corto contra `POST /api/tareas`) y comprobar que el
listado y los filtros responden en menos de 1 segundo.
