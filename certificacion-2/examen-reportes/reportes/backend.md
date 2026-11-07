# Bugs de Backend

Formato de cada entrada:

```markdown
## N. <título corto del bug>

- **Ubicación:** archivo:línea, o método + endpoint
- **Qué está mal:** descripción concreta del defecto
- **Cómo reproducirlo:** pasos o request exactos
- **Esperado:** qué debería pasar en su lugar
- **Severidad:** alta / media / baja
- [ ] Corregido
```

---

## 1. `ReportsService` comentado impide que la app arranque

- **Ubicación:** `src/reports/reports.module.ts` (import y `providers`, línea ~14 y ~32)
- **Qué está mal:** `ReportsService` está comentado tanto en el import como en `providers` del módulo, pero `ReportsController` lo sigue inyectando — Nest no puede resolver la dependencia y la aplicación no arranca.
- **Cómo reproducirlo:** `npm run build && npm run start` con el código fuente actual.
- **Esperado:** `ReportsService` debe estar importado y registrado en `providers`.
- **Severidad:** alta (bloquea el arranque completo de la app)
- [x] Corregido

## 2. Prefijo global y puerto incorrectos en `main.ts`

- **Ubicación:** `src/main.ts`
- **Qué está mal:** el prefijo global de la API es `'api/v1'` en vez de `'api'` (rompe todas las URLs que documentan los README y que usa el frontend). Además el puerto se lee de `APP_PORT` con default `3001`, en vez de `PORT` (la variable real definida en `.env`, valor `3000`) — `3001` además ya lo ocupa el frontend.
- **Cómo reproducirlo:** levantar el backend con el código actual y pegarle a `/api/...` → 404 (porque en realidad escucha en `/api/v1/...` y en el puerto 3001 si `APP_PORT` no está seteado).
- **Esperado:** prefijo `'api'`, puerto desde `PORT`.
- **Severidad:** alta (rompe la integración completa con el frontend)
- [x] Corregido

## 3. `GET /users/me` nunca se alcanza por orden de rutas

- **Ubicación:** `src/users/users.controller.ts` — `@Get(':id')` (línea 42) está definido antes que `@Get('me')` (línea 50)
- **Qué está mal:** Nest/Express evalúa las rutas en orden de declaración; `:id` captura literalmente la palabra "me" como si fuera un id, así que `GET /users/me` nunca llega al handler de "me" y falla con "ID invalido".
- **Cómo reproducirlo:** `GET /api/users/me` con un token válido → 400 "ID invalido" en vez de los datos del usuario autenticado.
- **Esperado:** declarar `@Get('me')` antes que `@Get(':id')`.
- **Severidad:** alta
- [x] Corregido (localmente, para habilitar pruebas de Playwright — pendiente de aplicar también en la rama `develop` si no coincide con la corrección del compañero)

## 4. `GET /groups/mine` nunca se alcanza por el mismo problema de orden

- **Ubicación:** `src/groups/groups.controller.ts` — `@Get(':id')` (línea 33) antes de `@Get('mine')` (línea 40)
- **Qué está mal:** mismo patrón que el bug #3: `:id` captura "mine" antes de llegar a la ruta correcta.
- **Cómo reproducirlo:** `GET /api/groups/mine` con token de docente/estudiante → error de id inválido en vez de la lista de grupos propios.
- **Esperado:** declarar `@Get('mine')` antes que `@Get(':id')`.
- **Severidad:** alta
- [x] Corregido (localmente, para habilitar pruebas de Playwright — pendiente de aplicar también en la rama `develop` si no coincide con la corrección del compañero)

## 5. `GET /enrollments/mine` restringido al rol equivocado

- **Ubicación:** `src/enrollments/enrollments.controller.ts`
- **Qué está mal:** el endpoint `mine` (matrículas propias) tiene `@Roles(Docente)` en vez de `@Roles(Estudiante)` — los docentes no tienen matrículas propias, los estudiantes sí, pero son justamente a quienes el guard les bloquea el acceso.
- **Cómo reproducirlo:** `GET /api/enrollments/mine` con token de estudiante → 403 Forbidden.
- **Esperado:** `@Roles(Estudiante)` en ese endpoint.
- **Severidad:** alta
- [x] Corregido

