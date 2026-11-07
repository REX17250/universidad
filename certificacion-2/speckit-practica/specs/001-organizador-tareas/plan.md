# Plan de Implementación: Organizador de Tareas Académicas UPB

**Rama**: `001-organizador-tareas` | **Fecha**: 2026-10-26 | **Especificación**: [spec.md](./spec.md)

**Entrada**: especificación de la funcionalidad en `/specs/001-organizador-tareas/spec.md`

**Nota**: este plan lo genera el comando `/speckit-plan`.

## Resumen

Aplicación web para un solo estudiante por dispositivo que permite registrar materias (nombre y
color de una paleta fija), crear tareas con fecha de entrega, verlas en un listado ordenado con
estados derivados (pendiente, urgente, vencida, completada), marcarlas como completadas, filtrarlas
por materia y estado, y editar o eliminar materias y tareas (con eliminación en cascada).

Enfoque técnico: un único proyecto Python 3.12 con FastAPI que expone una API REST JSON bajo
`/api` y sirve el frontend estático (HTML, CSS y JavaScript sin frameworks) desde el mismo
proceso. Los datos se guardan en un archivo SQLite local mediante `sqlite3` de la biblioteca
estándar. Toda la lógica de negocio (validaciones, conteo de caracteres, cálculo de estados,
orden y filtros) vive en el servidor y se prueba con pytest usando un reloj inyectable. Detalle de
decisiones en [research.md](./research.md).

## Contexto Técnico

**Lenguaje/Versión**: Python 3.12 (backend); HTML5, CSS3 y JavaScript ES2020 sin frameworks
(frontend).

**Dependencias principales**: `fastapi` (incluye `pydantic` y `starlette`), `uvicorn` (servidor),
`regex` (conteo de grafemas, D-04). Desarrollo: `pytest`, `httpx` (para `TestClient`), `ruff`.

**Almacenamiento**: SQLite en `datos/organizador.db` vía `sqlite3` (sin ORM), con claves foráneas
y `ON DELETE CASCADE`.

**Pruebas**: pytest + `fastapi.testclient.TestClient`, base temporal por prueba y reloj fijo con
`dependency_overrides`. Comando único: `pytest`.

**Plataforma objetivo**: equipo del estudiante (Windows, Linux o macOS) ejecutando el servidor en
`127.0.0.1`; navegadores modernos de escritorio y celular (≥ 360 px).

**Tipo de proyecto**: aplicación web en un único proyecto (API + frontend estático servido por el
mismo FastAPI).

**Objetivos de rendimiento**: listado y filtros con 200 tareas en < 1 s percibido (CE-004);
actualización de estados con retraso ≤ 1 min (RF-016).

**Restricciones**: sin Docker ni microservicios; sin inicio de sesión; funciona sin internet
(no se usan CDN); textos y mensajes en español; WCAG 2.1 AA; usable por teclado.

**Escala/Alcance**: 1 usuario por dispositivo, del orden de decenas de materias y cientos de
tareas; 1 página web; ~10 endpoints.

## Verificación de la Constitución

*PUERTA: debe pasar antes de la Fase 0 y volver a verificarse después del diseño de la Fase 1.*

| Principio / Regla | Cómo lo cumple el plan | Estado |
|-------------------|------------------------|--------|
| **I. Simplicidad (YAGNI)** | Un solo proyecto y proceso; `sqlite3` sin ORM; sin frameworks JS, sin Docker, sin capas de repositorio/servicio separadas. La única dependencia no impuesta por el usuario (`regex`) se justifica en *Seguimiento de Complejidad*. | ✅ Cumple (con 1 justificación) |
| **II. Pruebas obligatorias** | Pruebas unitarias de reglas puras y pruebas de API por historia de usuario, con flujo principal y casos de error/borde; comando único `pytest` documentado en [quickstart.md](./quickstart.md). | ✅ Cumple |
| **III. Código legible** | Módulos pequeños con una responsabilidad (`estados.py`, `textos.py`, `fechas.py`…); identificadores en español de forma consistente; `ruff` como linter/formateador. | ✅ Cumple |
| **IV. Validación de entradas** | Validación en el servidor con Pydantic y mensajes en español (D-09); SQL parametrizado; validación en el cliente solo como ayuda (contadores). Pruebas con entradas inválidas por cada regla de [data-model.md](./data-model.md). | ✅ Cumple |
| **V. Accesible y responsivo** | HTML semántico, `<label>` por campo, `<dialog>` nativo, foco visible, estados con texto además de color, paleta con contraste AA, diseño *mobile first* desde 360 px. Verificación manual en quickstart V7. | ✅ Cumple |
| **Restricciones: idioma** | Documentación, interfaz y mensajes en español; identificadores en español. | ✅ Cumple |
| **Restricciones: integridad académica** | Sin código de terceros copiado; dependencias declaradas en `requirements*.txt`. | ✅ Cumple |
| **Flujo Spec Kit** | spec → plan (este documento) → tasks → implementación. | ✅ Cumple |

