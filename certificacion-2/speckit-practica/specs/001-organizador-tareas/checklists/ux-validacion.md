# Checklist de Experiencia de Usuario y Validación de Datos: Organizador de Tareas Académicas UPB

**Propósito**: Evaluar la calidad (completitud, claridad, consistencia y medibilidad) de los requisitos de experiencia de usuario y de validación de datos antes de implementar.
**Creado**: 2026-10-26
**Funcionalidad**: [spec.md](../spec.md) · [data-model.md](../data-model.md) · [contracts/api-rest.md](../contracts/api-rest.md)

**Nota**: Este checklist personalizado fue generado por el comando `/speckit-checklist` a partir del contexto de la funcionalidad y sus requisitos.
**Responsable de la revisión**: Este checklist es un artefacto de revisión de la calidad de los requisitos y pertenece al revisor. Marca un ítem `[x]` solo cuando el revisor determine que se cumple el criterio de calidad del requisito.
**Semántica de las marcas**: `[x]` significa que el criterio se revisó y se cumple en cuanto a calidad de los requisitos. NO significa que la implementación esté terminada.

## Completitud de los Requisitos — Experiencia de Usuario

- [ ] CHK001 - ¿Se especifica qué contiene el mensaje de bienvenida del estado vacío (texto, acciones ofrecidas, orden de los pasos guiados)? [Completitud, Spec §Casos Borde]
- [ ] CHK002 - ¿Se define cómo se le ofrece al estudiante registrar una materia cuando intenta crear una tarea sin materias (enlace, botón, apertura directa del formulario)? [Completitud, Spec §US2-7, RF-010]
- [ ] CHK003 - ¿Se define el contenido mínimo de los diálogos de confirmación de eliminación de tarea y de materia (texto, nombre del elemento, etiquetas de los botones, opción por defecto)? [Gap, Spec §RF-005, RF-009]
- [ ] CHK004 - ¿Se especifica cómo se muestra la descripción de una tarea en el listado o en un detalle, dado que RF-012 no la incluye entre los datos visibles? [Gap, Spec §RF-012]
- [ ] CHK005 - ¿Se define el formato de presentación de la fecha y hora de entrega (día/mes/año, reloj de 24 h, nombre del día, tiempo relativo)? [Gap, Spec §RF-012]
- [ ] CHK006 - ¿Se especifica qué ve el estudiante en el formulario cuando no indica la hora y el sistema asume las 23:59 (aviso, valor precargado)? [Gap, Spec §RF-007]
- [ ] CHK007 - ¿Se definen los estados de carga y de error de comunicación con el servidor local (servidor detenido, petición fallida) y el mensaje en español correspondiente? [Gap, Excepción]
- [ ] CHK008 - ¿Se define la retroalimentación tras una acción exitosa (crear, editar, completar, eliminar): mensaje, cierre del formulario, foco resultante? [Gap]
- [ ] CHK009 - ¿Se especifica si los filtros activos se conservan al recargar o volver a abrir la aplicación? [Gap, Spec §RF-018–RF-020]
- [ ] CHK010 - ¿Se define cómo se indica visualmente qué filtros están activos? [Gap, Spec §RF-020]

## Claridad de los Requisitos — Experiencia de Usuario

- [ ] CHK011 - ¿Está cuantificado "destacarse visualmente de forma más notoria" para las tareas vencidas (ícono, texto, peso, borde) de modo que pueda evaluarse objetivamente? [Ambigüedad, Spec §RF-014]
- [ ] CHK012 - ¿Se define en qué consiste la distinción visual de las tareas completadas (tachado, atenuado, etiqueta, ícono) y que no dependa solo del color? [Ambigüedad, Spec §RF-015]
- [ ] CHK013 - ¿Se especifica la etiqueta o indicador textual de los estados "Pendiente" y "Completada", además de "Urgente" y "Vencida"? [Claridad, Spec §RF-012, RF-014]
- [ ] CHK014 - ¿Se define la representación de las tareas en 360 px de ancho (qué datos se muestran, si se truncan títulos largos en la vista y cómo se accede al texto completo)? [Claridad, Spec §RF-025]
- [ ] CHK015 - ¿Están definidos los nombres visibles de los 8 colores de la paleta, de modo que la materia sea identificable sin depender de percibir el color? [Claridad, Spec §RF-002, Supuestos]