## 6. Ruta de `evaluations` con nombre inválido

- **Ubicación:** `src/evaluations/evaluations.controller.ts`
- **Qué está mal:** `@Controller('evaluationslalala')` — typo evidente; el endpoint real nunca es `/api/evaluations`, sino `/api/evaluationslalala`.
- **Cómo reproducirlo:** `GET /api/evaluations` (la ruta "correcta" esperada) → 404.
- **Esperado:** `@Controller('evaluations')`.
- **Severidad:** alta (el módulo completo de evaluaciones es inalcanzable desde la ruta esperada)
- [x] Corregido

## 7. `RolesGuard` nunca se registra — todos los permisos por rol se ignoran

- **Ubicación:** `src/auth/auth.module.ts:33`
- **Qué está mal:** solo `JwtAuthGuard` está registrado como `APP_GUARD`; `RolesGuard` (`src/auth/guards/roles.guard.ts`) no se usa en ningún lado (0 referencias). Todos los decoradores `@Roles(...)` del proyecto quedan sin efecto.
- **Cómo reproducirlo:** con token de estudiante: `POST /programs`, `GET /users`, `DELETE /users/:id`, `GET /reports/*` → responden 200 en vez de 403.
- **Esperado:** `RolesGuard` registrado como `APP_GUARD` junto a `JwtAuthGuard`.
- **Severidad:** alta (crítico — rompe toda la autorización por rol del sistema)
- [x] Corregido

## 8. El token JWT expira en segundos, no en una hora

- **Ubicación:** `src/auth/auth.module.ts:22`
- **Qué está mal:** `expiresIn: String(JWT_EXPIRES_IN_SECONDS)` pasa `"3600"` como string; la librería `jsonwebtoken` interpreta un string puramente numérico como **milisegundos**, no segundos. Verificado: el token expira a los 3 segundos de emitido.
- **Cómo reproducirlo:** hacer login y volver a usar el token 4 segundos después → 401.
- **Esperado:** pasar el número `3600` (sin convertir a string) o `"3600s"`, para que expire en 1 hora real.
- **Severidad:** alta
- [x] Corregido

## 9. Login exige contraseña de 12 caracteres mínimo

- **Ubicación:** `src/auth/dto/login.dto.ts:12`
- **Qué está mal:** `@MinLength(12)` en el DTO de login. Las contraseñas de prueba (`Secret123!`, 10 caracteres) y la política real de creación de usuarios (mínimo 8) no llegan a 12.
- **Cómo reproducirlo:** `POST /auth/login` con `Secret123!` → 400 por validación, antes de siquiera intentar autenticar.
- **Esperado:** el login no debería imponer un mínimo de longitud distinto al de creación de cuentas (o ninguno — el login solo valida credenciales, no política de contraseña).
- **Severidad:** alta (bloqueaba el login de prácticamente todos los usuarios de prueba)
- [x] Corregido

## 10. Freno de 5 segundos en todo intento de login, exitoso o no

- **Ubicación:** `src/auth/auth.service.ts:36-38` (usado en línea 18)
- **Qué está mal:** `slowDownAttempts` aplica una espera fija de 5 segundos en **todo** login, incluyendo el correcto — debería aplicarse solo como freno tras intentos fallidos repetidos.
- **Cómo reproducirlo:** medir el tiempo de respuesta de cualquier login, correcto o no.
- **Esperado:** el retraso solo debería aparecer como rate-limit tras fallos, no siempre.
- **Severidad:** media
- [x] Corregido

## 11. Swagger publicado en una ruta distinta a la documentada

- **Ubicación:** `src/main.ts:26`
- **Qué está mal:** Swagger se sirve en `'api/doc'`; el resto del proyecto (y lo que normalmente se documenta) espera `'api/docs'`.
- **Cómo reproducirlo:** entrar a `/api/docs` → 404; sí funciona en `/api/doc`.
- **Esperado:** unificar en `'api/docs'`.
- **Severidad:** baja
- [x] Corregido

