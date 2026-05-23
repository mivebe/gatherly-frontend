import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assets = resolve(here, '..', 'assets');

const targets = [
  { svg: 'icon.svg', png: 'icon.png', size: 1024 },
  { svg: 'adaptive-icon.svg', png: 'adaptive-icon.png', size: 1024 },
  { svg: 'splash-icon.svg', png: 'splash-icon.png', size: 1284 },
  { svg: 'icon.svg', png: 'favicon.png', size: 64 },
];

for (const { svg, png, size } of targets) {
  const input = await readFile(resolve(assets, svg));
  await sharp(input, { density: 512 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(resolve(assets, png));
  console.log(`  ${svg} -> ${png} (${size}x${size})`);
}
