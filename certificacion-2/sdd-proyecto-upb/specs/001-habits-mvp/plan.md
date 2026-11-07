# Plan 001 — MVP de habits-cli

Cómo se construye lo que dice [spec.md](spec.md), respetando [la constitución](../../docs/constitution.md). Este documento no contiene código: solo estructura, contratos y pseudocódigo.

Convención: cada parte marca entre `[ ]` los requisitos que cubre. «RNF» y «CL» se citan cuando aplican.

## 1. Estructura de módulos

```text
habits/
  __init__.py     (vacío)
  __main__.py     punto de entrada: llama a la CLI y devuelve su código de salida
  core.py         NÚCLEO. Reglas de negocio puras: sin E/S, sin print/input/argparse, sin leer el reloj
  storage.py      DATOS. Lee y escribe el archivo JSON; valida lo leído
  cli.py          CLI. Lee el reloj una vez, interpreta los argumentos, llama a core y storage, imprime, devuelve el código
  messages.py     TODOS los textos en español que ve la persona (confirmaciones, errores, ayuda)
tests/
  test_core.py    reglas de negocio, sin archivos
  test_storage.py archivo, validación y escritura atómica
  test_cli.py     comandos completos, salidas y códigos
  test_static.py  reglas de arquitectura y trazabilidad (ver sección 7)
```

**Dependencias permitidas (solo hacia abajo):** `cli → core, storage, messages`; `storage → core`; `core → nada del proyecto`. `core.py` solo importa la biblioteca estándar de cálculo (fechas, texto Unicode, dataclasses). *[constitución 1 y 3, RNF-3, RNF-5, RNF-7]*

**Responsabilidades por etiqueta de la spec:** las reglas *[núcleo]* viven en `core.py`; las *[datos]*, en `storage.py`; las *[CLI]*, en `cli.py` y `messages.py`.

## 2. Modelo de datos

### 2.1 En memoria (núcleo) *[RF-1, RF-2, RF-3]*

- **Hábito** (inmutable): `name` (texto limpio y válido) y `marks` (conjunto de fechas de calendario, sin hora ni zona).
- La lista de hábitos es una secuencia inmutable cuyo orden es el de creación *[RF-3.2]*. No se guarda fecha de creación: la spec no la usa.
- Cada operación del núcleo recibe la lista actual y devuelve una lista nueva; nunca modifica la recibida.

### 2.2 En disco (JSON) *[RF-4.1, RF-4.3]*

Un solo archivo de texto UTF-8, en la carpeta personal de quien ejecuta el programa: `<carpeta personal>/.habits/habits.json`. Cada cuenta del sistema tiene así sus propios hábitos *[RF-4.1]*.

Ejemplo:

```json
{
  "version": 1,
  "habits": [
    { "name": "Inglés", "marks": ["2026-10-19", "2026-10-20", "2026-10-21"] },
    { "name": "Leer 20 páginas", "marks": [] }
  ]
}
```

Reglas del formato (si alguna falla al leer, el archivo es **incoherente** *[RF-4.3]*):

| Campo | Regla |
|---|---|
| Archivo | Existe y tiene contenido; si no existe, es primera ejecución *[RF-4.2]*; si existe y está vacío, es dañado *[RF-4.3, CL-12]* |
| Raíz | Objeto con exactamente `version` y `habits` |
| `version` | El entero `1`; cualquier otro valor es «formato desconocido» |
| `habits` | Lista (puede estar vacía); el orden de la lista es el orden de creación |
| `name` | Texto que ya cumple las reglas de nombre del núcleo (sección 3.2) y ya está limpio |
| Nombres | Sin dos nombres equivalentes en la misma lista |
| `marks` | Lista de textos con forma estricta `AAAA-MM-DD` que sean fechas reales; sin repetidas. El orden no importa: al guardar se escriben ascendentes |
| Fechas futuras | Son válidas y se conservan *[RF-3.9, CL-17]* |

El archivo se escribe con `indent` legible y sin escapar las tildes, para que una persona pueda abrirlo.

**Ruta única:** no hay variable de entorno ni opción para cambiarla; las pruebas inyectan la ruta como parámetro de las funciones. *(Decisión D-9.)*

