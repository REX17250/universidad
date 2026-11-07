# Portal del equipo

Aplicación React mínima para presentar el estado del espacio de trabajo.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://127.0.0.1:5173`. Para generar la versión distribuible, ejecutar `npm run build`.

El proyecto usa React y un servidor Node sencillo. No requiere Vite ni binarios nativos de Rollup.

`npm run inventory` genera `docs/project-inventory.md` con los archivos y las dependencias de este portal. Solo lee esta carpeta, nunca busca archivos `.env` y no se ejecuta al arrancar ni al compilar.
