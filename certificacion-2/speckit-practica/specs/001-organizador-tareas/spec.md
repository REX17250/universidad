# Especificación de Funcionalidad: Organizador de Tareas Académicas UPB

**Rama de la funcionalidad**: `001-organizador-tareas`

**Creada**: 2026-10-26

**Estado**: Borrador

**Entrada**: Descripción del usuario: "Quiero una aplicación para estudiantes de la UPB que les ayude a organizar sus tareas académicas. El estudiante puede registrar sus materias (nombre y color). Puede crear tareas asociadas a una materia, con título, descripción opcional y fecha de entrega. Ve un listado de tareas ordenado por fecha de entrega, donde las tareas vencidas se destacan y las próximas 48 horas aparecen como "urgentes". Puede marcar tareas como completadas y filtrarlas por materia o por estado. En esta primera versión no hay inicio de sesión: es un solo usuario por dispositivo. Todo el contenido de la especificación debe estar en español."

## Clarifications

### Session 2026-10-26

- Q: Cuando el estudiante elimina una materia que tiene tareas, ¿qué debe pasar con esas tareas? → A: Se eliminan en cascada junto con la materia, tras advertir cuántas tareas se eliminarán y pedir confirmación explícita; el borrado es permanente (sin deshacer ni reasignación a otra materia).
- Q: ¿Qué debe pasar cuando el estudiante escribe o pega más caracteres de los permitidos en un campo? → A: Se permite escribir de más, pero un contador visible (por ejemplo, "120/100") indica el exceso; no se puede guardar hasta corregirlo y se muestra un mensaje en español con el límite. El texto nunca se corta automáticamente.
- Q: ¿Cómo se cuentan los caracteres para los límites y qué pasa con una descripción que solo tiene espacios? → A: Se cuentan caracteres visibles (un emoji o una letra con tilde cuentan como 1) después de quitar los espacios al inicio y al final; se guarda el texto ya recortado. Una descripción vacía o solo con espacios se guarda como "sin descripción".
- Q: ¿Cómo se calcula exactamente "urgente": una ventana móvil de 48 horas desde el momento actual o por días de calendario (hoy y mañana)? → A: Ventana móvil de 48 horas, con precisión de minutos: una tarea no completada es "urgente" si ahora < entrega ≤ ahora + 48 h; "vencida" si entrega ≤ ahora; "pendiente" si entrega > ahora + 48 h.
- Q: Al filtrar por estado "pendiente", ¿se muestran todas las tareas no completadas o solo las que vencen después de 48 horas? → A: Solo las que vencen después de 48 horas; los cuatro estados son mutuamente excluyentes y cada filtro muestra únicamente su estado. Para referirse a cualquier tarea no completada se usa "sin completar", no "pendiente".

## Escenarios de Usuario y Pruebas *(obligatorio)*

### Historia de Usuario 1 - Registrar materias (Prioridad: P1)

El estudiante registra las materias que cursa en el semestre, indicando para cada una un nombre y un color que le permita reconocerla visualmente.

**Por qué esta prioridad**: las tareas siempre pertenecen a una materia; sin materias registradas no se puede crear ninguna tarea. Es la base de todo el sistema.

**Prueba independiente**: se puede probar por completo registrando varias materias con distintos colores y verificando que aparecen en el listado de materias con su nombre y color, y que siguen disponibles al volver a abrir la aplicación.

**Escenarios de aceptación**:

1. **Dado** que el estudiante no tiene materias registradas, **Cuando** registra la materia "Cálculo I" con color azul, **Entonces** la materia aparece en su listado de materias con el nombre y el color elegidos.
2. **Dado** que existe la materia "Cálculo I", **Cuando** intenta registrar otra materia llamada "cálculo i", **Entonces** el sistema rechaza el registro e informa en español que ya existe una materia con ese nombre.
3. **Dado** que el estudiante está registrando una materia, **Cuando** deja el nombre vacío, **Entonces** el sistema no guarda la materia y muestra un mensaje indicando que el nombre es obligatorio.
4. **Dado** que el estudiante registró materias, **Cuando** cierra y vuelve a abrir la aplicación en el mismo dispositivo, **Entonces** sus materias siguen disponibles.

---

### Historia de Usuario 2 - Crear tareas y verlas ordenadas por fecha de entrega (Prioridad: P1)

