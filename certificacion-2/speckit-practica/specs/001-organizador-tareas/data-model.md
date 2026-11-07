# Modelo de Datos (Fase 1): Organizador de Tareas Académicas UPB

**Funcionalidad**: `001-organizador-tareas` | **Fecha**: 2026-10-26 | **Plan**: [plan.md](./plan.md)

Almacenamiento: SQLite (archivo local). Decisiones de soporte en [research.md](./research.md)
(D-01 a D-08).

## Diagrama de relaciones

```text
materias (1) ──────< (0..N) tareas
             ON DELETE CASCADE
```

---

## Entidad: Materia (`materias`)

| Campo                | Tipo SQLite | Restricciones                          | Descripción |
|----------------------|-------------|----------------------------------------|-------------|
| `id`                 | INTEGER     | PRIMARY KEY AUTOINCREMENT              | Identificador. |
| `nombre`             | TEXT        | NOT NULL                               | Nombre recortado, tal como se muestra. |
| `nombre_normalizado` | TEXT        | NOT NULL, UNIQUE                       | `casefold(NFC(recortar(nombre)))`; garantiza RF-003. No se expone en la API. |
| `color`              | TEXT        | NOT NULL                               | Identificador de un color de la paleta (D-10). |

**Reglas de validación** (servidor, RF-001 a RF-004, RF-006a):

| Regla | Mensaje (ejemplo) |
|-------|-------------------|
| `nombre` presente y, tras recortar espacios, con al menos 1 carácter | "El nombre de la materia es obligatorio." |
| `nombre` recortado con 50 grafemas como máximo | "El nombre puede tener como máximo 50 caracteres (tiene 63)." |
| `nombre_normalizado` no repetido (al crear y al editar, excluyendo la propia materia) | "Ya existe una materia llamada «Cálculo I». Elige otro nombre." |
| `color` presente y perteneciente a la paleta | "Elige un color de la lista." |

**Campo derivado en respuestas**: `cantidad_tareas` (conteo de tareas asociadas), usado para la
advertencia de eliminación (RF-005).

**Eliminación**: permanente; elimina en cascada todas sus tareas. La confirmación con la cantidad
de tareas se realiza en la interfaz antes de llamar a la API.

---

## Entidad: Tarea (`tareas`)

| Campo           | Tipo SQLite | Restricciones                                           | Descripción |
|-----------------|-------------|---------------------------------------------------------|-------------|
| `id`            | INTEGER     | PRIMARY KEY AUTOINCREMENT                               | Identificador; también desempata el orden (D-08). |
| `materia_id`    | INTEGER     | NOT NULL, REFERENCES `materias(id)` ON DELETE CASCADE   | Materia a la que pertenece. |
| `titulo`        | TEXT        | NOT NULL                                                | Título recortado. |
| `descripcion`   | TEXT        | NULL                                                    | Descripción recortada; `NULL` = "sin descripción". |
| `fecha_entrega` | TEXT        | NOT NULL                                                | `"AAAA-MM-DDTHH:MM"` en hora local (D-05). |
| `completada`    | INTEGER     | NOT NULL DEFAULT 0, CHECK (`completada` IN (0, 1))      | Indicador de completada. |
| `creada_en`     | TEXT        | NOT NULL                                                | Momento de creación, `"AAAA-MM-DDTHH:MM:SS"`. |

**Índice**: `CREATE INDEX idx_tareas_entrega ON tareas (fecha_entrega, id);` (orden de RF-011).

**Reglas de validación** (servidor, RF-006 a RF-010, RF-006a):

| Regla | Mensaje (ejemplo) |
|-------|-------------------|
| `materia_id` presente | "Elige la materia de la tarea." |
| `materia_id` corresponde a una materia existente | "La materia elegida no existe. Actualiza la página y elige otra." |
| `titulo` presente y no vacío tras recortar | "El título es obligatorio." |
| `titulo` con 100 grafemas como máximo | "El título puede tener como máximo 100 caracteres (tiene 120)." |
| `descripcion` con 500 grafemas como máximo tras recortar; vacía o solo espacios → `NULL` | "La descripción puede tener como máximo 500 caracteres (tiene 512)." |
| `fecha_entrega` presente | "La fecha de entrega es obligatoria." |
| `fecha_entrega` con formato `AAAA-MM-DD` o `AAAA-MM-DDTHH:MM` y fecha existente | "La fecha de entrega no es válida. Usa el formato día/mes/año y una fecha que exista." |
| Si `fecha_entrega` no trae hora → se completa con `T23:59` (RF-007) | — |
| Se permiten fechas pasadas (RF-008) | — |

**Nota**: no se cortan textos largos; se rechazan (RF-006a). El texto se guarda ya recortado.

---

## Atributo derivado: `estado` de la Tarea (no se almacena)

Se calcula en cada consulta con `ahora` = hora local truncada al minuto (D-06):

```text
si completada                     → "completada"
si no, si fecha_entrega <= ahora  → "vencida"
si no, si fecha_entrega <= ahora + 48 h → "urgente"
si no                             → "pendiente"
```

Los estados son mutuamente excluyentes. "Sin completar" = {vencida, urgente, pendiente}.

### Transiciones de estado

```text
                 marcar completada
  ┌────────────┐ ───────────────▶ ┌────────────┐
  │ pendiente  │                  │            │
  │     │      │                  │            │
  │ (paso del  │                  │ completada │
  │  tiempo)   │                  │            │
  │     ▼      │ ◀─────────────── │            │
  │  urgente   │   desmarcar (vuelve al estado  └────────────┘
  │     │      │   que corresponda por fecha)
  │ (paso del  │
  │  tiempo)   │
  │     ▼      │
  │  vencida   │
  └────────────┘
```

- `pendiente → urgente`: cuando `ahora` alcanza `fecha_entrega − 48 h`.
- `urgente → vencida`: en el minuto exacto de `fecha_entrega`.
- Editar `fecha_entrega` puede mover la tarea a cualquier estado sin completar (US5, escenario 1).
- Cualquier estado sin completar ↔ `completada` mediante marcar/desmarcar (RF-017).

---

## Paleta de colores (constante en código, no es tabla)

8 entradas `{id, nombre, hex}` con identificadores en español (D-10). Cada `hex` debe ofrecer un
contraste ≥ 4.5:1 con el texto blanco. Se expone en `GET /api/colores`.