## 12. Crear usuario responde 400 aunque el usuario se crea

- **Ubicación:** `src/users/users.controller.ts:28`
- **Qué está mal:** `@HttpCode(400)` en `POST /users` — el usuario se crea correctamente en la base, pero la respuesta HTTP es 400 Bad Request.
- **Cómo reproducirlo:** `POST /api/users` con datos válidos → se crea el documento, pero la respuesta es 400 (cualquier cliente lo interpretaría como fallo).
- **Esperado:** `201 Created`.
- **Severidad:** alta
- [x] Corregido

## 13. No se puede renombrar un usuario por un typo en el DTO

- **Ubicación:** `src/users/dto/user.dto.ts:14`
- **Qué está mal:** el campo se llama `namesssss` en vez de `name`. Como el `ValidationPipe` global usa `forbidNonWhitelisted`, enviar `{"name": "X"}` en un `PATCH /users/:id` es rechazado con 400 por campo no permitido.
- **Cómo reproducirlo:** `PATCH /api/users/:id` con `{"name":"Nuevo Nombre"}` → 400.
- **Esperado:** el campo debe llamarse `name`.
- **Severidad:** alta
- [x] Corregido

## 14. Búsqueda de usuarios sensible a mayúsculas/minúsculas

- **Ubicación:** `src/users/users.service.ts:55`
- **Qué está mal:** `new RegExp(escapeRegex(q.trim()))` se construye sin la flag `'i'`; `GET /users?q=ana` no encuentra a "Ana". Otros lugares del mismo servicio (`findIdsByText`, `textPattern`) sí son insensibles a mayúsculas.
- **Cómo reproducirlo:** `GET /api/users?q=ana` con un usuario llamado "Ana García" → no aparece en los resultados.
- **Esperado:** búsqueda insensible a mayúsculas, consistente con el resto del servicio.
- **Severidad:** media
- [x] Corregido

## 15. Cambiar contraseña no persiste el cambio

- **Ubicación:** `src/users/users.service.ts:123-136` (`changePassword`)
- **Qué está mal:** la función actualiza `passwordHash` y `passwordChangedAt` en memoria pero nunca llama `user.save()` (compárese con `setPassword`, que sí lo hace en las líneas 145-148). `PATCH /auth/change-password` devuelve un token nuevo, pero la contraseña real en la base no cambia — la vieja sigue funcionando.
- **Cómo reproducirlo:** cambiar la contraseña vía la API, cerrar sesión, volver a entrar con la contraseña **anterior** → funciona (no debería).
- **Esperado:** persistir el cambio con `.save()`.
- **Severidad:** alta (seguridad: el cambio de contraseña no tiene efecto real)
- [x] Corregido

## 16. Un docente puede gestionar los grupos de cualquier otro docente

- **Ubicación:** `src/groups/groups.service.ts:98` (`assertCanManage`)
- **Qué está mal:** la condición compara `user.role === Role.Estudiante` para decidir si se puede gestionar el grupo; debería comparar contra `Role.Docente` y además verificar que sea el docente **dueño** del grupo. Tal como está, la regla "el grupo está a tu cargo" nunca se aplica entre docentes.
- **Cómo reproducirlo:** como docente `gomez@`, hacer `PUT /grades` o `POST /groups/:id/finalize` sobre un grupo a cargo de **otro** docente → 200 en vez de 403.
- **Esperado:** 403 si el docente no es el dueño del grupo.
- **Severidad:** alta (crítico — permite modificar notas/evaluaciones de grupos ajenos)
- [x] Corregido
- *(confirmado en vivo: docente creó evaluación en grupo ajeno sin 403, y pudo ver roster/planilla de grupo ajeno. Efecto lateral: un token de estudiante en estas mismas rutas recibe 404 "no tiene perfil de docente" en vez de 403, porque el chequeo busca el perfil del rol equivocado.)*

## 17. Toda matrícula exitosa responde error 400

