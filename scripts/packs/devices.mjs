/**
 * The devices pack: icons for the devices around the Deck. So far, the keys that switch monitor inputs and set their
 * brightness, each on its monitor's color, with the desk mode key and the locks, which go with them, the keys that
 * switch the sound between speakers and headphones, and a mouse on every tile. Labels are text written as paths (see
 * `scripts/text.mjs`), and the glyphs are sized as on the monitor keys, where the suns span a little over half of the
 * tile.
 */
import {
  brightnessGlyph,
  computerGlyph,
  dimGlyph,
  headphonesGlyph,
  laptopGlyph,
  lockGlyph,
  macStudioGlyph,
  mouseGlyph,
  speakerGlyph,
} from "../../src/glyphs.mjs";
import { ACCENTS, INK, TILES, WHITE } from "../../src/palette.mjs";
import { scaled, tile } from "../pack-builder.mjs";
import { textGlyph } from "../text.mjs";

/** @import { LockOptions } from "../../src/glyphs.mjs" */
/** @import { Icon, Pack } from "../pack-builder.mjs" */

/**
 * What an icon shows, which sorts the icons on the same tile: see {@link SHOWS}.
 *
 * @typedef {"blank" | "device" | "glyph" | "text"} Shows
 */

/**
 * An icon, with the tile it's on and what it shows, by which {@link byTile} sorts it.
 *
 * @typedef {Icon & { tile: string, shows: Shows }} Entry
 */

/**
 * A monitor: see {@link MONITORS}.
 *
 * @typedef {{ id: string, name: string, label: string[], color: string, suns: boolean }} Monitor
 */

/**
 * One of a monitor's keys, before it's placed on the monitor's tile: see {@link monitorIcons}.
 *
 * @typedef {{ kind: string, name: string, shows: Shows, tags: string[], draw: (size: number) => string }} MonitorKey
 */

/**
 * A lock: see {@link LOCKS}.
 *
 * @typedef {{ id: string, name: string, tags: string[], options: Pick<LockOptions, "open">, bar?: boolean }} Lock
 */

/**
 * A tile the locks come on: see {@link LOCK_TILES}.
 *
 * @typedef {{ suffix: string, name: string, tags: string[], tile: string, slot: string }} LockTile
 */

/** The order of what the icons on the same tile show: the blank tile, then devices, then other glyphs, then text. */
/** @type {Shows[]} */
const SHOWS = ["blank", "device", "glyph", "text"];

// The suns as on the monitor keys, from their span on their own canvas to their span on a tile.
const SUN_SPAN = 0.865;
const SUN_TILE_SPAN = 0.57;

// The frame of the desk mode key while it's on, as a share of the icon, along its edge.
const FRAME = 0.08;

// The computer glyph's span, for the pack's own icon, which it fills.
const COMPUTER_SPAN = 0.5625;
const LOGO_SPAN = 0.86;

/** Each monitor, its label and its color. `suns` marks the monitors that have brightness keys. */
/** @type {Monitor[]} */
const MONITORS = [
  { id: "left", name: "Left", label: ["LEFT"], color: TILES.teal, suns: true },
  { id: "center", name: "Center", label: ["CENTER"], color: TILES.blue, suns: true },
  { id: "top-right", name: "Top right", label: ["TOP", "RIGHT"], color: TILES.plum, suns: true },
  { id: "bottom-right", name: "Bottom right", label: ["BOTTOM", "RIGHT"], color: TILES.rust, suns: true },
  { id: "all", name: "All", label: ["ALL"], color: TILES.slate, suns: false },
];

/**
 * The keys of one monitor, each on its tile: the blank tile, the label, the inputs, then the brightness keys, for the
 * monitors that have them.
 *
 * @param {Monitor} monitor
 * @returns {Entry[]}
 */
function monitorIcons(monitor) {
  /** @type {MonitorKey[]} */
  const kinds = [
    { kind: "tile", name: "tile", shows: "blank", tags: ["tile", "blank"], draw: () => "" },
    {
      kind: "label",
      name: "label",
      shows: "text",
      tags: ["label"],
      draw: (size) => textGlyph(size, monitor.label, { color: WHITE }),
    },
    {
      kind: "laptop",
      name: "laptop",
      shows: "device",
      tags: ["laptop", "input"],
      draw: (size) => laptopGlyph(size, { color: WHITE }),
    },
    {
      kind: "computer",
      name: "computer",
      shows: "device",
      tags: ["computer", "desktop", "input"],
      draw: (size) => computerGlyph(size, { color: WHITE }),
    },
    {
      kind: "mac-studio",
      name: "Mac Studio",
      shows: "device",
      tags: ["computer", "desktop", "mac", "input"],
      draw: (size) => macStudioGlyph(size, { color: WHITE }),
    },
    ...(monitor.suns
      ? /** @satisfies {MonitorKey[]} */ ([
          {
            kind: "brightness",
            name: "brightness",
            shows: "glyph",
            tags: ["sun", "brightness"],
            draw: (size) => scaled(size, brightnessGlyph(size, { color: WHITE }), SUN_SPAN, SUN_TILE_SPAN),
          },
          {
            kind: "brightness-low",
            name: "brightness low",
            shows: "glyph",
            tags: ["sun", "brightness", "dim"],
            draw: (size) => scaled(size, dimGlyph(size, { color: WHITE }), SUN_SPAN, SUN_TILE_SPAN),
          },
        ])
      : []),
  ];
  return kinds.map(({ kind, name, shows, tags, draw }) => ({
    tile: monitor.color,
    shows,
    path: `${monitor.id}-${kind}.svg`,
    name: `${monitor.name} ${name}`,
    tags: ["monitor", ...monitor.id.split("-"), ...tags],
    draw: (size) => `${tile(size, monitor.color)}
      ${draw(size)}`,
  }));
}

