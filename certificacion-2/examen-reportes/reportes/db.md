# Bugs de Base de Datos

Formato de cada entrada:

```markdown
## N. <título corto del bug>

- **Ubicación:** colección/campo, o archivo de seed/schema
- **Qué está mal:** descripción concreta del defecto
- **Cómo reproducirlo:** query o pasos para verlo
- **Esperado:** qué debería pasar en su lugar
- **Severidad:** alta / media / baja
- [ ] Corregido
```

---

## 1. Código de programa duplicado rompe la importación del seed

- **Ubicación:** `database/programs.json` — dos documentos con `code: "DERE"` (`_id` `6abf0b8bfead57fb41c1292d` "Derecho" y `_id` `6ac03d4229a649e6df069ebb` "Derecho (jornada nocturna)")
- **Qué está mal:** `code` tiene índice único en el schema de `Program`, pero el seed trae dos programas distintos con el mismo código. `npm run db:import` corta en el primer error de `insertMany`, así que esto además impide importar `students`, `subjects`, `teachers` y `users` (vienen después alfabéticamente).
- **Cómo reproducirlo:** `npm run db:import` con el seed original → `E11000 duplicate key error ... code_1 dup key: { code: "DERE" }`.
- **Esperado:** cada programa con un `code` único.
- **Severidad:** alta (bloquea el setup completo del proyecto)
- [x] Corregido — renombrado localmente el segundo a `DERE-N` en `database/programs.json` para poder continuar probando. Pendiente decidir el código "correcto" para la versión final.

## 2. Usuario docente de ejemplo tiene email en mayúsculas y rol fuera del enum

- **Ubicación:** `database/users.json`, documento de `Laura.Lopez89@universidad.edu`
- **Qué está mal:** corrección de la entrada original — el usuario **sí existe**, pero con dos defectos: (1) el email está guardado con mayúsculas (`Laura.Lopez89@...`) mientras el schema fuerza `lowercase` y `findByEmail` hace `.toLowerCase()` antes de buscar, así que el login con el email tal como lo documenta el README nunca encuentra el documento; (2) `role: "Docente"` (con mayúscula) está fuera del enum real (`admin`/`docente`/`estudiante`), que es case-sensitive.
- **Cómo reproducirlo:** `POST /api/auth/login` con `laura.lopez89@universidad.edu` / `Secret123!` → `401 Credenciales invalidas` (no encuentra el documento por el case del email guardado).
- **Esperado:** email guardado en minúsculas, `role: "docente"`.
- **Severidad:** alta
- [x] Corregido

## 3. Hash de contraseña inválido en la cuenta de estudiante de ejemplo

- **Ubicación:** `database/users.json`, documento de `juliana.herrera147@universidad.edu`
- **Qué está mal:** corrección de la entrada original — el `passwordHash` guardado **no es un hash bcrypt válido** (longitud incorrecta comparada con los demás usuarios, que comparten un hash de 60 caracteres). No es que la contraseña sea "otra", es que el valor guardado ni siquiera tiene formato de hash bcrypt real.
- **Cómo reproducirlo:** comparar la longitud/formato de `passwordHash` de este documento contra cualquier otro usuario del seed.
- **Esperado:** un hash bcrypt válido correspondiente a `Secret123!`.
- **Severidad:** media
- [x] Corregido — se reemplazó por un hash bcrypt válido de `Secret123!`.

## 4. Usuario admin con nombre vacío

- **Ubicación:** `database/users.json`, `admin@universidad.edu` (`_id` `6abf0b8bfead57fb41c12a38`)
- **Qué está mal:** `name: ""`, aunque el schema marca `name` como requerido.
- **Cómo reproducirlo:** ver el nombre del admin en cualquier pantalla que lo muestre (ej. saludo, perfil).
- **Esperado:** un nombre no vacío.
- **Severidad:** media
- [x] Corregido

## 5. Materia con créditos en 0

- **Ubicación:** `database/subjects.json`, `ODON105` (`_id` `6abf0b8bfead57fb41c1299d`)
- **Qué está mal:** `credits: 0`; el mínimo esperado es 1 y el resto del seed usa 2-5.
- **Cómo reproducirlo:** ver los créditos de `ODON105`.
- **Esperado:** `credits >= 1`.
- **Severidad:** media
- [x] Corregido