- **Ubicación:** `src/enrollments/enrollments.service.ts:79-81`
- **Qué está mal:** condición invertida: `if (created.status === EnrollmentStatus.Active) throw BadRequestException('No se pudo confirmar la matricula')`. O sea, cuando la matrícula se confirma correctamente (queda "activa"), el código lanza el error que debería reservarse para cuando **falla**. Esto ocurre después de ya haber guardado la matrícula, descontado el cupo y enviado la notificación.
- **Cómo reproducirlo:** `POST /enrollments {groupId}` como estudiante → la matrícula se crea en la base, pero la respuesta es 400 "No se pudo confirmar la matricula".
- **Esperado:** la condición debe ser al revés — lanzar el error cuando el status NO sea activo.
- **Severidad:** alta (crítico — toda matrícula válida parece haber fallado desde la API)
- [x] Corregido
- *(confirmado en vivo: `group.enrolled` sí sube, la notificación sí se envía, y la respuesta igual es 400. Un reintento del cliente da 409 "ya matriculado" — el cliente nunca se entera de que la primera matrícula funcionó.)*

## 18. Cancelar una matrícula no libera el cupo del grupo

- **Ubicación:** `src/enrollments/enrollments.service.ts:95-103` (`cancel`)
- **Qué está mal:** solo cambia el `status` a "cancelada"; nunca decrementa `group.enrolled`, a pesar de que el endpoint documenta que "libera el cupo".
- **Cómo reproducirlo:** matricular, cancelar, revisar `group.enrolled` → no baja. Con el tiempo el grupo acumula cupos "fantasma" ocupados.
- **Esperado:** decrementar `group.enrolled` al cancelar.
- **Severidad:** alta
- [x] Corregido

## 19. Docentes no pueden ver matrículas de sus propios grupos

- **Ubicación:** `src/enrollments/enrollments.controller.ts:41`
- **Qué está mal:** `GET /enrollments/:id` solo permite rol Admin y Estudiante; el docente dueño del grupo no tiene forma de consultar esa matrícula.
- **Cómo reproducirlo:** como docente, `GET /api/enrollments/:id` de una matrícula de su propio grupo → 403.
- **Esperado:** permitir también al docente del grupo correspondiente.
- **Severidad:** baja
- [x] Corregido

## 20. Crear evaluación responde 400 aunque se crea correctamente

