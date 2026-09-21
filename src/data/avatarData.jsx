/**
 * avatarData.jsx
 * 16 polished, kid-friendly headshot avatars.
 *
 * The SVGs are PRE-RENDERED (DiceBear "Adventurer") into static files under
 * public/avatars/ by scripts/gen-avatars.mjs, so neither the DiceBear library
 * nor the avatar data ships in the JS bundle — each avatar is a cached static
 * asset fetched only when shown. Regenerate with `npm run gen:avatars` after
 * changing the style/seeds/backgrounds.
 *
 * The 16 IDs are unchanged from the original set, so existing users keep their
 * chosen avatar. Each ID doubles as the deterministic seed AND the file name.
 *
 * Avatar art: "Adventurer" by Lisa Wischofsky, licensed CC BY 4.0 (see README).
 *
 * Categories: "critters" | "characters" drive the picker's filter tabs. The
 * old Girls/Boys split is gone: nobody is sorted by gender to pick a face.
 * tabs. The generator (scripts/gen-avatars.mjs) pins the girl set to long hair
 * and the boy set to short hair, so each face clearly matches its tab.
 */

// Return a render fn compatible with the Avatar/AvatarGrid API: `svg(size)`.
const build = (id) => {
  const src = `/avatars/${id}.svg`;
  // `size` sets the intrinsic pixel size; the img fills its wrapper so the grid
  // can scale avatars responsively (bigger on wider screens) via the cell width.
  const render = (size = 48) => (
    <img
      src={src}
      alt=""
      loading="lazy"
      draggable={false}
      width={size}
      height={size}
      className="h-full w-full rounded-full"
    />
  );
  return render;
};

// ── Character set (was the Girls tab) ────────────────────────────────────────
const feminineAvatars = [
  { id: "astro-girl",     label: "Space Explorer", category: "characters", svg: build("astro-girl") },
  { id: "pixel-princess", label: "Cyber Princess", category: "characters", svg: build("pixel-princess") },
  { id: "skater-girl",    label: "Skater Star",    category: "characters", svg: build("skater-girl") },
  { id: "wizard-girl",    label: "Spell Caster",   category: "characters", svg: build("wizard-girl") },
  { id: "music-girl",     label: "Beat Maker",     category: "characters", svg: build("music-girl") },
  { id: "coder-girl",     label: "Code Queen",     category: "characters", svg: build("coder-girl") },
  { id: "artist-girl",    label: "Art Star",       category: "characters", svg: build("artist-girl") },
  { id: "science-girl",   label: "Lab Genius",     category: "characters", svg: build("science-girl") },
];

// ── Character set (was the Boys tab) ────────────────────────────────────────────────────────────
const masculineAvatars = [
  { id: "ninja-boy",    label: "Cyber Ninja",   category: "characters", svg: build("ninja-boy") },
  { id: "gamer-boy",    label: "Pro Gamer",     category: "characters", svg: build("gamer-boy") },
  { id: "robot-boy",    label: "Mecha Bot",     category: "characters", svg: build("robot-boy") },
  { id: "skater-boy",   label: "Board Rider",   category: "characters", svg: build("skater-boy") },
  { id: "explorer-boy", label: "Wild Explorer", category: "characters", svg: build("explorer-boy") },
  { id: "rocket-boy",   label: "Rocket Kid",    category: "characters", svg: build("rocket-boy") },
  { id: "sport-boy",    label: "All-Star",      category: "characters", svg: build("sport-boy") },
  { id: "dino-boy",     label: "Dino Rider",    category: "characters", svg: build("dino-boy") },
];

// ── Pets set ─────────────────────────────────────────────────────────────────
// Gender-neutral animals, drawn for Learntopia as flat SVGs in public/avatars/
// rather than generated: the DiceBear styles behind the sets above have no
// animal faces. They share the frame (762x762, pastel ground, face filling most
// of it) so the picker grid reads evenly. A learner who skips profile setup gets
// one of these, so nobody is assigned a gendered face by default.
const petAvatars = [
  { id: "pet-cat",     label: "Whiskers",     category: "critters", svg: build("pet-cat") },
  { id: "pet-dog",     label: "Scout",     category: "critters", svg: build("pet-dog") },
  { id: "pet-fox",     label: "Ember",     category: "critters", svg: build("pet-fox") },
  { id: "pet-panda",   label: "Bamboo",   category: "critters", svg: build("pet-panda") },
  { id: "pet-owl",     label: "Hoots",     category: "critters", svg: build("pet-owl") },
  { id: "pet-penguin", label: "Waddles", category: "critters", svg: build("pet-penguin") },
  { id: "pet-rabbit",  label: "Nibbles",  category: "critters", svg: build("pet-rabbit") },
  { id: "pet-bear",    label: "Rumble",    category: "critters", svg: build("pet-bear") },
  { id: "pet-frog",    label: "Ribbit",    category: "critters", svg: build("pet-frog") },
  { id: "pet-koala",   label: "Snooze",   category: "critters", svg: build("pet-koala") },
];

export const AVATARS = [...petAvatars, ...feminineAvatars, ...masculineAvatars];

/** Avatar given to a learner who does not choose one. */
export const randomPetAvatarId = () => petAvatars[Math.floor(Math.random() * petAvatars.length)].id;

export const getAvatarById = (id) => AVATARS.find((a) => a.id === id) || null;

export const DEFAULT_AVATAR_ID = null;
