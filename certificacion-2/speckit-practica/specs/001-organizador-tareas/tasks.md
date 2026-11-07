---

description: "Lista de tareas para implementar el Organizador de Tareas Académicas UPB"
---

# Tareas: Organizador de Tareas Académicas UPB

**Entrada**: documentos de diseño en `/specs/001-organizador-tareas/`

**Prerrequisitos**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/api-rest.md](./contracts/api-rest.md), [quickstart.md](./quickstart.md)

**Pruebas**: SÍ se incluyen. La constitución (Principio II, NO NEGOCIABLE) y el plan exigen pruebas automatizadas con flujo principal y al menos un caso de error o borde por funcionalidad, y pruebas con entradas inválidas para cada regla de validación (Principio IV). Se escriben primero y deben FALLAR antes de implementar.

**Organización**: las tareas se agrupan por historia de usuario para que cada una pueda implementarse y probarse de forma independiente.

## Formato: `[ID] [P?] [Historia] Descripción`

- **[P]**: puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[USn]**: historia de usuario a la que pertenece la tarea (US1 … US5)
- Cada descripción incluye la ruta exacta del archivo

## Convenciones de rutas

Proyecto único en la raíz del repositorio (ver plan.md): backend en `app/` (módulos planos), frontend estático en `app/static/`, pruebas en `tests/` (archivos planos). Identificadores del código en español.

---

## Fase 1: Configuración (infraestructura compartida)

**Propósito**: inicializar el proyecto y su estructura básica.

- [X] T001 Crear la estructura de carpetas del plan: `app/`, `app/static/`, `tests/`, `datos/` y los archivos vacíos `app/__init__.py` y `tests/__init__.py` (si pytest lo requiere para importar `app`)
- [X] T002 [P] Crear `requirements.txt` con `fastapi`, `uvicorn` y `regex` (versiones fijadas compatibles con Python 3.12)
- [X] T003 [P] Crear `requirements-dev.txt` con `-r requirements.txt`, `pytest`, `httpx` y `ruff`
- [X] T004 [P] Crear `pyproject.toml` con configuración de pytest (`testpaths = ["tests"]`, `pythonpath = ["."]`) y de ruff (`target-version = "py312"`, `line-length = 100`, reglas `E`, `F`, `I`, `B`, `UP`) (D-13)
- [X] T005 [P] Crear `.gitignore` que excluya `.venv/`, `__pycache__/`, `.pytest_cache/`, `.ruff_cache/` y `datos/` (la base SQLite no se versiona)

---

## Fase 2: Fundacional (prerrequisitos bloqueantes)

**Propósito**: infraestructura común que TODAS las historias necesitan: base de datos con ambas tablas, formato de errores en español, paleta, utilidades de texto, app FastAPI y esqueleto del frontend.

**⚠️ CRÍTICO**: ninguna historia de usuario puede empezar hasta terminar esta fase.

### Pruebas fundacionales (escribir primero; deben fallar)

- [X] T006 [P] Escribir pruebas unitarias en `tests/test_textos.py` para `recortar`, `contar_caracteres` y `normalizar_nombre`: "  Hola  " → "Hola"; "ñandú" cuenta 5; "Cálculo" en forma NFD cuenta 7; "👍🏽" cuenta 1; "👨‍👩‍👧" cuenta 1; una bandera "🇧🇴" cuenta 1; cadena solo con espacios → "" y cuenta 0; `normalizar_nombre("  CÁLCULO I ")` == `normalizar_nombre("cálculo i")`; `texto_opcional("   ")` → `None`

### Implementación fundacional