## 3. Núcleo (`core.py`)

### 3.1 Constantes *[RF-1.4, RF-1.8]*

`MAX_NAME_LENGTH = 60` y `MAX_HABITS = 100`.

### 3.2 Reglas de nombre *[RF-1.2 a RF-1.7]*

Pseudocódigo de la validación (`clean_name`), en este orden:

```text
clean_name(raw):
  1. si raw contiene algún carácter de categoría Unicode Cc (control: salto de línea,
     tabulador…), Zl o Zp (separadores de línea/párrafo)      -> InvalidName(CONTROL)        [RF-1.7]
  2. texto = raw normalizado a NFC
  3. texto = unir con un solo espacio las partes de dividir texto por espacios
     (quita espacios al inicio y al final y reduce los repetidos)                          [RF-1.2]
  4. si texto está vacío                                    -> InvalidName(EMPTY)          [RF-1.3]
  5. si texto empieza con «-»                               -> InvalidName(DASH)           [RF-1.7]
  6. si ningún carácter de texto es letra o número          -> InvalidName(NO_ALNUM)       [RF-1.7]
  7. si cantidad de puntos de código de texto > 60          -> InvalidName(TOO_LONG)       [RF-1.4]
  8. devolver texto  (conserva mayúsculas, tildes, signos y emojis)                        [RF-1.2, RF-1.6]
```

Equivalencia (`equivalence_key`) *[RF-1.5, RF-2.2, CL-7]*:

```text
equivalence_key(nombre_limpio):
  1. t = casefold(nombre_limpio)            # no distingue mayúsculas
  2. t = descomponer t en NFD
  3. recorrer t: descartar la marca U+0301 (acento) si el carácter anterior es a, e, i, o, u;
                 descartar la marca U+0308 (diéresis) si el carácter anterior es u;
                 conservar todo lo demás (por ejemplo, la marca de la ñ, que es U+0303)
  4. recomponer en NFC y devolver
```

Dos nombres son equivalentes si tienen la misma clave. «Inglés», «ingles» y « INGLÉS » dan la misma clave; «año» y «ano», no.

### 3.3 Operaciones

| Operación | Entrada → salida | Errores (sin texto, solo tipo y datos) | Cubre |
|---|---|---|---|
| `create_habit` | lista, nombre escrito → lista nueva con el hábito al final y sin marcas | `InvalidName(motivo)`; `DuplicateHabit(nombre_existente)`; `LimitReached` | RF-1.1 a RF-1.8 |
| `find_habit` | lista, nombre escrito → el hábito cuya clave coincide | `HabitNotFound` | RF-2.2, RF-2.4 |
| `mark_done` | lista, nombre escrito, hoy → lista nueva, nombre del hábito y si ya estaba marcado hoy | `HabitNotFound` | RF-2.1 a RF-2.5 |
| `streak` | marcas, hoy → entero ≥ 0 | — | RF-3.3 a RF-3.5, RF-3.8, RF-3.9 |
| `summarize` | lista, hoy → lista de (nombre, racha, hecho hoy) en orden de creación | — | RF-3.1, RF-3.2 |

Orden de comprobación en `create_habit`: primero nombre válido, luego duplicado, luego límite de 100 *[RF-1.8]*. Si ya hay 100 hábitos y el nombre está repetido, informa el duplicado.

`find_habit` es **más tolerante** que `create_habit`: solo une los espacios del nombre escrito y calcula su clave, sin aplicar las reglas de validez. Un nombre inválido simplemente no existe → `HabitNotFound` *[RF-2.4]*. Efecto: `marcar "Inglés\n"` funciona aunque `crear "Inglés\n"` se rechace.

`mark_done`: si la fecha de hoy ya está en las marcas, devuelve la misma lista y `ya_marcado = verdadero` *[RF-2.3]*; si no, agrega solo la fecha de hoy y nunca otra *[RF-2.5]*.

### 3.4 Algoritmo de la racha *[RF-3.3, RF-3.4, RF-3.5, RF-3.8, RF-3.9]*

`hoy` es un valor de fecha de calendario recibido como parámetro; el núcleo nunca lee el reloj. Restar un día a una fecha de calendario produce siempre la fecha anterior, sea cual sea el mes, el año, el 29 de febrero o el cambio de horario *[RF-3.8, CL-16]*.