- **Ubicación:** `src/evaluations/evaluations.controller.ts:21`
- **Qué está mal:** `@HttpCode(HttpStatus.BAD_REQUEST)` en `POST /evaluations` — igual que el bug #12 con usuarios, el recurso se crea pero la respuesta es 400.
- **Cómo reproducirlo:** `POST /api/evaluationslalala` (ver bug #6) con datos válidos → se crea, responde 400.
- **Esperado:** `201 Created`.
- **Severidad:** alta
- [x] Corregido

## 21. Se puede editar el plan de evaluaciones de un periodo ya cerrado

- **Ubicación:** `src/evaluations/evaluations.service.ts:47-59` (`update`)
- **Qué está mal:** a diferencia de `create` (líneas 24-27, que sí valida), `update` no verifica si el periodo del grupo está cerrado.
- **Cómo reproducirlo:** editar una evaluación de un grupo cuyo periodo ya está cerrado → se permite.
- **Esperado:** bloquear edición si el periodo está cerrado, igual que en creación.
- **Severidad:** media
- [x] Corregido

## 22. Límite de nota inconsistente con la escala real (0-5)

- **Ubicación:** `src/grades/dto/grade.dto.ts:18`
- **Qué está mal:** `@Max(4.5)` en el DTO, pero la escala real del sistema es 0-5 (el schema, el `ApiProperty` y los datos de seed usan máximo 5).
- **Cómo reproducirlo:** `PUT /grades` con `value: 4.8` (válido en la escala real) → 400 por el DTO.
- **Esperado:** `@Max(5)`.
- **Severidad:** alta
- [x] Corregido

## 23. Nota mínima de aprobación (3.0) queda marcada como reprobada

- **Ubicación:** `src/grades/grades.service.ts:132`
- **Qué está mal:** la comparación usa `finalGrade > PASSING_GRADE` en vez de `>=`. La nota mínima de aprobación documentada es 3.0 (líneas 16-17 del mismo archivo, y `scripts/db-seed.js:252` usa `>=` correctamente). Con una nota final exactamente 3.0, el sistema la marca "reprobada".
- **Cómo reproducirlo:** una matrícula con nota final exacta 3.0 → queda en estado reprobada.
- **Esperado:** `>=`.
- **Severidad:** alta
- [x] Corregido

## 24. Marcar una notificación como leída no la marca como leída

- **Ubicación:** `src/notifications/notifications.service.ts:69-72` (`markRead`)
- **Qué está mal:** asigna `readAt` pero nunca pone `notification.read = true`. `PATCH /notifications/:id/read` no tiene efecto visible: el contador de no leídas no baja.
- **Cómo reproducirlo:** marcar una notificación como leída y revisar el contador de no leídas → sigue igual.
- **Esperado:** también asignar `read = true`.
- **Severidad:** alta
- [x] Corregido

## 25. Tag de Swagger con texto basura

- **Ubicación:** `src/deletions/deletions.controller.ts:10`
- **Qué está mal:** `@ApiTags('deletions21312')` — tag con sufijo numérico sin sentido en la documentación de Swagger.
- **Cómo reproducirlo:** ver la sección de Swagger correspondiente a "deletions21312".
- **Esperado:** `@ApiTags('deletions')`.
- **Severidad:** baja
- [x] Corregido

## 26. Un periodo puede volver de "abierto" a "planificado"

- **Ubicación:** `src/periods/periods.service.ts:62-69`
- **Qué está mal:** el ciclo de vida declarado es planificado → abierto → cerrado, pero el código permite retroceder de "abierto" a "planificado".
- **Cómo reproducirlo:** cambiar el estado de un periodo abierto de vuelta a planificado vía la API → se permite.
- **Esperado:** bloquear transiciones hacia atrás en el ciclo de vida.
- **Severidad:** baja
- [x] Corregido

## 27. Campos booleanos mal validados aceptan valores inválidos como `false`

- **Ubicación:** `src/users/dto/user.dto.ts:56` y `src/notifications/dto/notification.dto.ts:27`
- **Qué está mal:** el `Transform` propio hace `value === 'true' || value === true`; cualquier otro valor (ej. `active=abc`) se convierte silenciosamente en `false` en vez de fallar la validación. El resto de DTOs del proyecto usa un `toBoolean` compartido que si rechaza valores inválidos.
- **Cómo reproducirlo:** enviar `active=abc` en un query/body → se interpreta como `false` sin error.
- **Esperado:** usar el mismo `toBoolean` que el resto del proyecto, que debería rechazar valores no booleanos.
- **Severidad:** baja
- [x] Corregido

## 28. `assertDean` no valida que el docente pertenezca a la facultad

- **Ubicación:** `src/faculties/faculties.service.ts:49-52`
- **Qué está mal:** la función no verifica que el docente asignado como decano realmente pertenezca a esa facultad (el seed sí lo garantiza, pero el código no lo exige).
- **Cómo reproducirlo:** asignar como decano a un docente de otra facultad vía la API → se permite.
- **Esperado:** validar pertenencia a la facultad.
- **Severidad:** baja (regla de negocio)
- [x] Corregido

## 29. Actualizar un grupo no valida periodo cerrado ni matrículas activas

- **Ubicación:** `src/groups/groups.service.ts:112-142` (`update`)
- **Qué está mal:** no valida si el periodo del grupo está cerrado, ni impide desactivar un grupo que todavía tiene matrículas activas.
- **Cómo reproducirlo:** desactivar un grupo con estudiantes matriculados actualmente → se permite sin aviso.
- **Esperado:** bloquear o advertir en ambos casos.
- **Severidad:** baja (regla de negocio)
- [x] Corregido

## 30. El dashboard de reportes cuenta facultades inactivas

- **Ubicación:** `src/reports/reports.service.ts:44`
- **Qué está mal:** el conteo de facultades no filtra por `active`, mientras que los demás conteos del mismo dashboard sí lo hacen — inconsistencia en las cifras mostradas.
- **Cómo reproducirlo:** comparar el total de facultades del dashboard contra la cantidad de facultades activas reales.
- **Esperado:** filtrar por `active` igual que el resto de los conteos.
- **Severidad:** baja
- [x] Corregido

## 31. Un dato inválido deja el documento completo inmodificable

- **Ubicación:** grupo `6abf0b8bfead57fb41c12c3a` (ver hallazgo #14 de DB: día `"Miércoles"` inválido en el schema)
- **Qué está mal:** al hacer `PATCH` sobre ese grupo con cualquier cambio (incluso uno sin relación, como solo la capacidad), Mongoose revalida **todo el documento** al guardar, incluyendo el campo `day` ya corrupto — y falla con `"Miércoles" is not a valid enum value for path "day"`. El grupo queda completamente inmodificable hasta que alguien corrija el dato a mano directo en la base.
- **Cómo reproducirlo:** `PATCH /groups/6abf0b8bfead57fb41c12c3a` con `{"capacity": 40}` → 400 por el campo `day`, no por `capacity`.
- **Esperado:** o sanear el dato corrupto, o que la validación de `update` solo revalide los campos que realmente cambian.
- **Severidad:** media
- [x] Corregido

## 32. Nota corrupta se convierte silenciosamente en `null` al leerla

- **Ubicación:** `src/grades/*` — afecta al documento de `grades` con `value: "4,2"` (ver hallazgo #11 de DB)
- **Qué está mal:** `GET /grades?enrollment=...` responde 200 con esa nota convertida silenciosamente a `null` en el JSON de salida, sin ningún error ni aviso de que el dato original era inválido.
- **Cómo reproducirlo:** `GET /api/grades?enrollment=6abf0b8bfead57fb41c12e1a` → la nota corrupta aparece como `null` entre las demás notas numéricas.
- **Esperado:** si el dato no se puede representar como número, debería marcarse explícitamente como inválido, no desaparecer silenciosamente como `null` (indistinguible de "sin nota todavía").
- **Severidad:** media
- [x] Corregido

## 33. Los reportes agregados descartan silenciosamente registros con referencias huérfanas

- **Ubicación:** `src/reports/reports.service.ts:89-94` (enrollments-by-program) y `:212-215` (faculty-summary)
- **Qué está mal:** ambos usan `$lookup` + `$unwind` sin `preserveNullAndEmptyArrays`; cualquier documento cuya referencia no resuelva (ej. el estudiante con programa huérfano del hallazgo #7 de DB) se descarta silenciosamente del conteo en vez de reportarse como inconsistencia.
- **Cómo reproducirlo:** `enrollments-by-program` del periodo 2026-1 suma 14 en vez de las 15 matrículas reales; `faculty-summary` cuenta 99 de 100 estudiantes.
- **Esperado:** usar `preserveNullAndEmptyArrays: true` y, si corresponde, reportar los registros huérfanos en vez de omitirlos sin aviso.
- **Severidad:** media
- [x] Corregido

## 34. Varias reglas de negocio de integridad no están validadas por la API

- **Ubicación:** `src/students/students.service.ts`, `src/subjects/subjects.service.ts`, `src/classrooms/classrooms.service.ts`, `src/teachers/teachers.service.ts`, `src/programs/programs.service.ts`
- **Qué está mal:** varias operaciones que deberían bloquearse por reglas de negocio se aceptan sin validar (confirmado con requests reales, todas responden 200/201): asignar un estudiante a un programa inactivo; crear una materia en un programa inactivo; desactivar un salón que todavía tiene grupos activos asignados; bajar la capacidad de un salón por debajo de la de un grupo que ya lo usa; crear un grupo con cupo mayor a la capacidad del salón; desactivar un docente con grupos activos a cargo; bajar los créditos totales de un programa por debajo de lo que ya cursan estudiantes activos.
- **Cómo reproducirlo:** cualquiera de las acciones de arriba vía la API correspondiente.
- **Esperado:** cada una debería rechazarse (400/409) mientras exista la dependencia activa que la vuelve inconsistente.
- **Severidad:** baja (son reglas de negocio no impuestas, no rompen nada hoy porque el seed las cumple)
- [ ] Corregido
