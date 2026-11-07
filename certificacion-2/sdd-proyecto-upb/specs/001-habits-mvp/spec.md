# Spec 001 — MVP de habits-cli

## 1. Contexto y objetivo

Quien estudia con constancia necesita ver si está siendo constante. Hoy no tiene una forma rápida de anotar «hoy estudié esto» ni de saber cuántos días seguidos lleva.

**Objetivo:** una herramienta de línea de comandos con la que una persona registra hábitos de estudio, marca cada uno como hecho el día de hoy y consulta su **racha**: los días consecutivos que lleva cumpliéndolo.

**Por qué importa:** la racha visible motiva a no romper la cadena. El MVP debe ser tan simple que se use cada día en pocos segundos y tan pequeño que un desarrollador junior pueda mantenerlo.

## 2. Usuarios

- **Estudiante:** persona que usa la terminal y quiere llevar sus propios hábitos (por ejemplo «inglés», «algoritmos», «leer 20 páginas»). Cada cuenta de usuario de la computadora tiene sus propios hábitos.
- **Mantenedor junior:** desarrollador que lee esta spec para entender qué debe hacer el producto.

## 3. Historias de usuario

- **HU-1.** Como estudiante, quiero crear un hábito con un nombre, para tener qué marcar cada día.
- **HU-2.** Como estudiante, quiero marcar un hábito como hecho hoy, para dejar constancia de que cumplí.
- **HU-3.** Como estudiante, quiero ver todos mis hábitos con su racha actual, para saber cómo voy y qué me falta hoy.
- **HU-4.** Como estudiante, quiero que el programa me explique qué comandos tiene y me avise claro cuando me equivoque, para usarlo sin leer documentación aparte.

## 4. Requisitos funcionales

Notación EARS: *Cuando* (evento), *Si… entonces* (situación no deseada), *Mientras* (estado), *El sistema deberá* (siempre).

Cada criterio lleva una etiqueta que indica a qué capa pertenece: **[núcleo]** regla de negocio, **[CLI]** lo que la persona ve o recibe del programa, **[datos]** conservación de la información.

### Definiciones

- **Hoy:** la fecha del calendario local de la computadora, leída **una sola vez al empezar cada comando**. A las 00:30 ya es el día nuevo.
- **Día:** se cuenta por fecha de calendario, nunca por períodos de 24 horas.
- **Nombre limpio:** el nombre sin espacios al inicio ni al final y con los espacios repetidos del interior reducidos a uno.
- **Nombre equivalente:** dos nombres limpios son equivalentes si son iguales sin distinguir mayúsculas ni tildes sobre las vocales (á, é, í, ó, ú, ü). La letra ñ es distinta de la n.
- **Racha:** cantidad de días del tramo **más reciente** de días consecutivos marcados que termina hoy o ayer; 0 si no hay tal tramo.
- **Estado de hoy:** cada hábito está «hecho hoy» o «pendiente hoy».

**Por qué crear un duplicado es error y marcar dos veces no:** crear un nombre repetido suele indicar que la persona quería marcarlo, y avisarle evita un hábito duplicado; marcar dos veces es una repetición inofensiva que no merece un error.

### RF-1 · Crear un hábito

