# Bugs de Frontend

Formato de cada entrada:

```markdown
## N. <título corto del bug>

- **Ubicación:** archivo:línea, o pantalla/componente
- **Qué está mal:** descripción concreta del defecto
- **Cómo reproducirlo:** pasos exactos (rol de usuario, clicks, inputs)
- **Esperado:** qué debería pasar en su lugar
- **Severidad:** alta / media / baja
- [x] Corregido
```

---

## 1. El proxy de sesión no protege subrutas por rol

- **Ubicación:** `src/proxy.ts:20`
- **Qué está mal:** la comparación `pathname === p` es igualdad exacta; solo protege `/admin` exacto, no `/admin/usuarios`, `/docente/grupos`, etc.
- **Cómo reproducirlo:** login como `ana@universidad.edu` (estudiante) → `GET /admin/usuarios` → responde 500 (renderiza la página de admin con rol estudiante) en vez de redirigir a `/estudiante`.
- **Esperado:** usar `pathname.startsWith(p + "/")` además de la igualdad exacta.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo: `/admin/usuarios`, `/admin/grupos`, `/docente/grupos` NO redirigen con un estudiante logueado; solo `/admin`/`/docente` exactos sí. Sin cookie, el redirect a `/login` sí funciona. Reconfirmado como admin en `/docente/grupos`: no redirige y la página SSR revienta con un 500 "El usuario no tiene perfil de docente" en vez de bloquear antes de renderizar.)*

## 2. El proxy de API puede crashear en respuestas 204

- **Ubicación:** `src/app/api/[...path]/route.ts:48`
- **Qué está mal:** construye `new NextResponse(text, { status })` con `text=""` aun cuando el backend devuelve 204/304 — el constructor de `NextResponse` lanza `TypeError` si el status es 204/205/304 y el body no es `null`.
- **Cómo reproducirlo:** cualquier request que el backend responda con 204 (ej. `DELETE /evaluations/:id` si el backend lo implementa así).
- **Esperado:** pasar `body: null` cuando `status` sea 204/205/304.
- **Severidad:** baja
- [x] Corregido

## 3. `change-password` no maneja respuesta no-JSON

- **Ubicación:** `src/app/api/[...path]/route.ts:32-34`
- **Qué está mal:** `JSON.parse(text)` sin try/catch; si el backend responde algo no-JSON, la ruta cae en 500.
- **Cómo reproducirlo:** forzar que el backend responda texto plano/HTML en el endpoint de cambio de contraseña.
- **Esperado:** manejar el error de parseo sin romper la respuesta.
- **Severidad:** baja
- [x] Corregido

## 4. Menú lateral ilegible (texto blanco sobre fondo blanco)

- **Ubicación:** `src/components/app-shell.tsx:83,106,112`
- **Qué está mal:** enlaces del menú y títulos de sección usan `text-white` sobre `bg-surface` (blanco, definido en la línea 131 del aside) — contraste 1:1. Solo el ítem activo (`bg-primary-600`) se ve.
- **Cómo reproducirlo:** entrar con cualquier rol y mirar el menú lateral.
- **Esperado:** usar `text-ink`/`text-muted` en vez de `text-white`.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo con Playwright: computed style de los 9 links del menú = `rgb(255,255,255)` sobre `aside` `rgb(255,255,255)`. Captura: `.playwright-mcp/st-home.png`.)*

## 5. El horario del sábado se dibuja en la columna del viernes

- **Ubicación:** `src/components/week-schedule.tsx:15`
- **Qué está mal:** `Math.min(DAYS.indexOf(d), 4) === col` mete las clases del sábado en la tarjeta de viernes; la tarjeta "Sábado" siempre dice "Sin clases". El comentario ("semana hasta el viernes") contradice que `DAYS` tiene 6 días.
- **Cómo reproducirlo:** cualquier horario (estudiante o docente) con clases un sábado.
- **Esperado:** cada día debe mapear a su propia columna.
- **Severidad:** alta
- [x] Corregido

## 6. Typo visible: "Lrrrrunes"

- **Ubicación:** `src/lib/format.ts:6`
- **Qué está mal:** `DAY_LABEL.lunes = "Lrrrrunes"`, se ve en el título de la tarjeta de horario de los lunes.
- **Cómo reproducirlo:** ver cualquier horario con clases un lunes.
- **Esperado:** `"Lunes"`.
- **Severidad:** media
- [x] Corregido

## 7. Badge de nota "reprobada" dice "Aprobada"

- **Ubicación:** `src/lib/format.ts:26`
- **Qué está mal:** `STATUS_LABEL.reprobada = "Aprobada"` — el badge rojo de una materia reprobada muestra el texto "Aprobada". Visible en historial, mis materias, notas, planilla docente y matrículas de admin.
- **Cómo reproducirlo:** ver cualquier matrícula/nota con estado `reprobada`.
- **Esperado:** `"Reprobada"`.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo: grupo PSIC174 G1 (2025-1, docente gomez@), estudiante Iván Londoño con `finalGrade: 2.88` y `status: "reprobada"` en la API, aparece con badge "Aprobada" en las pestañas Estudiantes y Notas.)*