- [X] T007 [P] Implementar `app/textos.py` (D-03, D-04, RF-006a): `recortar(texto)` (quita espacios al inicio y al final y normaliza a NFC), `contar_caracteres(texto)` (cuenta grafemas con `regex.findall(r"\X", texto)`), `normalizar_nombre(texto)` = `casefold(NFC(recortar(texto)))`, `texto_opcional(texto)` (devuelve `None` si es `None` o queda vacío tras recortar), y `validar_longitud(texto, maximo, etiqueta)` que lanza `ValueError` con el mensaje "{etiqueta} puede tener como máximo {maximo} caracteres (tiene {n})." sin cortar nunca el texto
- [X] T008 [P] Implementar `app/colores.py` (D-10, RF-002): constante `PALETA` con 8 entradas `{id, nombre, hex}` en este orden: `azul`, `rojo`, `verde`, `naranja`, `morado`, `turquesa`, `rosa`, `marron` (nombre visible "Marrón"); tonos oscuros cuyo contraste con texto blanco sea ≥ 4.5:1 (p. ej. azul `#1F4E9C`, rojo `#B3261E`); función `es_color_valido(id_color)` y `IDS_COLORES`
- [X] T009 [P] Implementar `app/basedatos.py` (D-01, D-02, D-14): ruta de la base desde la variable de entorno `ORGANIZADOR_DB` con valor por defecto `datos/organizador.db`, leída en cada conexión (función `ruta_base()`, no una constante del módulo; F2) y creando la carpeta si no existe; `crear_esquema(conexion)` con `CREATE TABLE IF NOT EXISTS` para `materias` (`id INTEGER PRIMARY KEY AUTOINCREMENT`, `nombre TEXT NOT NULL`, `nombre_normalizado TEXT NOT NULL UNIQUE`, `color TEXT NOT NULL`) y `tareas` (`id INTEGER PRIMARY KEY AUTOINCREMENT`, `materia_id INTEGER NOT NULL REFERENCES materias(id) ON DELETE CASCADE`, `titulo TEXT NOT NULL`, `descripcion TEXT NULL`, `fecha_entrega TEXT NOT NULL`, `completada INTEGER NOT NULL DEFAULT 0 CHECK (completada IN (0, 1))`, `creada_en TEXT NOT NULL`) e índice `CREATE INDEX IF NOT EXISTS idx_tareas_entrega ON tareas (fecha_entrega, id)`; dependencia de FastAPI `obtener_conexion()` que abre `sqlite3.connect`, ejecuta `PRAGMA foreign_keys = ON`, usa `row_factory = sqlite3.Row`, hace `commit` al terminar y cierra la conexión
- [X] T010 [P] Implementar `app/errores.py` (D-09): función `respuesta_error(codigo, detalle, errores=None)` que produce `{"detalle": ..., "errores": {...}}`; manejador de `RequestValidationError` que devuelve 422 con `detalle` "Revisa los campos marcados." y un mensaje en español por campo (usa el mensaje del `ValueError` del validador cuando exista y traduce los genéricos de Pydantic: campo faltante, tipo incorrecto); manejador de `HTTPException` que conserva el formato uniforme (para 404 y 409)
- [X] T011 Crear `app/main.py` (depende de T009, T010): crea `app = FastAPI(title="Organizador de Tareas UPB")`, llama a `crear_esquema` al arrancar (evento `lifespan`), registra los manejadores de `app/errores.py` y monta `StaticFiles(directory="app/static", html=True)` en `/` DESPUÉS de los routers de `/api` (D-11)
- [X] T012 Crear `tests/conftest.py` (depende de T011): fixture `cliente` que fija `ORGANIZADOR_DB` a una base en `tmp_path` y entrega un cliente abierto con `with TestClient(app)` (para que corra el `lifespan` y se cree el esquema); define la constante `AHORA = datetime(2026, 10, 26, 10, 0)`; fixture auxiliar `crear_materia(cliente, nombre, color="azul")`. (F1: la sustitución de `obtener_ahora` se añade en T026, cuando exista `app/fechas.py`.)
- [X] T013 [P] Crear `app/static/index.html`: documento `lang="es"`, `<meta name="viewport">`, `<header>` con título "Organizador de Tareas UPB", `<main>` con secciones vacías y con encabezado para "Materias", "Nueva tarea", "Filtros" y "Tareas", una región `<div id="mensajes" aria-live="polite">` para `detalle`, y carga de `/estilos.css` y `/app.js` (sin CDN)
- [X] T014 [P] Crear `app/static/estilos.css` con base *mobile first*: variables de color, `box-sizing: border-box`, `min-width: 360px` sin desplazamiento horizontal, foco visible (`:focus-visible` con contorno de alto contraste), clases utilitarias `.error-campo`, `.contador`, `.contador--excedido`, y media query para escritorio (≥ 768 px) en dos columnas
- [X] T015 [P] Crear `app/static/app.js` con utilidades comunes: `pedirApi(metodo, ruta, cuerpo)` (fetch JSON; ante error devuelve `{detalle, errores}`), `mostrarMensaje(texto)` en `#mensajes`, `mostrarErroresCampos(formulario, errores)` / `limpiarErrores(formulario)` (mensaje junto a cada campo con `aria-describedby`), `contarCaracteres(texto)` con `Intl.Segmenter("es", {granularity: "grapheme"})` y respaldo `[...texto].length` aplicado al texto recortado, y `conectarContador(campo, maximo)` que muestra "n/máximo", marca el exceso, NO corta el texto y deshabilita el envío mientras haya exceso (RF-006a)

**Punto de control**: `pytest tests/test_textos.py` pasa; `uvicorn app.main:app` arranca, crea `datos/organizador.db` con ambas tablas y sirve la página vacía.

---

## Fase 3: Historia de Usuario 1 - Registrar materias (Prioridad: P1) 🎯 MVP

**Objetivo**: el estudiante registra materias con nombre y color de la paleta, las ve listadas y persisten.

