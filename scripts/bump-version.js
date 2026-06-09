// Liest die aktuelle Version aus version.json, erhoet die Patch-Zahl, schreibt zurueck
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const versionFile = join(__dirname, '..', 'src', 'version.json');

let current = { version: '0.0.0' };
try {
  current = JSON.parse(readFileSync(versionFile, 'utf-8'));
} catch {
  // Datei existiert noch nicht, starten mit 0.0.0
}

const [major, minor, patch] = current.version.split('.').map(Number);
const next = `${major}.${minor}.${patch + 1}`;

writeFileSync(versionFile, JSON.stringify({ version: next }, null, 2) + '\n');
console.log(`Version: ${current.version} -> ${next}`);