## 8. Las notas se truncan en vez de redondearse

- **Ubicación:** `src/lib/format.ts:17`
- **Qué está mal:** `grade()` usa `Math.floor(value*10)/10`: 4.56 → "4.5", 2.99 → "2.9" (nunca redondea a 3.0). Además es inconsistente con `operations.tsx:328` y el acumulado (`toFixed(2)`).
- **Cómo reproducirlo:** cualquier nota con decimales que debería redondear hacia arriba.
- **Esperado:** usar `toFixed(1)` (redondeo real), consistente en todo el proyecto.
- **Severidad:** media
- [x] Corregido
- *(confirmado en vivo, mismo grupo PSIC174 G1: la API da 4.07/4.06/3.79/2.88/3.15/3.12 y la UI (roster y planilla) muestra 4.0/4.0/3.7/2.8/3.1/3.1 — redondeando bien deberían ser 4.1/4.1/3.8/2.9/3.2/3.1.)*

## 9. Fechas de periodos se muestran un día antes

- **Ubicación:** `src/lib/format.ts:19-20`
- **Qué está mal:** `date()` no pasa `timeZone: "UTC"`; fechas como `2027-02-02T00:00:00Z` se muestran como 1 de febrero en zonas horarias negativas (ej. Colombia UTC-5). Visible en Admin → Periodos (Inicio/Fin). `estudiante/page.tsx:10` sí usa `timeZone: "UTC"` — inconsistencia dentro del mismo proyecto.
- **Cómo reproducirlo:** ver fecha de inicio/fin de cualquier periodo en Admin.
- **Esperado:** formatear siempre con `timeZone: "UTC"`.
- **Severidad:** media
- [x] Corregido
- *(confirmado en vivo, zona America/La_Paz: API `2027-08-03` → UI "2 de ago de 2027"; API `2027-02-02` → UI "1 de feb de 2027". Un día menos en todos los periodos.)*

## 10. Esc no cierra ningún modal

