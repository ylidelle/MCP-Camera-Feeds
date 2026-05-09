export interface Camera {
  id: string;
  name: string;
  url: string;
  description: string;
  info: string;
  bufferMs?: number;    // extra time to wait for stream to load (default 5000ms)
  clickToPlay?: boolean; // whether to click the center of the video iframe to start playback
}

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
    bufferMs: 9000,
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
];

export function findCamera(id: string): Camera | undefined {
  return CAMERAS.find((c) => c.id === id);
}