El estudiante crea tareas asociadas a una de sus materias, con título, descripción opcional y fecha de entrega. Consulta un listado único de todas sus tareas ordenado de la entrega más próxima a la más lejana, donde las tareas vencidas se destacan y las que vencen en las próximas 48 horas se identifican como "urgentes".

**Por qué esta prioridad**: es el valor central de la aplicación: saber qué se debe entregar y cuándo, con énfasis en lo que requiere atención inmediata.

**Prueba independiente**: con al menos una materia registrada, crear tareas con fechas pasadas, dentro de las próximas 48 horas y más lejanas, y verificar el orden del listado y los indicadores de "vencida" y "urgente".

**Escenarios de aceptación**:

1. **Dado** que existe la materia "Física I", **Cuando** el estudiante crea la tarea "Informe de laboratorio" con fecha de entrega dentro de 5 días y sin descripción, **Entonces** la tarea aparece en el listado asociada a "Física I", mostrando el color de la materia y su fecha de entrega.
2. **Dado** que existen tareas sin completar con entregas el 10, 3 y 7 de noviembre, **Cuando** el estudiante consulta el listado, **Entonces** las tareas aparecen en el orden 3, 7 y 10 de noviembre.
3. **Dado** que una tarea sin completar tenía entrega ayer, **Cuando** el estudiante consulta el listado, **Entonces** la tarea aparece destacada como "vencida".
4. **Dado** que una tarea sin completar tiene entrega dentro de 30 horas, **Cuando** el estudiante consulta el listado, **Entonces** la tarea aparece identificada como "urgente".
5. **Dado** que una tarea sin completar tiene entrega dentro de 3 días, **Cuando** el estudiante consulta el listado, **Entonces** la tarea aparece como "pendiente" (ni urgente ni vencida).
6. **Dado** que el estudiante está creando una tarea, **Cuando** deja vacío el título, no elige materia o no indica fecha de entrega, **Entonces** el sistema no guarda la tarea y señala en español cada campo obligatorio faltante.
7. **Dado** que el estudiante no tiene materias registradas, **Cuando** intenta crear una tarea, **Entonces** el sistema le indica que primero debe registrar una materia y le ofrece hacerlo.

---

### Historia de Usuario 3 - Marcar tareas como completadas (Prioridad: P2)

El estudiante marca una tarea como completada cuando la entrega, y puede revertir esa acción si se equivocó.

**Por qué esta prioridad**: permite distinguir lo que falta por entregar de lo ya hecho y evita que las tareas entregadas sigan generando alertas de "urgente" o "vencida".

**Prueba independiente**: con tareas existentes, marcar una como completada, verificar que pierde los indicadores de urgencia/vencimiento y se distingue visualmente; luego revertirla y verificar que recupera su estado según su fecha.

**Escenarios de aceptación**:

1. **Dado** que una tarea está marcada como "urgente", **Cuando** el estudiante la marca como completada, **Entonces** la tarea se muestra como completada y deja de mostrarse como urgente.
2. **Dado** que una tarea vencida se marca como completada, **Cuando** el estudiante consulta el listado, **Entonces** la tarea ya no aparece destacada como vencida.
3. **Dado** que una tarea está completada, **Cuando** el estudiante la desmarca, **Entonces** vuelve a estar sin completar y recupera el indicador que le corresponda según su fecha de entrega.

---

### Historia de Usuario 4 - Filtrar tareas por materia o por estado (Prioridad: P2)

El estudiante filtra el listado de tareas para ver solo las de una materia o solo las de un estado (pendiente, urgente, vencida o completada), y puede combinar ambos filtros.

**Por qué esta prioridad**: cuando el número de tareas crece, el filtrado permite concentrarse en una materia o en lo que requiere atención; es valioso pero el listado completo ya cubre la necesidad básica.

**Prueba independiente**: con tareas de varias materias y estados, aplicar cada filtro y su combinación, y verificar que solo se muestran las tareas que cumplen el criterio, conservando el orden por fecha de entrega.

**Escenarios de aceptación**:

