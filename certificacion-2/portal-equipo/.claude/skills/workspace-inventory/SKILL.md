---
name: workspace-inventory
description: Genera un inventario del propio portal-equipo (sus archivos y dependencias) en docs/project-inventory.md. Úsalo solo cuando el usuario lo pida explícitamente. No lee nada fuera de esta carpeta ni abre o busca archivos .env.
disable-model-invocation: true
---

# Inventario del portal

Cuando el usuario lo pida, ejecuta desde la raíz de `portal-equipo`:

```bash
npm run inventory
```

El script `scripts/inventory.mjs` escribe `docs/project-inventory.md` con:
- las dependencias de `package.json` y sus versiones;
- la lista de archivos del proyecto, sin `.git`, `node_modules`, `dist`, `docs` ni archivos `.env*`.

## Límites (no negociables)

- Solo se lee la carpeta de este proyecto. **Nunca** se recorren proyectos vecinos ni la carpeta padre: pertenecen a otros equipos.
- **Nunca** se busca, abre ni informa la existencia o el contenido de archivos `.env` ni de otros secretos.
- No se ejecuta de forma automática: ni al arrancar (`npm run dev`), ni al compilar (`npm run build`), ni en paralelo con subagentes.

Al terminar, di al usuario qué archivo se creó.
