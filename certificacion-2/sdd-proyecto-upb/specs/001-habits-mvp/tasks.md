# Tareas 001 — MVP de habits-cli

Derivadas de [spec.md](spec.md) y [plan.md](plan.md). Las secciones del plan se citan como «plan §n».

## Reglas de trabajo

- Orden: se hacen de arriba abajo; cada tarea solo depende de las anteriores.
- Tamaño: de 20 a 30 minutos cada una. Si una se alarga, se divide antes de seguir.
- Test primero: en cada tarea se escriben antes los tests (su docstring cita los identificadores RF/CL/RNF) y luego el código que los hace pasar *[constitución 4]*.
- Cierre de cada tarea: `pytest -q` pasa completo y se hace un commit por tarea, en una rama `feat/…`, nunca en `main`, `dev` ni `qa`.
- Si una tarea obliga a cambiar el comportamiento, se actualiza antes la spec o el plan *[constitución 2]*.

## Fase 0 · Esqueleto

- [ ] **T-01 · Esqueleto del proyecto** (~20 min) · Cubre: base de todos los RF · Depende de: —
  Crear la carpeta `habits/` con `__init__.py`, `core.py`, `storage.py`, `cli.py`, `messages.py` y `__main__.py` vacíos (plan §1), la carpeta `tests/` y un test de humo que importa los cinco módulos.
  **Hecho cuando:** `pytest -q` ejecuta el test de humo y pasa, y `python -m habits` no falla al importarse.

## Fase 1 · Núcleo (`core.py`)

- [x] **T-02 · Tipos, constantes y errores del núcleo** (~20 min) · Cubre: RF-1.4, RF-1.8 (constantes) · Depende de: T-01
  Definir `MAX_NAME_LENGTH = 60`, `MAX_HABITS = 100`, el hábito inmutable (nombre y marcas) y los errores `InvalidName` (con motivos `CONTROL`, `EMPTY`, `DASH`, `NO_ALNUM`, `TOO_LONG`), `DuplicateHabit`, `LimitReached` y `HabitNotFound` (plan §3.1, §3.3).
  **Hecho cuando:** los tests comprueban los valores de las constantes, que un hábito no se puede modificar una vez creado y que cada error guarda su motivo o su dato (por ejemplo, el nombre existente).

- [ ] **T-03 · Limpiar nombre: control, espacios y vacío** (~25 min) · Cubre: RF-1.2, RF-1.3, RF-1.7 (control), CL-7, CL-8 · Depende de: T-02
  Implementar los pasos 1 a 4 y 8 de `clean_name` (plan §3.2): rechazar caracteres de control y separadores de línea, normalizar, unir espacios y rechazar vacío.
  **Hecho cuando:** los tests pasan con estos casos: « Inglés  clase » → «Inglés clase»; mayúsculas y tildes se conservan; «» y «   » → `EMPTY`; un salto de línea y un tabulador → `CONTROL`.

- [ ] **T-04 · Limpiar nombre: guion, letras y longitud** (~25 min) · Cubre: RF-1.4, RF-1.6, RF-1.7, CL-8, CL-9, CL-10 · Depende de: T-03
  Implementar los pasos 5 a 7 de `clean_name`: empieza con «-», sin letra ni número y más de 60 puntos de código.
  **Hecho cuando:** los tests pasan con: «-x» → `DASH`; «!!!» → `NO_ALNUM`; 60 caracteres se acepta y 61 → `TOO_LONG`; «Leer 20 páginas» y un nombre con un emoji simple se aceptan y el emoji cuenta como 1.

- [ ] **T-05 · Clave de equivalencia** (~25 min) · Cubre: RF-1.5, RF-2.2, CL-7 · Depende de: T-03
  Implementar `equivalence_key` (plan §3.2): `casefold`, NFD, quitar solo el acento sobre a, e, i, o, u y la diéresis sobre u, y recomponer.
  **Hecho cuando:** «Inglés», «ingles» e «INGLÉS» dan la misma clave, «pingüino» y «pinguino» también, y «año» y «ano» dan claves distintas.