1. **Dado** que existen tareas de "Cálculo I" y "Física I", **Cuando** el estudiante filtra por "Cálculo I", **Entonces** solo se muestran las tareas de "Cálculo I", ordenadas por fecha de entrega.
2. **Dado** que existen tareas completadas y sin completar, **Cuando** el estudiante filtra por estado "completada", **Entonces** solo se muestran las tareas completadas.
3. **Dado** que el estudiante filtra por materia "Física I" y estado "urgente", **Cuando** consulta el listado, **Entonces** solo se muestran las tareas urgentes de "Física I".
4. **Dado** que ninguna tarea cumple los filtros aplicados, **Cuando** el estudiante consulta el listado, **Entonces** se muestra un mensaje indicando que no hay tareas para esos filtros y la opción de quitarlos.
5. **Dado** que hay filtros aplicados, **Cuando** el estudiante los quita, **Entonces** vuelve a ver todas sus tareas.
6. **Dado** que existen una tarea vencida, una urgente y una con entrega en 5 días, todas sin completar, **Cuando** el estudiante filtra por estado "pendiente", **Entonces** solo se muestra la tarea con entrega en 5 días.

---

### Historia de Usuario 5 - Editar y eliminar materias y tareas (Prioridad: P3)

El estudiante corrige los datos de una materia o tarea (por ejemplo, una fecha de entrega que cambió) y elimina las que ya no necesita.

**Por qué esta prioridad**: las fechas y las materias cambian durante el semestre; sin edición el estudiante tendría que convivir con datos incorrectos, pero el resto de la aplicación funciona sin esta capacidad.

**Prueba independiente**: editar el nombre/color de una materia y el título/fecha de una tarea, verificar que los cambios se reflejan en el listado; eliminar una tarea y una materia con tareas y verificar el resultado.

**Escenarios de aceptación**:

1. **Dado** que una tarea tiene entrega en 5 días, **Cuando** el estudiante cambia la fecha a mañana, **Entonces** la tarea cambia de posición en el listado y aparece como "urgente".
2. **Dado** que una materia cambia de color, **Cuando** el estudiante consulta el listado, **Entonces** todas sus tareas muestran el nuevo color.
3. **Dado** que el estudiante elige eliminar una tarea, **Cuando** confirma la acción, **Entonces** la tarea desaparece del listado.
4. **Dado** que una materia tiene 3 tareas asociadas, **Cuando** el estudiante elige eliminarla, **Entonces** el sistema le advierte que también se eliminarán sus 3 tareas y solo procede si confirma.
5. **Dado** que el estudiante confirmó la eliminación de una materia con 3 tareas, **Cuando** consulta el listado, **Entonces** ni la materia ni sus 3 tareas aparecen, y no es posible recuperarlas.
6. **Dado** que el estudiante elige eliminar una materia con tareas, **Cuando** cancela la advertencia, **Entonces** la materia y todas sus tareas se conservan sin cambios.

---

### Casos Borde

- **Tarea creada con fecha ya pasada**: se permite (el estudiante puede registrar tareas atrasadas) y aparece de inmediato como "vencida".
- **Límite exacto de 48 horas**: una tarea sin completar cuya entrega ocurre dentro de las 48 horas siguientes al momento actual (incluido el límite) es "urgente"; a partir de ese límite es "pendiente". La ventana es móvil (se cuenta desde el momento actual, no por días de calendario): por ejemplo, el lunes a las 10:00, una entrega el miércoles a las 10:00 es "urgente" y una el miércoles a las 10:01 es "pendiente".
- **Momento de la entrega**: una tarea deja de ser "urgente" y pasa a "vencida" en el instante exacto en que se alcanza su fecha y hora de entrega.
- **Paso del tiempo con la aplicación abierta**: los indicadores de "urgente" y "vencida" se actualizan sin que el estudiante tenga que reiniciar la aplicación.
- **Tareas con la misma fecha y hora de entrega**: se ordenan por orden de creación (la más antigua primero).
- **Sin materias ni tareas**: el listado muestra un mensaje de bienvenida que guía a registrar la primera materia y crear la primera tarea.
- **Textos demasiado largos**: el campo admite escribir o pegar de más, pero el contador de caracteres señala el exceso y no se permite guardar hasta corregirlo; el texto nunca se corta automáticamente.
- **Textos solo con espacios**: en el nombre de la materia y el título de la tarea se rechazan como vacíos; en la descripción se guardan como "sin descripción". Los espacios al inicio y al final se quitan antes de validar y de guardar.
- **Caracteres especiales en los límites**: emojis y letras con tilde o "ñ" cuentan como un carácter cada uno.
- **Filtro por una materia eliminada**: si la materia filtrada se elimina, el filtro de materia se quita automáticamente.
- **Fecha inválida**: una fecha de entrega inexistente o con formato incorrecto se rechaza con un mensaje en español.

