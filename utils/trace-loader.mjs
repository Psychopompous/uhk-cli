import * as tsNodeLoader from 'ts-node/esm';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const shouldCollectBetweenRuns = true;
const OUT = './Ω-runtime-deps.txt';

const seen = new Set(); // key format: "container::pkg"

if (shouldCollectBetweenRuns) {
	// Load existing deps so we don't re-append
	if (fs.existsSync(OUT)) {
	  for (const line of fs.readFileSync(OUT, 'utf8').split('\n')) {
	    if (line.trim()) seen.add(line.trim());
	  }
	}
} else {
	// start fresh
	fs.writeFileSync(OUT, '');
}

function recordAll(url) {
    fs.appendFileSync(OUT, url + '\n');
}


function record(url) {
    if (!url.startsWith('file://')) return;

    const fsPath = fileURLToPath(url);

    const nm = `${path.sep}node_modules${path.sep}`;
    const idx = fsPath.lastIndexOf(nm);
    if (idx === -1) return;

    // container = folder just before node_modules
    const before = fsPath.slice(0, idx);
    const container = path.basename(before);

    // package name after node_modules
    const after = fsPath.slice(idx + nm.length);
    const parts = after.split(path.sep);

    const pkg = parts[0].startsWith('@')
      ? `${parts[0]}/${parts[1]}`
      : parts[0];

    const key = `${container}::${pkg}`;

    if (seen.has(key)) return;
    seen.add(key);

    fs.appendFileSync(OUT, key + '\n');
}

export async function resolve(specifier, context, defaultResolve) {
  return tsNodeLoader.resolve
    ? tsNodeLoader.resolve(specifier, context, defaultResolve)
    : defaultResolve(specifier, context, defaultResolve);
}

export async function load(url, context, defaultLoad) {
  // recordAll(url);
  record(url);

  return tsNodeLoader.load
    ? tsNodeLoader.load(url, context, defaultLoad)
    : defaultLoad(url, context, defaultLoad);
}
