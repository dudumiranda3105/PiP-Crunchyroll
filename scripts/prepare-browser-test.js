import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import '../build.js';

const root = new URL('../', import.meta.url);
const template = readFileSync(new URL('tests/player-check.js', root), 'utf8');
const source = readFileSync(new URL('content.js', root), 'utf8');
const output = new URL('.playwright-cli/', root);
mkdirSync(output, { recursive: true });
writeFileSync(new URL('player-check.js', output),
  template.replace('__EXTENSION_SOURCE__', () => JSON.stringify(source)));
console.log('Teste preparado em .playwright-cli/player-check.js');