- **Ubicación:** `src/components/ui/modal.tsx:21`
- **Qué está mal:** `onCancel` hace `preventDefault`, bloqueando que Esc cierre el modal (problema de accesibilidad/teclado).
- **Cómo reproducirlo:** abrir cualquier modal y presionar Esc.
- **Esperado:** Esc debería cerrar el modal.
- **Severidad:** media
- [x] Corregido
- *(confirmado en vivo, visible al probar el bug #26: Esc no cierra el modal de edición de usuario.)*

## 11. Contraste insuficiente en badges/avatares

- **Ubicación:** `src/app/globals.css:20-26`, `src/components/ui/badge.tsx:10`, `avatar.tsx`, `src/lib/format.ts:39-41`
- **Qué está mal:** `text-accent-600` (#d98a00) sobre `accent-100` (#fff1d6) ≈2.7:1, y `text-warning-600` (#b97a00) sobre `warning-100` ≈3.4:1 — ambos por debajo del mínimo 4.5:1. También el placeholder `text-muted/70` tiene contraste bajo.
- **Cómo reproducirlo:** ver cualquier badge/avatar con esos tonos (`subjectTone`).
- **Esperado:** ratio de contraste ≥4.5:1 para texto normal.
- **Severidad:** baja
- [x] Corregido

## 12. Periodo "planificado" se muestra como "Cerrado"

- **Ubicación:** `src/app/(app)/estudiante/historial/page.tsx:49` y `materias/page.tsx:38`
- **Qué está mal:** cualquier periodo que no esté "abierto" se rotula "Cerrado", incluyendo uno en estado "planificado" (que aún no empezó).
- **Cómo reproducirlo:** ver un periodo futuro/planificado en historial o materias del estudiante.
- **Esperado:** distinguir "planificado" de "cerrado".
- **Severidad:** baja
- [x] Corregido

## 13. Saludo con nombre incorrecto o "undefined"

- **Ubicación:** `src/app/(app)/estudiante/page.tsx:22`
- **Qué está mal:** usa `me.name.split(" ")[1]` (segunda palabra del nombre completo) → "Hola, Pérez" en vez del nombre de pila, o "Hola, undefined" si el nombre es de una sola palabra. `docente/page.tsx:20` usa `[0]` correctamente.
- **Cómo reproducirlo:** entrar como estudiante y ver el saludo del dashboard.
- **Esperado:** usar `[0]` (primera palabra), igual que en la vista de docente.
- **Severidad:** media
- [x] Corregido
- *(confirmado en vivo: `ana@universidad.edu` → "Hola, Perez" en el dashboard.)*

## 14. Conteo de matrículas activas incluye canceladas/históricas

- **Ubicación:** `src/app/(app)/estudiante/page.tsx:16,31`
- **Qué está mal:** "Materias matriculadas / Matrículas activas este periodo" usa `meta.total` de `/enrollments/mine?limit=1` sin filtrar por `status=activa` ni por `period`.
- **Cómo reproducirlo:** un estudiante con matrículas canceladas o de periodos anteriores verá un conteo inflado.
- **Esperado:** filtrar por estado activo y periodo actual.
- **Severidad:** media
- [x] Corregido

## 15. Orden de materias contradice el comentario del código

- **Ubicación:** `src/app/(app)/estudiante/materias/page.tsx:22`
- **Qué está mal:** ordena con `a.localeCompare(b)` (ascendente) pero el comentario dice "el más reciente primero". `notas/page.tsx:21` sí ordena descendente — inconsistencia entre pantallas.
- **Cómo reproducirlo:** comparar el orden de materias vs. notas del mismo estudiante.
- **Esperado:** orden consistente con lo que el comentario/UX pretende.
- **Severidad:** media
- [x] Corregido

## 16. Cancelar matrícula no refresca la vista

- **Ubicación:** `src/app/(app)/estudiante/materias/cancel-button.tsx:17-19`
- **Qué está mal:** tras cancelar una matrícula no llama `router.refresh()`; la materia sigue apareciendo como "En curso" con el botón Cancelar hasta recargar manualmente.
- **Cómo reproducirlo:** estudiante → Materias → Cancelar una matrícula.
- **Esperado:** refrescar la vista tras la acción.
- **Severidad:** media
- [x] Corregido

## 17. Promedio acumulado ignora el peso de las evaluaciones

- **Ubicación:** `src/app/(app)/estudiante/notas/page.tsx:40`
- **Qué está mal:** "Acumulado" se calcula como promedio simple (suma/cantidad) de las notas, ignorando el peso (%) de cada evaluación. Debería ser `Σ(nota·peso)/100` (o `/evaluado`).
- **Cómo reproducirlo:** un estudiante con evaluaciones de distinto peso verá un acumulado incorrecto.
- **Esperado:** promedio ponderado por peso.
- **Severidad:** alta
- [x] Corregido

## 18. Nota de aprobación exacta (3.0) se pinta en rojo

- **Ubicación:** `src/app/(app)/estudiante/notas/page.tsx:73`
- **Qué está mal:** usa `value <= PASSING` para decidir el color, pintando 3.0 (nota mínima de aprobación) en rojo, como si fuera reprobatoria. La línea 86 sí usa `<` correctamente para la lógica de aprobado/reprobado.
- **Cómo reproducirlo:** una nota exactamente igual a la nota mínima de aprobación.
- **Esperado:** usar `<` también para el color, consistente con la lógica real.
- **Severidad:** media
- [x] Corregido

## 19. Límite de créditos hardcodeado en el frontend

- **Ubicación:** `src/app/(app)/estudiante/matricula/enroll-view.tsx:16`
- **Qué está mal:** `MAX_CREDITS=20` hardcodeado; puede no coincidir con la regla real validada en el backend.
- **Cómo reproducirlo:** comparar el límite mostrado en la barra/etiqueta contra el límite real que aplica el backend al matricular.
- **Esperado:** el límite debería venir del backend o mantenerse sincronizado con él.
- **Severidad:** baja
- [x] Corregido

## 20. Filtro de periodo en grupos del docente no se aplica por defecto

- **Ubicación:** `src/app/(app)/docente/grupos/page.tsx:52`
- **Qué está mal:** el parámetro `&period=` solo se envía si existe `?period` en la URL. El selector muestra el periodo abierto por defecto, pero la lista trae TODOS los periodos igual.
- **Cómo reproducirlo:** entrar a Grupos como docente sin tocar el selector de periodo.
- **Esperado:** filtrar por el periodo seleccionado (`selected`) cuando no sea "todos", incluso sin parámetro explícito en la URL.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo: sin periodo abierto (bug D4), el selector queda en "Todos los periodos" y la lista mezcla grupos de 2027-1 y 2025-1 en la misma pantalla.)*

## 21. Capacidad/inscritos invertidos en la tarjeta de grupo

- **Ubicación:** `src/app/(app)/docente/grupos/page.tsx:52` (badge)
- **Qué está mal:** muestra `{g.capacity} / {g.enrolled} estudiantes`, invertido (debería ser inscritos/capacidad). El detalle del grupo sí lo muestra bien.
- **Cómo reproducirlo:** ver la tarjeta de cualquier grupo en la lista.
- **Esperado:** `{g.enrolled} / {g.capacity} estudiantes`.
- **Severidad:** media
- [x] Corregido
- *(confirmado en vivo: tarjeta muestra "32 / 0 estudiantes" para un grupo con 0 de 32 matriculados; el detalle del mismo grupo sí muestra bien "9 / 36" en otro caso.)*

## 22. Porcentaje restante de evaluaciones invertido

- **Ubicación:** `src/app/(app)/docente/grupos/[id]/evaluations-panel.tsx:44,177`
- **Qué está mal:** `remaining = total - 100` está invertido: con 60% asignado dice "Te pasaste 40%", y con 120% dice "Faltan 20%" (al revés de lo correcto).
- **Cómo reproducirlo:** crear evaluaciones que sumen menos o más del 100% del peso total.
- **Esperado:** `remaining = 100 - total`.
- **Severidad:** alta
- [x] Corregido

## 23. La planilla de notas rechaza coma decimal a pesar de prometerlo

- **Ubicación:** `src/app/(app)/docente/grupos/[id]/grade-sheet-panel.tsx:17-20`
- **Qué está mal:** el comentario dice "acepta coma o punto" pero la regex `^\d(\.\d{1,2})?$` rechaza "4,5" (el campo queda inválido y bloquea Guardar); tampoco normaliza coma→punto.
- **Cómo reproducirlo:** docente → planilla de notas → ingresar una nota con coma decimal.
- **Esperado:** aceptar y normalizar coma como separador decimal, o corregir el mensaje si no se va a soportar.
- **Severidad:** media
- [x] Corregido

## 24. Formato de nota inconsistente dentro de la misma planilla

- **Ubicación:** `src/app/(app)/docente/grupos/[id]/grade-sheet-panel.tsx:188` vs `:183`
- **Qué está mal:** el acumulado se muestra a 2 decimales mientras las notas individuales usan `grade()` (que trunca a 1 decimal) — inconsistencia visual en la misma pantalla.
- **Cómo reproducirlo:** ver la planilla de notas de cualquier grupo.
- **Esperado:** mismo formato de decimales en toda la pantalla.
- **Severidad:** baja
- [x] Corregido

## 25. Filtros de administración se pierden al cambiar de página

- **Ubicación:** `src/components/admin/resource-manager.tsx:115`
- **Qué está mal:** `if (page === 1) Object.entries(filters)...` — los filtros solo se aplican cuando `page === 1`; al avanzar a la página 2 se pierden y la lista/total queda incoherente con lo filtrado.
- **Cómo reproducirlo:** Admin → Usuarios → filtrar por Rol=Docente con más de 15 resultados → clic en "Siguiente".
- **Esperado:** los filtros deben aplicarse en cualquier página.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo: filtro Rol=Docente en página 1 muestra 15 docentes ("Página 1 de 7 · 99 registros"); al pasar a página 2 aparecen filas de Docente Y Estudiante mezcladas, con "Página 2 de 14 · 201 registros" — el select sigue mostrando "Docente" aunque ya no filtra nada.)*