## 6. Ningún periodo con estado "abierto" válido

- **Ubicación:** `database/periods.json`, periodo `2026-2`
- **Qué está mal:** `status: "Abierto"` (con mayúscula) no coincide con el enum real (`'abierto'`, minúscula). Resultado: no existe ningún periodo abierto en todo el sistema.
- **Cómo reproducirlo:** `GET /api/periods/current` → 404 (no encuentra ninguno); no se puede matricular a nadie; los reportes no tienen periodo de referencia.
- **Esperado:** `status: "abierto"`.
- **Severidad:** alta (bloquea matrículas y reportes del periodo actual en todo el sistema)
- [x] Corregido
- *(confirmado en vivo desde el frontend: de los 100 periodos, 97 cerrado, 2 planificado, 1 con `"Abierto"` mal escrito; en Admin → Periodos esa fila sale con badge neutro y SIN la acción "Cerrar periodo" porque el frontend compara contra `'abierto'` en minúscula; `/periods?status=abierto` da 0 resultados.)*

## 7. Estudiante con programa huérfano y estado inconsistente

- **Ubicación:** `database/students.json`, estudiante `E20210046`
- **Qué está mal:** su `program` (`6ac057b232f78f9b9e14f3c4`) no existe en la colección `programs` (referencia huérfana); además `active: false` en el estudiante mientras su `user.active` es `true`.
- **Cómo reproducirlo:** intentar resolver/popular el programa de este estudiante → `null`.
- **Esperado:** referencia válida y estado consistente entre `student` y su `user`.
- **Severidad:** alta
- [x] Corregido

## 8. Campo `campus` con espacio final impide filtrar

- **Ubicación:** `database/faculties.json`, `FAC-SAL`
- **Qué está mal:** `campus: "Bogotá "` (espacio al final); `GET /faculties?campus=Bogotá` no la encuentra por la diferencia exacta de string.
- **Cómo reproducirlo:** filtrar facultades por `campus=Bogotá` → `FAC-SAL` no aparece.
- **Esperado:** sin espacios extra en el dato.
- **Severidad:** baja
- [x] Corregido

## 9. Decano de facultad con referencia huérfana

- **Ubicación:** `database/faculties.json`, `FAC-COM`
- **Qué está mal:** `dean` (`6ac057b232f78f9b9e14f3c3`) no existe en `teachers`; cualquier populate de ese campo devuelve `null`.
- **Cómo reproducirlo:** consultar `FAC-COM` con el decano populado → `null`.
- **Esperado:** referencia a un docente existente.
- **Severidad:** alta
- [x] Corregido

## 10. Notas por encima del máximo de la escala

- **Ubicación:** `database/grades.json`, `_id` `6abf0b8bfead57fb41c12df0` y `...12dfc`
- **Qué está mal:** `value: 5.7`, por encima del máximo real de la escala (5).
- **Cómo reproducirlo:** ver esas dos notas directamente en la colección.
- **Esperado:** valores dentro de 0-5.
- **Severidad:** alta
- [x] Corregido

## 11. Nota guardada como texto con coma decimal

- **Ubicación:** `database/grades.json`, `_id` `6abf0b8bfead57fb41c12e1b`
- **Qué está mal:** `value: "4,2"` — string con coma, en vez de un `number`.
- **Cómo reproducirlo:** ver el tipo de dato de ese campo.
- **Esperado:** `value: 4.2` (number).
- **Severidad:** alta
- [x] Corregido

## 12. Notificación con tipo fuera del enum

- **Ubicación:** `database/notifications.json`, `_id` `6abf0b8bfead57fb41c12eb7`
- **Qué está mal:** `type: "aviso_urgente"`, valor no contemplado en el enum real del schema.
- **Cómo reproducirlo:** ver el campo `type` de esa notificación.
- **Esperado:** un valor válido del enum.
- **Severidad:** media
- [x] Corregido

## 13. Materia con auto-referencia como su propio prerrequisito