/** The locks: the original with its bar, then the keyhole lock, locked and in each unlocked style. */
/** @type {Lock[]} */
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
/** @type {LockTile[]} */
const LOCK_TILES = [
  { suffix: "", name: "", tags: [], tile: TILES.navy, slot: ACCENTS.cobalt },
  { suffix: "-green", name: " (green)", tags: ["green", "safe"], tile: TILES.green, slot: ACCENTS.sage },
  { suffix: "-red", name: " (red)", tags: ["red", "unsafe"], tile: TILES.red, slot: ACCENTS.scarlet },
];

/**
 * The locks on one of {@link LOCK_TILES}.
 *
 * @param {LockTile} lockTile
 * @returns {Entry[]}
 */
function lockIcons({ suffix, name, tags, tile: color, slot }) {
  return LOCKS.map((lock) => ({
    tile: color,
    shows: "glyph",
    path: `${lock.id}${suffix}.svg`,
    name: `${lock.name}${name}`,
    tags: [...lock.tags, ...tags],
    draw: (size) => `${tile(size, color)}
      ${lockGlyph(size, { color: WHITE, slot, keyhole: !lock.bar, ...lock.options })}`,
  }));
}

/**
 * The mouse, outlined then filled, each on every tile of the palette, in the ink each tile takes: `INK` on the light
 * ones.
 *
 * @returns {Entry[]}
 */
function mouseIcons() {
  return [false, true].flatMap((filled) =>
    Object.entries(TILES).map(([name, color]) => ({
      tile: color,
      shows: "device",
      path: `mouse${filled ? "-filled" : ""}-${name}.svg`,
      name: `Mouse${filled ? " filled" : ""} (${name})`,
      tags: ["mouse", filled ? "filled" : "outlined", "tile", name],
      draw: (size) => `${tile(size, color)}
        ${mouseGlyph(size, { color: color === TILES.grey || color === TILES.honey ? INK : WHITE, filled })}`,
    })),
  );
}

/**
 * The icons in the order the Icon Library shows them: by their tile, in the palette's order, then by what they show, in
 * the order of {@link SHOWS}. Icons that share both keep the order they're given in.
 *
 * @param {Entry[]} entries
 * @returns {Icon[]}
 */
function byTile(entries) {
  const tiles = Object.values(TILES);
  /** @param {Entry} entry */
  const rank = (entry) => tiles.indexOf(entry.tile) * SHOWS.length + SHOWS.indexOf(entry.shows);
  return entries.toSorted((a, b) => rank(a) - rank(b)).map(({ tile: _tile, shows: _shows, ...icon }) => icon);
}

export default /** @satisfies {Pack} */ ({
  folder: "com.daczarne.devices.sdIconPack",
  tag: "devices",
  // Within a tile and what they show, each monitor's keys, then the audio keys, the mouse, the desk mode keys and the
  // locks, as given here.
  icons: byTile([
    ...MONITORS.flatMap(monitorIcons),
    {
      tile: TILES.navy,
      shows: "device",
      path: "speakers.svg",
      name: "Speakers",
      tags: ["audio", "sound", "speakers", "output"],
      draw: (size) => `${tile(size, TILES.navy)}
        ${speakerGlyph(size, { color: WHITE })}`,
    },
    {
      tile: TILES.navy,
      shows: "device",
      path: "headphones.svg",
      name: "Headphones",
      tags: ["audio", "sound", "headphones", "output"],
      draw: (size) => `${tile(size, TILES.navy)}
        ${headphonesGlyph(size, { color: WHITE })}`,
    },
    ...mouseIcons(),
    {
      tile: TILES.green,
      shows: "text",
      path: "desk-mode-off.svg",
      name: "Desk mode off",
      tags: ["desk", "mode", "off"],
      draw: (size) => `${tile(size, TILES.green)}
        ${textGlyph(size, ["Desk", "Mode", "OFF"], { color: WHITE })}`,
    },
    {
      tile: TILES.red,
      shows: "text",
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
  ]),
  logo: (size) => scaled(size, computerGlyph(size), COMPUTER_SPAN, LOGO_SPAN),
});