## 26. El modal de editar usuario nunca se puede cancelar

- **Ubicación:** `src/components/admin/resource-manager.tsx:297` + `configs.tsx:254` (ej. en Usuarios)
- **Qué está mal:** `dirty` se calcula comparando `values` contra el `row` crudo (no contra `config.initial(row)`); en edición siempre da "dirty" (ej. `password:""` no existe en `row`), así que Cancelar / la X del modal de Editar usuario nunca cierran (`closeForm` corta por el chequeo de dirty).
- **Cómo reproducirlo:** Admin → Usuarios → Editar un usuario → intentar Cancelar.
- **Esperado:** comparar contra los valores iniciales reales del formulario, no contra el documento crudo.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo: Cancelar, la X y Esc no cierran el modal "Editar usuario" en ningún caso — solo se sale recargando la página. Captura: `admin-edit-user-stuck.png`.)*

## 27. Tablas de administración sin scroll horizontal en móvil

- **Ubicación:** `src/components/admin/resource-manager.tsx:187-188`
- **Qué está mal:** la tabla usa `min-w-[40rem]` dentro de un `Card` con `overflow-hidden` y un `<div>` sin `overflow-x-auto`; en pantallas angostas las columnas/acciones quedan recortadas y sin forma de hacer scroll. El resto de tablas del proyecto sí usan `overflow-x-auto`.
- **Cómo reproducirlo:** abrir cualquier pantalla de administración en un viewport angosto.
- **Esperado:** agregar `overflow-x-auto` como en las demás tablas.
- **Severidad:** media
- [x] Corregido
- *(confirmado en vivo a 375px: tabla de Usuarios de 697px dentro de una tarjeta de 328px, el botón Editar queda completamente fuera de vista sin forma de hacer scroll. Captura: `admin-usuarios-375.png`.)*

## 28. Validaciones de formulario de administración son solo "no vacío"