- **Ubicación:** `database/subjects.json`, `MAT101`
- **Qué está mal:** `prerequisites` incluye el propio `_id` de `MAT101` (ciclo de un solo nodo). Ninguna matrícula de `MAT101` puede validar el prerrequisito (afecta a las 18 matrículas de esa materia), y la validación `assertNoCycle` del backend fallaría si se intenta editar.
- **Cómo reproducirlo:** intentar matricular `MAT101` → la validación de prerrequisito nunca se satisface.
- **Esperado:** `prerequisites` sin auto-referencia.
- **Severidad:** alta
- [x] Corregido

## 14. Grupo con más inscritos que capacidad, día inválido y salón insuficiente

- **Ubicación:** `database/groups.json`, `_id` `6abf0b8bfead57fb41c12c3a`
- **Qué está mal:** `enrolled: 35 > capacity: 32` (y solo hay 9 matrículas vigentes reales — el contador no corresponde a nada); el horario usa `day: "Miércoles"` (el enum real es `'miercoles'`, minúscula sin tilde); y usa el salón `B-104`, que está **inactivo** y tiene capacidad 22 (menor a los 32 del grupo).
- **Cómo reproducirlo:** ver el documento del grupo y su salón asignado.
- **Esperado:** `enrolled` coherente con las matrículas reales, día del enum correcto, salón activo y con capacidad suficiente.
- **Severidad:** alta
- [x] Corregido

## 15. Otro grupo con inscritos por encima de la capacidad

- **Ubicación:** `database/groups.json`, `_id` `6abf0b8bfead57fb41c12c3e`
- **Qué está mal:** `enrolled: 42 > capacity: 39`, con solo 10 matrículas vigentes reales.
- **Cómo reproducirlo:** ver el documento del grupo.
- **Esperado:** `enrolled` coherente con las matrículas reales y dentro de la capacidad.
- **Severidad:** alta
- [x] Corregido

## 16. Franja horaria con hora de fin anterior a la de inicio

- **Ubicación:** `database/groups.json`, `_id` `6abf0b8bfead57fb41c12c64`
- **Qué está mal:** franja del jueves con `endTime: "07:00"` y `startTime: "09:00"` (termina antes de empezar).
- **Cómo reproducirlo:** ver el horario de ese grupo.
- **Esperado:** `endTime > startTime`.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo: existe otro caso igual, grupo PSIC575 G1 (2027-1) con franja "Jue 09:00–07:00" — confirma que no hay validación de este caso ni en backend ni en frontend al crear/editar grupos.)*

## 17. Grupo asignado a un salón inactivo y de menor capacidad

- **Ubicación:** `database/groups.json`, `_id` `6abf0b8bfead57fb41c12c99`
- **Qué está mal:** usa el salón `B-104` (inactivo), con `capacity: 25` en el grupo pero el salón real tiene capacidad 22.
- **Cómo reproducirlo:** ver el salón asignado y su estado/capacidad.
- **Esperado:** salón activo y con capacidad suficiente.
- **Severidad:** media
- [x] Corregido

## 18. Matrícula activa con nota final en un periodo ya cerrado, de estudiante inactivo

- **Ubicación:** `database/enrollments.json`, `_id` `6abf0b8bfead57fb41c12d25`
- **Qué está mal:** `status: "activa"` con `finalGrade: 3.38` (una matrícula activa no debería tener nota final todavía), en el periodo `2025-1` que ya está cerrado, de un estudiante marcado como inactivo.
- **Cómo reproducirlo:** ver ese documento de matrícula y cruzarlo con el estado del periodo y del estudiante.
- **Esperado:** una matrícula de un periodo cerrado debería estar finalizada, no "activa".
- **Severidad:** alta
- [x] Corregido

## 19. Matrícula con materia distinta a la de su grupo, estudiante inactivo

- **Ubicación:** `database/enrollments.json`, `_id` `6abf0b8bfead57fb41c12dfb`
- **Qué está mal:** el campo `subject` de la matrícula no coincide con la materia real del `group` al que pertenece; además el estudiante está inactivo pero la matrícula sigue "activa".
- **Cómo reproducirlo:** comparar `subject` de la matrícula contra `subject` del grupo referenciado.
- **Esperado:** consistencia entre ambos campos.
- **Severidad:** alta
- [x] Corregido