```text
streak(marks, hoy):
  validas = { d en marks tal que d <= hoy }          # ignora marcas futuras           [RF-3.9, CL-17]
  si hoy está en validas:        fin = hoy                                               # [RF-3.3]
  si no, si (hoy - 1 día) en validas:  fin = hoy - 1 día                                 # [RF-3.5]
  si no: devolver 0                                                                      # [RF-3.4, CL-3, CL-13]

  racha = 0
  d = fin
  mientras d esté en validas:
      racha = racha + 1
      si d es la fecha mínima representable: detener     # evita salir del rango de fechas
      d = d - 1 día
  devolver racha                                         # tramo MÁS reciente              [RF-3.3, CL-4]
```

Costo: una búsqueda en conjunto por día de racha; con 5 años de marcas es del orden de miles de operaciones por hábito *[RNF-2]*.

`done_today = (hoy está en validas)` *[RF-3.1, RF-3.5]*.

## 4. Datos (`storage.py`)

| Operación | Comportamiento | Cubre |
|---|---|---|
| `default_path` | Devuelve `<carpeta personal>/.habits/habits.json` | RF-4.1 |
| `load(ruta)` | Si el archivo no existe → lista vacía sin crear nada. Si existe: lo lee como UTF-8 y aplica la tabla de reglas de 2.2; todo incumplimiento → `DataUnreadable(motivo)` con motivo `EMPTY`, `NOT_READABLE` (error del sistema al abrir/leer), `INVALID_JSON`, `UNKNOWN_FORMAT` o `INCOHERENT`. Usa `clean_name`/`equivalence_key` del núcleo para validar nombres y repetidos | RF-4.2, RF-4.3 |
| `save(ruta, lista)` | Escritura «todo o nada» (abajo). Cualquier error del sistema → `SaveFailed(motivo)` | RF-4.4, RNF-4, RNF-8 |

Escritura atómica *[RF-4.4, RNF-4, RNF-8, CL-19, CL-20, CL-22]*:

```text
save(ruta, habitos):
  1. crear la carpeta de la ruta si falta (si no se puede -> SaveFailed)
  2. serializar a texto JSON con marcas ordenadas ascendentemente
  3. crear un archivo temporal ÚNICO en la misma carpeta (nombre distinto en cada ejecución)
  4. escribir el texto, vaciar buffers y forzar a disco (flush + fsync)
  5. reemplazar el archivo real por el temporal con una operación atómica (os.replace)
  6. si algo falla en 1-5: borrar el temporal (si existe) y lanzar SaveFailed; el archivo real queda como estaba
```

Si el proceso se interrumpe entre 3 y 5, el archivo real sigue intacto (queda a lo sumo un temporal suelto sin efecto). Con dos ejecuciones simultáneas, cada una usa su propio temporal y gana la última en reemplazar; el archivo nunca queda mezclado *[RNF-8]*.

## 5. Contrato de la CLI (`cli.py`, `messages.py`)

### 5.1 Invocación

`python -m habits <comando> [argumentos]`. La interpretación de argumentos es **manual** (sin `argparse`, decisión D-2). `cli.main` recibe la lista de argumentos y, para poder probarlo, la ruta de datos y una función que da la fecha de hoy; por defecto usa `default_path()` y la fecha local de la computadora. **Lee la fecha una sola vez, al empezar** *[CL-6]*.

### 5.2 Comandos

| Argumentos | Acción | Stdout (éxito) |
|---|---|---|
| (ninguno), `ayuda`, `-h`, `--help` | Muestra la ayuda | Texto de ayuda *[RF-5.1]* |
| `crear <nombre…>` | Crea el hábito | `Hábito creado: «{nombre}».` *[RF-1.1]* |
| `marcar <nombre…>` | Marca hoy | `¡Hecho! «{nombre}»: racha de {racha}.` *[RF-2.1]*; si ya estaba: `«{nombre}» ya estaba marcado hoy. Racha: {racha}.` *[RF-2.3]* |
| `listar` | Lista con racha | Ver 5.3 *[RF-3.1, RF-3.6]* |

