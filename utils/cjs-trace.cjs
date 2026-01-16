const Module = require('module');
const path = require('path');

const fs = require('fs');
const OUT = './Ω-runtime-deps.txt';

// preload existing entries
const seen = new Set();
if (fs.existsSync(OUT)) {
  for (const line of fs.readFileSync(OUT, 'utf8').split('\n')) {
    if (line.trim()) seen.add(line.trim());
  }
}

const originalLoad = Module._load;

Module._load = function (request, parent, isMain) {
  try {
    const resolved = Module._resolveFilename(request, parent);

    const nm = `${path.sep}node_modules${path.sep}`;
    const idx = resolved.lastIndexOf(nm);
    if (idx !== -1) {
      const before = resolved.slice(0, idx);
      const container = path.basename(before);

      const after = resolved.slice(idx + nm.length);
      const parts = after.split(path.sep);

      const pkg = parts[0].startsWith('@')
        ? `${parts[0]}/${parts[1]}`
        : parts[0];

      const key = `${container}::${pkg}`;
      if (!seen.has(key)) {
        seen.add(key);
        fs.appendFileSync(OUT, key + '\n');
      }
    }
  } catch {
    // ignore resolution failures
  }

  return originalLoad.apply(this, arguments);
};
