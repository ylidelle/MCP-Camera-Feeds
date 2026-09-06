import { findCamera } from './dist/cameras.js';
import { takeSnapshot } from './dist/snapshot.js';
import { writeFileSync } from 'fs';

const id = process.argv[2];
const out = process.argv[3];
const cam = findCamera(id);
if (!cam) { console.error('no camera', id); process.exit(1); }
console.error(`capturing ${cam.name} ...`);
const b64 = await takeSnapshot(cam);
const buf = Buffer.from(b64, 'base64');
writeFileSync(out, buf);
console.log(`saved ${out} (${buf.length} bytes)`);