## 20. Matrícula con periodo distinto al del grupo, duplicada, y sin prerrequisito

- **Ubicación:** `database/enrollments.json`, `_id` `6abf0b8bfead57fb41c12e1a`
- **Qué está mal:** varios problemas en el mismo documento: `period` no coincide con el del `group`; está "activa" en un periodo (`2026-1`) ya cerrado; fue creada el 2026-08-02, **después** de la fecha de fin de ese periodo; el estudiante no tiene aprobado el prerrequisito `CSOC128` que la materia exige; y existe un par `(student, group)` **duplicado** (dos documentos distintos), violando el índice único `{student, group}` que define el schema.
- **Cómo reproducirlo:** buscar en `enrollments` documentos con el mismo `(student, group)` → aparecen 2.
- **Esperado:** sin duplicados, periodo consistente, fecha de creación dentro del periodo, prerrequisito validado.
- **Severidad:** alta
- [x] Corregido

## 21. Matrícula activa de un estudiante ya inactivo

- **Ubicación:** `database/enrollments.json`, `_id` `6ac057b232f78f9b9e14f3c2`
- **Qué está mal:** matrícula "activa" del mismo estudiante inactivo del hallazgo #7 (programa huérfano).
- **Cómo reproducirlo:** cruzar esta matrícula con el estado del estudiante referenciado.
- **Esperado:** un estudiante inactivo no debería tener matrículas activas.
- **Severidad:** media
- [x] Corregido

## 22. Evaluaciones de un grupo suman 110% del peso total

- **Ubicación:** `database/evaluations.json`, grupo `6abf0b8bfead57fb41c12c3a`
- **Qué está mal:** los porcentajes de las evaluaciones de ese grupo suman 110%, deberían sumar 100%. La validación `assertWeightFits` del backend impediría esto si se creara vía API, y finalizar el grupo fallaría con estos datos.
- **Cómo reproducirlo:** sumar los pesos de las evaluaciones de ese grupo.
- **Esperado:** suma de pesos = 100%.
- **Severidad:** alta
- [x] Corregido

## 23. Nota asociada a una evaluación de otro grupo

- **Ubicación:** `database/grades.json`, `_id` `6abf0b8bfead57fb41c12dfd`
- **Qué está mal:** la evaluación referenciada pertenece a un grupo distinto al de la matrícula de esta nota.
- **Cómo reproducirlo:** cruzar el `group` de la evaluación referenciada contra el `group` de la matrícula de la nota.
- **Esperado:** la evaluación debe pertenecer al mismo grupo que la matrícula.
- **Severidad:** alta
- [x] Corregido

## 24. Notas sobre matrículas activas en periodos ya cerrados