## Requisitos *(obligatorio)*

### Requisitos Funcionales

**Materias**

- **RF-001**: El sistema DEBE permitir registrar una materia con un nombre obligatorio (de 1 a 50 caracteres, sin contar espacios al inicio y al final) y un color obligatorio.
- **RF-002**: El sistema DEBE ofrecer un conjunto predefinido de al menos 8 colores distinguibles entre sí para elegir el color de la materia.
- **RF-003**: El sistema DEBE impedir registrar dos materias con el mismo nombre, sin distinguir mayúsculas, minúsculas ni espacios al inicio y al final.
- **RF-004**: El sistema DEBE permitir editar el nombre y el color de una materia existente, aplicando las mismas validaciones que al registrarla.
- **RF-005**: El sistema DEBE permitir eliminar una materia; si tiene tareas asociadas, DEBE advertir cuántas tareas se eliminarán con ella y requerir confirmación explícita. Al confirmar, la materia y todas sus tareas se eliminan de forma permanente (en cascada); no se ofrece deshacer ni reasignar las tareas a otra materia.

**Tareas**

- **RF-006**: El sistema DEBE permitir crear una tarea con: materia asociada (obligatoria, elegida entre las registradas), título (obligatorio, de 1 a 100 caracteres), descripción (opcional, hasta 500 caracteres) y fecha de entrega (obligatoria).
- **RF-006a**: Los límites de longitud de RF-001 y RF-006 DEBEN contarse en caracteres visibles (un emoji o una letra con tilde cuentan como 1) después de quitar los espacios al inicio y al final, y el sistema DEBE guardar el texto ya recortado. Cada campo con límite DEBE mostrar un contador visible (por ejemplo, "120/100"); si se supera el límite, el sistema NO DEBE cortar el texto, DEBE impedir guardar y DEBE mostrar un mensaje en español que indique el máximo permitido. Una descripción vacía o solo con espacios DEBE guardarse como ausente.
- **RF-007**: La fecha de entrega DEBE incluir día y hora; si el estudiante no indica la hora, el sistema DEBE asumir las 23:59 de ese día.
- **RF-008**: El sistema DEBE permitir registrar tareas con fecha de entrega pasada.
- **RF-009**: El sistema DEBE permitir editar todos los datos de una tarea y eliminarla previa confirmación.
- **RF-010**: Cuando no existan materias registradas, el sistema DEBE impedir la creación de tareas e indicar al estudiante que primero registre una materia.

**Listado y estados**

- **RF-011**: El sistema DEBE mostrar un listado de tareas ordenado por fecha y hora de entrega ascendente; ante empates, por orden de creación.
- **RF-012**: Cada tarea del listado DEBE mostrar su título, el nombre y el color de su materia, su fecha y hora de entrega y su estado.
- **RF-013**: El sistema DEBE asignar a cada tarea exactamente uno de estos estados, calculado respecto al momento actual del dispositivo ("ahora"), con precisión de minutos y usando una ventana móvil de 48 horas (no días de calendario):
  - **Completada**: el estudiante la marcó como completada (sin importar la fecha).
  - **Vencida**: no está completada y entrega ≤ ahora.
  - **Urgente**: no está completada y ahora < entrega ≤ ahora + 48 horas.
  - **Pendiente**: no está completada y entrega > ahora + 48 horas.
  Las tareas vencidas, urgentes y pendientes forman el grupo de tareas "sin completar".
- **RF-014**: Las tareas vencidas DEBEN destacarse visualmente de forma más notoria que las demás, y las urgentes DEBEN mostrar la etiqueta "Urgente"; la distinción NO DEBE depender únicamente del color (por ejemplo, debe incluir texto o un ícono).
- **RF-015**: Las tareas completadas DEBEN distinguirse visualmente de las no completadas.
- **RF-016**: Los estados DEBEN actualizarse con el paso del tiempo mientras la aplicación está abierta, con un retraso máximo de 1 minuto.

