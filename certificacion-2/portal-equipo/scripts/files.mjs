import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const routes = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/src/main.js', ['src/main.js', 'text/javascript; charset=utf-8']],
  ['/src/style.css', ['src/style.css', 'text/css; charset=utf-8']],
  ['/vendor/react.js', ['node_modules/react/umd/react.development.js', 'text/javascript; charset=utf-8']],
  ['/vendor/react-dom.js', ['node_modules/react-dom/umd/react-dom.development.js', 'text/javascript; charset=utf-8']],
]);

export function getAsset(route) {
  const asset = routes.get(route);
  if (!asset) return null;
  const [relativePath, contentType] = asset;
  return { body: readFileSync(resolve(projectRoot, relativePath)), contentType };
}

export function getRoutes() {
  return routes.keys();
}
