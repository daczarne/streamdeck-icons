/**
 * Builds an icon pack from its definition in `scripts/packs/`: its icons, and an `icons.json` written from the same
 * list, so every icon has its entry and the reverse. A definition lists its icons, or builds the list with the helpers
 * here, such as {@link plainGlyphs} and {@link tiledGlyphs} for a glyph plain and on every tile of
 * {@link TILE_SCHEMES}.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { ACCENTS, INK, TILES, WHITE } from "../src/palette.mjs";
import { svgDoc } from "../src/svg.mjs";

/** @import { GlyphOptions } from "../src/glyphs.mjs" */

/**
 * A glyph as the packs draw it: at a size, in a color, or in its own colors without one.
 *
 * @typedef {(size: number, options?: GlyphOptions) => string} Draw
 */

/**
 * A glyph to draw plain and on every tile: see {@link plainGlyphs}.
 *
 * @typedef {object} GlyphEntry
 * @property {string} id the start of its file names
 * @property {string} name
 * @property {string[]} tags
 * @property {Draw} draw
 * @property {number} span how much of its own canvas it covers, at its widest or tallest
 * @property {number} packSpan how much of a pack icon it covers
 * @property {"lit" | "red"} [tone] the tile's shade it's drawn in, in place of the tile's ink
 * @property {boolean} [fade] an off state, drawn in the ink faded toward the tile
 */

/**
 * A tiled scheme: see {@link TILE_SCHEMES}.
 *
 * @typedef {{ name: string, tile: string, ink: string, lit: string, red: string }} TileScheme
 */

/**
 * An icon of a pack, as {@link writePack} writes it.
 *
 * @typedef {object} Icon
 * @property {string} path its file, in the pack's `icons/`
 * @property {string} name
 * @property {string[]} tags
 * @property {(size: number) => string} draw its markup at a size
 */

/**
 * A pack's definition, as `scripts/packs/` exports it: see {@link writePack}.
 *
 * @typedef {object} Pack
 * @property {string} folder
 * @property {string} tag
 * @property {Icon[]} icons
 * @property {(size: number) => string} logo
 */

/**
 * The tiled schemes: a glyph in `ink` on a `tile` that fills the icon, like the monitor keys. The Deck's keys round the
 * corners themselves, so the tile doesn't. Besides its `ink`, each tile has its own shade of the glyphs' other tones,
 * readable on it: `lit` for lights that are on, and `red`.
 */
/** @type {TileScheme[]} */
const TILE_SCHEMES = [
  { name: "charcoal", tile: TILES.charcoal, ink: WHITE, lit: ACCENTS.gold, red: ACCENTS.scarlet },
  { name: "grey", tile: TILES.grey, ink: INK, lit: ACCENTS.ochre, red: ACCENTS.crimson },
  { name: "navy", tile: TILES.navy, ink: WHITE, lit: ACCENTS.gold, red: ACCENTS.scarlet },
  { name: "aubergine", tile: TILES.aubergine, ink: WHITE, lit: ACCENTS.gold, red: ACCENTS.scarlet },
  { name: "forest", tile: TILES.forest, ink: WHITE, lit: ACCENTS.gold, red: ACCENTS.scarlet },
  // Already the color of light, so lights that are on are drawn in the ink, against the faded ink of those that are
  // off.
  { name: "honey", tile: TILES.honey, ink: INK, lit: INK, red: ACCENTS.crimson },
];

// How far an off glyph fades toward its tile: dimmer than an on one, and still readable.
const OFF_FADE = 0.5;

// The size Elgato asks for an icon in a pack, and the one it recommends for the pack's own icon.
const PACK_ICON_SIZE = 144;
const PACK_LOGO_SIZE = 56;

/**
 * A glyph drawn at `size`, scaled about the center from its own span to its span in the pack.
 *
 * @param {number} size
 * @param {string} glyph its markup
 * @param {number} span
 * @param {number} packSpan
 * @returns {string}
 */
export function scaled(size, glyph, span, packSpan) {
  const c = size / 2;
  return `<g transform="translate(${c} ${c}) scale(${packSpan / span}) translate(${-c} ${-c})">${glyph}</g>`;
}

/**
 * The color `share` of the way from `from` to `to`, both as six-digit hex colors.
 *
 * @param {string} from
 * @param {string} to
 * @param {number} share
 * @returns {string}
 */