**Prueba independiente**: registrar varias materias con distintos colores, verificar que aparecen con su nombre y color, que se rechazan duplicados y vacíos, y que siguen disponibles al reiniciar (quickstart V1).

### Pruebas de la Historia 1 (escribir primero; deben fallar)

- [X] T016 [P] [US1] Escribir pruebas de API en `tests/test_api_materias.py`: `GET /api/colores` devuelve 8 colores con `id`, `nombre`, `hex`; `POST /api/materias` con `{"nombre": "Cálculo I", "color": "azul"}` → 201 con `cantidad_tareas: 0`; `"  Física I  "` se guarda como "Física I"; `"cálculo i"` y `"  CÁLCULO I "` tras "Cálculo I" → 409 con "Ya existe una materia llamada «Cálculo I». Elige otro nombre."; nombre vacío o solo espacios → 422 con `errores.nombre` "El nombre de la materia es obligatorio."; nombre de 51 caracteres → 422 "El nombre puede tener como máximo 50 caracteres (tiene 51)."; nombre de 50 emojis "👍🏽" → 201; color `"amarillo"` o ausente → 422 "Elige un color de la lista."; `GET /api/materias` ordena por nombre sin distinguir mayúsculas; los datos persisten al crear un nuevo `TestClient` sobre la misma base (RF-022)

### Implementación de la Historia 1

- [X] T017 [US1] Crear en `app/esquemas.py` los modelos Pydantic `MateriaEntrada` (`nombre: str`, `color: str`) con validadores que usan `app/textos.py` y `app/colores.py`: nombre recortado "presente y, tras recortar espacios, con al menos 1 carácter" → si no, "El nombre de la materia es obligatorio."; "nombre recortado con 50 grafemas como máximo" → "El nombre puede tener como máximo 50 caracteres (tiene N)."; "color presente y perteneciente a la paleta" → "Elige un color de la lista."; y `MateriaSalida` (`id`, `nombre`, `color`, `cantidad_tareas`) sin exponer `nombre_normalizado`
- [X] T018 [US1] Crear `app/rutas_materias.py` con `APIRouter(prefix="/api")`: `GET /colores` (devuelve `PALETA`), `GET /materias` (consulta con `LEFT JOIN tareas` y `COUNT` para `cantidad_tareas`, ordenada por `nombre_normalizado`), `POST /materias` (inserta `nombre` recortado, `nombre_normalizado` y `color` con SQL parametrizado; captura `sqlite3.IntegrityError` de la restricción UNIQUE y responde 409 con "Ya existe una materia llamada «{nombre existente}». Elige otro nombre."; 201 con `MateriaSalida`)
- [X] T019 [US1] Registrar el router de `app/rutas_materias.py` en `app/main.py` antes del montaje de estáticos
- [X] T020 [US1] Completar la sección "Materias" en `app/static/index.html`: `<form id="form-materia">` con `<label>` + `<input id="materia-nombre">` y contador, selector de color accesible (`<fieldset>` con `<legend>Color</legend>` y radios generados con muestra de color y nombre en texto), botón "Guardar materia" y `<ul id="lista-materias">`; mensaje de bienvenida `#bienvenida` que guía a registrar la primera materia y crear la primera tarea
- [X] T021 [US1] Implementar en `app/static/app.js`: `cargarColores()` desde `GET /api/colores` para construir los radios; `cargarMaterias()` y `pintarMaterias()` (nombre + muestra de color + texto del color); envío de `#form-materia` con `POST /api/materias`, mostrando `errores` por campo y `detalle` en `#mensajes`; contador del nombre con máximo 50 (`conectarContador`); mostrar/ocultar `#bienvenida` según haya materias y tareas
- [X] T022 [P] [US1] Añadir estilos en `app/static/estilos.css` para el selector de colores (radios visibles con foco), la muestra de color de cada materia y el mensaje de bienvenida

**Punto de control**: `pytest tests/test_textos.py tests/test_api_materias.py` pasa; quickstart V1 se cumple en el navegador.

---

## Fase 4: Historia de Usuario 2 - Crear tareas y verlas ordenadas por fecha de entrega (Prioridad: P1)

**Objetivo**: crear tareas asociadas a una materia y ver un listado único ordenado por entrega con estados vencida/urgente/pendiente que se actualizan con el tiempo.

**Prueba independiente**: con una materia registrada, crear tareas con entregas pasadas, dentro de 48 h y más lejanas, y verificar orden e indicadores (quickstart V2).

### Pruebas de la Historia 2 (escribir primero; deben fallar)

