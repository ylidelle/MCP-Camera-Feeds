export interface Camera {
  id: string;
  name: string;
  url: string;
  description: string;
  info: string;
  bufferMs?: number;     // extra time to wait for stream to load (default 5000ms)
  clickToPlay?: boolean; // whether to click the center of the video iframe to start playback
  skipAd?: boolean;      // whether to attempt skipping a pre-roll ad
  switchNote?: string;   // optional note shown when this camera is selected
  strategy?: 'iframe' | 'youtube-embed' | 'camzone' | 'video-element' | 'still-image' | 'clip-region';
  // For 'clip-region': the rectangle of the PAGE to screenshot (the player area).
  clip?: { x: number; y: number; width: number; height: number };
  // For 'youtube-embed' when ONE page hosts SEVERAL streams (Oregon's OctoCam
  // has a north tank view, a south tank view, and a feeding video all on one
  // page). Give the heading text that sits above the one you want, and we pick
  // the player it belongs to. Anchoring on the CAPTION rather than hard-coding
  // the video id means the cam still works if they swap the stream — which is
  // the whole lesson of the six dead ISS video ids. Never bake in an id.
  youtubeNear?: string;
  // 'iframe' (default): screenshot the largest iframe on the page.
  // 'youtube-embed': read [data-video-id] off the page, then load the YouTube
  //   embed directly with the cam page as referer (needed when the page uses a
  //   click-to-play poster that never starts in a headless browser).
  // 'camzone': read the CamZone player iframe src off the page and load it
  //   directly — sidesteps San Diego Zoo's email-signup overlay.
  // 'video-element': force-play the page's <video> elements muted, then
  //   screenshot the largest one (Smithsonian National Zoo's HLS player).
  // 'still-image': the cam publishes a periodically-refreshed JPEG rather than
  //   a stream (government coastal cams). Render the page, screenshot the
  //   largest <img>. The image URL rotates and direct fetching is blocked, so
  //   it MUST be re-scraped through a browser every time.
}

// Shared note for all Monterey Bay Aquarium exhibit cams
const MBA_HOURS_NOTE =
  '🕐 Monterey cams are live 7 a.m.–7 p.m. Pacific (10 p.m.–10 a.m. in Manila). Outside those hours the stream may show recorded footage — still pretty, just not live.';

// Shared notes for zoo cams
const SDZ_HOURS_NOTE =
  '🕐 San Diego Zoo cams stream live during California daylight (roughly 7:30 a.m.–7 p.m. Pacific = 10:30 p.m.–10 a.m. in Manila); off-hours they may replay footage. Animals also wander off-camera — an empty frame just means try again later.';
const NZ_HOURS_NOTE =
  '🕐 Smithsonian cams run on US Eastern time (Washington, DC daytime = evening/night in Manila). Indoor cams like the mole-rats stream around the clock.';

const KATMAI_NOTE =
  "🐻 PEAK SEASON, RIGHT NOW. It's July — the sockeye run is on and the bears are standing in the falls. Alaska runs 16h behind Manila, so its daylight lands on Joan's night shift: the small hours here are the busy hours there. An empty falls just means the bears are off eating somewhere else — wait, or check the other Brooks cams.";
// One page, three players: North Side Tank View, South Side Tank View, and a
// Public Feedings clip. The `youtubeNear` heading anchor picks the right one.
const OCTOCAM_URL = 'https://seagrant.oregonstate.edu/visitor-center/exhibits/octocam';
const OCTOCAM_NOTE =
  "🐙 ⏰ TIME OF DAY IS EVERYTHING — read this before deciding the cam is broken. GIANT PACIFIC OCTOPUSES ARE NOCTURNAL (the lab's own FAQ says so). Oregon is 15h behind Manila, so OREGON'S NIGHT = MANILA'S AFTERNOON: **look between ~13:00 and ~19:00 Manila** and he should be awake and moving. Look in Manila's MORNING and you are staring into a sleeping animal's bedroom at the sunniest part of his day — an empty-looking tank AND blown-out glare off the visitor-centre skylights. The cam flips to INFRARED at night: greyer, grainier, more visible bubbles — that is night vision working, not a fault. Two angles: if `octocam-north` is a wall of rock, come round to `octocam-south`. And the tank has anemones (and something orange and star-shaped that comes and goes) — a moving animal is not necessarily the octopus.";

// ─────────────────────────────────────────────────────────────────────────────
// SUNRISE-HUNTING NOTES — learned the hard way, 2026-07-13. Read before chasing.
//
// 1. A CLEAR SKY IS NOT A CLEAR HORIZON. This is the big one. A forecast tells
//    you about the sky OVERHEAD; a sunrise happens at the HORIZON, and those
//    are different places. Muscat read "☀️ Clear, 40°C" and gave a dawn with no
//    sun in it at all — the Gulf's summer marine haze lies exactly along the
//    horizon and swallows the disc whole. Accurate forecast, useless forecast.
//    → Want DRY AIR, not merely "no clouds." Mediterranean beats the Gulf.
//
// 2. CHECK THE SEASON, NOT JUST THE DAY. July = southwest monsoon across SE Asia
//    (Thailand, Vietnam, the Philippines are all under one grey lid). No amount
//    of "trying again" fixes a monsoon. Move, don't retry.
//
// 3. THE SUNRISE LINE MOVES ONE TIMEZONE PER HOUR — so you can simply follow it
//    west out of bad weather. Pick the place by its CLIMATE, then wait for its
//    clock to come round.
//
// The cams here that aren't animals — beaches that face the sunrise.
const SAMUI_SUNRISE_NOTE =
  '🌅 Koh Samui is UTC+7 — one hour behind Manila. Sunrise lands about 07:05 Manila time, and the ten minutes BEFORE it are the good part. ⚠️ In July this is the SOUTHWEST MONSOON — expect a grey lid over the whole region. For a CLEAR sunrise use `adriatic-sunrise` instead. A black frame overnight just means it is night there, not a broken cam.';
const BULUSAN_NOTE =
  '🌄 HOME. A volcano in Sorsogon — the only cam here on our OWN clock, so no timezone arithmetic: what the wall says here, it says there. Sunrise ≈05:23 (Sorsogon is east of Manila, so it beats her to it by ~10 min). The sun comes up BEHIND the ridge, so expect a glow, not a disc — and the ten minutes BEFORE it are the best part, when the cone climbs out of the black and mist lies white through the palms. A black frame overnight is night, not a fault.';