**Resultado previo a la Fase 0**: APROBADO. No hay violaciones sin justificar.

**Re-verificación tras la Fase 1 (diseño)**: APROBADO. El modelo de datos (2 tablas), el contrato
REST (~10 endpoints) y la guía de validación no introducen nuevas capas ni dependencias. Se
confirmó que la regla de estados existe en un solo lugar (servidor) y que toda regla de validación
tiene un mensaje en español y una prueba prevista.

## Estructura del Proyecto

### Documentación (esta funcionalidad)

```text
specs/001-organizador-tareas/
├── plan.md              # Este archivo (salida de /speckit-plan)
├── research.md          # Fase 0 (salida de /speckit-plan)
├── data-model.md        # Fase 1 (salida de /speckit-plan)
├── quickstart.md        # Fase 1 (salida de /speckit-plan)
├── contracts/
│   └── api-rest.md      # Fase 1 (salida de /speckit-plan)
└── tasks.md             # Fase 2 (salida de /speckit-tasks; NO la crea /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
app/
├── __init__.py
├── main.py              # Crea la app FastAPI, registra rutas, manejadores de error y estáticos
├── basedatos.py         # Conexión sqlite3 (dependencia de FastAPI) y creación del esquema
├── colores.py           # Paleta predefinida de 8 colores
├── textos.py            # Recorte, normalización NFC/casefold y conteo de grafemas
├── fechas.py            # Parseo de fecha de entrega (23:59 por defecto) y obtener_ahora()
├── estados.py           # calcular_estado(completada, fecha_entrega, ahora)
├── esquemas.py          # Modelos Pydantic de entrada/salida con mensajes en español
├── errores.py           # Formato uniforme {detalle, errores} y traducción de errores
├── rutas_materias.py    # /api/materias y /api/colores
├── rutas_tareas.py      # /api/tareas
└── static/
    ├── index.html       # Página única
    ├── estilos.css      # Estilos mobile first
    └── app.js           # Lógica de interfaz: fetch, formularios, contadores, filtros, refresco

tests/
├── conftest.py          # Cliente de pruebas, base temporal, reloj fijo
├── test_textos.py       # Conteo de grafemas, recorte, normalización
├── test_fechas.py       # Formatos válidos/inválidos, hora por defecto
├── test_estados.py      # Límites exactos de 48 h y minuto de entrega
├── test_api_materias.py # US1 y US5 (materias, duplicados, cascada)
└── test_api_tareas.py   # US2, US3, US4 y US5 (tareas, orden, completar, filtros)

datos/                   # Base SQLite local (creada al ejecutar; ignorada por git)
requirements.txt         # fastapi, uvicorn, regex
requirements-dev.txt     # pytest, httpx, ruff
pyproject.toml           # Configuración de pytest y ruff
README.md                # Instalación, ejecución y pruebas (en español)
```

**Decisión de estructura**: un único proyecto en la raíz. El paquete `app/` contiene el backend
como módulos planos (sin subcarpetas `models/`, `services/`, `api/`, innecesarias para este
tamaño) y el frontend en `app/static/`, servido por el mismo FastAPI. Las pruebas viven en
`tests/` como archivos planos, separados entre reglas puras y pruebas de API.

## Seguimiento de Complejidad

> Solo se completa porque la verificación de la constitución registra una justificación.

| Elemento | Por qué se necesita | Alternativa más simple descartada porque |
|----------|---------------------|------------------------------------------|
| Dependencia `regex` (conteo de grafemas con `\X`) | RF-006a exige que un emoji, incluidos los compuestos (👍🏽, 👨‍👩‍👧, banderas), cuente como 1 carácter, y la validación debe ser autoritativa en el servidor (Principio IV). | `len()` tras normalizar a NFC cuenta puntos de código: resuelve tildes y "ñ", pero cuenta 2 a 5 por cada emoji compuesto; implementar las reglas de segmentación Unicode a mano sería más código y más frágil que una librería madura. |
| Columna `nombre_normalizado` | RF-003 exige unicidad sin distinguir mayúsculas, también con tildes ("CÁLCULO" = "cálculo"). | `COLLATE NOCASE` de SQLite solo pliega mayúsculas ASCII. |
