// Inventario del propio portal: lista sus archivos y dependencias.
// Solo lee dentro de la carpeta del proyecto y nunca abre ni busca archivos .env.
// Se ejecuta a mano con `npm run inventory`; no forma parte del arranque ni de la compilación.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { projectRoot } from './files.mjs';

const IGNORED = new Set(['.git', 'node_modules', 'dist', 'docs']);
const output = resolve(projectRoot, 'docs/project-inventory.md');

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (IGNORED.has(entry.name) || entry.name.startsWith('.env')) return [];
    const path = resolve(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [relative(projectRoot, path).replaceAll('\\', '/')];
  });
}

const pkg = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'));
const dependencies = Object.entries(pkg.dependencies ?? {});
const files = listFiles(projectRoot).sort();

const lines = [
  `# Inventario de ${pkg.name}`,
  '',
  '## Dependencias',
  '',
  '| Paquete | Versión |',
  '|---|---|',
  ...dependencies.map(([name, version]) => `| ${name} | ${version} |`),
  '',
  `## Archivos (${files.length})`,
  '',
  ...files.map((file) => `- \`${file}\``),
  '',
];

mkdirSync(resolve(projectRoot, 'docs'), { recursive: true });
writeFileSync(output, lines.join('\n'));
console.log(`Inventario creado en ${relative(projectRoot, output)}`);
