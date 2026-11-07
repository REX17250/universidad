# Investigación (Fase 0): Organizador de Tareas Académicas UPB

**Funcionalidad**: `001-organizador-tareas` | **Fecha**: 2026-10-26 | **Plan**: [plan.md](./plan.md)

Este documento resuelve las incógnitas del Contexto Técnico y registra las decisiones de diseño
tomadas con el stack definido por el usuario: Python 3.12, FastAPI, SQLite, HTML/CSS/JS sin
frameworks servidos por el mismo FastAPI, y pytest.

---

## D-01. Acceso a SQLite: módulo `sqlite3` de la biblioteca estándar, sin ORM

- **Decisión**: usar `sqlite3` de la biblioteca estándar con consultas SQL parametrizadas. El
  esquema se crea al arrancar la aplicación con `CREATE TABLE IF NOT EXISTS`.
- **Justificación**: son solo dos tablas y unas pocas consultas; un ORM o una herramienta de
  migraciones añadiría dependencias y conceptos sin beneficio (Principio I). Las consultas
  parametrizadas (`?`) previenen inyección SQL (Principio IV).
- **Alternativas consideradas**: SQLAlchemy / SQLModel (más dependencias y abstracción
  innecesaria para dos tablas); Alembic (no hay esquema previo que migrar).

## D-02. Integridad: borrado en cascada con clave foránea

- **Decisión**: `tareas.materia_id REFERENCES materias(id) ON DELETE CASCADE`, activando
  `PRAGMA foreign_keys = ON` en cada conexión.
- **Justificación**: RF-005 exige eliminar la materia y todas sus tareas de forma permanente; la
  base de datos lo garantiza de forma atómica sin código adicional.
- **Alternativas consideradas**: borrar las tareas manualmente antes de la materia (más código y
  riesgo de inconsistencia si falla a mitad).

## D-03. Unicidad de nombre de materia sin distinguir mayúsculas (con tildes)

- **Decisión**: guardar una columna `nombre_normalizado` = nombre recortado, normalizado a NFC y
  pasado por `str.casefold()`, con restricción `UNIQUE`.
- **Justificación**: `COLLATE NOCASE` de SQLite solo ignora mayúsculas en ASCII; "CÁLCULO I" y
  "cálculo i" no se considerarían iguales. La columna normalizada resuelve RF-003 con una
  restricción declarativa y evita condiciones de carrera.
- **Alternativas consideradas**: `COLLATE NOCASE` (falla con tildes y "ñ"); comprobar en Python
  antes de insertar sin restricción (no garantiza unicidad).

## D-04. Conteo de caracteres visibles (grafemas)

- **Decisión**: en el servidor, contar grafemas con la librería `regex` (patrón `\X`) tras
  recortar espacios y normalizar a NFC. En el navegador, el contador visible usa
  `Intl.Segmenter` con granularidad `grapheme` (con respaldo a `[...texto].length` si el
  navegador no lo soporta).
- **Justificación**: RF-006a exige que un emoji (incluidos los compuestos, como 👍🏽 o 👨‍👩‍👧) o una
  letra con tilde cuenten como 1. `len()` de Python cuenta puntos de código y fallaría con emojis
  compuestos y con letras en forma descompuesta (NFD). El servidor es la autoridad (Principio IV);
  el contador del cliente es solo ayuda de usabilidad.
- **Alternativas consideradas**: `len()` tras NFC (correcto para tildes pero no para emojis
  compuestos); paquete `grapheme` (sin mantenimiento activo); implementar las reglas Unicode a mano
  (complejo y propenso a errores). Ver la justificación en *Seguimiento de Complejidad* del plan.

## D-05. Fecha de entrega: hora local sin zona horaria, precisión de minutos

- **Decisión**: la API recibe la fecha como `"AAAA-MM-DD"` o `"AAAA-MM-DDTHH:MM"`. Si falta la
  hora se asume `23:59` (RF-007). Se valida con `datetime.strptime` (rechaza fechas inexistentes
  como `2026-02-30` y formatos incorrectos). Se almacena como texto ISO `"AAAA-MM-DDTHH:MM"`, que se
  ordena correctamente de forma lexicográfica.
- **Justificación**: el supuesto de la especificación es que la hora de referencia es la local del
  dispositivo y la aplicación (servidor y navegador) corre en el mismo equipo; guardar zonas
  horarias no aporta valor en esta versión. El formato de texto fijo simplifica orden y
  comparación.
- **Alternativas consideradas**: guardar UTC y convertir en el cliente (añade conversiones sin
  necesidad para un único dispositivo); marca de tiempo numérica (menos legible al depurar).

## D-06. Cálculo del estado: en el servidor, con reloj inyectable

- **Decisión**: el estado (`completada`, `vencida`, `urgente`, `pendiente`) se calcula en el
  servidor en cada consulta mediante una función pura `calcular_estado(completada, entrega, ahora)`.
  `ahora` es la hora local truncada al minuto y se obtiene de una dependencia de FastAPI
  (`obtener_ahora`) que las pruebas sustituyen con `app.dependency_overrides` para fijar el reloj.
  Reglas (RF-013): completada → `completada`; `entrega <= ahora` → `vencida`;
  `entrega <= ahora + 48 h` → `urgente`; en otro caso → `pendiente`.
- **Justificación**: una sola implementación de la regla de negocio, probada de forma exhaustiva
  con pytest en los límites exactos (CE-003). El filtro por estado (RF-019) se resuelve en el
  mismo lugar. No se guarda el estado en la base de datos porque cambia con el tiempo.
