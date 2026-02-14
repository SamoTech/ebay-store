#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const markersRegex = /^(<<<<<<<|=======|>>>>>>>)/;

function getTrackedFiles() {
  const output = execSync('git ls-files', { encoding: 'utf8' });
  return output.split('\n').filter(Boolean);
}

function findConflictsInFile(path) {
  try {
    if (!existsSync(path)) {
      return [];
    }

    const content = readFileSync(path, 'utf8');
    const lines = content.split('\n');
    const hits = [];
    for (let i = 0; i < lines.length; i += 1) {
      if (markersRegex.test(lines[i])) {
        hits.push(i + 1);
      }
    }
    return hits;
  } catch {
    return [];
  }
}

const files = getTrackedFiles();
const found = [];

for (const file of files) {
  if (file.startsWith('node_modules/')) continue;
  const hits = findConflictsInFile(file);
  if (hits.length > 0) {
    found.push({ file, lines: hits });
  }
}

if (found.length === 0) {
  console.log('No merge conflict markers found.');
  process.exit(0);
}

console.error('Merge conflict markers detected:');
for (const item of found) {
  console.error(`- ${item.file}: ${item.lines.join(', ')}`);
}
process.exit(1);
