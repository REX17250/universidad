# mcp-nasa

Servidor MCP que expone las APIs públicas de la NASA como herramientas para Claude.

## Setup

```bash
npm install
```

Por defecto usa `DEMO_KEY` (límite bajo: 30 peticiones/hora). Para uso real, consigue una
clave gratuita e instantánea en https://api.nasa.gov y expórtala antes de correr el servidor:

```bash
export NASA_API_KEY=tu_clave_aqui
```

## Tools

| Tool | Descripción |
|---|---|
| `get-apod` | Foto astronómica del día (por fecha, o N aleatorias) |
| `get-neo-feed` | Asteroides con acercamiento cercano a la Tierra en un rango de fechas |
| `get-neo-details` | Detalle orbital de un asteroide por su id de la NASA JPL |
| `search-nasa-media` | Búsqueda en la biblioteca de imágenes/videos de la NASA |
| `get-earth-images` | Imágenes del disco completo de la Tierra (satélite DSCOVR / cámara EPIC) |

## Probar localmente

```bash
npm run inspect
```

Abre el MCP Inspector en el navegador para llamar cada tool manualmente.

## Usar con Claude Code

El `.mcp.json` en la raíz de este proyecto ya está configurado. Abre Claude Code con esta
carpeta como raíz del workspace y acepta la conexión al servidor `mcp-nasa` cuando te lo pida.