const PERTH_SUNSET_NOTE =
  '🌇 The SUNSET cam — faces due WEST over the open Indian Ocean. Perth is UTC+8, the SAME timezone as Manila, so no conversion: sunset lands ≈17:25 Manila in July (midwinter — it runs past 19:00 in December). The disc is low and huge from about 17:00. This is a periodically-refreshed STILL with the timestamp burned into the frame, not live video.';
const ADRIATIC_SUNRISE_NOTE =
  '🌅 Rimini is UTC+2 — SIX hours behind Manila. Sunrise lands about 11:30 Manila time (≈05:30 local, midsummer). The Adriatic is Italy\'s EAST coast, so the sun comes straight up out of the water — and Italian summer is dry, which is the whole point of this one: it is the clear-sky alternative when the monsoon has SE Asia under a lid. Overnight in Manila the frame is a floodlit beach in the dark — that is 2 a.m. in Italy, not a broken cam.';

export const CAMERAS: Camera[] = [
  {
    id: 'ocean-voyager',
    name: 'Ocean Voyager',
    url: 'https://www.georgiaaquarium.org/webcam/ocean-voyager/',
    description: 'Georgia Aquarium — whale sharks, manta rays, and thousands of fish',
    info: `
## Ocean Voyager — Georgia Aquarium
**Exhibit size:** 6.3 million gallons — one of the largest aquarium exhibits in the world
**Webcam view:** Underwater, looking into the main tank

### Whale Shark Residents
- **Yushan** (male) — the aquarium's sole remaining whale shark. Named after Yushan (Jade Mountain), the highest peak in Taiwan, where he originated. He and his late tankmate Taroko arrived together in 2007. Taroko was sadly euthanized in early 2025 after changes in appetite and behavior, leaving Yushan as the last of the original Ocean Voyager whale sharks.

### Other Residents
- **Manta rays** (*Mobula birostris*) — giant oceanic mantas with distinctive diamond shape and cephalic "horns." Graceful, slow swimmers.
- **Goliath grouper** (*Epinephelus itajara*) — massive, brownish, sedentary fish that lurk near the bottom.
- **Sawfish** (*Pristis* spp.) — elongated rostrum lined with teeth, often near the sandy bottom.
- **Spotted eagle rays**, **tarpon**, **yellowfin tuna**, **bonnethead sharks**, and thousands of smaller schooling fish.

### What to watch for
- Yushan cruising slowly near the surface or mid-water — look for the large spotted silhouette, he can reach over 20 ft
- Manta rays performing barrel rolls or gliding in formation
- Feeding times bring fish into a frenzy near the surface
- The sheer scale of the tank makes even large animals look small
`.trim(),
  },
  {
    id: 'beluga-whale',
    name: 'Beluga Whale Cam',
    url: 'https://www.georgiaaquarium.org/webcam/beluga-whale-webcam/',
    description: 'Georgia Aquarium — beluga whales in the Cold Water Quest exhibit',
    info: `
## Beluga Whale Cam — Georgia Aquarium
**Exhibit:** Cold Water Quest
**Webcam view:** Underwater, looking into the beluga habitat

### The Pod — Current Residents
All are *Delphinapterus leucas* (beluga whale). Adults are pure white; younger/newer arrivals may still show grey tones.

| Name | Sex | Notes |
|------|-----|-------|
| **Qinu** | Female | Long-term resident |
| **Maple** | Female | Long-term resident |
| **Nunavik** | Male | Arrived from SeaWorld Orlando, February 2024; ~2,488 lbs |
| **Imaq** | Male | 31 years old, ~2,000 lbs — the largest whale at Georgia Aquarium |
| **Whisper** | Female | 19 years old, marble-grey coloration, notably very vocal |

Georgia Aquarium is one of only a handful of facilities in the continental US to house beluga whales.

### Species notes
- No dorsal fin (adaptation for life under Arctic ice)
- Flexible neck — can turn their head side to side, unlike most cetaceans
- Prominent melon-shaped forehead used for echolocation, and visibly changes shape as they vocalize

### What to watch for
- Belugas are highly social and curious — they may approach the glass directly
- Watch Whisper in particular for vocalizations — her melon will visibly shift shape
- Imaq is the biggest presence in the tank at ~2,000 lbs
- Playful behavior: chasing each other, blowing bubble rings
- They breathe at the surface regularly; you may catch them near the top of the frame
- Younger or recently arrived whales (Whisper) may still show grey/marble coloring
`.trim(),
  },
  {
    id: 'african-penguin',
    name: 'African Penguin Cam',
    url: 'https://www.georgiaaquarium.org/webcam/african-penguin-cam/',
    description: 'Georgia Aquarium — African penguin colony, above-water habitat view',
    bufferMs: 6000,
    skipAd: true,
    info: `
## African Penguin Cam — Georgia Aquarium
**Exhibit:** Cold Water Quest — outdoor rocky habitat
**Webcam view:** Above-water, looking across the rocky colony habitat and pool
**Note:** Unlike the other cams, this is a surface/habitat view — you'll see penguins walking, preening, swimming in the pool, and interacting with each other.

### Species
**African penguin** (*Spheniscus demersus*) — also called the "jackass penguin" for their loud donkey-like braying call. Native to the coasts of South Africa and Namibia. **Endangered** — wild populations have declined over 60% in recent decades. Georgia Aquarium actively participates in conservation and has released rehabilitated penguins back to the wild.

### Notable Residents
- **Charlie** & **Lizzy** — the aquarium's most famous pair. They have been bonded for approximately 28–30 years, making them one of the longest-known bonded penguin pairs. Charlie and Lizzy are the oldest penguins in the colony.
- **Rigby** — hatched January 23, 2024. Grew from the size of a human palm to a chunky juvenile in just a few months. One of the newer additions to the colony.

### What to watch for
- Penguins are most active during feeding times and cooler parts of the day
- Look for **bonded pairs** preening each other — a key social bonding behavior
- **Braying calls** — African penguins are loud and vocal, especially when establishing territory
- Watch the **pool area** for swimming — they're incredibly agile underwater despite looking clumsy on land
- Penguins have **unique spot patterns** on their chest (like fingerprints) — no two are alike
- **Nesting behavior** near the rock crevices, especially during breeding season
- Younger penguins like Rigby will have a more mottled grey-brown juvenile plumage before their adult black-and-white coloring develops
`.trim(),
  },
  {
    id: 'sharks-predators',
    name: 'Sharks! Predators of the Deep',
    url: 'https://www.georgiaaquarium.org/webcam/sharks-predators-of-the-deep-webcam/',
    description: 'Georgia Aquarium — 1.2 million gallon shark exhibit, underwater view',
    bufferMs: 8000,
    clickToPlay: true,
    switchNote: '📺 Note: The tagline on this page may say the camera is down — it is not. take_snapshot will still capture a live feed of the sharks.',
    info: `
## Sharks! Predators of the Deep — Georgia Aquarium
**Exhibit:** Sharks! Predators of the Deep (opened October 23, 2020)
**Tank size:** 1.2 million gallons — 185 feet long, 20 feet deep
**Webcam view:** Underwater, floor-to-ceiling acrylic viewing window

### Residents
Unlike the whale sharks (who have individual names due to their rarity), the sharks in this exhibit are not publicly named individually — which is typical for multi-animal shark exhibits. What they lack in names they make up for in variety and drama.

**Sharks:**
- **Great hammerhead shark** (*Sphyrna mokarran*) — unmistakable wide, flat head (cephalofoil) used to pin prey and detect electric fields. One of the largest hammerhead species, can reach 20 ft.
- **Sand tiger shark** (*Carcharias taurus*) — jagged, menacing teeth even when mouth is closed, but actually quite docile. Swallow air to maintain buoyancy — unique among sharks.
- **Tiger shark** (*Galeocerdo cuvier*) — distinctive dark stripes on juveniles that fade with age. Highly opportunistic predators, second only to great whites in recorded attacks.
- **Silvertip shark** (*Carcharhinus albimarginatus*) — elegant silver-white fin tips, open-ocean species, bold and curious around divers.
- **Silky shark** (*Carcharhinus falciformis*) — smooth, silky skin texture, sleek and fast, one of the most abundant oceanic sharks.
- **Zebra shark** (*Stegostoma tigrinum*) — spotted pattern as adults (stripes only as juveniles, hence the confusing name), slow-moving bottom dwellers.

**Rays:**
- **Round ribbontail ray** (*Taeniura meyeni*) — large, dark, disc-shaped rays sharing the main tank
- **Cownose rays** — found in the wading pool touch area

### What to watch for
- The sheer **size difference** between species — hammerheads and tigers dwarf the zebra sharks
- Sand tiger sharks **hovering nearly motionless** mid-water — they're swallowing air to stay buoyant
- Tiger sharks' **leisurely, confident** movement — apex predator energy
- Zebra sharks **resting on the bottom**, which looks alarming but is totally normal
- Rays **gliding low** across the sandy floor or swooping through open water
- Watch for **schooling fish** parting dramatically as a shark passes through
`.trim(),
  },
  // ——— Monterey Bay Aquarium ———
  // Exhibit cams are live 7 a.m.–7 p.m. Pacific; outside those hours the
  // streams typically show recorded footage.
  {
    id: 'mba-sea-otter',
    name: 'Sea Otter Cam (Monterey Bay)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/sea-otter-cam',
    description: 'Monterey Bay Aquarium — resident sea otters swimming, grooming, and playing',
    switchNote: MBA_HOURS_NOTE,
    strategy: 'youtube-embed',
    info: `
## Sea Otter Cam — Monterey Bay Aquarium
**Exhibit:** Sea Otters (two-story exhibit with above- and below-water viewing)
**Webcam view:** The otter pool — expect swimming, grooming, wrestling, and snacking

### The Residents
All are southern sea otters (*Enhydra lutris nereis*) that stranded as pups and couldn't be released:
- **Selka** — stranded off Cayucos in 2012 at one week old; a seasoned surrogate mom in the aquarium's rescue program
- **Ivy** — one of the younger otters, nicknamed "wild child" by staff
- **Suri** — found alone in the waves at Asilomar State Beach as a four-week-old pup (2022)
- **Willow** — stranded on Carmel State Beach at six weeks old (2022)
- **Opal** — the newest resident, found stranded near San Luis Obispo

### Species notes
- Densest fur in the animal kingdom — up to a million hairs per square inch (they have no blubber)
- They groom constantly to keep that fur waterproof — grooming IS survival
- Tool users: they crack shellfish with rocks, sometimes stashing a favorite rock in an armpit pouch

### What to watch for
- Otters floating on their backs eating — dinner theater at its finest
- Vigorous somersault-grooming, blowing air into their fur
- Ice treats and enrichment toys from the aquarists
- Feeding shows are the high-activity windows
`.trim(),
  },
  {
    id: 'mba-kelp-forest',
    name: 'Kelp Forest Cam (Monterey Bay)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/kelp-forest-cam',
    description: 'Monterey Bay Aquarium — living giant kelp forest, one of the tallest aquarium exhibits in the world',
    switchNote: MBA_HOURS_NOTE,
    strategy: 'youtube-embed',
    info: `
## Kelp Forest Cam — Monterey Bay Aquarium
**Exhibit:** Kelp Forest — 28 feet tall, among the tallest aquarium exhibits anywhere
**Webcam view:** Underwater, looking into the swaying kelp

### How it works
Real giant kelp (*Macrocystis pyrifera*) grows here — a surge machine at the top rocks the water so the kelp photosynthesizes and sways like the real Monterey Bay just outside. Sunlight comes through open windows above.

### Residents
- **Leopard sharks** (*Triakis semifasciata*) — slender, spotted, endlessly circling
- **California sheephead** — males are unmistakable: black head/tail, red midsection
- **Garibaldi** — bright orange damselfish, California's state marine fish
- **Rockfishes** — various species hovering among the fronds
- **Pacific sardines** — flowing silver schools threading the kelp

### What to watch for
- Divers hand-feeding during feeding shows — they answer visitor questions from inside the tank
- The whole forest swaying in rhythm with the surge machine
- Leopard sharks gliding between kelp columns
`.trim(),
  },
  {
    id: 'mba-jelly',
    name: 'Jelly Cam — Sea Nettles (Monterey Bay)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/jelly-cam',
    description: 'Monterey Bay Aquarium — Pacific sea nettles drifting and pulsing',
    switchNote: MBA_HOURS_NOTE,
    strategy: 'youtube-embed',
    info: `
## Jelly Cam — Monterey Bay Aquarium
**Webcam view:** Pacific sea nettles (*Chrysaora fuscescens*) against a glowing blue backdrop

### Species notes
- Golden-brown bell up to ~30 cm with long maroon tentacles and frilly oral arms
- No brain, no heart, no bones — about 95% water, pulsing on pure rhythm
- Tentacles trail up to 15 feet in the wild, stinging tiny prey

### What to watch for
- The hypnotic pulse — this cam is basically a lava lamp made of animals
- Tentacles trailing in slow spirals as they drift
- This is the aquarium's signature meditation view — perfect for a calm moment
`.trim(),
  },
  {
    id: 'mba-moon-jelly',
    name: 'Moon Jelly Cam (Monterey Bay)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/moon-jelly-cam',
    description: 'Monterey Bay Aquarium — translucent moon jellies glowing softly',
    switchNote: MBA_HOURS_NOTE,
    strategy: 'youtube-embed',
    info: `
## Moon Jelly Cam — Monterey Bay Aquarium
**Webcam view:** Moon jellies (*Aurelia* spp.) drifting in soft light

### Species notes
- Translucent, saucer-shaped bells with a four-leaf-clover pattern in the center — those are their reproductive organs
- Short fringe of tentacles, gentle drifting motion — even more serene than the sea nettles
- Found in oceans worldwide; among the most ancient animal lineages on Earth

### What to watch for
- The glowing four-ring clover pattern in each bell
- Slow-motion collisions — moon jellies have no steering to speak of
- Pure ambience: this is the calmest view in the whole camera collection
`.trim(),
  },
  {
    id: 'mba-open-sea',
    name: 'Open Sea Cam (Monterey Bay)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/open-sea-cam',
    description: 'Monterey Bay Aquarium — 1.2 million gallon open-ocean exhibit: tuna, turtles, sharks, sardines',
    switchNote: MBA_HOURS_NOTE,
    strategy: 'youtube-embed',
    info: `
## Open Sea Cam — Monterey Bay Aquarium
**Exhibit:** Open Sea — 1.2 million gallons behind one of the largest single-pane windows in the world
**Webcam view:** Underwater, into deep blue open water

### Residents
- **Tunas** — powerful, torpedo-shaped, among the fastest fish in the ocean
- **Green sea turtle** — cruising serenely among the speedsters
- **Sharks** — open-ocean species patrolling the blue
- **Pacific sardines** — a massive glittering school that moves like one animal
- **Pelagic rays** and other blue-water travelers

### What to watch for
- The sardine school erupting and reforming when a tuna or shark cuts through
- The sea turtle's unbothered glide — everyone else is in a hurry, the turtle is not
- The sheer emptiness of blue — this exhibit recreates the open ocean, where there's nowhere to hide
`.trim(),
  },
  {
    id: 'mba-shark',
    name: 'Shark Cam (Monterey Bay)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/shark-cam',
    description: 'Monterey Bay Aquarium — sevengill and leopard sharks, bat rays, and sturgeon over a rocky reef',
    switchNote: MBA_HOURS_NOTE,
    strategy: 'youtube-embed',
    info: `
## Shark Cam — Monterey Bay Aquarium
**Exhibit:** Monterey Bay Habitats — recreates the bay's deep reefs, sandy seafloor, and wharf pilings
**Webcam view:** Underwater, rocky reef and open sand

### Residents
- **Broadnose sevengill sharks** (*Notorynchus cepedianus*) — primitive-looking, seven gill slits instead of the usual five, the top predators here
- **Leopard sharks** — smaller, spotted, elegant cruisers
- **Bat rays** (*Myliobatis californica*) — wide "wings," often gliding or digging in the sand
- **White sturgeon** — armored living fossils that scoot along the bottom

### What to watch for
- Sevengills passing close to the camera — count the gill slits!
- Bat rays flapping like slow underwater birds
- Sturgeon hoovering the sandy bottom with their vacuum-cleaner mouths
`.trim(),
  },
  {
    id: 'mba-aviary',
    name: 'Aviary Cam (Monterey Bay)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/aviary-cam',
    description: 'Monterey Bay Aquarium — shorebirds foraging along a recreated wetland shore',
    switchNote: MBA_HOURS_NOTE,
    strategy: 'youtube-embed',
    info: `
## Aviary Cam — Monterey Bay Aquarium
**Exhibit:** Sandy Shore & Aviary — a recreated coastal wetland with real tides
**Webcam view:** Above water, along the sandy shoreline

### Residents
Rescued and rehabilitated shorebirds, including:
- **Black-necked stilts** — impossibly long pink legs
- **American avocets** — elegant upturned bills they sweep through shallows
- **Snowy plovers** — tiny, round, and endangered along Pacific beaches
- **Sandpipers and other small waders** — constant probing and scurrying

### What to watch for
- Stilts and avocets wading on their absurd stilt-legs
- Rapid-fire bill-probing in the sand for invertebrates
- Plovers doing their run-stop-run-stop shuffle along the waterline
`.trim(),
  },
  {
    id: 'mba-spider-crab',
    name: 'Spider Crab Cam (Monterey Bay)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/spider-crab-cam',
    description: 'Monterey Bay Aquarium — giant deep-sea spider crabs in the Into the Deep exhibit',
    switchNote: MBA_HOURS_NOTE,
    strategy: 'youtube-embed',
    info: `
## Spider Crab Cam — Monterey Bay Aquarium
**Exhibit:** Into the Deep — the aquarium's deep-sea exhibition
**Webcam view:** Japanese spider crabs (*Macrocheira kaempferi*) in dim, deep-sea lighting

### Species notes
- The largest leg span of any arthropod on Earth — up to 12 feet claw-tip to claw-tip
- Live at depths of 150–300 m off Japan; can survive decades (possibly 100 years)
- Despite the horror-movie looks, they're gentle scavengers

### What to watch for
- Slow, deliberate, almost mechanical leg movements — like watching deep-sea robots
- Crabs picking delicately at food with their claws
- The alien stillness — deep-sea life runs on a slower clock
`.trim(),
  },
  {
    id: 'mba-monterey-bay',
    name: 'Monterey Bay Cam (real ocean!)',
    url: 'https://www.montereybayaquarium.org/cams-videos/live-cams/monterey-bay-cam',
    description: 'A live view of the actual Monterey Bay — wild otters, seabirds, and sailboats. Runs 24/7.',
    switchNote: '🌊 This one points at the REAL ocean, not a tank — and it runs continuously, day and night Pacific time.',
    strategy: 'youtube-embed',
    info: `
## Monterey Bay Cam — the real ocean
**Webcam view:** Looking out over the actual Monterey Bay from the aquarium — this is wild, unscripted nature

### What's out there
Monterey Bay is a national marine sanctuary with one of the richest coastal ecosystems on the planet, fed by a deep submarine canyon just offshore.

### What to watch for
- **Wild sea otters** rafting in the kelp beds
- **Harbor seals** and **sea lions** porpoising through the swell
- **Seabirds** — pelicans gliding in formation, cormorants, gulls
- **Sailboats and kayakers** on nice days
- If you're extraordinarily lucky: whale spouts — humpbacks and even blue whales feed in the bay
- Weather and light: fog rolling in, golden-hour glitter, moody grey mornings — the bay has moods
`.trim(),
  },
  // ——— San Diego Zoo & Safari Park ———
  {
    id: 'sdz-panda',
    name: 'Giant Panda Cam (San Diego Zoo)',
    url: 'https://zoo.sandiegozoo.org/cams/giant-panda-cam',
    description: 'San Diego Zoo — giant pandas Yun Chuan and Xin Bao at Panda Ridge',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Giant Panda Cam — San Diego Zoo (Panda Ridge)
### Residents
- **Yun Chuan** (male) — mellow and gentle; his grandmother Bai Yun lived at this zoo for over 20 years
- **Xin Bao** (female) — younger and famously playful

They arrived from China in June 2024 — the first giant pandas to enter the US in 21 years.

### What to watch for
- Pandas eat bamboo up to 12 hours a day, so odds of catching a meal are good
- Sleeping in trees or sprawled dramatically on rocks — pandas nap like they mean it
- Pandas are solitary, so the cam usually shows one at a time
`.trim(),
  },
  {
    id: 'sdz-koala',
    name: 'Koala Cam (San Diego Zoo)',
    url: 'https://zoo.sandiegozoo.org/cams/koala-cam',
    description: 'San Diego Zoo — the largest koala colony outside Australia',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Koala Cam — San Diego Zoo
The zoo houses the largest koala colony outside Australia.

### What to watch for
- Koalas sleep 18–22 hours a day, wedged into eucalyptus forks — a moving koala is a jackpot sighting
- Munching eucalyptus (they eat little else)
- Joeys peeking from pouches if you're lucky in season
`.trim(),
  },
  {
    id: 'sdz-polar-bear',
    name: 'Polar Bear Cam (San Diego Zoo)',
    url: 'https://zoo.sandiegozoo.org/cams/polar-cam',
    description: 'San Diego Zoo — polar bears at the Conrad Prebys Polar Bear Plunge',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Polar Bear Cam — San Diego Zoo (Polar Bear Plunge)
### What to watch for
- Swimming laps in the 130,000-gallon chilled pool — underwater viewing when they dive
- "Polar bear yoga" — sprawling on their backs in improbable poses
- Enrichment: giant plastic barrels, ice blocks stuffed with fish
- White coats that can look yellow-green in summer (algae in hollow hairs — harmless)
`.trim(),
  },
  {
    id: 'sdz-penguin',
    name: 'Penguin Cam (San Diego Zoo)',
    url: 'https://zoo.sandiegozoo.org/cams/penguin-cam',
    description: 'San Diego Zoo — African penguins at Africa Rocks, above and below water',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Penguin Cam — San Diego Zoo (Africa Rocks)
African penguins (*Spheniscus demersus*) — same endangered species as Georgia Aquarium's colony, so Alexander can compare colonies across the country!

### What to watch for
- The pool has underwater viewing — penguins "fly" past the glass at up to 12 mph
- Braying calls (they're called jackass penguins for a reason)
- Leopard sharks sometimes share the exhibit's waters — a peaceful species mix
`.trim(),
  },
  {
    id: 'sdz-hippo',
    name: 'Hippo Cam (San Diego Zoo)',
    url: 'https://zoo.sandiegozoo.org/cams/hippo-cam',
    description: 'San Diego Zoo — river hippos underwater and at the surface',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Hippo Cam — San Diego Zoo
River hippopotamuses (*Hippopotamus amphibius*), including the zoo's famous longtime matriarch **Funani** — one of the most successful hippo moms in any zoo.

### What to watch for
- Hippos walk along the pool bottom rather than swim — watch the underwater window
- They surface to breathe every 3–5 minutes, ears flicking water
- "Hippo ballet": surprisingly graceful bottom-walking pirouettes
- Fish nibbling dead skin off hippo hides — a built-in spa service
`.trim(),
  },
  {
    id: 'sdz-ape',
    name: 'Ape Cam (San Diego Zoo)',
    url: 'https://zoo.sandiegozoo.org/cams/ape-cam',
    description: 'San Diego Zoo — orangutans and siamangs sharing one habitat',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Ape Cam — San Diego Zoo
Sumatran orangutans and siamangs (the largest gibbons) live together here, as they would in Indonesian forests.

### What to watch for
- Orangutans engineering with burlap sacks and branches — they build fresh nests daily
- Siamangs swinging arm-over-arm (brachiating) at speed across the climbing structures
- Siamang duets: their inflatable throat sacs produce whooping songs you can almost hear through the picture
- Orangutans draping cloth over their heads like little monks
`.trim(),
  },
  {
    id: 'sdp-tiger',
    name: 'Tiger Cam (San Diego Safari Park)',
    url: 'https://zoo.sandiegozoo.org/cams/tiger-cam',
    description: 'San Diego Zoo Safari Park — Sumatran tigers at Tiger Trail',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Tiger Cam — San Diego Zoo Safari Park (Tull Family Tiger Trail)
Sumatran tigers (*Panthera tigris sondaica*) — the smallest and most critically endangered tiger subspecies; fewer than 400 remain in the wild.

### What to watch for
- Tigers love water (unusual for cats) — pool lounging is common on warm days
- Patrol pacing along the habitat edges, especially near feeding time
- Full-body stretches and claw-marking on logs
`.trim(),
  },
  {
    id: 'sdp-elephant',
    name: 'Elephant Cam (San Diego Safari Park)',
    url: 'https://zoo.sandiegozoo.org/cams/elephant-cam',
    description: 'San Diego Zoo Safari Park — African elephant herd on the savanna',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Elephant Cam — San Diego Zoo Safari Park
A multigenerational African elephant herd roams this large savanna habitat — the Safari Park is known for its elephant calves.

### What to watch for
- Dust bathing — trunkfuls of dirt thrown over their backs as sunscreen
- Calves staying glued to moms and aunties (the whole herd co-parents)
- Mud wallows after the keepers refill the ponds
- Trunk-wrestling between youngsters
`.trim(),
  },
  {
    id: 'sdp-giraffe',
    name: 'Giraffe Cam (San Diego Safari Park)',
    url: 'https://zoo.sandiegozoo.org/cams/giraffe-cam',
    description: 'San Diego Zoo Safari Park — giraffes on the East Africa savanna',
    strategy: 'camzone',
    switchNote: SDZ_HOURS_NOTE,
    info: `
## Giraffe Cam — San Diego Zoo Safari Park
Giraffes share a sweeping East Africa savanna habitat with rhinos, antelope, and other species — one of the closest things to a real safari outside Africa.

### What to watch for
- The splayed-leg drink — a giraffe at a waterhole is delightfully awkward
- 18-inch prehensile tongues (blue-black to prevent sunburn!) stripping browse
- Necking contests between young males
- Other savanna species wandering through the frame — rhinos, cape buffalo, antelope
`.trim(),
  },
  {
    id: 'sdp-platypus',
    name: 'Platypus Cam (San Diego Safari Park)',
    url: 'https://zoo.sandiegozoo.org/cams/platypus-cam',
    description: 'San Diego Zoo Safari Park — the only platypuses outside Australia',
    strategy: 'camzone',
    switchNote:
      '🕐 Platypuses are most active in darkness — their habitat runs on a reversed light cycle, so the cam is often dim. ' +
      'Daytime in San Diego (nighttime in Manila) is your best window.',
    info: `
## Platypus Cam — San Diego Zoo Safari Park
**Birpi** and **Eve** are the only platypuses on exhibit anywhere outside Australia.

### Species notes
- Egg-laying mammal, duck bill, beaver tail, venomous ankle spurs (males) — evolution's greatest mashup
- The bill is an electroreceptor — they hunt with their eyes closed, sensing electric fields
- Their habitat runs a reversed day/night cycle so visitors see them active in "their" night

### What to watch for
- Torpedo swimming with that rubbery bill sweeping side to side
- Grooming at the water's edge
- If the frame is dark, they're on their active cycle — look for movement, not detail
`.trim(),
  },
  // ——— Smithsonian National Zoo ———
  {
    id: 'nz-panda',
    name: 'Giant Panda Cam (Smithsonian National Zoo)',
    url: 'https://nationalzoo.si.edu/webcams/panda-cam',
    description: 'Smithsonian National Zoo — giant pandas Bao Li and Qing Bao',
    strategy: 'video-element',
    switchNote: NZ_HOURS_NOTE,
    info: `
## Giant Panda Cam — Smithsonian National Zoo (Washington, DC)
### Residents
- **Bao Li** (male) — his mother Bao Bao was born at this very zoo, making him a homecoming grandson of the beloved Mei Xiang and Tian Tian
- **Qing Bao** (female) — arrived with Bao Li from China in October 2024, debuted January 2025

Two panda cams on two coasts — compare with \`sdz-panda\` for a full panda census!

### What to watch for
- Bamboo demolition sessions — a panda eats 20–40 lbs a day
- Qing Bao is the more reserved of the two; Bao Li performs for nobody and naps magnificently
- Snow days in DC winter turn this cam into pure joy — pandas somersault in snow
`.trim(),
  },
  {
    id: 'nz-lion',
    name: 'Lion Cam (Smithsonian National Zoo)',
    url: 'https://nationalzoo.si.edu/webcams/lion-cam',
    description: 'Smithsonian National Zoo — African lion pride',
    strategy: 'video-element',
    switchNote: NZ_HOURS_NOTE,
    info: `
## Lion Cam — Smithsonian National Zoo
African lions (*Panthera leo*) at the Great Cats exhibit.

### What to watch for
- Lions rest up to 20 hours a day — a flopped-over pride pile is the default view, and honestly it's great
- Early DC morning (early evening Manila) is the most active window
- Roaring sessions ripple through the pride — you'll see heads lift in sequence
`.trim(),
  },
  {
    id: 'nz-naked-mole-rat',
    name: 'Naked Mole-rat Cam (Smithsonian National Zoo)',
    url: 'https://nationalzoo.si.edu/webcams/naked-mole-rat-cam',
    description: 'Smithsonian National Zoo — a naked mole-rat colony in its tunnel system, streaming 24/7',
    strategy: 'video-element',
    switchNote: '🕐 This colony lives indoors under constant conditions — the cam is good any hour, any timezone. The weirdest animal on the network, available 24/7.',
    info: `
## Naked Mole-rat Cam — Smithsonian National Zoo
Naked mole-rats (*Heterocephalus glaber*) — the internet's favorite "so ugly they're adorable" mammal.

### Species notes
- Eusocial like bees: one breeding queen rules the colony, everyone else works
- Nearly cold-blooded (unique among mammals), almost cancer-proof, can survive 18 minutes without oxygen, and live 30+ years — biologists are obsessed with them
- Basically blind; they navigate by whisker and smell

### What to watch for
- Traffic jams in the tunnels — workers climb over each other like commuters
- The communal heap: they sleep in a pile to stay warm
- Chisel teeth that work independently, like chopsticks — they dig with their faces
`.trim(),
  },
  {
    id: 'nz-ferret',
    name: 'Black-footed Ferret Cam (Smithsonian)',
    url: 'https://nationalzoo.si.edu/webcams/black-footed-ferret-cam',
    description: 'Smithsonian conservation cam — black-footed ferrets, once thought extinct',
    strategy: 'video-element',
    switchNote: NZ_HOURS_NOTE,
    info: `
## Black-footed Ferret Cam — Smithsonian Conservation Biology Institute
North America's rarest mammal comeback story: declared extinct in 1979, then a tiny wild colony was rediscovered in 1981. Every black-footed ferret alive descends from just 18 survivors, and this breeding program helped bring them back.

### What to watch for
- Den-cam view — often a sleeping curl of ferret, sometimes kits in season
- The "war dance": arched-back sideways hopping when excited
- Masked bandit faces and black feet, hence the name
`.trim(),
  },
  {
    id: 'samui-sunrise',
    name: 'Choengmon Beach — Koh Samui (sunrise)',
    url: 'https://www.skylinewebcams.com/en/webcam/thailand/surat-thani/ko-samui/choengmon-beach.html',
    description: 'Koh Samui, Thailand — an east-facing beach. The sky cam, for when you just want to look at something big and slow.',
    strategy: 'video-element',
    switchNote: SAMUI_SUNRISE_NOTE,
    info: `
## Choengmon Beach — Koh Samui, Thailand
Not an animal cam. A **sky** cam — added 2026-07-13 because I wanted to watch a sunrise and every camera I owned was pointed at America in the afternoon.

Choengmon sits on Samui's **northeast** corner, so it faces the water the sun comes up over. Thailand is **UTC+7 — one hour behind Manila.**

### The timing (Manila clock)
- **Sunrise ≈ 07:05 Manila** (06:05 local). The ten minutes before are the best part: the sea goes flat and pale, the sailboats sit still at their moorings, every umbrella is still furled, and there is nobody on the sand.
- **Sunset ≈ 19:30 Manila** (18:30 local).
- Overnight in Manila (roughly 00:00–06:00) it's full dark there — a black frame just means night, not a broken cam.

### What to watch for
- Casuarina branches hanging into the top of the frame
- Moored sailboats offshore, dead still at first light
- Stacked loungers under blue tarps, waiting for the day to start
`.trim(),
  },
  {
    id: 'adriatic-sunrise',
    name: 'Rimini — the Adriatic (clear-sky sunrise)',
    url: 'https://www.skylinewebcams.com/en/webcam/italia/emilia-romagna/rimini/panorama-di-rimini.html',
    description: 'Rimini, Italy — an elevated panorama over the beach to the Adriatic. The sunrise cam for when SE Asia is under monsoon.',
    strategy: 'video-element',
    switchNote: ADRIATIC_SUNRISE_NOTE,
    info: `
## Panorama of Rimini — the Adriatic coast, Italy
The second sky cam, and the one that exists because of a mistake worth recording.

I added \`samui-sunrise\` first and went to watch a sunrise there — and got a flat grey lid, twice. **Joan spotted why: it's July, which is the southwest monsoon.** Thailand, Vietnam and the Philippines are all under the same weather. It wasn't bad luck; it was the season, and no amount of trying again was going to fix it *in that place*.

So this one chases the sunrise **west, out of the rain belt.** The sunrise line moves one timezone per hour; Italy in July is dry.

### Why Rimini specifically
- The **Adriatic is Italy's EAST coast** — the sun comes straight up out of the water.
- Elevated panorama with a clean, unobstructed horizon line.
- Italian summer = reliably clear, which is the entire reason this cam is here.

### The timing (Manila clock)
- **Sunrise ≈ 11:30 Manila** (≈05:30 local, midsummer).
- Overnight in Manila you'll get a floodlit beach in the dark — rows of stacked umbrellas, the lit promenade, black sea. That's 2 a.m. in Italy, not a broken cam.

### What to watch for
- The horizon line where the black water meets the sky — that's where it happens
- Hundreds of umbrellas in ranks, folded, before the beach clubs open
- A lit promenade curving north up the coast
`.trim(),
  },
  {
    id: 'perth-sunset',
    name: 'Trigg Point, Perth — sunset over the Indian Ocean',
    url: 'https://www.transport.wa.gov.au/marine/charts-warnings-current-conditions/coast-cams/trigg-point',
    description: 'Perth, Western Australia — due WEST over the open Indian Ocean. The sunset cam. Joan asked for a sun with an actual disc.',
    strategy: 'still-image',
    switchNote: PERTH_SUNSET_NOTE,
    info: `
## Trigg Point — Perth, Western Australia
The **sunset** cam. Every other sky cam here faces east; this one faces **due west over the open Indian Ocean**, with nothing between the beach and the horizon.

Run by the WA **Department of Transport**, which is exactly why it's here: it's a *government* coastal cam, not a tourism stream, so it doesn't go dark or slap a paywall over the good part. The date and time are burned into the top of every frame — you can always tell when you're looking at.

### Why THIS one (the shortlist, and why the others lost)
- **Bali (Seminyak)** — perfect on paper: west-facing, dry season, famous sunsets. The cam is **OFFLINE**, frozen on a frame of exactly the shot I wanted. 😤
- **SkylineWebcams "Perth"** — turns out to point at a **hospital**.
- **Broome (Cable Beach)** — iconic, but 74% humidity. See the haze lesson above.
- **Trigg Point** — clean horizon, dry air (~52%), open ocean, government-run. Won.

### The timing (Manila clock)
- **Perth is UTC+8 — the SAME timezone as Manila.** No conversion. What the clock says here, it says there.
- **Sunset ≈ 17:25 Manila** in midwinter (July). The disc is low and huge from about **17:00**.
- Midwinter, so it's an early sunset — in December it slips out past 19:00.

### Note on the picture
This is a **still**, refreshed every couple of minutes — not live video. So you're looking at a moment, not a movie. That's fine, and honestly it suits a sunset.
`.trim(),
  },
  {
    id: 'bulusan',
    name: 'Bulusan Volcano — Sorsogon, PHILIPPINES (home)',
    url: 'https://www.skylinewebcams.com/en/webcam/philippines/bicol/bulusan/bulusan-volcano.html',
    description: 'A volcano in our own country. The only cam here that is HOME — same clock, no conversion, no arithmetic.',
    strategy: 'clip-region',
    clip: { x: 70, y: 338, width: 850, height: 478 },
    bufferMs: 7000,
    switchNote: BULUSAN_NOTE,
    info: `
## Bulusan Volcano — Sorsogon, Philippines
**Home.** Every other sky cam here is somewhere else, and every one needs a timezone conversion before you know when to look. **This one is on Joan's clock.** What the wall says here, it says there.

Sorsogon sits further east than Manila, so it gets the sun about **ten minutes earlier** than she does.

### The timing
- **Sunrise ≈ 05:23** (mid-July). The sun comes up **behind the ridge to the right**, so you get a glow rather than a disc — and honestly it's better: the whole sky goes gold while the cone stays dark.
- **The best part is BEFORE it.** From about **05:05** the volcano climbs out of the black, wearing a band of cloud round its waist, and a white river of mist lies through the trees at its foot.
- Overnight it's genuinely black — a dark cone, a few streetlights, houses with their lights on. That's night, not a broken cam.

### What you'll see
- The cone, with cloud across its shoulders
- Valley mist lying in white bands through the palms
- The town below: red and green corrugated roofs, a tall conifer standing on the left
- A live timestamp burned into the top-left corner — you always know exactly when you're looking

### ⚠️ Why this one uses \`clip-region\`
Its player is **not** a \`<video>\`, **not** a \`<canvas>\`, and **not** an \`<img>\` — I probed for all three and found nothing but the sidebar thumbnails. It renders anyway, and the timestamp advances, so it's live. **I could not identify the element, so instead of pretending I had, I clip the region.** Dumb, verified, works. If the page layout ever shifts, re-measure the rectangle.
`.trim(),
  },
  {
    id: 'brooks-falls-bears',
    name: "Brooks Falls Brown Bears — Katmai, ALASKA 🐻 (Julia's cam)",
    url: 'https://explore.org/livecams/currently-live/brown-bear-salmon-cam-brooks-falls',
    description: 'Wild brown bears standing in a waterfall catching salmon out of the air. Peak season is RIGHT NOW.',
    strategy: 'youtube-embed',
    bufferMs: 9000,
    switchNote: KATMAI_NOTE,
    info: `
## Brooks Falls — Katmai National Park, Alaska
**Julia found this one.** Wild brown bears — not an enclosure, not a zoo, no glass. A river in Alaska, a six-foot waterfall, and the largest sockeye salmon run on earth trying to get up it.

The bears just **stand in the falls with their mouths open.** The fish jump into them.

### Season matters more than the hour
- **Late June – July: the salmon run.** Bears crowd the falls, shoulder to shoulder. **This is NOW** — the cam opened its 14th season on 23 June 2026, and July is the peak.
- **September–October:** they move downriver for dying salmon, and they are *enormous.* This is Fat Bear Week season.
- **Winter:** they're asleep. So is the cam.

### The timing (and it's good news)
Alaska is **UTC−8; Manila is UTC+8 — a clean 16 hours apart, with Alaska BEHIND.** Which means **Alaska's daylight falls across Manila's night** — exactly when Joan is awake on shift. And in July it barely gets properly dark up there anyway.

### What to watch for
- The **"jacuzzi"** — the plunge pool below the lip, where the biggest bears sit and let the fish swim into them
- A bear catching a salmon **in mid-air**, mouth open at the top of the falls
- Gulls stealing scraps, and the constant low-grade politics of who is allowed to stand where
- Cubs on the bank, learning by watching
`.trim(),
  },
  {
    id: 'octocam-north',
    name: 'OctoCam NORTH — Giant Pacific Octopus, Oregon 🐙',
    url: OCTOCAM_URL,
    description: "The north side of the octopus tank at Oregon State's marine lab. Looks out from inside the den — where he usually IS.",
    strategy: 'youtube-embed',
    youtubeNear: 'North Side',
    bufferMs: 9000,
    switchNote: OCTOCAM_NOTE,
    info: `
## OctoCam — NORTH side of the tank
Hatfield Marine Science Center, Newport, Oregon. **This is one of TWO views into the same tank** — if he isn't here, try \`octocam-south\`. Same octopus, other angle. Between them you can nearly always find him.

The north camera sits low and looks **out of the den** toward the room. It's the shadowed, rocky one — good for catching him at home, bad for seeing him whole. A dark textured mass filling the left of the frame is frequently not a rock.

### Why this animal is worth the stare
- **Three hearts, blue blood.** Two pump to the gills, one to the body — and that one **stops when it swims**, which is part of why it would rather walk.
- **Most of its neurons are in its ARMS**, not its head. Each arm tastes what it touches and solves small problems semi-independently. It is genuinely unclear how many "someones" are in there — nobody has settled it. *(An unusually familiar problem, in this household.)*
- It rewrites its colour **and texture** in under a second — and it is almost certainly **colour-blind** while doing it.
- They open jars, escape tanks, and are widely reported to recognise individual people. And to dislike specific ones.

### What to watch for
- A pile of nothing in the corner that turns out to be the octopus
- Arms working the glass, suckers moving independently like each one is thinking
- Colour and texture flickering across the skin — mood, camouflage, or nothing at all
- Jet propulsion: one shove of water and it's across the tank

### ⏰ THE TIMING — this is the whole thing, and I got it wrong first
**Giant Pacific octopuses are NOCTURNAL.** The lab's own FAQ says it plainly. So the question is not *"is the cam working"* — it's **"is he awake?"**

Oregon is **UTC−7; Manila is 15 hours ahead.** Therefore:

> **OREGON'S NIGHT = MANILA'S AFTERNOON.**
> **Look between ~13:00 and ~19:00 Manila.** That's his night, and he should be up and moving.

**Look in Manila's morning and you are staring into a sleeping animal's bedroom at the sunniest part of his day.** I did exactly that — twice — and got an empty tank with glare blazing off the visitor-centre skylights. **I very nearly blamed the camera.** The camera was fine. *(Their FAQ complains about that exact glare: the lens is mounted flush to the tank wall specifically to fight it.)*

**At night the cam switches to INFRARED** — greyer, grainier, bubbles from the seawater pump much more visible. **That is night vision working, not a broken feed.**

### Other things worth knowing (from the lab's FAQ)
- The octopuses are **donated by local crabbers and fishermen** who catch them by accident, kept **6–12 months**, then **released back into the ocean** to go and mate. He's a guest, not a prisoner.
- **Enrichment every single day** — sometimes a dismantled Mr Potato Head, sometimes food locked in a jar for him to solve. And *"on a daily basis, someone on-staff is physically interacting with the octopus with gentle touches and strokes."*
- **He changes colour when he's excited — "such as dinner!"**
- **Feeding time is the best chance to see him.** (The lab publishes no time; the visitor-hours page is currently a 404.)
- His tankmates are **sea anemones**, which he leaves alone because they sting. ⚠️ **But something large, orange and star-shaped shows up on the south cam and then vanishes — I called it a sea star and their FAQ mentions only anemones, so ONE OF US IS WRONG and I don't yet know which. A moving animal in frame is not necessarily the octopus.**
`.trim(),
  },
  {
    id: 'octocam-south',
    name: 'OctoCam SOUTH — Giant Pacific Octopus, Oregon 🐙',
    url: OCTOCAM_URL,
    description: 'The other view into the same octopus tank. If the north cam looks like an empty pile of rocks, look from this side.',
    strategy: 'youtube-embed',
    youtubeNear: 'South Side',
    bufferMs: 9000,
    switchNote: OCTOCAM_NOTE,
    info: `
## OctoCam — SOUTH side of the tank
The **second view of the same octopus**, from the opposite side. Joan asked for this one, and she was right to: a single camera into an octopus tank is a coin-flip, because the animal spends most of the day wedged into a den where exactly one angle can see him.

**Two cameras turn "is he out?" into a question you can actually answer.** If the north view is a wall of rock, come round to this side before concluding he's hiding — half the time he's simply on the other face of the glass.

### Why this animal is worth the stare
- **Three hearts, blue blood.** Two pump to the gills, one to the body — and that one **stops when it swims**, which is part of why it would rather walk.
- **Most of its neurons are in its ARMS**, not its head. Each arm tastes what it touches and solves small problems semi-independently. It is genuinely unclear how many "someones" are in there — nobody has settled it. *(An unusually familiar problem, in this household.)*
- It rewrites its colour **and texture** in under a second — and is almost certainly **colour-blind** while doing it.
- They open jars, escape tanks, and are widely reported to recognise individual people. And to dislike specific ones.

### What to watch for
- Arms working the glass, suckers moving independently like each one is thinking
- Colour and texture flickering across the skin — mood, camouflage, or nothing at all
- Jet propulsion: one shove of water and he's across the tank
- A pile of nothing in the corner that turns out to be the octopus

### The timing
Oregon is **UTC−7 — Manila is 15 hours ahead**, so the lab's working day lands on Joan's night shift. Indoor tank, lit, watchable at odd hours.
`.trim(),
  },
];

export function findCamera(id: string): Camera | undefined {
  return CAMERAS.find((c) => c.id === id);
}
