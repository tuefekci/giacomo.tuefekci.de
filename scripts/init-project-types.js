import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = resolve(fileURLToPath(import.meta.url), '..', '..');
const src = resolve(dir, 'src', 'data', 'resume.json');

const resume = JSON.parse(readFileSync(src, 'utf8'));
const projects = resume.projects || [];

const types = { 'open-source': [], 'customer-work': [], personal: [], research: [] };

const knownEmployers = [
  'planetmutlu gmbh & co. kg',
  'Image Advertising H. G. GmbH & Co. KG',
];

const tscEntity = 'Tufekci Software Development & Consulting';

for (const p of projects) {
  let type;

  if (p.url && p.url.includes('github.com')) {
    type = 'open-source';
  } else if (p.category === 'AI & Machine Learning') {
    type = 'research';
  } else if (knownEmployers.includes(p.entity)) {
    type = 'customer-work';
  } else if (p.entity === tscEntity && !p.url) {
    type = 'personal';
  } else {
    type = 'personal';
  }

  p.type = type;
  types[type].push(p.name);
}

writeFileSync(src, JSON.stringify(resume, null, 2) + '\n', 'utf8');

console.log(`\n✓ ${projects.length} projects classified in src/data/resume.json\n`);

for (const [t, names] of Object.entries(types)) {
  console.log(`  ${t} (${names.length})`);
  for (const n of names) {
    console.log(`    - ${n}`);
  }
  console.log();
}
