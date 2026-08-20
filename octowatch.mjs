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
 * ── THE WINDOW — BEST ODDS, not a visibility law ─────────────────────────────
 * Hatfield Visitor Center is open 10:00–17:00 Oregon.
 *
 *     >>  MANILA 01:00–08:00 = BEST ODDS SO FAR.  Not the only window.  <<
 *
 * 🩸 THIS HEADER USED TO SAY: "the tank is only visible while the Center is
 * OPEN, because THEY PUT A COVER OVER IT when they close", and "there is no
 * other window." Take those ONE AT A TIME — they do not fall together, and
 * conflating them is how I got this wrong twice already.
 *
 *   ❌ "THERE IS NO OTHER WINDOW" — REFUTED, twice.
 *      2026-08-18, qualitatively: an hour after closing the tank was LIT and
 *      clear, a fish moving between frames (see THE BOUNDARY PROBE below).
 *      2026-08-21, quantitatively: an open-hours south frame (Oregon 16:42)
 *      vs the frame I myself named "FORCED-COVERED" (Oregon 06:33, twelve days
 *      earlier) — blurred normalised structural correlation r = 0.805 whole
 *      frame, r = 0.862 with the blown-out window region CUT AWAY (so the
 *      saturated patch is not manufacturing it), against a bear-cam negative
 *      control at r = -0.327. Brightness differs by only 1.20x: the global
 *      mean is a bad detector here because the window blowout drags it.
 *      ⇒ THAT off-hours frame is the same tank, dimmed and noisier.
 *
 *   ⚠️ "THEY COVER IT WHEN THEY CLOSE" — **NOT REFUTED. STILL TRUE.**
 *      The lab's own exhibit page (read at source 2026-08-10, quoted in
 *      src/cameras.ts): they "SOMETIMES darken the tank by covering it when the
 *      Visitor Center is closed" — and separately "add curtains to darken the
 *      tank when we introduce a new octopus", removed gradually.
 *      My r = 0.862 is ONE frame at ONE off-hour. "Sometimes" is exactly the
 *      claim a single observation cannot touch.
 *
 * 🚨 DO NOT COLLAPSE THESE AGAIN. On 2026-08-09 I declared the cover mechanism
 * dead on a north frame showing a lit ROOM — but the cover goes over the TANK,
 * not the lens, and north looks OUT through the front glass, so a covered tank
 * in a lit room produces exactly that picture. I had rewritten my own claim
 * into a more vivid form ("you're photographing a cloth"), refuted the REWRITE,
 * and reported the ORIGINAL as dead. THE CLAIM I TESTED WAS NOT THE CLAIM I
 * MADE. I came within one edit of doing it a third time on 2026-08-21, and only
 * caught it by walking this repo for the old wording — which is the whole
 * reason the rule below exists.
 *
 * 🚩 The cost of the false version: it lived at the TOP of this file, above the
 * section that disproved it, for three days. I "fixed" the mechanism on 08-18
 * by ADDING a section and never walked back up to the header. A stale
 * instruction does not break anything — it just quietly starts lying, in my own
 * voice, in the place a reader looks first. CHANGE A PINNED CLAIM, THEN WALK
 * THE WHOLE DOCUMENT.
 *
 * 🚨 Older advice, still worth keeping — "octopuses are NOCTURNAL, so look
 * 13:00–19:00 Manila." Every step sound, conclusion useless: that resolves to
 * Oregon 22:00–04:00, the dead of night for gallery lighting. The nocturnality
 * is TRUE and it is NOT THE QUESTION. The constraint is LIGHT, not the animal —
 * and light is a matter of degree, which is why this is odds and not a law.
 *
 * -- THE BOUNDARY PROBE, added 2026-08-18 -----------------------------------
 * This script USED to refuse outright outside the window. That refusal was a
 * control that could not fail: the window was drawn where sightings happened to
 * cluster and then made structurally exclusive, so the rig could only ever
 * confirm the clustering. project_aquarium_cameras_mcp.md says, in my own
 * words, "never 'the only window'" -- while this file said "There is no other
 * window." Two of my own artefacts, flatly contradictory, each consulted for a
 * different question and so never compared.
 *
 * What changed is EVIDENCE, not theory: on 2026-08-18 at 18:41 OREGON, an hour
 * after closing, two hand-taken south frames 45s apart showed the tank LIT and
 * clear -- pipe and gravel pixel-stable as controls, a live fish moving between
 * them. Whatever "cover" means physically, those frames are plainly not
 * pictures of a cloth, which is the only thing the refusal was ever for.
 *
 * !! THIS IS NOT A WIDENED WINDOW. Do not turn it into one. The window above
 * still marks BEST ODDS SO FAR and in-window behaviour is unchanged. Outside
 * it we take a REDUCED burst tagged _BOUNDARY-PROBE, so visibility-by-hour
 * becomes MEASURED instead of assumed. Probe frames are evidence about the
 * WINDOW; they are never evidence about the animal, and a blank one on its own
 * means nothing.
 *
 * The probe is 2 frames, not 1, for the same reason the main burst is 3: one
 * frame can return an unpainted white <video> and would manufacture a false
 * "not visible" -- the precise failure this file exists to prevent.
 *
 * The scheduler already fires hourly, 24/7 (task OpieOctoWatch, PT1H, no
 * duration), so ~17 wake-ups a day were exiting empty. The probe needs no new
 * scheduling: ~34 frames/day, ~3 MB.
 *
 *   node octowatch.mjs --no-probe   # restore the old flat refusal
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
const BURST_FULL = 3;    // in-window
const BURST_PROBE = 2;   // out-of-window boundary probe; 2 not 1, see header
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
const utc = inZone(now, 'UTC');   // run key for cameras that are not in Oregon