- En `crear` y `marcar`, **todos los argumentos restantes se unen con un espacio** como nombre; así `crear Leer 20 páginas` y `crear "Leer 20 páginas"` son lo mismo. `crear ""` entrega un nombre vacío (error RF-1.3), mientras que `crear` sin nada entrega un uso incorrecto *[RF-5.2]*.
- `{racha}` se escribe «0 días», «1 día», «N días» *[RF-3.7]*.
- `listar` y `ayuda` no aceptan argumentos de más.
- `listar` y los errores **no escriben** el archivo; `marcar` con «ya marcado» tampoco *[RF-2.3]*.

### 5.3 Formato de `listar` *[RF-3.1, RF-3.2, RF-3.6, RF-3.7]*

Con hábitos, en orden de creación:

```text
Tus hábitos:
  Inglés — racha: 3 días — hecho hoy
  Algoritmos — racha: 0 días — pendiente hoy
  Leer 20 páginas — racha: 1 día — pendiente hoy
```

Sin hábitos (éxito, código 0):

```text
Aún no tienes hábitos. Crea el primero con: python -m habits crear "Inglés"
```

### 5.4 Ayuda *[RF-5.1]*

```text
habits — registra hábitos de estudio y calcula tu racha

Comandos:
  crear <nombre>    Crea un hábito nuevo
  marcar <nombre>   Marca un hábito como hecho hoy
  listar            Muestra tus hábitos con su racha
  ayuda             Muestra esta ayuda

Ejemplo:
  python -m habits crear "Inglés"
```

### 5.5 Errores (salen por stderr) y códigos *[RNF-6]*

| Código | Tipo | Cuándo | Mensaje |
|---|---|---|---|
| `0` | Éxito | Éxito, «ya marcado», ayuda, lista vacía | — |
| `1` | Uso/validación | Nombre vacío *[RF-1.3]* | `Error: el nombre no puede estar vacío.` |
| `1` | | Más de 60 caracteres *[RF-1.4]* | `Error: el nombre supera el máximo de 60 caracteres.` |
| `1` | | Duplicado *[RF-1.5]* | `Error: ya existe el hábito «{existente}».` |
| `1` | | Caracteres de control *[RF-1.7]* | `Error: el nombre no puede tener saltos de línea, tabuladores ni otros caracteres de control.` |
| `1` | | Empieza con «-» *[RF-1.7]* | `Error: el nombre no puede empezar con «-».` |
| `1` | | Sin letras ni números *[RF-1.7]* | `Error: el nombre debe tener al menos una letra o un número.` |
| `1` | | Ya hay 100 *[RF-1.8]* | `Error: ya tienes 100 hábitos, el máximo permitido.` |
| `1` | | No existe, con hábitos *[RF-2.4]* | `Error: no existe el hábito «{nombre}». Hábitos disponibles: {lista separada por comas}.` |
| `1` | | No existe, sin hábitos *[RF-2.4]* | `Error: no existe el hábito «{nombre}». Aún no tienes hábitos; crea uno con: python -m habits crear "Inglés"` |
| `1` | | Comando desconocido o argumentos que faltan o sobran *[RF-5.2]* | `Error de uso: {motivo}.` seguido de los comandos de la ayuda |
| `2` | Datos | Datos dañados *[RF-4.3]* | `Error: no se pueden leer tus datos en {ruta} ({motivo}). No se modificó nada.` con motivo en español: «archivo vacío», «no se puede leer», «JSON no válido», «formato desconocido», «datos incoherentes» |
| `2` | | No se pudo guardar *[RF-4.4]* | `Error: no se pudo guardar el cambio ({motivo}). Tus datos anteriores no se modificaron.` |

`messages.py` es el **único** lugar con textos; `core.py` y `storage.py` solo lanzan errores con tipo y datos, y `cli.py` los traduce a mensajes y códigos. Ninguna otra parte contiene frases en español *[RNF-5, constitución 6]*.

### 5.6 Flujos *[RF-1, RF-2, RF-3, RF-4, RF-5]*