- **Ubicación:** `src/components/admin/resource-manager.tsx:327-331` + `configs.tsx`
- **Qué está mal:** el formulario tiene `noValidate` y solo revisa que el campo no esté vacío: no aplica min/max (créditos, piso, capacidad, cupo), formato de email, mínimo de 8 caracteres en la contraseña de "Nuevo usuario" (solo aparece como hint visual, no se valida — `ResetPassword` sí valida el largo), ni que `endDate > startDate` en Periodos. El error termina dependiendo completamente del backend.
- **Cómo reproducirlo:** crear un usuario con contraseña de 3 caracteres, o un periodo con fecha de fin anterior a la de inicio.
- **Esperado:** validar estos casos en el cliente antes de enviar.
- **Severidad:** media
- [x] Corregido
- *(confirmado en vivo: Usuarios → Nuevo con nombre "   ", correo "no-es-email" y contraseña "123" → botón "Crear" queda habilitado igual. Grupos → Nuevo con Cupo=-5 y una franja con fin antes que inicio → "Crear" también habilitado.)*

## 29. Lookups de administración sin protección contra respuestas fuera de orden

- **Ubicación:** `src/components/admin/resource-manager.tsx:129` y `:112-122`
- **Qué está mal:** el lookup (ej. facultad/programa en columnas) muestra "—" mientras carga o si el id supera `limit=100`; además, al teclear en la búsqueda o cambiar filtros rápido, no hay protección contra que una respuesta vieja llegue después de una más nueva (race condition) y pise el resultado correcto.
- **Cómo reproducirlo:** escribir rápido en el buscador de una tabla de administración con muchos resultados.
- **Esperado:** descartar respuestas obsoletas (ej. con un token de petición o `AbortController`).
- **Severidad:** baja
- [x] Corregido

## 30. El mensaje de confirmación anterior no se limpia al abrir "Nuevo"

- **Ubicación:** `src/components/admin/resource-manager.tsx:264-268`
- **Qué está mal:** al crear/guardar un registro, el `notice` (mensaje de confirmación) de la acción anterior no se limpia al abrir el formulario de "Nuevo" — solo se limpia al editar (línea 215).
- **Cómo reproducirlo:** guardar un registro, luego abrir "Nuevo" sin recargar.
- **Esperado:** limpiar el notice también al abrir "Nuevo".
- **Severidad:** baja
- [x] Corregido

## 31. Tarjeta "Docentes activos" muestra el número de estudiantes

- **Ubicación:** `src/app/(app)/admin/page.tsx:23`
- **Qué está mal:** la tarjeta "Docentes activos" muestra `d.active.students` en vez de `d.active.teachers`.
- **Cómo reproducirlo:** ver el dashboard de administrador.
- **Esperado:** mostrar el conteo real de docentes activos.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo: panel muestra "Docentes activos: 97" cuando la API de reportes da `teachers: 99` y `students: 97` — 97 es el número de estudiantes, no de docentes.)*

## 32. Contadores de matrículas por estado del periodo siempre en 0

- **Ubicación:** `src/app/(app)/admin/page.tsx:58`
- **Qué está mal:** `p.enrollmentsByStatus[label]` indexa con la etiqueta visible ("Activas") en vez de la clave real ("activa"); los 4 contadores del periodo abierto siempre salen 0.
- **Cómo reproducirlo:** ver el dashboard de administrador con matrículas reales en el periodo abierto.
- **Esperado:** indexar por la clave real del objeto, no por el texto de la etiqueta.
- **Severidad:** alta
- [x] Corregido

## 33. Posible crash al listar matrículas sin nota final

- **Ubicación:** `src/components/admin/operations.tsx:328`
- **Qué está mal:** `r.finalGrade !== undefined ? r.finalGrade.toFixed(1) ...` — si el backend manda `null` (el tipo lo permite en otras pantallas), la comparación con `undefined` no lo filtra y `null.toFixed(1)` lanza `TypeError`. Además usa `toFixed` en vez de `grade()` como el resto del proyecto.
- **Cómo reproducirlo:** listar matrículas finalizadas/sin nota final asignada.
- **Esperado:** chequear `== null` (cubre `null` y `undefined`), y usar el mismo formateador que el resto de la app.
- **Severidad:** media
- [x] Corregido

## 34. Validaciones de Salón débiles o de tipo incorrecto

- **Ubicación:** `src/components/admin/configs.tsx:169-170`
- **Qué está mal:** el piso tiene mínimo 1 (no permite planta baja = 0) y la capacidad mínimo 5 — verificar si coincide con el DTO real del backend. Además, el filtro "Capacidad mínima" es un campo de texto (acepta letras) en vez de numérico.
- **Cómo reproducirlo:** Admin → Salones → usar el filtro de capacidad mínima con letras.
- **Esperado:** campo numérico, y mínimos consistentes con el backend.
- **Severidad:** baja
- [x] Corregido

## 35. Texto sin singularizar en resumen de matrículas sin nota

