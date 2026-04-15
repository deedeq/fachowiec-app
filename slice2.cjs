const fs = require('fs');
const content = fs.readFileSync('src_backup/data/fachowcy.js', 'utf8');

// Instead of regex, split on '\n  },\n  {\n    id:' to count items safely
// Let's just find the closing brace of the 60th item.
// Let's use a simpler approach: evaluating it.
// Wait, we can't eval easily because of ES imports/exports.
// Strip 'export const fachowcy =' and evaluate:
let jsonLike = content.match(/export const fachowcy = (\[[\s\S]*?\])\s*export const kategorie/)[1];
// jsonLike is not valid JSON (no quotes around keys).
// But we have Node.js! Let's write a small script that loads it as an ES module and overwrites the file.