**Completar y filtrar**

- **RF-017**: El sistema DEBE permitir marcar una tarea como completada y desmarcarla para que vuelva a su estado según su fecha.
- **RF-018**: El sistema DEBE permitir filtrar el listado por una materia.
- **RF-019**: El sistema DEBE permitir filtrar el listado por un estado (pendiente, urgente, vencida o completada); cada filtro DEBE mostrar únicamente las tareas de ese estado según RF-013 (por ejemplo, "pendiente" no incluye urgentes ni vencidas).
- **RF-020**: El sistema DEBE permitir combinar el filtro de materia con el de estado, y quitar los filtros con una sola acción.
- **RF-021**: El listado filtrado DEBE conservar el orden definido en RF-011 y, si no hay resultados, mostrar un mensaje que lo indique.

**Generales**

- **RF-022**: El sistema DEBE conservar las materias y tareas en el dispositivo, de modo que sigan disponibles al cerrar y volver a abrir la aplicación.
- **RF-023**: El sistema NO DEBE requerir registro ni inicio de sesión; todos los datos pertenecen al único usuario del dispositivo.
- **RF-024**: Todos los textos, etiquetas y mensajes de error visibles DEBEN estar en español y explicar cómo corregir el problema.
- **RF-025**: La interfaz DEBE poder usarse en pantallas de celular (desde 360 px de ancho) y de computadora, y todas las acciones DEBEN poder realizarse con teclado.

### Entidades Clave

- **Materia**: asignatura que cursa el estudiante. Atributos: nombre (único, 1 a 50 caracteres) y color. Una materia puede tener cero o más tareas; al eliminarla, sus tareas se eliminan con ella de forma permanente.
- **Tarea**: actividad académica con entrega. Atributos: título (1 a 100 caracteres), descripción opcional (hasta 500 caracteres), fecha y hora de entrega, indicador de completada y momento de creación. Pertenece a exactamente una materia. Su estado (pendiente, urgente, vencida o completada) se deriva del indicador de completada y de la fecha de entrega respecto al momento actual.

## Criterios de Éxito *(obligatorio)*

### Resultados Medibles

- **CE-001**: Un estudiante que usa la aplicación por primera vez puede registrar una materia y crear su primera tarea en menos de 2 minutos, sin ayuda.
- **CE-002**: Al abrir el listado, el estudiante identifica cuáles tareas están vencidas y cuáles son urgentes en menos de 5 segundos.
- **CE-003**: El 100 % de las tareas se muestra con el estado correcto según las reglas de RF-013, incluidos los casos límite de 48 horas y del momento exacto de entrega.
- **CE-004**: Con 200 tareas registradas, el listado y la aplicación de filtros responden de forma percibida como inmediata (menos de 1 segundo).
- **CE-005**: El 100 % de los datos registrados sigue disponible tras cerrar y volver a abrir la aplicación en el mismo dispositivo.
- **CE-006**: El 90 % de los estudiantes que prueban la aplicación logra marcar una tarea como completada y filtrar por materia en el primer intento.
- **CE-007**: Ninguna entrada inválida (campos obligatorios vacíos, textos demasiado largos, nombres de materia duplicados, fechas inválidas) se guarda; en todos los casos se muestra un mensaje de error en español.

## Supuestos

- Los usuarios son estudiantes de la UPB que usan la aplicación de forma personal en su propio dispositivo (celular o computadora).
- Al no existir inicio de sesión, los datos no se sincronizan entre dispositivos ni se respaldan en la nube; si el estudiante borra los datos del dispositivo o cambia de equipo, pierde su información. Esto se acepta para la primera versión.
- La hora de referencia para calcular estados es la hora local del dispositivo.
- El color de las materias se elige de una paleta predefinida (no un selector libre) para garantizar que los colores sean distinguibles y que el texto mantenga un contraste adecuado.
- Las tareas completadas permanecen en el listado (en su posición por fecha) hasta que el estudiante las elimine; no hay archivado automático.
- Quedan fuera del alcance de esta versión: notificaciones o recordatorios, tareas recurrentes, subtareas, adjuntos, calificaciones, calendario académico oficial de la UPB, compartir tareas, múltiples usuarios por dispositivo y exportación de datos.
- No se requiere conexión a internet para usar las funciones descritas.