```text
main(args, ruta, hoy_fn):
  hoy = hoy_fn()                                  # una sola lectura                     [CL-6]
  interpretar args  -> si no cumple el contrato de 5.2: uso incorrecto (código 1)        [RF-5.2]
  ayuda -> imprimir ayuda (código 0)                                                      [RF-5.1]

  crear:   habitos = load(ruta) ; nueva = create_habit(habitos, nombre)
           save(ruta, nueva) ; confirmar (0)                                              [RF-1.x]
  marcar:  habitos = load(ruta) ; (nueva, nombre, ya) = mark_done(habitos, nombre, hoy)
           si no ya: save(ruta, nueva) ;  confirmar con streak(...) (0)                   [RF-2.x]
  listar:  habitos = load(ruta) ; imprimir summarize(habitos, hoy) o mensaje vacío (0)    [RF-3.x]

  traducir cada error a mensaje + código: tipos del núcleo -> 1 ; tipos de datos -> 2
```

`__main__.py`: reconfigura la salida para que un carácter que la terminal no puede mostrar se sustituya en vez de provocar una excepción *[RNF-9]*; si se interrumpe con Ctrl+C, imprime `Interrumpido.` por stderr y termina con código `1` (la spec no define este código; ver sección 8).

## 6. Decisiones técnicas

| # | Decisión | Por qué | Alternativa descartada |
|---|---|---|---|
| D-1 | Un solo archivo JSON local *[constitución 5]* | Es lo que fija la constitución; legible y editable a mano, sin dependencias | SQLite: más potente pero innecesario para ≤ 100 hábitos y contrario a la constitución |
| D-2 | Interpretar los argumentos a mano, sin `argparse` | Con 3 comandos es poco código y permite cumplir RNF-5 (todo en español) y RNF-6 (códigos 0/1/2). `argparse` imprime sus mensajes en inglés y termina con código 2 para errores de uso | `argparse` con mensajes y códigos sobrescritos: más configuración que el problema que resuelve |
| D-3 | Fechas de calendario (sin hora ni zona) *[RF-3.8]* | «Día» es una fecha, no 24 horas; así el cambio de horario no afecta | Marcas de tiempo (timestamps): obligan a decidir zona y cortes de medianoche |
| D-4 | No guardar la racha; calcularla al leer *[RF-3.3–3.9]* | Una racha guardada se vuelve falsa al pasar un día sin ejecutar el programa | Guardar contador y última fecha: más simple de leer, pero desactualizado y frágil ante cambios de reloj |
| D-5 | Escritura con archivo temporal + reemplazo atómico *[RNF-4, RNF-8]* | Es la forma estándar de que una interrupción no corrompa | Escribir directamente sobre el archivo: más corto, pero una interrupción deja datos a medias |
| D-6 | Núcleo con funciones puras y datos inmutables *[constitución 3]* | Se prueba con fechas fijas y sin archivos; no hay efectos escondidos | Una clase «gestor» con estado mutable: obliga a preparar estado en cada prueba |
| D-7 | El núcleo lanza errores con tipo y datos; el texto lo pone `cli`/`messages` *[RNF-5]* | Mantiene el núcleo sin idioma ni interfaz | El núcleo devuelve frases: mezcla reglas y presentación |
| D-8 | `hoy` es un parámetro; `cli` lo lee una vez *[CL-6]* | Prueba determinista y la medianoche no cambia el día a mitad de un comando | El núcleo llama al reloj: pruebas dependientes de la fecha real |
| D-9 | Una sola ruta: `<carpeta personal>/.habits/habits.json` | Funciona igual en Windows, macOS y Linux sin dependencias | Directorios por sistema (`APPDATA`, `XDG`): más correcto por plataforma pero con ramas o una librería externa (prohibida por la constitución 1) |
| D-10 | Campo `version` en el JSON *[RF-4.3]* | Permite reconocer un formato desconocido sin adivinar | Sin versión: no se distingue un archivo futuro de uno dañado |
| D-11 | No guardar fecha de creación | La spec no la usa; menos datos que validar | Guardarla «por si acaso»: viola «ningún código sin spec» *[constitución 2]* |
| D-12 | Normalizar con casefold + NFD y quitar solo acento sobre vocales y diéresis sobre u *[RF-1.5]* | Cumple exactamente la regla de la spec y deja la ñ distinta | `unidecode` o quitar todas las marcas: ñ = n, contrario a la spec, o dependencia externa |
| D-13 | Todo texto en `messages.py` | Un lugar para revisar la redacción *[RNF-5]* | Textos junto al código que los usa: dispersos |
| D-14 | `find_habit` tolerante (solo une espacios) | Un nombre inválido no puede existir, y el error correcto es «no existe» *[RF-2.4]* | Validar el nombre al marcar: produciría errores de nombre inválido en un comando de marcar |

