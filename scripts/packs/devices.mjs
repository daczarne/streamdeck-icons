/**
 * The devices pack: icons for the devices around the Deck. So far, the keys that switch monitor inputs and set their
 * brightness, each on its monitor's color, with the desk mode key and the locks, which go with them, and the keys that
 * switch the sound between speakers and headphones. Labels are text written as paths (see `scripts/text.mjs`), and the
 * glyphs are sized as on the monitor keys, where the suns span a little over half of the tile.
 */
import {
  brightnessGlyph,
  computerGlyph,
  dimGlyph,
  headphonesGlyph,
  laptopGlyph,
  lockGlyph,
  speakerGlyph,
} from "../../src/glyphs.mjs";
import { ACCENTS, TILES, WHITE } from "../../src/palette.mjs";
import { scaled, tile } from "../pack-builder.mjs";
import { textGlyph } from "../text.mjs";

// The suns as on the monitor keys, from their span on their own canvas to their span on a tile.
const SUN_SPAN = 0.865;
const SUN_TILE_SPAN = 0.57;

// The frame of the desk mode key while it's on, as a share of the icon, along its edge.
const FRAME = 0.08;

// The computer glyph's span, for the pack's own icon, which it fills.
const COMPUTER_SPAN = 0.5625;
const LOGO_SPAN = 0.86;

/** Each monitor, its label and its color. `suns` marks the monitors that have brightness keys. */
const MONITORS = [
  { id: "left", name: "Left", label: ["LEFT"], color: TILES.teal, suns: true },
  { id: "center", name: "Center", label: ["CENTER"], color: TILES.blue, suns: true },
  { id: "top-right", name: "Top right", label: ["TOP", "RIGHT"], color: TILES.plum, suns: true },
  { id: "bottom-right", name: "Bottom right", label: ["BOTTOM", "RIGHT"], color: TILES.rust, suns: true },
  { id: "all", name: "All", label: ["ALL"], color: TILES.slate, suns: false },
];

/**
 * The keys of one monitor, each on its tile, in the order the Icon Library shows them: the blank tile, the label, the
 * inputs, then the brightness keys, for the monitors that have them.
 */
function monitorIcons(monitor) {
  const kinds = [
    { kind: "tile", name: "tile", tags: ["tile", "blank"], draw: () => "" },
    { kind: "label", name: "label", tags: ["label"], draw: (size) => textGlyph(size, monitor.label, { color: WHITE }) },
    { kind: "laptop", name: "laptop", tags: ["laptop", "input"], draw: (size) => laptopGlyph(size, { color: WHITE }) },
    {
      kind: "computer",
      name: "computer",
      tags: ["computer", "desktop", "input"],
      draw: (size) => computerGlyph(size, { color: WHITE }),
    },
    ...(monitor.suns
      ? [
          {
            kind: "brightness",
            name: "brightness",
            tags: ["sun", "brightness"],
            draw: (size) => scaled(size, brightnessGlyph(size, { color: WHITE }), SUN_SPAN, SUN_TILE_SPAN),
          },
          {
            kind: "brightness-low",
            name: "brightness low",
            tags: ["sun", "brightness", "dim"],
            draw: (size) => scaled(size, dimGlyph(size, { color: WHITE }), SUN_SPAN, SUN_TILE_SPAN),
          },
        ]
      : []),
  ];
  return kinds.map(({ kind, name, tags, draw }) => ({
    path: `${monitor.id}-${kind}.svg`,
    name: `${monitor.name} ${name}`,
    tags: ["monitor", ...monitor.id.split("-"), ...tags],
    draw: (size) => `${tile(size, monitor.color)}
      ${draw(size)}`,
  }));
}

/** The locks: the original with its bar, then the keyhole lock, locked and in each unlocked style. */
const LOCKS = [
  { id: "lock", name: "Lock", tags: ["lock"], options: {}, bar: true },
  { id: "lock-keyhole", name: "Lock with keyhole", tags: ["lock", "keyhole", "locked"], options: {} },
  {
    id: "unlock-keyhole",
    name: "Unlocked with keyhole",
    tags: ["lock", "keyhole", "unlocked", "open"],
    options: { open: "up" },
  },
  {
    id: "unlock-keyhole-short",
    name: "Unlocked with keyhole, low shackle",
    tags: ["lock", "keyhole", "unlocked", "open"],
    options: { open: "short" },
  },
  {
    id: "unlock-keyhole-side",
    name: "Unlocked with keyhole, shackle to the side",
    tags: ["lock", "keyhole", "unlocked", "open"],
    options: { open: "side" },
  },
];

/**
 * The tiles every lock comes on, each with the shade its slot or keyhole takes, a step from the tile's own color. Navy
 * is the original lock's. Green, as desk mode off, and red, as desk mode on, mark a safe and an unsafe state.
 */
const LOCK_TILES = [
  { suffix: "", name: "", tags: [], tile: TILES.navy, slot: ACCENTS.cobalt },
  { suffix: "-green", name: " (green)", tags: ["green", "safe"], tile: TILES.green, slot: ACCENTS.sage },
  { suffix: "-red", name: " (red)", tags: ["red", "unsafe"], tile: TILES.red, slot: ACCENTS.scarlet },
];

/** The locks on one of {@link LOCK_TILES}. */
function lockIcons({ suffix, name, tags, tile: color, slot }) {
  return LOCKS.map((lock) => ({
    path: `${lock.id}${suffix}.svg`,
    name: `${lock.name}${name}`,
    tags: [...lock.tags, ...tags],
    draw: (size) => `${tile(size, color)}
      ${lockGlyph(size, { color: WHITE, slot, keyhole: !lock.bar, ...lock.options })}`,
  }));
}

export default {
  folder: "com.daczarne.devices.sdIconPack",
  tag: "devices",
  // Each monitor's keys together, then the keys that go with them.
  icons: [
    ...MONITORS.flatMap(monitorIcons),
    {
      path: "desk-mode-off.svg",
      name: "Desk mode off",
      tags: ["desk", "mode", "off"],
      draw: (size) => `${tile(size, TILES.green)}
        ${textGlyph(size, ["Desk", "Mode", "OFF"], { color: WHITE })}`,
    },
    {
      path: "desk-mode-on.svg",
      name: "Desk mode on",
      tags: ["desk", "mode", "on"],
      // The frame's stroke runs along the middle of its width, so it's inset by half of it to stay inside the icon.
      draw: (size) => `<rect x="${(FRAME * size) / 2}" y="${(FRAME * size) / 2}"
        width="${size - FRAME * size}" height="${size - FRAME * size}"
        fill="${TILES.red}" stroke="${ACCENTS.amber}" stroke-width="${FRAME * size}"/>
        ${textGlyph(size, ["Desk", "Mode", "ON"], { color: WHITE })}`,
    },
    ...LOCK_TILES.flatMap(lockIcons),
    {
      path: "speakers.svg",
      name: "Speakers",
      tags: ["audio", "sound", "speakers", "output"],
      draw: (size) => `${tile(size, TILES.navy)}
        ${speakerGlyph(size, { color: WHITE })}`,
    },
    {
      path: "headphones.svg",
      name: "Headphones",
      tags: ["audio", "sound", "headphones", "output"],
      draw: (size) => `${tile(size, TILES.navy)}
        ${headphonesGlyph(size, { color: WHITE })}`,
    },
  ],
  logo: (size) => scaled(size, computerGlyph(size), COMPUTER_SPAN, LOGO_SPAN),
};