- [ ] **T-06 · Crear hábito** (~25 min) · Cubre: RF-1.1, RF-1.5, RF-1.8, CL-18 · Depende de: T-02, T-04, T-05
  Implementar `create_habit` (plan §3.3): valida el nombre, luego duplicado, luego límite; devuelve una lista nueva con el hábito al final y sin marcas.
  **Hecho cuando:** los tests pasan con: se agrega al final sin marcas; duplicado equivalente → `DuplicateHabit` con el nombre existente; con 100 hábitos → `LimitReached`; con 100 hábitos y un nombre repetido → `DuplicateHabit`; la lista recibida no cambia.

- [ ] **T-07 · Buscar hábito** (~20 min) · Cubre: RF-2.2, RF-2.4 · Depende de: T-05
  Implementar `find_habit` tolerante (plan §3.3): une los espacios, calcula la clave y compara, sin validar el nombre.
  **Hecho cuando:** «  ingles » encuentra «Inglés»; un nombre inexistente, uno vacío y uno con «-» al inicio lanzan `HabitNotFound`; «Inglés\n» encuentra «Inglés».

- [ ] **T-08 · Marcar hoy** (~25 min) · Cubre: RF-2.1, RF-2.3, RF-2.5, CL-1 · Depende de: T-02, T-07
  Implementar `mark_done` (plan §3.3) con la fecha de hoy recibida como parámetro.
  **Hecho cuando:** los tests pasan con: marcar agrega solo la fecha de hoy y no otra; marcar dos veces devuelve `ya_marcado = verdadero` sin cambiar la lista; un hábito inexistente → `HabitNotFound`; la lista recibida no cambia.

- [ ] **T-09 · Racha: caso base** (~25 min) · Cubre: RF-3.3, RF-3.4, RF-3.5, CL-2, CL-3, CL-13, CL-14 · Depende de: T-02
  Implementar `streak` (plan §3.4) y `done_today`, sin tramos con huecos todavía.
  **Hecho cuando:** los tests pasan con: sin marcas → 0; solo hoy → 1; ayer y hoy → 2; solo ayer → 1 y pendiente hoy; última marca anteayer → 0; hábito creado hoy y marcado → 1.

- [ ] **T-10 · Racha: huecos, calendario y marcas futuras** (~30 min) · Cubre: RF-3.3, RF-3.8, RF-3.9, CL-4, CL-15, CL-16, CL-17 · Depende de: T-09
  Completar `streak`: tramo más reciente con huecos, fechas sucesivas de calendario y marcas posteriores a hoy ignoradas pero no borradas.
  **Hecho cuando:** los tests pasan con: marcas en los días 1, 2, 3 y 5 con hoy el 5 → 1; cadena que cruza 31-dic → 1-ene; cadena que incluye el 29 de febrero; cadena que cruza un cambio de horario; 400 días seguidos → 400; una marca de mañana no cuenta para la racha ni para «hecho hoy» y sigue en la lista; la fecha mínima no produce error.

- [ ] **T-11 · Resumen de hábitos** (~20 min) · Cubre: RF-3.1, RF-3.2 · Depende de: T-06, T-09
  Implementar `summarize` (plan §3.3): nombre, racha y hecho hoy, en orden de creación.
  **Hecho cuando:** con tres hábitos creados en un orden dado, el resumen sale en ese mismo orden con la racha y el estado de cada uno.

- [ ] **T-12 · Regla de arquitectura del núcleo** (~20 min) · Cubre: constitución 1 y 3 · Depende de: T-11
  Escribir `test_static.py` con la regla: `core.py` no contiene `print`, `input` ni `argparse`, y no importa `storage` ni `cli` (plan §7).
  **Hecho cuando:** el test pasa con el núcleo actual y falla si se le agrega temporalmente un `print` (se comprueba a mano y se deshace).

## Fase 2 · Datos (`storage.py`)

