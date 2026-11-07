# Constitución del proyecto

1. **Stack mínimo:** Python 3.12+ y solo la biblioteca estándar; `pytest` únicamente para tests; toda otra dependencia necesita aprobación escrita.
2. **La spec manda:** ningún código existe sin una spec en `specs/`; si el comportamiento cambia, la spec se actualiza en el mismo commit.
3. **Lógica separada de la interfaz:** el cálculo de rachas y las reglas viven en el núcleo (`habits/core.py`) sin `print`, `input` ni `argparse`; la CLI (`habits/cli.py`) solo traduce; la spec marca cada regla como [núcleo], [CLI] o [datos].
4. **Todo cambio de lógica lleva test:** un test por criterio (RF-x.y) y por caso límite de la spec, citando su identificador; `pytest -q` debe pasar antes de cada commit.
5. **Persistencia simple y segura:** un solo archivo JSON local (`habits/storage.py`); su formato se documenta en el plan de la spec y no cambia sin actualizarlo antes; una escritura fallida o interrumpida nunca deja los datos corruptos.
6. **Idioma:** identificadores y comentarios en inglés; mensajes al usuario en español, centralizados en un solo lugar.
