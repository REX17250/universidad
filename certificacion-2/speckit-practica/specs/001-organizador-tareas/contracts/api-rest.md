# Contrato de la API REST: Organizador de Tareas Académicas UPB

**Funcionalidad**: `001-organizador-tareas` | **Fecha**: 2026-10-26 | **Plan**: [../plan.md](../plan.md)

- Base: `http://127.0.0.1:8000`. Todas las rutas de datos cuelgan de `/api`.
- Formato: JSON en UTF-8. Sin autenticación (RF-023).
- Entidades y reglas de validación: ver [../data-model.md](../data-model.md).
- La documentación interactiva generada por FastAPI queda disponible en `/docs`.

## Formato de error uniforme

Todas las respuestas de error usan este cuerpo:

```json
{
  "detalle": "Revisa los campos marcados.",
  "errores": {
    "titulo": "El título es obligatorio.",
    "fecha_entrega": "La fecha de entrega es obligatoria."
  }
}
```

- `detalle` (siempre): mensaje general en español.
- `errores` (solo en errores de validación): un mensaje por campo; se informa **cada** campo
  inválido (US2, escenario 6).

| Código | Uso |
|--------|-----|
| 200 | Consulta o actualización correcta. |
| 201 | Recurso creado. |
| 204 | Recurso eliminado (sin cuerpo). |
| 404 | Recurso inexistente (`"No se encontró la tarea."`). |
| 409 | Nombre de materia duplicado. |
| 422 | Datos inválidos (incluida una `materia_id` inexistente en el cuerpo y parámetros de filtro inválidos). |

---

## Colores

### `GET /api/colores`

Devuelve la paleta predefinida (RF-002), en el orden en que se muestra.

```json
[
  { "id": "azul", "nombre": "Azul", "hex": "#1F4E9C" },
  { "id": "rojo", "nombre": "Rojo", "hex": "#B3261E" }
]
```

---

## Materias

### Representación `Materia`

```json
{ "id": 1, "nombre": "Cálculo I", "color": "azul", "cantidad_tareas": 3 }
```

### `GET /api/materias`

Lista todas las materias ordenadas por nombre (sin distinguir mayúsculas). `200` → `Materia[]`.

### `POST /api/materias`

Cuerpo:

```json
{ "nombre": "Cálculo I", "color": "azul" }
```

- `201` → `Materia` (con `cantidad_tareas: 0`).
- `422` → nombre vacío, demasiado largo o color fuera de la paleta.
- `409` → ya existe una materia con ese nombre sin distinguir mayúsculas ni espacios (RF-003).

### `PUT /api/materias/{id}`

Mismo cuerpo y validaciones que `POST` (RF-004). La comprobación de duplicados excluye a la propia
materia (se puede cambiar solo el color o solo las mayúsculas del nombre).

- `200` → `Materia` actualizada · `404` · `409` · `422`.

### `DELETE /api/materias/{id}`

Elimina la materia y, en cascada, todas sus tareas, de forma permanente (RF-005). La advertencia y
confirmación se realizan en la interfaz usando `cantidad_tareas`.

- `204` · `404`.

---

## Tareas

### Representación `Tarea`

```json
{
  "id": 7,
  "titulo": "Informe de laboratorio",
  "descripcion": null,
  "fecha_entrega": "2026-10-31T23:59",
  "completada": false,
  "estado": "pendiente",
  "creada_en": "2026-10-26T09:15:02",
  "materia": { "id": 2, "nombre": "Física I", "color": "rojo" }
}
```

- `descripcion`: `null` significa "sin descripción".
- `estado`: uno de `"pendiente" | "urgente" | "vencida" | "completada"`, calculado en el servidor
  en el momento de la petición (RF-013).
- `materia`: datos actuales de la materia (un cambio de color se refleja en todas sus tareas, US5).

### `GET /api/tareas`

Parámetros de consulta opcionales y combinables (RF-018 a RF-020):

| Parámetro    | Tipo    | Descripción |
|--------------|---------|-------------|
| `materia_id` | entero  | Solo tareas de esa materia. Si la materia no existe, devuelve `[]`. |
| `estado`     | texto   | `pendiente`, `urgente`, `vencida` o `completada`. Cada valor devuelve **solo** ese estado. |

- `200` → `Tarea[]` ordenadas por `fecha_entrega` ascendente y, en empate, por orden de creación
  (RF-011, RF-021). Lista vacía si no hay resultados.
- `422` → `materia_id` no entero o `estado` fuera de los valores permitidos
  (`"El estado debe ser pendiente, urgente, vencida o completada."`).

### `GET /api/tareas/{id}`

- `200` → `Tarea` · `404`.

### `POST /api/tareas`

Cuerpo:

```json
{
  "materia_id": 2,
  "titulo": "Informe de laboratorio",
  "descripcion": "Incluir gráficas",
  "fecha_entrega": "2026-10-31T18:00"
}
```

- `descripcion` es opcional; vacía o solo espacios se guarda como `null`.
- `fecha_entrega` acepta `"AAAA-MM-DD"` (se asume `23:59`, RF-007) o `"AAAA-MM-DDTHH:MM"`. Se
  permiten fechas pasadas (RF-008).
- `201` → `Tarea` (con `completada: false`).
- `422` → campos obligatorios faltantes, textos demasiado largos, fecha inválida o
  `materia_id` inexistente. Si no hay materias registradas, el mensaje de `materia_id` indica que
  primero se debe registrar una materia (RF-010).

### `PUT /api/tareas/{id}`

Edita todos los datos de la tarea (RF-009). Mismo cuerpo y validaciones que `POST`; además acepta
`"completada"` (booleano, opcional; si se omite se conserva el valor actual).

- `200` → `Tarea` · `404` · `422`.

### `PATCH /api/tareas/{id}/completada`

Marca o desmarca la tarea (RF-017).

```json
{ "completada": true }
```

- `200` → `Tarea` con el `estado` recalculado · `404` · `422` (valor no booleano).

### `DELETE /api/tareas/{id}`

Elimina la tarea de forma permanente (la confirmación se pide en la interfaz).

- `204` · `404`.

---

## Contrato de la interfaz (frontend)

- `GET /` sirve `index.html`; `/estilos.css` y `/app.js` se sirven desde `app/static/`.
- La interfaz consume exclusivamente las rutas anteriores.
- Refresca `GET /api/tareas` (con los filtros activos) cada 60 segundos y al volver a la pestaña
  (RF-016).
- Al eliminar la materia usada como filtro, quita ese filtro automáticamente (caso borde).
- Muestra los mensajes de `errores` junto a cada campo y `detalle` en una región `aria-live`.