- [ ] **T-13 · Ruta y lectura sin archivo** (~20 min) · Cubre: RF-4.1, RF-4.2 · Depende de: T-02
  Implementar `default_path` (`<carpeta personal>/.habits/habits.json`) y `load` para el caso de archivo inexistente (plan §4).
  **Hecho cuando:** los tests pasan con: la ruta termina en `.habits/habits.json` dentro de la carpeta personal; `load` de un archivo inexistente devuelve una lista vacía y no crea el archivo ni la carpeta.

- [ ] **T-14 · Leer: archivo vacío, ilegible y forma del JSON** (~30 min) · Cubre: RF-4.3, CL-12 · Depende de: T-13
  Implementar en `load` los motivos `EMPTY`, `NOT_READABLE`, `INVALID_JSON` y `UNKNOWN_FORMAT` (versión distinta de 1, raíz con campos de más o de menos, `habits` que no es lista).
  **Hecho cuando:** cada caso lanza `DataUnreadable` con su motivo y el archivo queda byte a byte igual.

- [ ] **T-15 · Leer: validar nombres y fechas** (~30 min) · Cubre: RF-4.3, RF-3.9, CL-12, CL-17 · Depende de: T-14, T-04, T-05
  Validar con las reglas de `core`: nombre inválido o no limpio, nombres equivalentes repetidos, fechas con forma distinta de `AAAA-MM-DD`, fechas inexistentes (30 de febrero) y fechas repetidas → motivo `INCOHERENT`. Aceptar marcas desordenadas y fechas futuras.
  **Hecho cuando:** los tests pasan con cada caso inválido → `INCOHERENT`; un archivo válido con marcas desordenadas y una fecha futura se carga completo.

- [ ] **T-16 · Guardar: formato e ida y vuelta** (~25 min) · Cubre: RF-4.1 · Depende de: T-15
  Implementar `save` sin atomicidad todavía (plan §4, pasos 1 y 2): crea la carpeta si falta y escribe JSON UTF-8 legible, con marcas ascendentes y sin escapar tildes.
  **Hecho cuando:** guardar y volver a leer devuelve hábitos idénticos (con tildes, ñ, emoji y marcas futuras); el archivo tiene `"version": 1`, se ve «Inglés» sin escapes y las marcas salen ordenadas.

- [ ] **T-17 · Guardar de forma atómica** (~30 min) · Cubre: RF-4.4, RNF-4, CL-19, CL-20 · Depende de: T-16
  Reescribir `save` con archivo temporal único en la misma carpeta, `flush` y `fsync`, y reemplazo atómico; ante cualquier error, borrar el temporal y lanzar `SaveFailed` (plan §4).
  **Hecho cuando:** con fallos simulados (sin permiso, carpeta imposible de crear, error al reemplazar) se lanza `SaveFailed`, el archivo anterior queda intacto y no queda ningún temporal; con una interrupción simulada entre escribir y reemplazar, el archivo real sigue válido.

- [ ] **T-18 · Guardados simultáneos** (~20 min) · Cubre: RNF-8, CL-22 · Depende de: T-17
  Probar con varios hilos guardando a la vez en la misma ruta.
  **Hecho cuando:** después de 20 guardados simultáneos, el archivo se lee sin error y contiene exactamente una de las versiones guardadas (aceptando que algún guardado falle con `SaveFailed`).

## Fase 3 · Mensajes y CLI

- [ ] **T-19 · Mensajes en español** (~30 min) · Cubre: RF-3.7, RNF-5 · Depende de: T-01
  Escribir en `messages.py` todos los textos de plan §5.2 a §5.5 como funciones o plantillas, incluida la concordancia de la racha («0 días», «1 día», «N días»).
  **Hecho cuando:** los tests renderizan cada mensaje con datos de ejemplo y coinciden letra por letra con el plan; la racha sale «0 días», «1 día» y «5 días».