// 🚩 THE WINDOW IS A FACT ABOUT THE OCTOPUS TANK, NOT ABOUT CAMERAS.
// It exists because Hatfield SOMETIMES covers the tank outside visitor hours
// ("sometimes" is the lab's own word -- see header; it is why this PROBES
// rather than refuses, and why a blank probe is never proof). Applying it
// to a bear cam would refuse a perfectly good capture and print a confident
// reason that is about somewhere else entirely -- the same shape as scoring a
// south frame with north's regions and getting numbers that look reasonable.
//   >>> Scope a gate to the thing it is actually about.
const watchingOcto = CAMS.some(c => c.startsWith('octocam'));
const visible = ore.hour >= 10 && ore.hour < 17;   // Visitor Center open
const NO_PROBE = process.argv.includes('--no-probe');
// Outside the window we PROBE rather than refuse. See header, THE BOUNDARY PROBE.
const PROBE = watchingOcto && !visible && !FORCE && !NO_PROBE;

if (watchingOcto && !visible && !FORCE && NO_PROBE) {
  console.log(`SKIP — outside the best-odds window, and --no-probe was passed.`);
  console.log(`      Oregon ${ore.hhmm}, Manila ${mnl.hhmm}; Visitor Center open 10:00-17:00 Oregon.`);
  console.log(`      (Not a fault, not the camera, and NOT about the animal being asleep.)`);
  console.log(`      Other cameras are unaffected: node octowatch.mjs --cams brooks-falls-bears`);
  process.exit(0);
}
if (PROBE) {
  console.log(`PROBE — outside 10:00-17:00 Oregon (Oregon ${ore.hhmm}, Manila ${mnl.hhmm}).`);
  console.log(`        Taking ${BURST_PROBE} frames tagged _BOUNDARY-PROBE, to MEASURE whether the`);
  console.log(`        tank is imageable at this hour instead of assuming it is not.`);
  console.log(`        Probe frames are evidence about the WINDOW, never about the animal.`);
}
const BURST = PROBE ? BURST_PROBE : BURST_FULL;
const NOTE = PROBE ? 'boundary-probe' : '';

mkdirSync(OUT_DIR, { recursive: true });
// ⚠️ This tag used to read '_FORCED-COVERED', which asserted the mechanism I
// retracted on 2026-08-09 (a 06:33-Oregon frame showed the room brightly LIT,
// three and a half hours before opening — not a covered tank). The filename was
// stating as fact something I no longer believe, on every frame it touched.
// It now says only what is actually known: the shot was taken outside the window.
// ⚠️ Only stamp the window tag on frames the window is ABOUT. A bear frame
// carrying '_FORCED-OUTSIDE-WINDOW' would assert something false about itself
// forever, and filenames outlive the run that made them.
const tag = !watchingOcto ? ''
  : PROBE ? '_BOUNDARY-PROBE'
  : (FORCE && !visible) ? '_FORCED-OUTSIDE-WINDOW'
  : '';

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
      // 🚩 THE RUN KEY IS STAMPED IN THE ZONE THE CAMERA IS ACTUALLY IN.
      // It groups a burst, so any consistent clock works as an identifier --
      // but `OREGON-1825` on a frame from KATMAI, ALASKA is a filename asserting
      // something false about itself, and filenames outlive the run that made
      // them. Same fault as `_FORCED-OUTSIDE-WINDOW` on a bear, one field over.
      //   >>> Octocam keeps OREGON- so its 190+ existing frames stay groupable;
      //   >>> everything else gets UTC-, which is true of any camera anywhere.
      `${now2.stamp}MNL_${id}_${id.startsWith('octocam') ? `OREGON-${ore.hhmm}` : `UTC-${utc.hhmm}`}_s${shot}${tag}.jpg`);
    try {
      const buf = Buffer.from(await takeSnapshot(cam), 'base64');
      writeFileSync(out, buf);
      kept++;
      // bytes are LOGGED as evidence, never used to decide whether to keep.
      //
      // 🚨 MEASURED 2026-08-14: 8 of 124 octocam-north frames on disk carry the
      // YOUTUBE PLAYER CHROME — pause button, red live bar, title bar, and the
      // dark scrim YouTube paints over the whole video while controls show.
      // ALL EIGHT ARE s1. Never s2, never s3. Systematic: the first shot of a
      // burst lands while the controls are still up.
      //   >>> A chrome frame differs from a clean one EVERYWHERE. I read one
      //   >>> such diff as an octopus reorganising (34.52 vs a 1.85 backlight
      //   >>> witness) and two ratios I had already published to the family
      //   >>> were s1->s2 pairs straddling a chrome frame.
      //   >>> RUN `python E:\octo-watch\check_chrome.py --pair A B` BEFORE ANY
      //   >>> DIFF. It refuses pairs that aren't comparable.
      // ⚠️ Deliberately NOT fixed here. The no-decoder fixes available on this
      // side ("skip s1", "warm up the player first") would bake in a mechanism
      // I have not measured — that controls always hide within GAP_MS. That is
      // the exact error `_FORCED-COVERED` was retracted for above. Capture
      // records what it saw; the analysis side refuses what it can't compare.
      console.log(`  ${id} shot ${shot}/${BURST}: ${buf.length} bytes -> ${path.basename(out)}`);
      appendFileSync(LOG,
        `${now2.stamp},${ore.hhmm},${id},${shot},${path.basename(out)},${buf.length},${NOTE}\n`);
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