## Consistencia de los Requisitos

- [ ] CHK016 - ¿Es consistente el formato de fecha que menciona el mensaje de error ("formato día/mes/año") con el formato aceptado por la API (`AAAA-MM-DD` / `AAAA-MM-DDTHH:MM`)? [Conflicto, data-model §Tarea, contracts §POST /api/tareas]
- [ ] CHK017 - ¿Coincide la regla de unicidad de nombres de RF-003 (solo mayúsculas y espacios) con la normalización del modelo (`casefold(NFC(...))`), en especial para nombres que difieren solo en tildes ("Cálculo" vs "Calculo")? [Consistencia, Spec §RF-003, data-model §Materia]
- [ ] CHK018 - ¿Es consistente el tratamiento de una `materia_id` inexistente entre la creación de tareas (422) y el filtro del listado (devuelve `[]`), y está justificado en la especificación? [Consistencia, contracts §GET /api/tareas]
- [ ] CHK019 - ¿Son consistentes los requisitos de confirmación: la eliminación de una materia sin tareas, ¿requiere confirmación como la de una tarea o se elimina directamente? [Consistencia, Spec §RF-005, RF-009]
- [ ] CHK020 - ¿Son consistentes los mensajes de error con RF-024 ("explicar cómo corregir el problema") en todos los ejemplos del modelo de datos (p. ej., "El título es obligatorio.")? [Consistencia, Spec §RF-024, data-model §Reglas de validación]

## Completitud de los Requisitos — Validación de Datos

- [ ] CHK021 - ¿Se define un rango permitido para la fecha de entrega (año mínimo y máximo), tal como exige el Principio IV de validar "rango"? [Gap, Constitución §IV, Spec §RF-008]
- [ ] CHK022 - ¿Se especifica cómo se tratan los espacios internos repetidos en nombres y títulos ("Cálculo  I" vs "Cálculo I"), tanto para el guardado como para la unicidad? [Gap, Spec §RF-003, RF-006a]
- [ ] CHK023 - ¿Se define si se permiten saltos de línea, tabulaciones o caracteres de control en el nombre de materia y en el título de tarea? [Gap, Spec §RF-001, RF-006]
- [ ] CHK024 - ¿Se especifica que el texto ingresado (p. ej., `<script>`) se muestre siempre como texto literal y nunca se interprete como HTML? [Gap, Constitución §IV]
- [ ] CHK025 - ¿Se definen las reglas de validación de los parámetros de ruta (`{id}` no entero o negativo) y del campo `completada` en `PUT` con su mensaje en español? [Completitud, contracts §PUT/PATCH /api/tareas]
- [ ] CHK026 - ¿Se especifica si existe un límite de cantidad de materias o tareas, o se declara explícitamente que no lo hay? [Gap, Spec §CE-004]
- [ ] CHK027 - ¿Se define el comportamiento ante campos desconocidos o de tipo incorrecto en el cuerpo JSON (p. ej., `titulo` numérico)? [Gap, Constitución §IV]

## Claridad de los Requisitos — Validación de Datos

- [ ] CHK028 - ¿Está definido si el contador visible ("120/100") cuenta el texto antes o después de quitar los espacios al inicio y al final, para que coincida con la validación del servidor? [Ambigüedad, Spec §RF-006a]
- [ ] CHK029 - ¿Se especifica en qué momento se muestran los errores de validación del cliente (al escribir, al salir del campo, al enviar)? [Gap, Spec §RF-006a]
- [ ] CHK030 - ¿Está definido qué se considera "fecha inexistente" (29 de febrero en año no bisiesto, 31 de abril, hora 24:00) y cómo se informa en cada caso? [Claridad, Spec §Casos Borde]
- [ ] CHK031 - ¿Se aclara si el contador de caracteres se muestra siempre o solo al acercarse al límite, y para qué campos (nombre, título, descripción)? [Claridad, Spec §RF-006a]