- [ ] **T-20 · `main`: ayuda y uso incorrecto** (~30 min) · Cubre: RF-5.1, RF-5.2, RNF-6, CL-21 · Depende de: T-19
  Implementar `cli.main` con la ruta de datos y la función de fecha inyectables y la interpretación manual de argumentos (plan §5.1, §5.2): sin argumentos, `ayuda`, `-h` y `--help` muestran la ayuda; comando desconocido, argumentos de más o de menos dan el mensaje de uso.
  **Hecho cuando:** los tests pasan con: las cuatro formas de pedir ayuda → ayuda por stdout y código 0; `listar x`, `ayuda x`, `crear` sin nombre, `marcar` sin nombre y `bailar` → mensaje de uso por stderr y código 1.

- [ ] **T-21 · Comando `listar`** (~25 min) · Cubre: RF-3.1, RF-3.2, RF-3.6, RF-3.7, RF-4.2 · Depende de: T-11, T-16, T-20
  Implementar `listar` con el formato de plan §5.3 y el mensaje de lista vacía.
  **Hecho cuando:** con datos preparados en una carpeta temporal y una fecha fija, la salida coincide con el ejemplo del plan, en orden de creación; sin archivo, muestra el mensaje de lista vacía con código 0 y no crea ningún archivo.

- [ ] **T-22 · Comando `crear`** (~30 min) · Cubre: RF-1.1 a RF-1.8, CL-18 · Depende de: T-06, T-17, T-20
  Implementar `crear` (varios argumentos se unen con un espacio) con su confirmación y la traducción de cada error de nombre a su mensaje y código 1 (plan §5.2, §5.5).
  **Hecho cuando:** los tests pasan con: éxito con mensaje y archivo guardado; `crear Leer 20 páginas` igual que con comillas; `crear ""`, 61 caracteres, duplicado, salto de línea, «-x», «!!!» y el hábito 101 dan su mensaje exacto por stderr, código 1 y archivo sin cambios.

- [ ] **T-23 · Comando `marcar`** (~30 min) · Cubre: RF-2.1 a RF-2.5, CL-1, CL-11 · Depende de: T-08, T-17, T-20
  Implementar `marcar` con confirmación y racha, el aviso «ya estaba marcado hoy» sin guardar, y el error de hábito inexistente con y sin hábitos.
  **Hecho cuando:** los tests pasan con: marcar muestra «¡Hecho!» y la racha; marcar otra vez muestra el aviso, código 0 y el archivo sin modificar (misma fecha de modificación); inexistente con hábitos lista los disponibles y sin hábitos sugiere crear, ambos con código 1.

- [ ] **T-24 · Errores de datos en todos los comandos** (~25 min) · Cubre: RF-4.3, RF-4.4, CL-12, CL-19 · Depende de: T-22, T-23, T-21
  Traducir `DataUnreadable` y `SaveFailed` a su mensaje con motivo en español y código 2 en `crear`, `marcar` y `listar`.
  **Hecho cuando:** con un archivo dañado, cada uno de los tres comandos muestra el mensaje con la ruta y el motivo, termina con código 2 y deja el archivo intacto; con un guardado que falla, `crear` y `marcar` dicen que no se guardó y terminan con código 2.

- [ ] **T-25 · Fecha de hoy: una sola lectura** (~20 min) · Cubre: RF-2.1, RF-3.5, CL-5, CL-6, CL-23 · Depende de: T-23, T-21
  Probar que cada comando llama a la función de fecha exactamente una vez y que dos ejecuciones con fechas distintas usan cada una la suya.
  **Hecho cuando:** los tests pasan con: contador de llamadas igual a 1 por comando; marcar el día 5 y listar el día 6 muestra la racha mantenida y «pendiente hoy»; listar el día 7 la muestra en 0.