- **Alternativas consideradas**: calcular el estado en JavaScript (duplicaría la regla y no podría
  probarse con pytest); guardar el estado y actualizarlo con una tarea programada (complejidad
  innecesaria y datos desactualizados).

## D-07. Actualización de estados con el paso del tiempo (RF-016)

- **Decisión**: el frontend vuelve a pedir el listado (con los filtros activos) cada 60 segundos
  con `setInterval`, y también al recuperar el foco la pestaña (`visibilitychange`).
- **Justificación**: cumple el retraso máximo de 1 minuto con una petición trivial (≤ 200 tareas)
  y reutiliza el cálculo del servidor (D-06).
- **Alternativas consideradas**: WebSockets / Server-Sent Events (complejidad injustificada);
  recalcular en el cliente (duplica la regla).

## D-08. Ordenamiento (RF-011)

- **Decisión**: `ORDER BY fecha_entrega ASC, id ASC`. El `id` autoincremental refleja el orden de
  creación; además se guarda `creada_en` por trazabilidad.
- **Justificación**: resuelve empates sin lógica adicional.
- **Alternativas consideradas**: ordenar por `creada_en` (dos tareas creadas en el mismo segundo
  empatarían).

## D-09. Validación y mensajes de error en español

- **Decisión**: los cuerpos de petición se validan con modelos Pydantic (incluido con FastAPI)
  cuyos validadores lanzan `ValueError` con mensajes en español. Un manejador de
  `RequestValidationError` transforma los errores al formato uniforme
  `{"detalle": "...", "errores": {"campo": "mensaje"}}` con código 422, y reemplaza los mensajes
  genéricos de Pydantic (en inglés) por textos en español (por ejemplo, "El título es
  obligatorio."). Los errores de negocio (nombre duplicado, materia inexistente) usan
  `HTTPException` con el mismo formato (409 y 404/422 respectivamente).
- **Justificación**: Principio IV y RF-024 (mensajes en español que expliquen cómo corregir). Un
  único formato permite al frontend mostrar el mensaje junto a cada campo.
- **Alternativas consideradas**: validar a mano en cada ruta (repetitivo); dejar los mensajes por
  defecto de Pydantic (en inglés, incumple RF-024).

## D-10. Paleta de colores predefinida (RF-002)

- **Decisión**: 8 colores fijos definidos en el servidor con un identificador en español (por
  ejemplo, `azul`, `rojo`, `verde`, `naranja`, `morado`, `turquesa`, `rosa`, `marron`) y su valor
  hexadecimal; se exponen en `GET /api/colores` para que el frontend construya el selector. Los
  tonos se eligen oscuros para que el texto blanco sobre ellos cumpla contraste AA (≥ 4.5:1).
- **Justificación**: una única fuente de verdad; el servidor puede validar que el color recibido
  pertenece a la paleta.
- **Alternativas consideradas**: selector de color libre (excluido por la especificación);
  duplicar la paleta en JS (riesgo de divergencia).

## D-11. Frontend sin frameworks servido por FastAPI

- **Decisión**: archivos estáticos en `app/static/` (`index.html`, `estilos.css`, `app.js`)
  montados con `StaticFiles(html=True)` en `/`. Una sola página con: formulario de materias,
  formulario de tareas, filtros y listado. Diálogos de confirmación con el elemento `<dialog>`
  nativo (accesible por teclado). Diseño *mobile first* con CSS Flexbox/Grid y `min-width: 360px`.
- **Justificación**: cumple la restricción del usuario y el Principio I; sin paso de compilación.
- **Alternativas consideradas**: plantillas Jinja2 (dependencia extra y recargas completas de
  página); frameworks JS (excluidos por el usuario).

## D-12. Estrategia de pruebas

- **Decisión**: pytest + `fastapi.testclient.TestClient` (requiere `httpx`). Cada prueba usa una
  base SQLite temporal (`tmp_path`) y un reloj fijo mediante `dependency_overrides`. Se separan:
  - pruebas unitarias de reglas puras (`calcular_estado`, conteo de caracteres, normalización y
    parseo de fechas);
  - pruebas de API por historia de usuario (flujo principal + errores y casos borde).
  Comando único: `pytest`.
- **Justificación**: Principio II. Toda la lógica de negocio y validación vive en el servidor, por
  lo que queda cubierta con pytest. La interfaz se verifica manualmente con la guía de
  [quickstart.md](./quickstart.md) (puerta de calidad 3 de la constitución).
- **Alternativas consideradas**: pruebas de navegador con Playwright (útiles, pero añaden
  dependencias y navegadores; se pueden incorporar en una versión posterior si se requiere).

## D-13. Estilo de código

- **Decisión**: `ruff` como linter y formateador (dependencia solo de desarrollo), configurado en
  `pyproject.toml`. Identificadores del código en español, de forma consistente.
- **Justificación**: Principio III (estilo consistente verificado automáticamente) y Restricciones
  Adicionales (criterio de idioma consistente).
- **Alternativas consideradas**: black + flake8 (dos herramientas en lugar de una).

## D-14. Ejecución y ubicación de datos

- **Decisión**: se ejecuta con `uvicorn app.main:app` en `127.0.0.1:8000`. La base se guarda en
  `datos/organizador.db` (ruta configurable con la variable de entorno `ORGANIZADOR_DB`); la
  carpeta se crea automáticamente.
- **Justificación**: RF-022 (persistencia en el dispositivo) y RF-023 (sin inicio de sesión:
  escuchar solo en `localhost` evita exponer los datos en la red).
- **Alternativas consideradas**: Docker (excluido por el usuario); guardar en `localStorage`
  (incompatible con el backend en SQLite solicitado).

---

**Estado**: no quedan elementos "NEEDS CLARIFICATION".
