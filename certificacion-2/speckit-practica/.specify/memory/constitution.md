<!--
Informe de Impacto de Sincronización
- Cambio de versión: (plantilla sin versión) → 1.0.0
- Principios definidos (primera ratificación):
  - [PRINCIPLE_1_NAME] → I. Simplicidad Primero (YAGNI)
  - [PRINCIPLE_2_NAME] → II. Pruebas Obligatorias (NO NEGOCIABLE)
  - [PRINCIPLE_3_NAME] → III. Código Legible
  - [PRINCIPLE_4_NAME] → IV. Validación de Entradas
  - [PRINCIPLE_5_NAME] → V. Accesible y Responsivo
- Secciones añadidas:
  - Restricciones Adicionales (idioma español, contexto académico UPB)
  - Flujo de Desarrollo y Puertas de Calidad
- Secciones eliminadas: ninguna
- Plantillas dependientes: leen la constitución en tiempo de ejecución; no se modificaron.
- TODO diferidos: ninguno
-->

# Constitución del Proyecto Académico UPB

## Principios Fundamentales

### I. Simplicidad Primero (YAGNI)

- Cada funcionalidad DEBE implementarse con la solución mínima que cumpla los requisitos
  especificados.
- NO se DEBEN agregar capas, abstracciones, dependencias ni configuraciones para necesidades
  futuras hipotéticas ("You Aren't Gonna Need It").
- Toda complejidad adicional (nuevo patrón, librería, servicio o nivel de indirección) DEBE
  justificarse por escrito en el plan, indicando qué alternativa más simple se descartó y por qué.

**Justificación**: un proyecto académico tiene tiempo y equipo limitados; el código simple es
más fácil de entregar, evaluar, mantener y explicar.

### II. Pruebas Obligatorias (NO NEGOCIABLE)

- Toda funcionalidad DEBE contar con pruebas automatizadas antes de considerarse terminada.
- Las pruebas DEBEN cubrir el flujo principal y, como mínimo, un caso de error o de borde por
  funcionalidad.
- Las pruebas DEBEN ejecutarse con un único comando documentado y pasar en su totalidad antes de
  integrar cambios a la rama principal.
- Una tarea cuyas pruebas fallan o no existen NO PUEDE marcarse como completada.

**Justificación**: las pruebas automatizadas demuestran objetivamente que el sistema cumple lo
especificado y evitan regresiones al avanzar en el proyecto.

### III. Código Legible

- Los nombres de variables, funciones, clases y archivos DEBEN describir claramente su propósito;
  se prohíben abreviaturas ambiguas y nombres genéricos (`data`, `tmp`, `x`) fuera de ámbitos
  triviales.
- Las funciones DEBEN ser pequeñas y tener una sola responsabilidad; una función que no cabe en
  una pantalla (~40 líneas) DEBE dividirse o justificarse.
- Se DEBE documentar con comentarios únicamente lo no obvio: decisiones de diseño, reglas de
  negocio y soluciones alternativas; no se comenta lo que el código ya expresa.
- El proyecto DEBE seguir un estilo de código consistente, preferentemente verificado con un
  formateador o linter automático.

**Justificación**: el código será leído por docentes, compañeros y evaluadores; la legibilidad
reduce errores y facilita la revisión.

### IV. Validación de Entradas

- Todo dato proveniente del usuario (formularios, parámetros de URL, cuerpos de peticiones,
  archivos) DEBE validarse antes de procesarse o almacenarse.
- La validación DEBE verificar tipo, formato, longitud y rango, y rechazar los datos inválidos
  con un mensaje de error claro en español.
- Si existe un backend, la validación DEBE realizarse en el servidor aunque también exista en el
  cliente; la validación del cliente es solo una ayuda de usabilidad.
- Las reglas de validación DEBEN tener pruebas automatizadas que incluyan entradas inválidas.

**Justificación**: validar las entradas previene errores, datos corruptos y vulnerabilidades de
seguridad comunes (por ejemplo, inyecciones).

### V. Accesible y Responsivo

- La interfaz DEBE ser usable en pantallas de celular (desde 360 px de ancho) y de computadora,
  sin desplazamiento horizontal ni contenido cortado.
- Se DEBE usar HTML semántico, etiquetas asociadas a cada campo de formulario y texto alternativo
  en las imágenes con significado.
- Todas las acciones DEBEN poder realizarse con teclado y el foco DEBE ser visible.
- El contraste de color entre texto y fondo DEBE cumplir como mínimo el nivel AA de WCAG 2.1.

**Justificación**: los usuarios acceden desde distintos dispositivos y capacidades; una interfaz
accesible y responsiva amplía el alcance y la calidad del producto.

## Restricciones Adicionales

- Todo el contenido de la documentación del proyecto (constitución, especificaciones, planes,
  tareas, README y mensajes visibles para el usuario) DEBE estar redactado en español.
- Los identificadores en el código PUEDEN estar en inglés o español, pero el criterio elegido
  DEBE aplicarse de forma consistente en todo el proyecto.
- El proyecto se desarrolla en el marco académico de la UPB; DEBE respetar las normas de
  integridad académica de la universidad, incluyendo la atribución de código o recursos de
  terceros.

## Flujo de Desarrollo y Puertas de Calidad

- Cada funcionalidad sigue el flujo Spec Kit: especificación → plan → tareas → implementación.
- Antes de dar por terminada una funcionalidad se DEBE verificar:
  1. Que todas las pruebas automatizadas pasan (Principio II).
  2. Que las entradas de usuario están validadas y probadas (Principio IV).
  3. Que la interfaz se revisó en vista de celular y de computadora (Principio V).
  4. Que no se introdujo complejidad sin justificar (Principio I).
- Toda revisión de código DEBE comprobar el cumplimiento de esta constitución y señalar
  cualquier incumplimiento antes de aprobar los cambios.

## Gobernanza

- Esta constitución prevalece sobre cualquier otra práctica o convención del proyecto.
- Las enmiendas DEBEN documentarse en este archivo, explicar su motivo y ser aprobadas por el
  equipo del proyecto (y el docente, cuando corresponda).
- El versionado sigue SemVer:
  - MAYOR: eliminación o redefinición incompatible de principios o reglas de gobernanza.
  - MENOR: nuevo principio o sección, o ampliación material de las directrices.
  - PARCHE: aclaraciones, redacción o correcciones tipográficas sin cambio semántico.
- El cumplimiento se revisa en cada plan (sección de verificación de la constitución) y en cada
  revisión de código; las desviaciones DEBEN justificarse explícitamente.

**Versión**: 1.0.0 | **Ratificada**: 2026-10-26 | **Última enmienda**: 2026-10-26