- **Ubicación:** `src/components/admin/operations.tsx:130`
- **Qué está mal:** el texto "matrículas activas sin nota final en N grupos" no singulariza cuando N=1 ("1 grupos", "1 matrículas").
- **Cómo reproducirlo:** un escenario con exactamente 1 grupo/matrícula en esa condición.
- **Esperado:** singularizar correctamente.
- **Severidad:** baja
- [x] Corregido

## 36. El botón "Guardar nombre" en Mi cuenta nunca se habilita

- **Ubicación:** `src/app/(app)/cuenta/account-forms.tsx:19,81`
- **Qué está mal:** la variable `dirty` nunca se pone en `true` (no hay ningún `setDirty(true)` en el formulario de nombre); el botón "Guardar nombre" queda siempre deshabilitado.
- **Cómo reproducirlo:** Mi cuenta → editar el campo nombre.
- **Esperado:** detectar el cambio y habilitar el botón.
- **Severidad:** alta
- [x] Corregido
- *(confirmado en vivo: tras editar el campo nombre, el botón sigue con `disabled=true`.)*

## 37. Falta validar complejidad de contraseña en cliente

- **Ubicación:** `src/app/(app)/cuenta/account-forms.tsx:104`
- **Qué está mal:** el texto promete requerir letras+números, pero el cliente solo valida `length >= 8`, sin revisar complejidad real.
- **Cómo reproducirlo:** cambiar la contraseña a algo de 8+ caracteres pero solo letras o solo números.
- **Esperado:** validar la complejidad prometida, o corregir el texto si no se va a exigir.
- **Severidad:** baja
- [x] Corregido

## 38. El contador de notificaciones no se actualiza al marcar como leídas

- **Ubicación:** `src/app/(app)/notificaciones/notification-list.tsx`
- **Qué está mal:** al marcar una notificación (o todas) como leída, el contador del menú no se actualiza (el `app-shell` solo refresca al cambiar de ruta o cada 60s). Además, con el filtro "Sin leer" activo en una página >1, marcar como leída puede dejar una página vacía.
- **Cómo reproducirlo:** marcar notificaciones como leídas y mirar el contador del menú sin cambiar de pantalla.
- **Esperado:** refrescar el contador inmediatamente tras la acción.
- **Severidad:** baja
- [x] Corregido

## 39. Login con contraseña incorrecta muestra "sesión venció" en vez del error real

- **Ubicación:** `src/components/login-form.tsx:34` y `src/lib/api.ts:31-35`
- **Qué está mal:** `api()` trata cualquier 401 como sesión vencida, incluso el 401 de `/auth/login` por credenciales incorrectas — redirige a `/login?expired=1`, mostrando "Tu sesión venció" (en rojo) en vez del error real "credenciales inválidas". Se pierde el mensaje correcto.
- **Cómo reproducirlo:** intentar iniciar sesión con una contraseña incorrecta.
- **Esperado:** distinguir el 401 del login (mostrar error de credenciales) del 401 de una sesión expirada en otras rutas.
- **Severidad:** media
- [x] Corregido
- *(confirmado en vivo: 401 real de login → redirige a `/login?expired=1` con "Tu sesión venció" en vez del error de credenciales)*

## 40. Sin manejo de errores en el layout autenticado — un 500 tumba toda la pantalla sin salida

- **Ubicación:** `src/app/(app)/layout.tsx` — falta `error.tsx`/`not-found.tsx`/`loading.tsx` en `src/app`
- **Qué está mal:** el layout llama `apiGet("/users/me")` sin ningún fallback ni error boundary. Cuando esa llamada falla (sea por el bug de backend de `/users/me`, o cualquier otro error de red), **todas** las pantallas autenticadas muestran la página de error genérica de Next (500), sin mensaje útil, sin botón de reintentar, y sin opción de cerrar sesión.
- **Cómo reproducirlo:** forzar que `/api/users/me` falle (ya ocurre hoy por el bug de backend) → cualquier pantalla autenticada cae en un 500 genérico sin salida.
- **Esperado:** un `error.tsx` con mensaje claro y opción de reintentar/cerrar sesión, y que el layout tolere ese fallo puntual (ej. usar el email de la sesión como respaldo en vez de bloquear toda la pantalla).
- **Severidad:** media
- [x] Corregido

## 41. Error del servidor sin traducir, volcado literal en pantalla

- **Ubicación:** pestaña Evaluaciones del grupo (docente), y potencialmente `estudiante/notas` (llama a `/evaluations` por SSR sin `apiGetOrNull`)
- **Qué está mal:** cuando el backend responde con error (ej. "Cannot GET /api/evaluations?group=...&limit=100", síntoma del bug de backend B20), el frontend muestra ese texto crudo del servidor tal cual, sin traducir a un mensaje amigable ni ofrecer reintento.
- **Cómo reproducirlo:** docente → cualquier grupo → pestaña Evaluaciones (o un periodo cerrado) → se ve el mensaje de error del servidor sin procesar.
- **Esperado:** interceptar el error y mostrar un mensaje genérico amigable, con opción de reintentar.
- **Severidad:** media
- [x] Corregido