## Calidad de los Criterios de Aceptación

- [ ] CHK032 - ¿Se define cómo se medirán CE-001 (menos de 2 minutos sin ayuda) y CE-006 (90 % en el primer intento): número de participantes, guion y condiciones de la prueba? [Medibilidad, Spec §CE-001, CE-006]
- [ ] CHK033 - ¿Puede verificarse objetivamente CE-002 ("identifica en menos de 5 segundos") con un procedimiento definido? [Medibilidad, Spec §CE-002]
- [ ] CHK034 - ¿Se define desde qué evento hasta cuál se mide el "menos de 1 segundo" de CE-004 y en qué tipo de dispositivo? [Medibilidad, Spec §CE-004]
- [ ] CHK035 - ¿Enumera CE-007 todas las entradas inválidas definidas en la especificación (color fuera de la paleta, materia inexistente, filtro inválido)? [Completitud, Spec §CE-007]

## Cobertura de Escenarios y Casos Borde

- [ ] CHK036 - ¿Se define qué ocurre si el estudiante cierra o cancela un formulario con cambios sin guardar? [Gap, Flujo alterno]
- [ ] CHK037 - ¿Se especifica el comportamiento cuando se edita o completa una tarea que ya fue eliminada (por ejemplo, desde otra pestaña), incluyendo el mensaje del 404? [Cobertura, Excepción, contracts §Códigos]
- [ ] CHK038 - ¿Se aborda qué pasa con la tarea en pantalla si cambia de estado (p. ej., de urgente a vencida) mientras hay un filtro de estado activo? [Cobertura, Spec §RF-016, RF-019]
- [ ] CHK039 - ¿Se definen los requisitos ante un cambio manual de la hora del dispositivo o de su zona horaria? [Gap, Spec §Supuestos, research §D-05]
- [ ] CHK040 - ¿Se especifica la recuperación ante un fallo al guardar (el formulario conserva lo escrito, se puede reintentar)? [Gap, Recuperación]

## Requisitos No Funcionales — Accesibilidad

- [ ] CHK041 - ¿Se definen requisitos de manejo del foco: al abrir y cerrar diálogos, tras un error de validación (foco al primer campo inválido) y tras eliminar un elemento? [Gap, Constitución §V, Spec §RF-025]
- [ ] CHK042 - ¿Se especifica que los mensajes de error queden asociados a su campo para lectores de pantalla, y no solo mostrados visualmente? [Completitud, Constitución §V, contracts §Contrato de la interfaz]
- [ ] CHK043 - ¿Se exige que los colores de la paleta sean distinguibles entre sí para personas con daltonismo, además del contraste AA con texto blanco? [Gap, Spec §RF-002, data-model §Paleta]
- [ ] CHK044 - ¿Se define si los cambios de estado automáticos (RF-016) se anuncian o no a tecnologías de asistencia, para evitar anuncios excesivos? [Gap, Spec §RF-016]

## Notas

- Marca los ítems `[x]` solo después de que la revisión confirme que se cumple el criterio de calidad del requisito
- Deja los ítems sin marcar cuando aún requieran aclaración, corrección o evaluación del revisor
- `/speckit-implement` lee el estado de las casillas como puerta de calidad y no debe modificar las marcas
- `checklists/requirements.md` tiene su propio ciclo de vida, mantenido por `/speckit-specify` y `/speckit-clarify`
- Agrega comentarios o hallazgos en línea
- Enlaza recursos o documentación relevantes
- Los ítems están numerados secuencialmente para facilitar su referencia