## 7. Estrategia de tests

Herramienta: `pytest` (`pytest -q` debe pasar antes de cada commit) *[constitución 4]*. Los tests no tocan la carpeta personal real: usan una carpeta temporal y la ruta inyectada. La fecha de hoy es siempre un valor fijo inyectado.

**Trazabilidad *[RNF-7]*:** la primera línea (docstring) de cada test cita los identificadores que verifica, por ejemplo `"""RF-1.3, CL-8"""`. Un test (`test_static.py`) lee `spec.md` y falla si algún `RF-x.y`, `RNF-n` o `CL-n` no aparece en ningún test; así se cumple el criterio de finalización 1.

| Archivo | Qué prueba | Cubre |
|---|---|---|
| `test_core.py` | Nombres válidos e inválidos (vacío, solo espacios, 60 y 61 caracteres, control, «-» inicial, sin letra/número, emoji, espacios múltiples); equivalencia («Inglés»/«ingles»/« INGLÉS », «año»≠«ano»); duplicado, límite de 100 y su orden de comprobación; marcar nuevo, repetido y de hábito inexistente; que solo se agregue hoy; racha: sin marcas, hoy, solo ayer, hueco, tramo más reciente, anterior a ayer, racha de más de un año, cruce 31-dic→1-ene, 29 de febrero, fechas de cambio de horario, marcas futuras ignoradas y conservadas; orden de `summarize`; que las listas recibidas no se modifiquen | RF-1.1–1.8, RF-2.1–2.5, RF-3.1–3.5, RF-3.8, RF-3.9, CL-1 a CL-4, CL-7 a CL-10, CL-13 a CL-18 |
| `test_storage.py` | Archivo inexistente (lista vacía y sin crear nada); vacío; JSON roto; versión desconocida; raíz con campos extra o faltantes; nombre inválido o repetido por equivalencia; fecha con forma incorrecta, inexistente (30 de febrero) o repetida; marcas desordenadas se aceptan y se guardan ordenadas; ida y vuelta guardar→leer idéntica, con tildes y emoji; nunca sobrescribe datos dañados; falla de guardado simulada (sin permiso, carpeta imposible) deja el archivo anterior intacto y no deja temporales; interrupción simulada entre escribir y reemplazar; varios hilos guardando a la vez dejan un archivo válido | RF-4.1–4.4, RNF-4, RNF-8, CL-11, CL-12, CL-19, CL-20, CL-22 |
| `test_cli.py` | Cada comando de principio a fin con ruta temporal y fecha inyectada: salidas exactas de 5.2–5.5, stdout frente a stderr y códigos 0/1/2; `crear` con varios argumentos y con `""`; ayuda con cada forma; comando desconocido y argumentos de más o de menos; lista vacía; «ya marcado» sin escribir el archivo; hábito inexistente con y sin otros hábitos; datos dañados en cada comando; día que cambia entre dos comandos (CL-5) y función de fecha invocada exactamente una vez por comando (CL-6); cambio de zona simulado = solo cambia la fecha entregada (CL-23); cada mensaje impreso es el de `messages.py` | RF-1 (salidas), RF-2 (salidas), RF-3.6, RF-3.7, RF-4.2–4.4, RF-5.1, RF-5.2, RNF-5, RNF-6, RNF-9, CL-5, CL-6, CL-21, CL-23 |
| `test_static.py` | `core.py` no contiene `print`, `input`, `argparse` ni importa `storage`/`cli`; ningún módulo importa red; `input` no se usa en ninguna parte; solo `messages.py` contiene texto de usuario; trazabilidad (arriba) | Constitución 1 y 3, RNF-1, RNF-3, RNF-5, RNF-7 |
| `test_cli.py` (rendimiento) | 100 hábitos con 5 años de marcas cada uno: `listar` completo en menos de 1 segundo | RNF-2 |

