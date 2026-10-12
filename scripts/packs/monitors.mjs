/**
 * The monitors pack: the keys that switch monitor inputs and set their brightness, each on its monitor's color, with
 * the desk mode key and the lock, which go with them. Labels are text written as paths (see `scripts/text.mjs`), and
 * the glyphs are sized as on the monitor keys, where the suns span a little over half of the tile.
 */
import { brightnessGlyph, computerGlyph, dimGlyph, laptopGlyph, lockGlyph } from "../../src/glyphs.mjs";
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

export default {
  folder: "com.daczarne.monitors.sdIconPack",
  tag: "monitors",
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
    {
      path: "lock.svg",
      name: "Lock",
      tags: ["lock"],
      draw: (size) => `${tile(size, TILES.navy)}
        ${lockGlyph(size, { color: WHITE, slot: ACCENTS.cobalt })}`,
    },
  ],
  logo: (size) => scaled(size, computerGlyph(size), COMPUTER_SPAN, LOGO_SPAN),
};