## 42. Pantallas SSR sin manejo de errores — un 404/500 del backend tumba toda la página

- **Ubicación:** páginas que usan `apiGet` (sin `OrNull`) en SSR: reportes, `estudiante/notas`, historial, malla curricular, cuenta, `docente/grupos/[id]`, entre otras — ninguna tiene `error.tsx`
- **Qué está mal:** solo las pantallas de horario (estudiante/docente) usan `apiGetOrNull` con manejo de ausencia de datos; el resto deja que cualquier error del backend (ej. los 404 "No hay un periodo abierto" que devuelven `/reports/group-occupancy`, `/reports/teacher-load`, `/reports/top-students`, `/reports/subject-performance`, `/reports/at-risk-students`, `/reports/enrollments-by-program`, `/students/me/schedule`, `/teachers/me/schedule`) tumbe la página completa con el overlay de error de Next, en vez de mostrar un estado vacío o un mensaje claro.
- **Cómo reproducirlo:** forzar un error del backend en cualquiera de esas pantallas (ej. pedir un recurso inexistente).
- **Esperado:** manejo de error consistente en todas las pantallas SSR, igual que ya se hace en horario.
- **Severidad:** media
- [x] Corregido
- *(corrección: al principio se pensó que los reportes caían directo por falta de periodo abierto, pero pasando `?period=<id>` responden 200 y la pantalla muestra "No hay grupos en este periodo" correctamente — el riesgo de que un error SÍ tumbe la página sigue siendo real para otros casos, pero no se reprodujo en vivo todavía, queda como riesgo teórico.)*

## 43. Malla curricular muestra una materia como prerrequisito de sí misma

