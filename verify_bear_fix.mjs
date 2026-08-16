// Verify the youtube-embed fix BOTH DIRECTIONS.
//   1. the bear cams now return Brooks Falls, not a birthday hamster
//   2. a single-candidate cam is unchanged (no regression on working cams)
// The local MCP loads its code at session start, so this calls dist/ directly.
import { takeSnapshot } from './dist/snapshot.js';
import { CAMERAS } from './dist/cameras.js';
import { writeFileSync } from 'fs';

const want = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['brooks-falls-bears', 'brooks-falls-low', 'mba-sea-otter'];


for (const id of want) {
  const cam = CAMERAS.find((c) => c.id === id);
  if (!cam) { console.log(`${id}: NOT A CAMERA`); continue; }
  const t0 = Date.now();
  try {
    const b64 = await takeSnapshot(cam);
    const buf = Buffer.from(b64, 'base64');
    const f = `verify_${id}.jpg`;
    writeFileSync(f, buf);
    console.log(`${id.padEnd(20)} OK    ${(buf.length / 1024).toFixed(0)} KB  ` +
                `${((Date.now() - t0) / 1000).toFixed(1)}s  -> ${f}`);
  } catch (e) {
    // A refusal is a PASS if the page really has no live stream. Print it whole.
    console.log(`${id.padEnd(20)} REFUSED/ERR  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    console.log(`   ${String(e.message ?? e).slice(0, 300)}`);
  }
}

console.log('\nOpen the verify_*.jpg files and LOOK. The tool cannot tell you');
console.log('what is in them: its description comes from metadata, not pixels.');
