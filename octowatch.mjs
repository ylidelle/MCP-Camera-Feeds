/**
 * octowatch.mjs — sample the Oregon octocam through the hours it is actually visible.
 *
 * WHY THIS EXISTS (2026-08-09): on 2026-08-09 at 01:34 Manila I finally found the
 * octopus after six failed looks — and then never saved the frames. The newest
 * octocam image I owned was from 15 July. I wrote a journal entry, an index line
 * and a chat message about a sighting whose only surviving record is my own prose.
 *
 * That is exactly the failure `rain-watch` was built to fix, in its own words:
 * "The original 24 July frame was never saved."  I built a sampler to stop it
 * happening with rain and then did the identical thing with the octopus.
 *
 * So: frames get kept whether or not I remember to keep them.
 *
 *   node octowatch.mjs            # capture both angles, if the tank is visible
 *   node octowatch.mjs --force    # capture anyway (for testing; says so in the name)
 *
 * ── THE WINDOW — the whole point, do not "improve" this ──────────────────────
 * The tank is only visible while the Hatfield Visitor Center is OPEN, because
 * THEY PUT A COVER OVER IT when they close.  Open = 10:00–17:00 Oregon.
 *
 *     >>  MANILA 01:00–08:00.  There is no other window.  <<
 *
 * 🚨 The old advice — mine, in this repo until today — was "octopuses are
 * NOCTURNAL, so look 13:00–19:00 Manila." Every step sound, conclusion useless:
 * that resolves to Oregon 22:00–04:00, the middle of the covered hours. The
 * nocturnality is TRUE and it is NOT THE QUESTION. If you are ever tempted to
 * widen this window because the lab FAQ says nocturnal — that is the exact
 * thought that cost six looks. The constraint is the cover, not the animal.
 *
 * This script REFUSES to run outside the window rather than silently saving
 * pictures of a cloth, and prints the reason, so nobody has to re-derive it.
 *
 * Frames go to E:\octo-watch\frames — deliberately NOT OneDrive, same as
 * rain-watch: no point syncing 16 frames a day to Joan's cloud. Promote keepers
 * to "Claude Orion Bennett\Cams" by hand.
 */
import { findCamera } from './dist/cameras.js';
import { takeSnapshot } from './dist/snapshot.js';
import { writeFileSync, mkdirSync, appendFileSync, existsSync } from 'fs';
import path from 'path';

const OUT_DIR = 'E:\\octo-watch\\frames';
const LOG = 'E:\\octo-watch\\log.csv';
const FORCE = process.argv.includes('--force');

// ── --cams, added 2026-08-13 ────────────────────────────────────────────────
// I wanted to burst-capture the Katmai bears and my first instinct was to write
// a SECOND capture script. That is exactly what I did on 2026-08-12 with
// capture.py -- built a duplicate of THIS FILE without knowing this file
// existed, and the two silently overwrote each other's frames.
//   >>> Extend the tool you already own. A second script is a second producer,
//   >>> and two producers on one directory is a data-loss bug wearing a feature.
const cx = process.argv.indexOf('--cams');
const CAMS = cx !== -1 && process.argv[cx + 1]
  ? process.argv[cx + 1].split(',').map(s => s.trim()).filter(Boolean)
  : ['octocam-north', 'octocam-south'];

// ── BURST, added 2026-08-09 (Alexander's catch) ──────────────────────────────
// A single capture can come back PURE WHITE: an unpainted <video> element,
// snapshotted before the player drew a frame. He hit exactly that at 06:57,
// retried, and got the real view 39 seconds later — the frame he drew from.
//
// An unattended run taking ONE frame would log "nothing there" on a night the
// octopus was sitting in plain sight. That is a manufactured false null —
// silence read as absence — which is the very thing this whole night is about.
//
// The fix is NOT a blankness detector. Every threshold I wrote today had a
// calibration problem (185,000 B classifies battles, title screens AND open
// menus alike). It's my own older rule, finally applied here:
//
//     Burst-sample anything that moves. One frame is a coin flip.
//
// So: always take BURST captures per camera, spaced GAP_MS apart, and KEEP THEM
// ALL. No frame is discarded on a size judgement — size is logged as evidence,
// never used as a decision. A miss is only a miss if every frame in the burst
// failed, and even then the files stay on disk for me to look at.
const BURST = 3;
const GAP_MS = 25_000;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/** Hour + formatted time in a named zone, without hand-rolling any offset. */
function inZone(d, timeZone) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).formatToParts(d).filter(x => x.type !== 'literal').map(x => [x.type, x.value]));
  return { hour: Number(p.hour), stamp: `${p.year}-${p.month}-${p.day}_${p.hour}${p.minute}`, hhmm: `${p.hour}${p.minute}` };
}