- [ ] T023 [P] [US2] Escribir pruebas unitarias en `tests/test_fechas.py` para `parsear_fecha_entrega`: `"2026-10-31"` → `"2026-10-31T23:59"` (RF-007); `"2026-10-31T18:00"` se conserva; `"2026-02-30"`, `"31/10/2026"`, `"2026-10-31T25:00"`, `"abc"` y `""` lanzan `ValueError` con "La fecha de entrega no es válida. Usa el formato día/mes/año y una fecha que exista."; una fecha pasada se acepta (RF-008); `obtener_ahora()` devuelve la hora local con segundos y microsegundos en 0
- [ ] T024 [P] [US2] Escribir pruebas unitarias en `tests/test_estados.py` para `calcular_estado(completada, fecha_entrega, ahora)` con `ahora = 2026-10-26T10:00`: entrega `10:00` del mismo día → "vencida" (minuto exacto); `10:01` → "urgente"; `2026-10-28T10:00` (48 h justas) → "urgente"; `2026-10-28T10:01` → "pendiente"; ayer → "vencida"; en 30 h → "urgente"; en 3 días → "pendiente"; `completada=True` con cualquier fecha → "completada"
- [ ] T025 [P] [US2] Escribir pruebas de API en `tests/test_api_tareas.py` (reloj fijo de conftest): `POST /api/tareas` válido → 201 con `completada: false`, `descripcion: null`, `estado` y `materia {id, nombre, color}`; descripción "   " → `null`; fecha sin hora → `T23:59`; fecha pasada → 201 y estado "vencida"; cuerpo vacío `{}` → 422 con `errores` para `materia_id` ("Elige la materia de la tarea."), `titulo` ("El título es obligatorio.") y `fecha_entrega` ("La fecha de entrega es obligatoria.") a la vez; título de 101 caracteres → "El título puede tener como máximo 100 caracteres (tiene 101)."; descripción de 501 → "La descripción puede tener como máximo 500 caracteres (tiene 501)."; `materia_id` inexistente → 422 "La materia elegida no existe. Actualiza la página y elige otra."; sin materias registradas → 422 cuyo mensaje de `materia_id` indica registrar primero una materia (RF-010); `GET /api/tareas` con entregas 10, 3 y 7 de noviembre → orden 3, 7, 10; dos tareas con la misma entrega → la creada primero va antes; `GET /api/tareas/{id}` → 200 y 404 "No se encontró la tarea."

### Implementación de la Historia 2

