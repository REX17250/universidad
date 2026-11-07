import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getAsset, getRoutes, projectRoot } from './files.mjs';

for (const route of getRoutes()) {
  const output = resolve(projectRoot, 'dist', route === '/' ? 'index.html' : route.slice(1));
  mkdirSync(resolve(output, '..'), { recursive: true });
  writeFileSync(output, getAsset(route).body);
}

console.log('Versión distribuible creada en dist/');
