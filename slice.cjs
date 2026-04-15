const fs = require('fs');
const content = fs.readFileSync('src/data/fachowcy.js', 'utf8');

// The file has export const fachowcy = [ ... ]
// Let's parse it safely without running eval. Actually we can just run eval since it's safe local code.
// No, it has ES modules syntax: export const...
// We can use regex to find all `{ id: ..., ... },` structures.
const arrMatches = content.match(/{\s*id:\s*\d+[\s\S]*?},/g);
const first60 = arrMatches.slice(0, 60).join('\n  ');

let newContent = content.replace(/export const fachowcy = \[[\s\S]*?\]/, 'export const fachowcy = [\n  ' + first60 + '\n]');

fs.writeFileSync('src/data/fachowcy.js', newContent, 'utf8');
console.log('Successfully sliced fachowcy.js to 60 items.');