- **Ubicación:** malla curricular del estudiante, usando `missingPrerequisites` de `/students/me/progress`
- **Qué está mal:** "Cálculo 1 · MAT101" aparece con "Requiere: MAT101" — la materia exigiéndose a sí misma como prerrequisito. El frontend solo pinta lo que el backend devuelve (consistente con el hallazgo de DB #13, `MAT101` con auto-referencia en `prerequisites`); se anota acá porque es donde se ve el síntoma visualmente.
- **Cómo reproducirlo:** estudiante `ana@` → malla curricular → materia `MAT101`.
- **Esperado:** una materia no debería listarse como su propio prerrequisito.
- **Severidad:** baja
- [x] Corregido

## 44. Resumen de grupos del docente cuenta periodos cerrados bajo la etiqueta "periodo abierto"

- **Ubicación:** `docente/page.tsx` (dashboard de inicio del docente)
- **Qué está mal:** la tarjeta "Grupos a mi cargo / Estudiantes" usa `/groups/mine` sin filtrar por periodo (porque no hay un periodo abierto, bug de datos D4) y cuenta grupos de periodos cerrados, pero el rótulo dice "Resumen de tus grupos en el periodo abierto".
- **Cómo reproducirlo:** entrar como docente al dashboard con el bug D4 presente.
- **Esperado:** si no hay periodo abierto, el rótulo debería reflejarlo (ej. "sin periodo abierto") en vez de contar grupos de cualquier periodo bajo una etiqueta que implica que sí hay uno.
- **Severidad:** baja
- [x] Corregido

## 45. Acumulado de la planilla no coincide con la nota final guardada

- **Ubicación:** planilla de notas del docente (grupo PSIC174 G1), estudiante Daniel Morales
- **Qué está mal:** la planilla muestra "Acumulado: 4.72" para ese estudiante, pero la nota final guardada en el roster es 4.73 — dos decimales distintos para lo que debería ser el mismo cálculo (probablemente un bug de redondeo en el backend; se anota acá como observación porque se detectó comparando ambas pantallas del frontend).
- **Cómo reproducirlo:** comparar el "Acumulado" de la planilla contra la nota final del roster para el mismo estudiante.
- **Esperado:** mismo valor en ambas pantallas.
- **Severidad:** baja
- [x] Corregido

## 46. Los campos de horario duplican id y el label enfoca el campo equivocado

- **Ubicación:** `src/components/admin/resource-manager.tsx:447-451` (editor de franjas horarias, usado en Grupos)
- **Qué está mal:** los campos Día/Inicio/Fin/Salón del editor de franjas no reciben `id`/`name` propio; `Field`/`Select` usan el texto del label ("Día", "Inicio", "Fin", "Salón") como `id`. Al agregar una segunda franja, los ids se duplican y hacer clic en el label de la 2ª franja enfoca el input de la 1ª.
- **Cómo reproducirlo:** Admin → Grupos → Nuevo grupo → agregar una segunda franja horaria → clic en cualquier label de esa franja.
- **Esperado:** cada franja debe generar ids únicos (ej. incluyendo el índice de la franja).
- **Severidad:** media
- [x] Corregido

## 47. Barra de ocupación no limita el valor accesible por encima del máximo

- **Ubicación:** `src/components/ui/bar.tsx:8`
- **Qué está mal:** el componente `Bar` solo limita el ancho visual al 100%, pero no el atributo `aria-valuenow`; con una ocupación de 109.4% (grupo sobrecupado), queda `aria-valuenow="109.4"` con `aria-valuemax="100"` — un valor accesible fuera del rango declarado.
- **Cómo reproducirlo:** Reportes → Ocupación, periodo 2026-2, grupo "Cálculo 1 G1" (35/32, 109.4%).
- **Esperado:** limitar también `aria-valuenow` al máximo declarado (o ajustar `aria-valuemax` si se quiere mostrar sobrecupo).
- **Severidad:** baja
- [x] Corregido

## 48. Avatar/nombre del admin vacíos en el menú por falta de respaldo

- **Ubicación:** pie del menú lateral (nombre/avatar de usuario)
- **Qué está mal:** el avatar y nombre del admin se muestran como "?" y vacío porque `/api/users/me` devuelve `name: ""` para `admin@universidad.edu` (dato de seed, ver hallazgo #4 de DB) y el frontend no tiene ningún valor de respaldo (ej. usar el email o el rol) cuando el nombre viene vacío.
- **Cómo reproducirlo:** entrar como `admin@universidad.edu` y ver el pie del menú.
- **Esperado:** usar el email o rol como respaldo cuando `name` esté vacío.
- **Severidad:** baja
- [x] Corregido

## 49. El drawer móvil no maneja foco, Esc, ni bloquea el scroll del body

- **Ubicación:** `src/components/app-shell.tsx:141-151` (drawer de menú en móvil, `role="dialog"` `aria-modal`)
- **Qué está mal:** varios problemas de accesibilidad en el mismo componente: Esc no cierra el drawer; al abrirlo, el foco no se mueve dentro (queda en el botón "Abrir menú" de atrás) ni se atrapa dentro del diálogo; el `body` sigue haciendo scroll con el drawer abierto (`overflow` no se bloquea). Además comparte el bug #4 (links blancos sobre blanco) y el botón de cerrar sesión queda fuera de pantalla hasta hacer scroll dentro del propio nav.
- **Cómo reproducirlo:** abrir la app en 375px, abrir el menú drawer.
- **Esperado:** un diálogo modal real: Esc cierra, foco atrapado dentro, scroll del body bloqueado mientras está abierto.
- **Severidad:** media
- [x] Corregido

## 50. Scroll horizontal de toda la página en Reportes → Ocupación (móvil)

- **Ubicación:** `src/app/(app)/admin/reportes/page.tsx:81-89,107-113` — sección "Grupos más llenos"
- **Qué está mal:** a 375px, la página completa desborda horizontalmente (ancho de scroll 562px vs 360px de viewport). La sección vive en un grid (`xl:grid-cols-2`) sin `min-w-0`, y sus filas combinan `truncate` con `shrink-0`, por lo que el contenido no puede encogerse para caber. El resto de pantallas revisadas a 375px no tienen este problema a nivel de página.
- **Cómo reproducirlo:** abrir Reportes → Ocupación en un viewport de 375px.
- **Esperado:** agregar `min-w-0` al ítem del grid y permitir que el contenido se encoja.
- **Severidad:** media
- [x] Corregido

## 51. Varios elementos de la paleta no cumplen contraste mínimo (WCAG 4.5:1)

- **Ubicación:** `src/app/globals.css:20-29` (paleta de colores base, no un componente suelto)
- **Qué está mal:** medido con los colores reales renderizados en 10 pantallas: badge "Activo" (`text-success-600` #178a55 sobre `success-100` #dcf6e8) = 3.83:1, presente en 56 apariciones (Usuarios, Grupos, Salones, Docente/grupos, etc.); texto/alerta de peligro (#d6333a sobre #fde3e4) = 3.93:1 (ej. "El periodo está cerrado: solo puedes consultar.", mensajes de error); badge de advertencia "Planificado" (#b97a00 sobre #fdf0d0) = 3.17:1 en Periodos. Todos por debajo del mínimo 4.5:1 para texto normal. (Relacionado con el hallazgo #11, que ya marcaba `accent-600`/`warning-600` sobre fondos claros — esto confirma que el problema es sistémico de la paleta, no de un solo componente.)
- **Cómo reproducirlo:** medir el contraste de esos pares color/fondo en cualquiera de las pantallas mencionadas.
- **Esperado:** ajustar la paleta para que los pares texto/fondo usados en badges y alertas cumplan ≥4.5:1.
- **Severidad:** media
- [x] Corregido