- **Ubicación:** `database/grades.json`, `_id`s `...12d26`, `...d27`, `...d28`, `...d29`, `...e1b`, `...e1c`
- **Qué está mal:** notas asociadas a matrículas "activas" cuyo periodo ya está cerrado (derivado de los hallazgos #18 y #20).
- **Cómo reproducirlo:** cruzar cada nota con el estado del periodo de su matrícula.
- **Esperado:** consistencia de estado matrícula/periodo.
- **Severidad:** media
- [x] Corregido

## 25. Notificación dirigida a un usuario con rol mal escrito

- **Ubicación:** `database/notifications.json`, `_id` `6abf0b8bfead57fb41c12ee1`
- **Qué está mal:** notificación tipo `'grupo_asignado'` dirigida al usuario del hallazgo #2 (`role: "Docente"` mal escrito).
- **Cómo reproducirlo:** consecuencia directa del hallazgo #2.
- **Esperado:** se resuelve corrigiendo el hallazgo #2.
- **Severidad:** baja
- [x] Corregido

## 26. Solo 5 de 13 colecciones tienen índices reales en la base viva

- **Ubicación:** base de datos `universidad` en ejecución (verificado con el driver de Mongo directamente, no solo leyendo el schema)
- **Qué está mal:** únicamente `periods` (code), `programs` (code), `students` (user, code, program), `subjects` (code, program) y `teachers` (user, code) y `users` (email) tienen índices creados de verdad. **No existen** los índices que los schemas definen para: `classrooms` (code único, building), `enrollments` (único student+group, student+subject+status, student+period+status, group), `evaluations` (único group+name, group), `faculties` (único code, campus), `grades` (único enrollment+evaluation, enrollment), `groups` (único subject+period+number, teacher, period), `notifications` (user+read+createdAt), y los índices de `programs.faculty`/`teachers.faculty`. Causa: `db:import` usa `insertMany` (no dispara la creación de índices de Mongoose), y el build viejo que corría nunca llegó a registrar esos modelos. Además, al arrancar el código fuente actual, el `autoIndex` fallaría al intentar crear el índice único de `enrollments` por el duplicado del hallazgo #20.
- **Cómo reproducirlo:** listar los índices reales de cada colección con el driver de Mongo y compararlos contra lo que cada schema de Mongoose declara.
- **Esperado:** todos los índices de los schemas creados realmente en la base, y sin duplicados que impidan crear los únicos.
- **Severidad:** alta (sin estos índices, varias validaciones de unicidad del negocio no se cumplen a nivel de base de datos)
- [x] Corregido

## 27. El volumen de Mongo ya no está montado — se pierden los datos al recrear el contenedor

- **Ubicación:** `docker-compose.yml`
- **Qué está mal:** se declara el volumen `mongo_data` al final del archivo, pero el servicio `mongo` ya no lo monta (`- mongo_data:/data/db` fue eliminado del servicio en el commit `edd8a7d`, aunque el volumen declarado sigue ahí sin usarse).
- **Cómo reproducirlo:** `docker compose down && docker compose up -d` → los datos importados desaparecen.
- **Esperado:** el servicio `mongo` debe montar `mongo_data:/data/db`.
- **Severidad:** alta (infraestructura)
- [x] Corregido

## 28. Puerto de Mongo inconsistente entre `.env.example` y `docker-compose.yml`

- **Ubicación:** `.env.example` (puerto 27018) vs `docker-compose.yml` (publica 27017)
- **Qué está mal:** siguiendo el `.env.example` tal cual, la app intentaría conectar al puerto 27018, pero Docker solo expone el 27017 — cualquiera que siga el setup documentado desde cero no podría conectar.
- **Cómo reproducirlo:** `cp .env.example .env` tal cual, levantar Docker, intentar conectar → falla.
- **Esperado:** mismo puerto en ambos archivos.
- **Severidad:** baja (infraestructura)
- [x] Corregido

## 29. Estudiante con 3 matrículas activas simultáneas, una de ellas en periodo cerrado

- **Ubicación:** `database/enrollments.json`, estudiante Juliana Herrera (`E20210046`, la misma cuenta con el hash de contraseña inválido del hallazgo #3)
- **Qué está mal:** aparece con una matrícula "En curso" en el periodo `2026-1` (ya cerrado) y, en total, 3 matrículas activas al mismo tiempo — confirmado visualmente en Admin → Matrículas.
- **Cómo reproducirlo:** Admin → Matrículas → filtrar por esa estudiante.
- **Esperado:** una matrícula activa en un periodo cerrado debería estar finalizada; revisar si tener 3 activas simultáneas es válido según las reglas del programa.
- **Severidad:** media
- [x] Corregido

## 30. Grupo con carga de créditos en cero para el reporte de docentes

- **Ubicación:** grupo a cargo del docente `DOC-015` (42 inscritos reales por capacidad, ver hallazgo #13 de DB)
- **Qué está mal:** el reporte `teacher-load` muestra `credits: 0` para ese grupo, cuando la materia asociada sí tiene créditos definidos.
- **Cómo reproducirlo:** Admin → Reportes → Carga docente → revisar la fila de `DOC-015`.
- **Esperado:** el cálculo de créditos del reporte debería reflejar los créditos reales de la materia del grupo.
- **Severidad:** baja
- [x] Corregido
