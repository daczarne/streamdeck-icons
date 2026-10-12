/**
 * Builds an icon pack from its definition in `scripts/packs/`. Every glyph of a pack comes plain, in its default colors
 * on transparent, and on every tile of {@link TILE_SCHEMES}, at the same size in all of them. The pack's `icons.json`
 * is written from the same list as its icons, so every icon has its entry and the reverse.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { ACCENTS, INK, TILES, WHITE } from "../src/palette.mjs";
import { svgDoc } from "../src/svg.mjs";

/**
 * The tiled schemes: a glyph in `ink` on a `tile` that fills the icon, like the monitor keys. The Deck's keys round the
 * corners themselves, so the tile doesn't. Besides its `ink`, each tile has its own shade of the glyphs' other tones,
 * readable on it: `lit` for lights that are on, and `red`.
 */
const TILE_SCHEMES = [
  { name: "charcoal", tile: TILES.charcoal, ink: WHITE, lit: ACCENTS.gold, red: ACCENTS.scarlet },
  { name: "grey", tile: TILES.grey, ink: INK, lit: ACCENTS.ochre, red: ACCENTS.crimson },
];

// How far an off glyph fades toward its tile: dimmer than an on one, and still readable.
const OFF_FADE = 0.5;

// The size Elgato asks for an icon in a pack, and the one it recommends for the pack's own icon.
const PACK_ICON_SIZE = 144;
const PACK_LOGO_SIZE = 56;

/** A glyph drawn at `size`, scaled about the center from its own span to its span in the pack. */
function scaled(size, glyph, span, packSpan) {
  const c = size / 2;
  return `<g transform="translate(${c} ${c}) scale(${packSpan / span}) translate(${-c} ${-c})">${glyph}</g>`;
}

/** The color `share` of the way from `from` to `to`, both as six-digit hex colors. */
function mix(from, to, share) {
  const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [a, b] = [channels(from), channels(to)];
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * share).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

/** The pack entry of a glyph on one tile, which fills the icon. */
function tiledIcon(tag, { id, name, tags, draw, span, packSpan, tone, fade }, scheme) {
  const { name: tileName, tile, ink } = scheme;
  const color = tone ? scheme[tone] : fade ? mix(ink, tile, OFF_FADE) : ink;
  return {
    path: `${id}-${tileName}.svg`,
    name: `${name} (${tileName})`,
    tags: [tag, "tile", tileName, ...tags],
    draw: (size) => `<rect width="${size}" height="${size}" fill="${tile}"/>
      ${scaled(size, draw(size, { color }), span, packSpan)}`,
  };
}

function writeSvg(filePath, svg, size) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  // The templates leave trailing spaces on some lines, such as where an optional element is left out.
  writeFileSync(filePath, `${svgDoc(size, svg).replace(/[ \t]+$/gm, "")}\n`);
  console.log("wrote", filePath);
}

/**
 * Writes a pack into its `folder`, from:
 * - `glyphs`, each drawn by `draw(size, { color })`, with an `id` for its file names, a `name` and `tags`. `span` is
 *   how much of its own canvas a glyph covers at its widest or tallest, strokes included, and `packSpan` how much of a
 *   pack icon it covers. On a tile, `tone` draws a glyph in the tile's shade of that tone rather than in its ink, and
 *   `fade` marks an off state, drawn in an ink faded toward the tile.
 * - `extras`, icons that come only plain, drawn as they are.
 * - `logo`, the pack's own icon.
 * - `tag`, given to every icon, so a search for it finds the whole pack.
 *
 * The icons come in the order the Icon Library shows them: the plain glyphs and the extras, then each tile's set.
 */
export function writePack({ folder, tag, glyphs, extras, logo }) {
  const root = path.resolve(folder);
  const icons = [
    ...glyphs.map(({ id, name, tags, draw, span, packSpan }) => ({
      path: `${id}.svg`,
      name,
      tags: [tag, ...tags],
      draw: (size) => scaled(size, draw(size), span, packSpan),
    })),
    ...extras.map((icon) => ({ ...icon, tags: [tag, ...icon.tags] })),
    ...TILE_SCHEMES.flatMap((scheme) => glyphs.map((glyph) => tiledIcon(tag, glyph, scheme))),
  ];
  // Rewritten from scratch, so an icon removed from the list doesn't linger.
  rmSync(path.join(root, "icons"), { recursive: true, force: true });
  for (const icon of icons) {
    writeSvg(path.join(root, "icons", icon.path), icon.draw(PACK_ICON_SIZE), PACK_ICON_SIZE);
  }
  const entries = icons.map(({ path, name, tags }) => ({ path, name, tags }));
  writeFileSync(path.join(root, "icons.json"), `${JSON.stringify(entries, null, 2)}\n`);
  console.log("wrote", path.join(root, "icons.json"));
  writeSvg(path.join(root, "icon.svg"), logo(PACK_LOGO_SIZE), PACK_LOGO_SIZE);
}