- [ ] T026 [P] [US2] Implementar `app/fechas.py` (D-05): `FORMATO_ENTREGA = "%Y-%m-%dT%H:%M"`; `parsear_fecha_entrega(texto)` que acepta "AAAA-MM-DD" (completa con `T23:59`) o "AAAA-MM-DDTHH:MM" validando con `datetime.strptime` y devuelve el texto normalizado; si no, `ValueError` con "La fecha de entrega no es válida. Usa el formato día/mes/año y una fecha que exista."; `obtener_ahora()` = `datetime.now().replace(second=0, microsecond=0)` (dependencia inyectable, D-06); además, en la fixture `cliente` de `tests/conftest.py`, sobrescribir `obtener_ahora` con `app.dependency_overrides[obtener_ahora] = lambda: AHORA` (F1)
- [ ] T027 [P] [US2] Implementar `app/estados.py` (D-06, RF-013): constantes de estado `PENDIENTE`, `URGENTE`, `VENCIDA`, `COMPLETADA`, `ESTADOS_VALIDOS` y función pura `calcular_estado(completada, fecha_entrega, ahora)`: completada → "completada"; `entrega <= ahora` → "vencida"; `entrega <= ahora + timedelta(hours=48)` → "urgente"; si no → "pendiente"
- [ ] T028 [US2] Añadir a `app/esquemas.py` los modelos `TareaEntrada` (`materia_id: int | None`, `titulo: str | None`, `descripcion: str | None = None`, `fecha_entrega: str | None`) con validadores que reportan CADA campo inválido: "`materia_id` presente" → "Elige la materia de la tarea."; "`titulo` presente y no vacío tras recortar" → "El título es obligatorio."; "`titulo` con 100 grafemas como máximo" → "El título puede tener como máximo 100 caracteres (tiene N)."; "`descripcion` con 500 grafemas como máximo tras recortar; vacía o solo espacios → `NULL`" → "La descripción puede tener como máximo 500 caracteres (tiene N)."; "`fecha_entrega` presente" → "La fecha de entrega es obligatoria." y formato vía `parsear_fecha_entrega`; `MateriaResumen` (`id`, `nombre`, `color`) y `TareaSalida` (`id`, `titulo`, `descripcion`, `fecha_entrega`, `completada: bool`, `estado`, `creada_en`, `materia: MateriaResumen`)
- [ ] T029 [US2] Crear `app/rutas_tareas.py` con `APIRouter(prefix="/api")`: función auxiliar `fila_a_tarea(fila, ahora)` que arma `TareaSalida` con el `estado` calculado; consulta base con `JOIN materias` y `ORDER BY t.fecha_entrega ASC, t.id ASC` (D-08); `GET /tareas` (sin filtros aún); `GET /tareas/{id}` (404 "No se encontró la tarea."); `POST /tareas` que verifica la existencia de la materia (si no hay ninguna materia → 422 con `errores.materia_id` "Primero registra una materia para poder crear tareas."; si la id no existe → 422 "La materia elegida no existe. Actualiza la página y elige otra."), inserta con `completada = 0` y `creada_en` = `ahora` en formato "AAAA-MM-DDTHH:MM:SS", y responde 201; `ahora` inyectado con `Depends(obtener_ahora)`
- [ ] T030 [US2] Registrar el router de `app/rutas_tareas.py` en `app/main.py` antes del montaje de estáticos
- [ ] T031 [US2] Completar en `app/static/index.html` la sección "Nueva tarea": `<form id="form-tarea">` con `<select id="tarea-materia">`, `<input id="tarea-titulo">` con contador, `<textarea id="tarea-descripcion">` con contador, `<input type="date" id="tarea-fecha">` y `<input type="time" id="tarea-hora">` (opcional, indica "Si no eliges hora se asume 23:59"), cada uno con `<label>`; aviso `#sin-materias` con botón "Registrar una materia" que lleva el foco a `#materia-nombre`; y la sección "Tareas" con `<ul id="lista-tareas">`
- [ ] T032 [US2] Implementar en `app/static/app.js`: poblar `#tarea-materia` con las materias; mostrar `#sin-materias` y deshabilitar `#form-tarea` cuando no hay materias (RF-010); contadores con máximos 100 (título) y 500 (descripción); envío con `POST /api/tareas` componiendo `fecha_entrega` como "AAAA-MM-DD" o "AAAA-MM-DDTHH:MM"; mostrar `errores` por campo; `cargarTareas()` y `pintarTareas()` que muestran por tarea título, nombre y color de la materia, fecha y hora de entrega legibles en español y el estado con texto (etiquetas "Vencida", "Urgente", "Pendiente") además de color o ícono (RF-012, RF-014); refresco con `setInterval(cargarTareas, 60000)` y en `visibilitychange` (D-07, RF-016)
- [ ] T033 [P] [US2] Añadir estilos en `app/static/estilos.css` para las tarjetas de tarea: borde/franja con el color de la materia, insignias de estado con texto y contraste AA; "vencida" con un destacado más notorio (fondo y borde fuerte más ícono ⚠ con texto), "urgente" con etiqueta "Urgente"

**Punto de control**: `pytest` pasa con `test_fechas.py`, `test_estados.py` y `test_api_tareas.py`; quickstart V2 se cumple. US1 + US2 forman el MVP.

---

## Fase 5: Historia de Usuario 3 - Marcar tareas como completadas (Prioridad: P2)

**Objetivo**: marcar y desmarcar tareas; las completadas pierden indicadores de urgencia/vencimiento y se distinguen visualmente.

**Prueba independiente**: marcar una tarea urgente como completada, verificar el estado "completada"; desmarcarla y verificar que vuelve a "urgente" (quickstart V3).

### Pruebas de la Historia 3 (escribir primero; deben fallar)

- [ ] T034 [US3] Añadir pruebas en `tests/test_api_tareas.py`: `PATCH /api/tareas/{id}/completada` con `{"completada": true}` sobre una tarea urgente → 200 y `estado: "completada"`; sobre una vencida → "completada"; con `{"completada": false}` → recupera "urgente"/"vencida" según su fecha; valor `"si"` o ausente → 422; id inexistente → 404 "No se encontró la tarea."

### Implementación de la Historia 3

- [ ] T035 [US3] Añadir a `app/esquemas.py` el modelo `CompletadaEntrada` (`completada: bool` estricto) con mensaje "Indica si la tarea está completada (verdadero o falso)."
- [ ] T036 [US3] Añadir a `app/rutas_tareas.py` el endpoint `PATCH /tareas/{id}/completada` que actualiza `completada` (0/1), responde 200 con la `TareaSalida` y el `estado` recalculado, o 404
- [ ] T037 [US3] En `app/static/app.js`, añadir a cada tarea de `pintarTareas()` una casilla `<input type="checkbox">` con `<label>` "Completada" que llama al `PATCH` y vuelve a cargar el listado conservando el foco en la casilla
- [ ] T038 [P] [US3] Añadir estilos en `app/static/estilos.css` para tareas completadas (texto tachado, opacidad reducida manteniendo contraste AA, insignia "Completada" con texto)

**Punto de control**: `pytest` pasa; quickstart V3 se cumple.

---

## Fase 6: Historia de Usuario 4 - Filtrar tareas por materia o por estado (Prioridad: P2)

