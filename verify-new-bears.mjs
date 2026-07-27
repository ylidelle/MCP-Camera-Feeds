// Ad-hoc verification: grab one real frame from each newly added Katmai cam.
// (New cams aren't callable via the already-running local MCP until next session,
//  so we call the snapshot engine directly. Delete this file after use if you like.)
import { CAMERAS } from './dist/cameras.js';
import { takeSnapshot } from './dist/snapshot.js';
import { writeFileSync } from 'node:fs';

const NEW_IDS = ['brooks-falls-low', 'brooks-lower-river', 'brooks-river-watch', 'brooks-underwater'];
const OUT_DIR = process.env.OUT_DIR ?? '.';

for (const id of NEW_IDS) {
  const cam = CAMERAS.find((c) => c.id === id);
  if (!cam) { console.log(`${id}: NOT FOUND in camera list`); continue; }
  try {
    const b64 = await takeSnapshot(cam);
    const buf = Buffer.from(b64, 'base64');
    const path = `${OUT_DIR}/${id}.jpg`;
    writeFileSync(path, buf);
    console.log(`${id}: OK — ${(buf.length / 1024).toFixed(0)} KB -> ${path}`);
  } catch (e) {
    console.log(`${id}: FAILED — ${e.message ?? e}`);
  }
}
