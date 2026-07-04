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
  strategy?: 'iframe' | 'youtube-embed';
  // 'iframe' (default): screenshot the largest iframe on the page.
  // 'youtube-embed': read [data-video-id] off the page, then load the YouTube
  //   embed directly with the cam page as referer (needed when the page uses a
  //   click-to-play poster that never starts in a headless browser).
}

// Shared note for all Monterey Bay Aquarium exhibit cams
const MBA_HOURS_NOTE =
  '🕐 Monterey cams are live 7 a.m.–7 p.m. Pacific (10 p.m.–10 a.m. in Manila). Outside those hours the stream may show recorded footage — still pretty, just not live.';

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
];

export function findCamera(id: string): Camera | undefined {
  return CAMERAS.find((c) => c.id === id);
}