**Objetivo**: filtrar el listado por materia, por estado (mutuamente excluyentes) o ambos, conservando el orden, con mensaje si no hay resultados y opción de quitar filtros.

**Prueba independiente**: con tareas de varias materias y estados, aplicar cada filtro y su combinación (quickstart V4).

### Pruebas de la Historia 4 (escribir primero; deben fallar)

- [ ] T039 [US4] Añadir pruebas en `tests/test_api_tareas.py`: `GET /api/tareas?materia_id=X` → solo tareas de X en orden; `?estado=completada` → solo completadas; `?estado=pendiente` con una vencida, una urgente y una a 5 días (sin completar) → solo la de 5 días; `?materia_id=X&estado=urgente` → solo urgentes de X; combinación sin resultados → `[]`; `materia_id` inexistente → `[]`; `?materia_id=abc` → 422; `?estado=sin_completar` → 422 "El estado debe ser pendiente, urgente, vencida o completada."

### Implementación de la Historia 4

- [ ] T040 [US4] Ampliar `GET /tareas` en `app/rutas_tareas.py` con parámetros opcionales `materia_id: int | None` (filtro SQL parametrizado) y `estado: str | None` (validado contra `ESTADOS_VALIDOS`; si no, 422 con "El estado debe ser pendiente, urgente, vencida o completada."); el filtro por estado se aplica en Python tras `calcular_estado` sobre la lista ya ordenada (D-06), conservando el orden de RF-011
- [ ] T041 [US4] Completar la sección "Filtros" en `app/static/index.html`: `<select id="filtro-materia">` ("Todas las materias" + materias), `<select id="filtro-estado">` ("Todos los estados", "Pendiente", "Urgente", "Vencida", "Completada"), botón "Quitar filtros", y elemento `#sin-resultados` con el texto "No hay tareas para estos filtros" y un botón "Quitar filtros"
- [ ] T042 [US4] En `app/static/app.js`: mantener el estado `filtros = {materia_id, estado}`; `cargarTareas()` envía los filtros activos como parámetros de consulta (también en el refresco de 60 s); al cambiar un selector recargar el listado; "Quitar filtros" restablece ambos en una sola acción; mostrar `#sin-resultados` cuando hay filtros y la lista está vacía (y `#bienvenida` solo cuando no hay datos); actualizar las opciones de `#filtro-materia` al cambiar las materias

**Punto de control**: `pytest` pasa; quickstart V4 se cumple.

---

## Fase 7: Historia de Usuario 5 - Editar y eliminar materias y tareas (Prioridad: P3)

**Objetivo**: editar nombre/color de materias y todos los datos de tareas; eliminar tareas con confirmación y materias en cascada con advertencia del número de tareas.

**Prueba independiente**: editar una materia y una tarea y ver los cambios en el listado; eliminar una tarea y una materia con 3 tareas (cancelar y confirmar) (quickstart V5).

### Pruebas de la Historia 5 (escribir primero; deben fallar)

- [ ] T043 [P] [US5] Añadir pruebas en `tests/test_api_materias.py`: `PUT /api/materias/{id}` cambia solo el color → 200; cambia solo mayúsculas del propio nombre ("cálculo i" → "Cálculo I") → 200 (el duplicado excluye a la propia materia); renombrar a un nombre existente de otra materia → 409; nombre vacío / 51 caracteres / color inválido → 422 con los mismos mensajes que al crear; id inexistente → 404; `GET /api/materias` refleja `cantidad_tareas: 3` para una materia con 3 tareas; `DELETE /api/materias/{id}` → 204 y en `GET /api/tareas` ya no aparecen sus 3 tareas (cascada, RF-005); DELETE de id inexistente → 404; tras cambiar el color, `GET /api/tareas` muestra el nuevo color en `materia.color`
- [ ] T044 [P] [US5] Añadir pruebas en `tests/test_api_tareas.py`: `PUT /api/tareas/{id}` cambiando la entrega de 5 días a mañana → 200, estado "urgente" y nueva posición en `GET /api/tareas`; `PUT` sin `completada` conserva el valor actual; `PUT` con `completada: true` lo cambia; `PUT` con título vacío o `materia_id` inexistente → 422; id inexistente → 404; `DELETE /api/tareas/{id}` → 204 y luego `GET` → 404

### Implementación de la Historia 5