Criterios de finalización 2, 3 y 4 de la spec se verifican fuera de los tests: ejecutar la suite con la versión mínima del lenguaje y con la instalada, leer la ayuda con una persona nueva y revisar juntos los textos de `messages.py`.

## 8. Notas, límites y ajustes pendientes en otros documentos

1. **Emojis compuestos** *[RF-1.4, CL-10]*: el límite de 60 cuenta puntos de código tras NFC. Un emoji simple cuenta 1; uno compuesto (por ejemplo, una familia) puede contar varios. Contar «símbolos visibles» exactos exige segmentar grafemas, que la biblioteca estándar no hace. Si importa, conviene precisar la spec («60 puntos de código»).
2. **Ctrl+C** *[CL-20]*: la spec solo exige que los datos queden íntegros. El plan agrega el mensaje `Interrumpido.` y el código `1`, que RNF-6 no enumera.
3. **`AGENTS.md`** describe tres archivos; este plan agrega `habits/messages.py`. Hay que reflejarlo en el mismo commit que lo cree *[constitución 2]*.
4. **Errores del sistema al leer** (permiso denegado) se tratan como «no se puede leer» con código 2 *[RF-4.3]*.
5. **No hay captura general de errores inesperados**: un fallo no previsto muestra su traza, porque ocultarlo esconde errores de programación.

## 9. Matriz de cobertura de los requisitos funcionales

| RF | Dónde se resuelve | Tests |
|---|---|---|
| RF-1.1 | 3.3 `create_habit`; 5.2, 5.6 | `test_core`, `test_cli` |
| RF-1.2 | 3.2 pasos 2-3 y 8 | `test_core` |
| RF-1.3 | 3.2 paso 4; 5.5 | `test_core`, `test_cli` |
| RF-1.4 | 3.1, 3.2 paso 7; 5.5 | `test_core`, `test_cli` |
| RF-1.5 | 3.2 `equivalence_key`; 3.3; 5.5 | `test_core`, `test_cli` |
| RF-1.6 | 3.2 paso 8 | `test_core` |
| RF-1.7 | 3.2 pasos 1, 5 y 6; 5.5 | `test_core`, `test_cli` |
| RF-1.8 | 3.1, 3.3; 5.5 | `test_core`, `test_cli` |
| RF-2.1 | 3.3 `mark_done`; 5.2, 5.6 | `test_core`, `test_cli` |
| RF-2.2 | 3.2 `equivalence_key`; 3.3 `find_habit` | `test_core` |
| RF-2.3 | 3.3 `mark_done`; 5.2 (sin guardar) | `test_core`, `test_cli` |
| RF-2.4 | 3.3 `find_habit`; 5.5 | `test_core`, `test_cli` |
| RF-2.5 | 3.3 `mark_done` (solo agrega hoy) | `test_core` |
| RF-3.1 | 3.3 `summarize`; 5.3 | `test_core`, `test_cli` |
| RF-3.2 | 2.1; 3.3 `summarize` | `test_core` |
| RF-3.3 | 3.4 | `test_core` |
| RF-3.4 | 3.4 | `test_core` |
| RF-3.5 | 3.4 | `test_core` |
| RF-3.6 | 5.3 | `test_cli` |
| RF-3.7 | 5.2 (`{racha}`), `messages.py` | `test_cli` |
| RF-3.8 | 3.4 (fechas de calendario); D-3 | `test_core` |
| RF-3.9 | 3.4 (`validas`); 2.2 (se conservan) | `test_core`, `test_storage` |
| RF-4.1 | 2.2; 4 `default_path` | `test_storage`, `test_cli` |
| RF-4.2 | 4 `load` (archivo inexistente) | `test_storage`, `test_cli` |
| RF-4.3 | 2.2 reglas; 4 `load`; 5.5 (código 2) | `test_storage`, `test_cli` |
| RF-4.4 | 4 `save`; 5.5 (código 2) | `test_storage`, `test_cli` |
| RF-5.1 | 5.2, 5.4 | `test_cli` |
| RF-5.2 | 5.2, 5.5 | `test_cli` |