function mix(from, to, share) {
  /** @type {(hex: string, i: number) => number} */
  const channel = (hex, i) => parseInt(hex.slice(i, i + 2), 16);
  return `#${[1, 3, 5]
    .map((i) => {
      const v = channel(from, i);
      return Math.round(v + (channel(to, i) - v) * share)
        .toString(16)
        .padStart(2, "0");
    })
    .join("")
    .toUpperCase()}`;
}

/**
 * A tile of `color` that fills an icon of `size`, for glyphs and text to go on. The Deck rounds its corners.
 *
 * @param {number} size
 * @param {string} color
 * @returns {string}
 */
export function tile(size, color) {
  return `<rect width="${size}" height="${size}" fill="${color}"/>`;
}

/**
 * The pack entry of a glyph on one tile, which fills the icon.
 *
 * @param {GlyphEntry} glyph
 * @param {TileScheme} scheme
 * @returns {Icon}
 */
function tiledIcon({ id, name, tags, draw, span, packSpan, tone, fade }, scheme) {
  const { name: tileName, tile: tileColor, ink } = scheme;
  const color = tone ? scheme[tone] : fade ? mix(ink, tileColor, OFF_FADE) : ink;
  return {
    path: `${id}-${tileName}.svg`,
    name: `${name} (${tileName})`,
    tags: ["tile", tileName, ...tags],
    draw: (size) => `${tile(size, tileColor)}
      ${scaled(size, draw(size, { color }), span, packSpan)}`,
  };
}

/**
 * Writes a glyph's markup as a complete SVG document of `size`, creating its folder if needed.
 *
 * @param {string} filePath
 * @param {string} svg
 * @param {number} size
 * @returns {void}
 */
function writeSvg(filePath, svg, size) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  // The templates leave trailing spaces on some lines, such as where an optional element is left out.
  writeFileSync(filePath, `${svgDoc(size, svg).replace(/[ \t]+$/gm, "")}\n`);
  console.log("wrote", filePath);
}

/**
 * The icons of `glyphs`, each drawn by `draw(size, { color })`, with an `id` for its file names, a `name` and `tags`:
 * every glyph plain, in its default colors on transparent, then every tile's set of them. `span` is how much of its own
 * canvas a glyph covers at its widest or tallest, strokes included, and `packSpan` how much of a pack icon it covers,
 * the same in every set. On a tile, `tone` draws a glyph in the tile's shade of that tone rather than in its ink, and
 * `fade` marks an off state, drawn in an ink faded toward the tile.
 *
 * @param {GlyphEntry[]} glyphs
 * @returns {Icon[]}
 */
export function plainGlyphs(glyphs) {
  return glyphs.map(({ id, name, tags, draw, span, packSpan }) => ({
    path: `${id}.svg`,
    name,
    tags,
    draw: (size) => scaled(size, draw(size), span, packSpan),
  }));
}

/**
 * The icons of `glyphs` (see {@link plainGlyphs}) on every tile of {@link TILE_SCHEMES}.
 *
 * @param {GlyphEntry[]} glyphs
 * @returns {Icon[]}
 */
export function tiledGlyphs(glyphs) {
  return TILE_SCHEMES.flatMap((scheme) => glyphs.map((glyph) => tiledIcon(glyph, scheme)));
}

/**
 * Writes a pack into its `folder`, from:
 * - `icons`, in the order the Icon Library shows them, each with a `path` for its file, a `name`, `tags`, and `draw`,
 *   which returns its markup for a given size.
 * - `logo`, the pack's own icon.
 * - `tag`, given to every icon before its own tags, so a search for it finds the whole pack.
 *
 * @param {Pack} pack
 * @returns {void}
 */
export function writePack({ folder, tag, icons, logo }) {
  const root = path.resolve(folder);
  // Rewritten from scratch, so an icon removed from the list doesn't linger.
  rmSync(path.join(root, "icons"), { recursive: true, force: true });
  for (const icon of icons) {
    writeSvg(path.join(root, "icons", icon.path), icon.draw(PACK_ICON_SIZE), PACK_ICON_SIZE);
  }
  const entries = icons.map(({ path, name, tags }) => ({ path, name, tags: [tag, ...tags] }));
  writeFileSync(path.join(root, "icons.json"), `${JSON.stringify(entries, null, 2)}\n`);
  console.log("wrote", path.join(root, "icons.json"));
  writeSvg(path.join(root, "icon.svg"), logo(PACK_LOGO_SIZE), PACK_LOGO_SIZE);
}