- [ ] T045 [US5] Añadir a `app/rutas_materias.py`: `PUT /materias/{id}` (mismas validaciones de `MateriaEntrada`; 404 si no existe; actualiza `nombre`, `nombre_normalizado` y `color`; `IntegrityError` → 409 con el mensaje de duplicado; 200 con `MateriaSalida` y `cantidad_tareas`) y `DELETE /materias/{id}` (204 o 404; la cascada la hace la clave foránea con `PRAGMA foreign_keys = ON`)
- [ ] T046 [US5] Añadir a `app/esquemas.py` el modelo `TareaEdicion` que hereda de `TareaEntrada` y agrega `completada: bool | None = None`
- [ ] T047 [US5] Añadir a `app/rutas_tareas.py`: `PUT /tareas/{id}` (404 si no existe; mismas validaciones y verificación de materia que `POST`; si `completada` es `None` conserva el valor; 200 con `TareaSalida`) y `DELETE /tareas/{id}` (204 o 404)
- [ ] T048 [US5] Añadir a `app/static/index.html` un `<dialog id="dialogo-confirmar">` con texto `#confirmar-texto` y botones "Cancelar" (foco inicial) y "Eliminar", cerrable con Esc
- [ ] T049 [US5] En `app/static/app.js`, para materias: botones "Editar" y "Eliminar" por materia; "Editar" carga nombre y color en `#form-materia` (que cambia a "Guardar cambios" con botón "Cancelar edición") y envía `PUT`; "Eliminar" abre `#dialogo-confirmar` con "Se eliminará la materia «X» y sus N tareas. Esta acción no se puede deshacer." (N de `cantidad_tareas`; sin mención a tareas si N = 0), llama a `DELETE` solo al confirmar; si la materia eliminada era la de `filtros.materia_id`, quitar ese filtro automáticamente; recargar materias y tareas
- [ ] T050 [US5] En `app/static/app.js`, para tareas: botones "Editar" y "Eliminar" por tarea; "Editar" carga todos los datos en `#form-tarea` (modo edición con "Guardar cambios" y "Cancelar edición") y envía `PUT`; "Eliminar" abre `#dialogo-confirmar` con "¿Eliminar la tarea «X»? Esta acción no se puede deshacer." y llama a `DELETE` al confirmar; devolver el foco a un elemento lógico tras cerrar el diálogo
- [ ] T051 [P] [US5] Añadir estilos en `app/static/estilos.css` para los botones de acción (área táctil ≥ 44 px), el `<dialog>` y su `::backdrop`, y el modo edición de los formularios

**Punto de control**: `pytest` completo pasa; quickstart V5 se cumple. Todas las historias funcionan de forma independiente.

---

## Fase 8: Pulido y aspectos transversales

**Propósito**: calidad, documentación y verificación de las puertas de calidad de la constitución.

- [ ] T052 [P] Escribir `README.md` en español: descripción, requisitos (Python 3.12), instalación con `venv` y `pip install -r requirements.txt -r requirements-dev.txt`, ejecución `uvicorn app.main:app --host 127.0.0.1 --port 8000`, pruebas con `pytest`, estilo con `ruff check . ; ruff format --check .`, ubicación de la base (`datos/organizador.db`, variable `ORGANIZADOR_DB`) y atribución de dependencias de terceros
- [ ] T053 Ejecutar `ruff check .` y `ruff format .` y corregir todos los avisos en `app/` y `tests/`; revisar que ninguna función supere ~40 líneas (Principio III)
- [ ] T054 Revisar que todos los textos visibles y mensajes de error en `app/static/index.html`, `app/static/app.js`, `app/esquemas.py`, `app/errores.py` y las rutas estén en español y expliquen cómo corregir el problema (RF-024)
- [ ] T055 [P] Verificar accesibilidad y diseño responsivo de `app/static/` (quickstart V7): vista a 360 px y escritorio sin desplazamiento horizontal, recorrido completo solo con teclado y foco visible, `<label>` en cada campo, anuncios en `aria-live`, contraste AA de cada color de `app/colores.py` (por ejemplo con la skill `a11y-check` o Lighthouse); corregir lo encontrado
- [ ] T056 [P] Verificar rendimiento (quickstart V8, CE-004): crear 200 tareas con un script temporal contra `POST /api/tareas` y comprobar que el listado y los filtros responden en < 1 s
- [ ] T057 Ejecutar la guía completa de [quickstart.md](./quickstart.md) (V1 a V8) y `pytest` completo; registrar cualquier desviación y corregirla antes de dar por terminada la funcionalidad

---

## Dependencias y orden de ejecución

### Dependencias entre fases

- **Configuración (Fase 1)**: sin dependencias; puede empezar de inmediato.
- **Fundacional (Fase 2)**: depende de la Fase 1; BLOQUEA todas las historias.
- **Historias (Fases 3 a 7)**: dependen de la Fase 2.
- **Pulido (Fase 8)**: depende de las historias que se quieran entregar.

### Dependencias entre historias