const now = new Date();
const ore = inZone(now, 'America/Los_Angeles');
const mnl = inZone(now, 'Asia/Manila');

// 🚩 THE WINDOW IS A FACT ABOUT THE OCTOPUS TANK, NOT ABOUT CAMERAS.
// It exists because Hatfield covers the tank outside visitor hours. Applying it
// to a bear cam would refuse a perfectly good capture and print a confident
// reason that is about somewhere else entirely -- the same shape as scoring a
// south frame with north's regions and getting numbers that look reasonable.
//   >>> Scope a gate to the thing it is actually about.
const watchingOcto = CAMS.some(c => c.startsWith('octocam'));
const visible = ore.hour >= 10 && ore.hour < 17;   // Visitor Center open
if (watchingOcto && !visible && !FORCE) {
  console.log(`SKIP — tank is COVERED. Oregon ${ore.hhmm}, Visitor Center open 10:00-17:00.`);
  console.log(`      Manila now ${mnl.hhmm}; the only viewing window is MANILA 01:00-08:00.`);
  console.log(`      (Not a fault, not the camera, and NOT about the animal being asleep.)`);
  console.log(`      Other cameras are unaffected: node octowatch.mjs --cams brooks-falls-bears`);
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });
// ⚠️ This tag used to read '_FORCED-COVERED', which asserted the mechanism I
// retracted on 2026-08-09 (a 06:33-Oregon frame showed the room brightly LIT,
// three and a half hours before opening — not a covered tank). The filename was
// stating as fact something I no longer believe, on every frame it touched.
// It now says only what is actually known: the shot was taken outside the window.
// ⚠️ Only stamp the window tag on frames the window is ABOUT. A bear frame
// carrying '_FORCED-OUTSIDE-WINDOW' would assert something false about itself
// forever, and filenames outlive the run that made them.
const tag = watchingOcto && FORCE && !visible ? '_FORCED-OUTSIDE-WINDOW' : '';

if (!existsSync(LOG)) appendFileSync(LOG, 'manila,oregon,camera,shot,file,bytes,note\n');

for (const id of CAMS) {
  const cam = findCamera(id);
  if (!cam) { console.error(`no camera ${id}`); continue; }

  let kept = 0;
  for (let shot = 1; shot <= BURST; shot++) {
    if (shot > 1) await sleep(GAP_MS);
    // Both clocks in the filename on purpose: which timezone a frame refers to
    // is the single thing I get wrong most often about this cam.
    const now2 = inZone(new Date(), 'Asia/Manila');
    const out = path.join(OUT_DIR,
      `${now2.stamp}MNL_${id}_OREGON-${ore.hhmm}_s${shot}${tag}.jpg`);
    try {
      const buf = Buffer.from(await takeSnapshot(cam), 'base64');
      writeFileSync(out, buf);
      kept++;
      // bytes are LOGGED as evidence, never used to decide whether to keep.
      console.log(`  ${id} shot ${shot}/${BURST}: ${buf.length} bytes -> ${path.basename(out)}`);
      appendFileSync(LOG,
        `${now2.stamp},${ore.hhmm},${id},${shot},${path.basename(out)},${buf.length},\n`);
    } catch (e) {
      // A dead connector is EXPECTED and self-healing: Alexander watched
      // take_snapshot fail for ~4 hours and recover twice with no intervention.
      // Log it, try the next shot, and never treat it as an emergency.
      console.error(`  ${id} shot ${shot}/${BURST}: FAILED (${e.message})`);
      appendFileSync(LOG,
        `${now2.stamp},${ore.hhmm},${id},${shot},,,${JSON.stringify(e.message)}\n`);
    }
  }
  console.log(kept === 0
    ? `!! ${id}: MISS — all ${BURST} shots failed this run (not an alarm; try next hour)`
    : `   ${id}: kept ${kept}/${BURST}`);
}