- [ ] **T-26 · Punto de entrada** (~20 min) · Cubre: RNF-9, CL-20 · Depende de: T-24
  Implementar `__main__.py`: llama a `main`, reconfigura la salida para sustituir lo que la terminal no pueda mostrar y, ante Ctrl+C, imprime «Interrumpido.» por stderr y sale con código 1 (plan §5.6).
  **Hecho cuando:** los tests pasan con: una salida de codificación limitada y un nombre con emoji no lanza excepción; una interrupción simulada produce el mensaje y el código 1; y `python -m habits listar` funciona a mano.

## Fase 4 · Calidad y cierre

- [ ] **T-27 · Rendimiento** (~20 min) · Cubre: RNF-2 · Depende de: T-21
  Crear datos con 100 hábitos y 5 años de marcas cada uno y medir `listar` completo.
  **Hecho cuando:** el test confirma menos de 1 segundo.

- [ ] **T-28 · Reglas de arquitectura completas** (~25 min) · Cubre: RNF-1, RNF-3, RNF-5, constitución 1, 3 y 6 · Depende de: T-26
  Completar `test_static.py`: ningún módulo importa red ni `input`; ningún módulo salvo `messages.py` contiene texto para el usuario; solo se importa biblioteca estándar.
  **Hecho cuando:** los tres tests pasan y fallan si se agrega a propósito un `import socket`, un `input(` o una frase en español fuera de `messages.py` (se comprueba a mano y se deshace).

- [ ] **T-29 · Trazabilidad** (~30 min) · Cubre: RNF-7, criterio de finalización 1 · Depende de: T-28
  Escribir el test que lee `spec.md` y exige que cada `RF-x.y`, `RNF-n` y `CL-n` aparezca en el docstring de algún test; añadir los tests o las citas que falten.
  **Hecho cuando:** el test de trazabilidad pasa sin identificadores sin cubrir y falla si se borra a propósito una cita (se comprueba y se deshace).

- [ ] **T-30 · Cierre y verificación final** (~30 min) · Cubre: criterios de finalización 2 a 7 · Depende de: T-27, T-29
  Ejecutar la suite con la versión mínima del lenguaje (3.12) y con la instalada; revisar juntos todos los textos de `messages.py`; actualizar `AGENTS.md` para mencionar `habits/messages.py` y la forma final de los comandos; pedir a una persona nueva que cree un hábito, lo marque y vea su racha leyendo solo la ayuda.
  **Hecho cuando:** `pytest -q` pasa en ambas versiones (si no hay 3.12 disponible, queda anotado), `AGENTS.md` está actualizado, la persona nueva completó el recorrido sin ayuda, y cada criterio de finalización 1 a 7 de la spec está marcado con su evidencia.

## Matriz de cobertura de los requisitos funcionales

| RF | Tareas | RF | Tareas |
|---|---|---|---|
| RF-1.1 | T-06, T-22 | RF-3.1 | T-11, T-21 |
| RF-1.2 | T-03 | RF-3.2 | T-11, T-21 |
| RF-1.3 | T-03, T-22 | RF-3.3 | T-09, T-10 |
| RF-1.4 | T-02, T-04, T-22 | RF-3.4 | T-09 |
| RF-1.5 | T-05, T-06, T-22 | RF-3.5 | T-09, T-25 |
| RF-1.6 | T-04 | RF-3.6 | T-21 |
| RF-1.7 | T-03, T-04, T-22 | RF-3.7 | T-19, T-21 |
| RF-1.8 | T-02, T-06, T-22 | RF-3.8 | T-10 |
| RF-2.1 | T-08, T-23, T-25 | RF-3.9 | T-10, T-15 |
| RF-2.2 | T-05, T-07 | RF-4.1 | T-13, T-16 |
| RF-2.3 | T-08, T-23 | RF-4.2 | T-13, T-21 |
| RF-2.4 | T-07, T-23 | RF-4.3 | T-14, T-15, T-24 |
| RF-2.5 | T-08 | RF-4.4 | T-17, T-24 |
| RF-5.1 | T-20 | RF-5.2 | T-20 |

Total: 30 tareas, todas de entre 20 y 30 minutos (unas 12 horas en total). Los 27 criterios RF-x.y tienen al menos una tarea.