- **RF-1.1** Cuando la persona pide crear un hábito con un nombre válido, el sistema deberá guardarlo y confirmar con un mensaje en español que incluya el nombre. *[núcleo] [CLI]*
- **RF-1.2** El sistema deberá guardar el nombre limpio conservando sus mayúsculas y tildes tal como las escribió la persona. *[núcleo]*
- **RF-1.3** Si el nombre limpio está vacío, entonces el sistema deberá rechazarlo, explicar el motivo y terminar con error de uso. *[núcleo] [CLI]*
- **RF-1.4** Si el nombre limpio supera 60 caracteres (cada símbolo visible, incluido un emoji, cuenta como uno), entonces el sistema deberá rechazarlo, indicar el máximo y terminar con error de uso. *[núcleo] [CLI]*
- **RF-1.5** Si ya existe un hábito con un nombre equivalente, entonces el sistema deberá rechazar la creación, decir cuál hábito ya existe y terminar con error de uso, sin crear duplicados. *[núcleo] [CLI]*
- **RF-1.6** El sistema deberá permitir nombres con espacios, tildes, signos y emojis (por ejemplo «Leer 20 páginas»). *[núcleo]*
- **RF-1.7** Si el nombre contiene saltos de línea, tabuladores u otros caracteres de control, o empieza con «-», o no tiene ninguna letra ni número, entonces el sistema deberá rechazarlo, explicar el motivo y terminar con error de uso. *[núcleo] [CLI]*
- **RF-1.8** Si ya existen 100 hábitos, entonces el sistema deberá rechazar la creación de otro, indicar el máximo y terminar con error de uso. *[núcleo] [CLI]*

### RF-2 · Marcar un hábito como hecho hoy

- **RF-2.1** Cuando la persona marca un hábito existente como hecho, el sistema deberá registrar el día de hoy para ese hábito y confirmar con un mensaje en español que incluya la racha resultante. *[núcleo] [CLI]*
- **RF-2.2** El sistema deberá identificar el hábito por un nombre equivalente al que se creó (se aplica la misma limpieza al nombre escrito). *[núcleo]*
- **RF-2.3** Cuando la persona marca un hábito que ya estaba marcado hoy, el sistema no deberá cambiar nada, deberá avisar «ya estaba marcado hoy» junto con la racha actual y terminar sin error. *[núcleo] [CLI]*
- **RF-2.4** Si el hábito indicado no existe, entonces el sistema deberá informarlo, mostrar los nombres de los hábitos disponibles (o, si no hay ninguno, decir que aún no hay hábitos y sugerir crear uno) y terminar con error de uso, sin crear nada. *[núcleo] [CLI]*
- **RF-2.5** El sistema no deberá permitir marcar fechas distintas de hoy. *[núcleo]*

### RF-3 · Listar hábitos con su racha

- **RF-3.1** Cuando la persona pide la lista, el sistema deberá mostrar cada hábito con su nombre, su racha en días y su estado de hoy («hecho hoy» o «pendiente hoy»). *[núcleo] [CLI]*
- **RF-3.2** El sistema deberá mostrar los hábitos en el orden en que fueron creados. *[núcleo]*
- **RF-3.3** El sistema deberá calcular la racha como la del tramo más reciente de días consecutivos marcados que termina hoy o ayer. *[núcleo]*
- **RF-3.4** Si el último día marcado de un hábito es anterior a ayer, o el hábito nunca se marcó, entonces el sistema deberá mostrar su racha como 0. *[núcleo]*
- **RF-3.5** Si el hábito no está marcado hoy pero sí lo estaba ayer, entonces el sistema deberá mantener su racha (la persona aún puede cumplir hoy) y mostrarlo como «pendiente hoy». *[núcleo]*
- **RF-3.6** Si no existe ningún hábito, entonces el sistema deberá mostrar un mensaje que invite a crear el primero y terminar sin error. *[CLI]*
- **RF-3.7** El sistema deberá escribir la racha con la concordancia correcta: «0 días», «1 día», «5 días». *[CLI]*
- **RF-3.8** El sistema deberá considerar consecutivos dos días cuando sus fechas de calendario son sucesivas, incluso entre meses, entre años, en el 29 de febrero y en los días con cambio de horario. *[núcleo]*
- **RF-3.9** Si un hábito tiene marcas con fecha posterior a hoy (por ejemplo, porque se retrasó el reloj), entonces el sistema deberá ignorarlas para la racha y el estado de hoy, y no deberá borrarlas. *[núcleo]*

### RF-4 · Conservación de los datos