- **US1 (P1)**: tras la Fase 2; sin dependencias de otras historias.
- **US2 (P1)**: tras la Fase 2; necesita materias existentes. Sus pruebas de API crean materias insertándolas con la fixture `crear_materia` (que usa `POST /api/materias` de US1); en la práctica se implementa después de US1.
- **US3 (P2)**: depende de US2 (necesita tareas y `app/rutas_tareas.py`).
- **US4 (P2)**: depende de US2 (amplía `GET /api/tareas`); independiente de US3, salvo que la prueba de `estado=completada` usa el `PATCH` de US3 (si US3 no está, marcar la tarea directamente en la base desde la prueba).
- **US5 (P3)**: depende de US1 (materias) y US2 (tareas); independiente de US3 y US4, excepto el quitado automático del filtro (T049), que usa `filtros` de US4 si existe.

### Dentro de cada historia

- Pruebas primero y deben FALLAR antes de implementar (Principio II).
- Esquemas (`app/esquemas.py`) → rutas → registro en `app/main.py` → HTML → JS → CSS.
- Varias tareas modifican el mismo archivo (`app/esquemas.py`, `app/rutas_tareas.py`, `app/static/app.js`, `tests/test_api_tareas.py`); esas tareas NO se marcan [P] entre sí y deben hacerse en orden.
- Una tarea no se marca como completada si sus pruebas fallan o no existen.

### Oportunidades de paralelismo

- Fase 1: T002, T003, T004, T005 en paralelo.
- Fase 2: T006, T007, T008, T009, T010 en paralelo; luego T011 → T012; T013, T014, T015 en paralelo con el backend.
- US1: T016 y T022 en paralelo con el resto.
- US2: T023, T024, T025 (pruebas) en paralelo; T026 y T027 en paralelo; T033 en paralelo con T031–T032.
- US3 y US4 pueden avanzar en paralelo una vez terminada US2 (cuidando que ambas tocan `app/rutas_tareas.py`, `app/static/app.js` y `tests/test_api_tareas.py`: coordinar o secuenciar esas tareas).
- US5: T043 y T044 en paralelo; T051 en paralelo con T048–T050.
- Pulido: T052, T055, T056 en paralelo.

---

## Ejemplo de paralelismo: Historia de Usuario 2

```bash
# Lanzar juntas las pruebas de la Historia 2:
Tarea: "T023 Pruebas unitarias de parsear_fecha_entrega en tests/test_fechas.py"
Tarea: "T024 Pruebas unitarias de calcular_estado en tests/test_estados.py"
Tarea: "T025 Pruebas de API de tareas en tests/test_api_tareas.py"

# Lanzar juntas las reglas puras de la Historia 2:
Tarea: "T026 Implementar app/fechas.py"
Tarea: "T027 Implementar app/estados.py"
```

## Ejemplo de paralelismo: Fase Fundacional

```bash
Tarea: "T007 Implementar app/textos.py"
Tarea: "T008 Implementar app/colores.py"
Tarea: "T009 Implementar app/basedatos.py"
Tarea: "T010 Implementar app/errores.py"
Tarea: "T013 Crear app/static/index.html"
Tarea: "T014 Crear app/static/estilos.css"
Tarea: "T015 Crear app/static/app.js"
```

---

## Estrategia de implementación

### MVP primero (US1 + US2)

1. Completar la Fase 1: Configuración.
2. Completar la Fase 2: Fundacional (CRÍTICO: bloquea todas las historias).
3. Completar la Fase 3: US1 → **VALIDAR** con `pytest` y quickstart V1.
4. Completar la Fase 4: US2 → **VALIDAR** con `pytest` y quickstart V2.
5. Demostrar: con materias y tareas ordenadas con estados, la aplicación ya cumple su valor central.

> US1 por sí sola es un incremento comprobable y demostrable, pero el valor central ("qué debo entregar y cuándo") llega con US2; ambas son P1.

### Entrega incremental

1. Configuración + Fundacional → base lista.
2. US1 → probar → demostrar.
3. US2 → probar → demostrar (MVP).
4. US3 → probar → demostrar.
5. US4 → probar → demostrar.
6. US5 → probar → demostrar.
7. Pulido → verificar las 4 puertas de calidad de la constitución.

### Estrategia en equipo

1. Todo el equipo completa Configuración + Fundacional.
2. Una persona hace US1 mientras otra prepara las pruebas y reglas puras de US2 (T023–T027).
3. Tras US2: una persona US3, otra US4 (coordinando los archivos compartidos), otra US5.

---

## Notas

- [P] = archivos distintos y sin dependencias pendientes.
- La etiqueta [USn] vincula cada tarea con su historia para trazabilidad.
- Verificar que las pruebas fallan antes de implementar.
- Hacer commit después de cada tarea o grupo lógico.
- Detenerse en cada punto de control para validar la historia de forma independiente.
- Evitar: tareas vagas, conflictos en el mismo archivo y dependencias entre historias que rompan su independencia.
