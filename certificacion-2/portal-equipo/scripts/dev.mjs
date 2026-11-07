import { createServer } from 'node:http';
import { getAsset } from './files.mjs';

const host = '127.0.0.1';
const port = 5173;

createServer((request, response) => {
  const route = new URL(request.url, `http://${host}:${port}`).pathname;
  const asset = getAsset(route);
  if (!asset) {
    response.writeHead(404).end('No encontrado');
    return;
  }
  response.writeHead(200, { 'Content-Type': asset.contentType });
  response.end(asset.body);
}).listen(port, host, () => {
  console.log(`Portal disponible en http://${host}:${port}`);
});