- **RF-4.1** El sistema deberá conservar hábitos y marcas entre ejecuciones y reinicios de la computadora, en la carpeta personal de la cuenta de usuario que los creó. *[datos]*
- **RF-4.2** Si todavía no existen datos guardados (primera ejecución), entonces el sistema deberá comportarse como si no hubiera ningún hábito, sin pedir configuración previa. *[datos]*
- **RF-4.3** Si existen datos guardados pero están vacíos, no se pueden leer, tienen un formato desconocido o son incoherentes (fechas repetidas o inexistentes, nombres equivalentes duplicados), entonces el sistema deberá informarlo en español, terminar con error de datos y no sobrescribir ni borrar nada. *[datos] [CLI]*
- **RF-4.4** Si no se pueden guardar los cambios (sin permiso, disco lleno, carpeta inexistente), entonces el sistema deberá decir que el cambio no se guardó, terminar con error de datos y dejar intactos los datos anteriores. *[datos] [CLI]*

### RF-5 · Uso del programa

- **RF-5.1** Cuando no se indica ningún comando o la persona pide ayuda, el sistema deberá mostrar una ayuda breve en español con los tres comandos, qué hace cada uno y un ejemplo, y terminar sin error. *[CLI]*
- **RF-5.2** Si el comando es desconocido o faltan o sobran argumentos, entonces el sistema deberá mostrar un mensaje de uso en español y terminar con error de uso. *[CLI]*

## 5. Requisitos no funcionales

- **RNF-1 Simplicidad:** cada comando se resuelve en una sola instrucción, sin preguntas interactivas.
- **RNF-2 Rapidez:** cada comando responde en menos de 1 segundo con 100 hábitos y 5 años de marcas cada uno, en una computadora de escritorio o portátil común de los últimos 5 años.
- **RNF-3 Funcionamiento local:** no requiere internet, cuenta ni configuración previa.
- **RNF-4 Integridad:** guardar es «todo o nada». Una falla o interrupción a mitad de una escritura (corte de luz, Ctrl+C, cierre del programa) deja los datos como estaban o completamente nuevos, nunca mezclados ni corruptos.
- **RNF-5 Idioma:** todos los mensajes que ve la persona están en español y se redactan en un solo lugar para revisarlos juntos.
- **RNF-6 Códigos de salida:** `0` éxito (incluye «ya estaba marcado», la ayuda y la lista vacía); `1` error de uso o validación (nombre inválido, duplicado, inexistente, comando incorrecto, límite alcanzado); `2` error de datos (ilegibles, incoherentes, no se pudo guardar). Los mensajes de error salen por el canal de errores.
- **RNF-7 Trazabilidad:** cada regla de esta spec tiene un identificador y cada prueba automática cita el identificador que verifica.
- **RNF-8 Ejecuciones simultáneas:** si dos ejecuciones ocurren a la vez no se garantiza cuál operación prevalece, pero el archivo de datos nunca queda corrupto.
- **RNF-9 Texto:** los mensajes usan tildes y ñ con la codificación estándar de texto; las terminales que no la soportan no están cubiertas.

## 6. Casos límite

