const fs = require('fs');

const data = fs.readFileSync('src/data/fachowcy.js', 'utf8');

// The structural markers we are looking for:
const startOf61 = data.indexOf('id: 61,');
if (startOf61 === -1) {
  console.error("Could not find id: 61. Exiting.");
  process.exit(1);
}

// Find the last "}," before id: 61
const before61 = data.substring(0, startOf61);
const lastClosingBrace = before61.lastIndexOf('},');

if (lastClosingBrace === -1) {
    console.error("Could not find closing brace for id 60.");
    process.exit(1);
}

// We want to keep everything up to this closing brace
const newFachowcyPart = data.substring(0, lastClosingBrace + 2) + '\n]\n\n';

// Now we need the remaining exports at the end of the file
const kategorieStart = data.indexOf('export const kategorie =');
if (kategorieStart === -1) {
    console.error("Could not find export const kategorie.");
    process.exit(1);
}

const restOfFile = data.substring(kategorieStart);

const newContent = newFachowcyPart + restOfFile;

fs.writeFileSync('src/data/fachowcy.js', newContent, 'utf8');
console.log('Successfully written new fachowcy.js with 60 items.');
