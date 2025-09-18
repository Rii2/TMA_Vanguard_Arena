// File: scripts/build-game-data.mjs | Purpose: Generates browser-friendly data bundle from module sources. | Notes: Keeps window.TMA_DATA in sync with test modules.
import { writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = dirname(__dirname);

const [animalsMod, configMod] = await Promise.all([
  import(pathToFileURL(join(root, 'animals.mjs')).href),
  import(pathToFileURL(join(root, 'config.mjs')).href)
]);

const { animals } = animalsMod;
const { CONFIG } = configMod;

const banner = '// File: game-data.js | Purpose: Provides browser globals for animals and config without ES modules. | Notes: Auto-generated via scripts/build-game-data.mjs.\n';
const body = 'window.TMA_DATA = ' + JSON.stringify({ animals, CONFIG }, null, 2) + ';\n';
await writeFile(join(root, 'game-data.js'), banner + body, 'utf8');
console.log('game-data.js rebuilt');