| # | Situación | Comportamiento esperado |
|---|---|---|
| CL-1 | Marcar el mismo hábito dos veces el mismo día | No cambia nada, avisa, éxito (RF-2.3) |
| CL-2 | Marcado ayer y hoy aún no | Racha se mantiene, «pendiente hoy» (RF-3.5) |
| CL-3 | Última marca hace 2 días o más | Racha 0 (RF-3.4) |
| CL-4 | Marcas en los días 1, 2, 3 y 5 (falta el 4) y hoy es el 5 | Racha 1 (RF-3.3) |
| CL-5 | Cambia el día entre un comando y el siguiente | El siguiente comando usa el día nuevo |
| CL-6 | Pasa la medianoche mientras corre un comando | Todo el comando usa la fecha leída al empezar |
| CL-7 | «Inglés», «ingles» e « INGLÉS  » | Son el mismo hábito (RF-1.5, RF-2.2); «año» y «ano» no |
| CL-8 | Nombre vacío, de solo espacios o de 61 caracteres | Rechazado (RF-1.3, RF-1.4) |
| CL-9 | Nombre con salto de línea, tabulador, que empieza con «-» o sin letras ni números | Rechazado (RF-1.7) |
| CL-10 | Nombre con emoji | Se acepta; el emoji cuenta como 1 carácter (RF-1.4, RF-1.6) |
| CL-11 | Marcar un hábito inexistente, con y sin otros hábitos | Error de uso con la lista o la sugerencia de crear (RF-2.4) |
| CL-12 | Datos ilegibles, vacíos, de formato desconocido o incoherentes | Error de datos, sin tocarlos (RF-4.3) |
| CL-13 | Hábito recién creado sin marcas | Racha 0, «pendiente hoy» |
| CL-14 | Hábito creado y marcado hoy; hábito creado ayer y nunca marcado | Racha 1 y «hecho hoy»; racha 0 y «pendiente hoy» |
| CL-15 | Racha de más de un año | Se muestra el número de días sin límite |
| CL-16 | Cadena que cruza 31 dic → 1 ene, el 29 de febrero o un cambio de horario | Los días se cuentan por fecha de calendario (RF-3.8) |
| CL-17 | Marcas con fecha posterior a hoy | Se ignoran para la racha y no se borran (RF-3.9) |
| CL-18 | Crear el hábito número 101 | Error de uso, indica el máximo (RF-1.8) |
| CL-19 | Sin permiso de escritura o disco lleno al guardar | Error de datos, datos anteriores intactos (RF-4.4) |
| CL-20 | Ctrl+C mientras se guarda | Datos anteriores o nuevos completos (RNF-4) |
| CL-21 | Sin comando, comando desconocido o argumentos incorrectos | Ayuda sin error, o mensaje de uso con error de uso (RF-5) |
| CL-22 | Dos ejecuciones a la vez | El archivo no se corrompe (RNF-8) |
| CL-23 | La zona horaria de la computadora cambia entre ejecuciones | Se usa la fecha local vigente; el historial no se corrige |

## 7. Fuera de alcance

Queda fuera del MVP, para specs futuras:
- Editar, renombrar, archivar o borrar hábitos.
- Marcar o corregir días pasados o futuros, y desmarcar un día.
- «Mejor racha histórica», estadísticas, gráficos, calendarios y ordenar la lista por racha.
- Recordatorios, notificaciones o integración con calendarios.
- Varios usuarios sobre los mismos datos, sincronización entre computadoras o respaldo en la nube.
- Frecuencias distintas de diaria (por ejemplo «3 veces por semana») y días de descanso.
- Exportar o importar datos.
- Corregir el historial por cambios de zona horaria o viajes.
- Coordinar ejecuciones simultáneas (bloqueos) y terminales sin soporte de texto estándar.
- Tratar la ñ como equivalente a la n.
- Interfaz gráfica o web.

## 8. Criterios de finalización

El MVP está terminado cuando:
1. Cada criterio (RF-x.y), cada requisito no funcional verificable y cada caso límite tiene al menos una prueba automática que cita su identificador, y todas pasan.
2. Las pruebas pasan con la versión mínima del lenguaje que fija la constitución y con la instalada actualmente.
3. Una persona nueva puede crear un hábito, marcarlo y ver su racha leyendo solo la ayuda del programa.
4. Todos los mensajes están en español y se revisaron juntos.
5. Se cumplen los 6 principios de `docs/constitution.md`.
6. No existe comportamiento en el código que no esté descrito en esta spec.
7. Se midió RNF-2 en las condiciones indicadas y se cumple.

## 9. Dudas abiertas

Ninguna por ahora. Las dudas de la versión anterior se resolvieron así: reloj que retrocede → RF-3.9; límite de 60 caracteres → firme en RF-1.4; ordenar la lista por racha → fuera de alcance.
