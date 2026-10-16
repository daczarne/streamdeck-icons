/**
 * The glyphs. Each takes the size of its square canvas, and options such as its color, and returns SVG markup for
 * {@link svgDoc}. Callers decide what to make of them: a plugin renders them to its own PNGs, and the packs here write
 * them as SVGs, plain or on a tile.
 */
import { ACCENTS } from "./palette.mjs";

// The default colors of the Litra plugin's first glyphs, which predate the palette: the marketplace icon's tile and
// lamp, and the Power key's off and on states.
const COLORS = {
  bg: "#1A1A1A",
  muted: "#6B6B6B",
  warm: "#FFB347",
  on: ACCENTS.gold,
};

/**
 * The options most glyphs take.
 *
 * @typedef {object} GlyphOptions
 * @property {string} [color] the glyph's ink, in place of its own colors
 */

/**
 * The options of {@link lockGlyph}.
 *
 * @typedef {object} LockOptions
 * @property {string} [color] the lock's ink
 * @property {string} [slot] the color of the slot or keyhole, which is cut out without one
 * @property {boolean} [keyhole] a keyhole in place of the slot
 * @property {false | "up" | "short" | "side"} [open] how the lock is unlocked, if it is
 */

/**
 * A badge drawn next to a thermometer, centered at (`cx`, `cy`) with radius `r` and strokes `sw` wide.
 *
 * @typedef {(cx: number, cy: number, r: number, sw: number, color: string) => string} Badge
 */

/**
 * Shares of a canvas of `size`, in its units, as many as given, so each can be named.
 *
 * @template {readonly number[] | []} T
 * @param {number} size
 * @param {T} shares
 * @returns {{ -readonly [K in keyof T]: number }}
 */
function toCanvas(size, shares) {
  return /** @type {{ -readonly [K in keyof T]: number }} */ (shares.map((share) => share * size));
}

/**
 * The outline of a rectangle from (`x0`, `y0`) to (`x1`, `y1`) with corners of radius `rr`, as path data.
 *
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {number} rr
 * @returns {string}
 */
function roundedRect(x0, y0, x1, y1, rr) {
  return `M ${x0 + rr} ${y0} H ${x1 - rr} A ${rr} ${rr} 0 0 1 ${x1} ${y0 + rr}
    V ${y1 - rr} A ${rr} ${rr} 0 0 1 ${x1 - rr} ${y1} H ${x0 + rr} A ${rr} ${rr} 0 0 1 ${x0} ${y1 - rr}
    V ${y0 + rr} A ${rr} ${rr} 0 0 1 ${x0 + rr} ${y0} Z`;
}

/**
 * The Power key's symbol: a ring open at the top, with a stem through the gap and, when `on`, a dot inside for
 * lights that are on. It's muted grey off and gold on, unless `color` sets both.
 *
 * @param {number} size the side of its square canvas
 * @param {{ on: boolean, color?: string }} options
 * @returns {string} its SVG markup
 */
export function powerGlyph(size, { on, color }) {
  const cx = size / 2;
  const cy = size / 2;
  const stroke = color ?? (on ? COLORS.on : COLORS.muted);
  const sw = size * 0.07;
  const r = size * 0.22;
  const stemH = size * 0.2;
  return `<path d="M ${cx} ${cy - r - stemH * 0.15} V ${cy - stemH * 0.05}"
    stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>
    <path d="M ${cx - r * 0.85} ${cy - r * 0.35} A ${r} ${r} 0 1 0 ${cx + r * 0.85} ${cy - r * 0.35}"
    stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>
    ${on ? `<circle cx="${cx}" cy="${cy + r * 0.15}" r="${size * 0.04}" fill="${color ?? COLORS.on}"/>` : ""}`;
}

/**
 * A desk lamp: a shade over a stem and a foot, filled in warm orange, or outlined in white with `mono`.
 *
 * @param {number} size the side of its square canvas
 * @param {{ mono?: boolean }} [options]
 * @returns {string} its SVG markup
 */
export function lampGlyph(size, { mono = false } = {}) {
  const cx = size / 2;
  const cy = size / 2;
  const stroke = mono ? "#FFFFFF" : COLORS.warm;
  const fill = mono ? "none" : COLORS.warm;
  const sw = Math.max(1.5, size * 0.08);
  const headR = size * 0.22;
  const stemH = size * 0.18;
  return `<path
    d="M ${cx - headR} ${cy - size * 0.02} A ${headR} ${headR * 0.85} 0 0 1 ${cx + headR} ${cy - size * 0.02}
    L ${cx + headR * 0.55} ${cy + size * 0.12} L ${cx - headR * 0.55} ${cy + size * 0.12} Z"
    fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
    <line x1="${cx}" y1="${cy + size * 0.12}" x2="${cx}" y2="${cy + size * 0.12 + stemH}"
    stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>
    <line x1="${cx - size * 0.12}" y1="${cy + size * 0.12 + stemH}"
    x2="${cx + size * 0.12}" y2="${cy + size * 0.12 + stemH}"
    stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;
}

/**
 * The Litra plugin's marketplace icon: the lamp on a dark rounded tile that fills the canvas.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function marketplaceGlyph(size) {
  return `<rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${COLORS.bg}"/> ${lampGlyph(size)}`;
}

/**
 * The Litra plugin's category icon, and the Litra pack's own: the lamp, outlined in white on transparent.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function categoryGlyph(size) {
  // Monochrome white on transparent: the plugin's category, and the lamp of the icon pack
  return lampGlyph(size, { mono: true });
}

/**
 * The Power action's icon in Stream Deck's action list: the power symbol in white, with heavier strokes than
 * {@link powerGlyph} to read at the list's small size.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function actionIconPower(size) {
  const cx = size / 2;
  const cy = size / 2;
  const sw = Math.max(1.5, size * 0.12);
  const r = size * 0.28;
  return `<path
    d="M ${cx} ${cy - r - size * 0.08} V ${cy - size * 0.02}"
    stroke="#FFFFFF" stroke-width="${sw}" stroke-linecap="round"/>
    <path d="M ${cx - r * 0.85} ${cy - r * 0.25} A ${r} ${r} 0 1 0 ${cx + r * 0.85} ${cy - r * 0.25}"
    stroke="#FFFFFF" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
}

/**
 * The Brightness action's icon in Stream Deck's action list: a sun in white.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function actionIconBrightness(size) {
  const cx = size / 2;
  const cy = size / 2;
  const core = size * 0.16;
  const rayIn = size * 0.28;
  const rayOut = size * 0.42;
  const sw = Math.max(1.5, size * 0.1);
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    return `<line x1="${cx + Math.cos(a) * rayIn}" y1="${cy + Math.sin(a) * rayIn}"
      x2="${cx + Math.cos(a) * rayOut}" y2="${cy + Math.sin(a) * rayOut}"
      stroke="#FFFFFF" stroke-width="${sw}" stroke-linecap="round"/>`;
  }).join("\n");
  return `<circle cx="${cx}" cy="${cy}" r="${core}" fill="#FFFFFF"/>\n${rays}`;
}

/**
 * The Temperature action's icon in Stream Deck's action list: a thermometer in white.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function actionIconTemperature(size) {
  const cx = size / 2;
  const sw = Math.max(1.5, size * 0.1);
  const bulbR = size * 0.16;
  const tubeW = size * 0.14;
  const top = size * 0.18;
  const bottom = size * 0.58;
  return `<rect x="${cx - tubeW / 2}" y="${top}" width="${tubeW}" height="${bottom - top}" rx="${tubeW / 2}"
    stroke="#FFFFFF" stroke-width="${sw}" fill="none"/>
    <circle cx="${cx}" cy="${bottom + bulbR * 0.35}" r="${bulbR}" fill="#FFFFFF"/>
    <line x1="${cx}" y1="${top + size * 0.12}" x2="${cx}" y2="${bottom}"
    stroke="#FFFFFF" stroke-width="${sw * 0.7}" stroke-linecap="round"/>`;
}

/**
 * The Scene action's icon in Stream Deck's action list: the thermometer of {@link actionIconTemperature} on the left,
 * and the sun of {@link actionIconBrightness} on the right, cut down a vertical line, as {@link sceneGlyph} draws them.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function actionIconScene(size) {
  const sw = Math.max(1.5, size * 0.1);
  const [tx, sx, cut] = toCanvas(size, [SCENE.thermometerX, SCENE.sunX, SCENE.cut]);
  return `<g transform="translate(${tx - size / 2} 0)">${actionIconTemperature(size)}</g>
    ${halfSun(sx, size / 2, size * 0.16 * SCENE.sunScale, size * 0.28 * SCENE.sunScale, size * 0.42 * SCENE.sunScale, cut, sw, "#FFFFFF")}`;
}

/**
 * Brightness and Temperature icons: white line art on transparent, like Stream Deck's own. Each is both the key image
 * and the dial icon, since Stream Deck's app pictures a dial with the key image.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function brightnessGlyph(size, { color = "#FFFFFF" } = {}) {
  const cx = size / 2;
  const cy = size / 2;
  const sw = size * 0.065;
  const core = size * 0.16;
  const rayIn = size * 0.27;
  const rayOut = size * 0.4;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    return `<line x1="${cx + Math.cos(a) * rayIn}" y1="${cy + Math.sin(a) * rayIn}"
      x2="${cx + Math.cos(a) * rayOut}" y2="${cy + Math.sin(a) * rayOut}"
      stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }).join("\n");
  // Filled, as large as the outlined circle was: an outline was hard to make out at the strip's sizes.
  return `<circle cx="${cx}" cy="${cy}" r="${core + sw / 2}" fill="${color}"/>\n${rays}`;
}

/**
 * A thermometer whose bar fills `level` of the tube, from the bulb up: all of it unless a glyph says otherwise.
 *
 * @param {number} size the side of its square canvas
 * @param {{ color?: string, level?: number }} [options] `level` is the share of the tube the bar fills, from 0 to 1
 * @returns {string} its SVG markup
 */
export function temperatureGlyph(size, { color = "#FFFFFF", level = 1 } = {}) {
  const cx = size / 2;
  const sw = size * 0.065;
  const tubeHalf = size * 0.08;
  const top = size * 0.12;
  const bulbR = size * 0.15;
  const bulbCy = size * 0.72;
  // Where the tube's sides meet the bulb.
  const joinY = bulbCy - Math.sqrt(bulbR ** 2 - tubeHalf ** 2);
  const barTop = top + size * 0.16;
  return `<path
    d="M ${cx - tubeHalf} ${top + tubeHalf}
    A ${tubeHalf} ${tubeHalf} 0 0 1 ${cx + tubeHalf} ${top + tubeHalf}
    V ${joinY}
    A ${bulbR} ${bulbR} 0 1 1 ${cx - tubeHalf} ${joinY} Z"
    stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"/>
    <circle cx="${cx}" cy="${bulbCy}" r="${bulbR * 0.45}" fill="${color}"/>
    <line x1="${cx}" y1="${bulbCy - (bulbCy - barTop) * level}" x2="${cx}" y2="${bulbCy}"
    stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
}

/**
 * The sun outlined rather than filled, for a lower brightness, with the rays of {@link brightnessGlyph}.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function dimGlyph(size, { color = "#FFFFFF" } = {}) {
  const cx = size / 2;
  const cy = size / 2;
  const sw = size * 0.065;
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    return `<line x1="${cx + Math.cos(a) * size * 0.27}" y1="${cy + Math.sin(a) * size * 0.27}"
      x2="${cx + Math.cos(a) * size * 0.4}" y2="${cy + Math.sin(a) * size * 0.4}"
      stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }).join("\n");
  return `<circle cx="${cx}" cy="${cy}" r="${size * 0.16}" stroke="${color}" stroke-width="${sw}"/>\n${rays}`;
}

/**
 * Where a thermometer and its badge (a snowflake or a sun) sit side by side, as shares of the canvas: the
 * thermometer's center, and the badge's center and radius. Together they span the canvas as the thermometer alone does.
 */
const BADGE = { thermometerX: 0.28, x: 0.71, y: 0.34, r: 0.18 };

/**
 * The thermometer of {@link temperatureGlyph}, moved left, with a badge drawn by `badge` at its upper right.
 *
 * @param {number} size
 * @param {string} color
 * @param {number} level
 * @param {Badge} badge
 * @returns {string}
 */
function thermometerWith(size, color, level, badge) {
  const sw = size * 0.038;
  const shift = size * (BADGE.thermometerX - 0.5);
  return `<g transform="translate(${shift} 0)">${temperatureGlyph(size, { color, level })}</g>
    ${badge(size * BADGE.x, size * BADGE.y, size * BADGE.r, sw, color)}`;
}

/**
 * A line from (`x1`, `y1`) to (`x2`, `y2`), `sw` wide with round ends, as the badges draw theirs.
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {number} sw
 * @param {string} color
 * @returns {string}
 */
function strokeLine(x1, y1, x2, y2, sw, color) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
    stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
}

/**
 * A snowflake of radius `r`: six arms, each with a pair of branches pointing outward.
 *
 * @type {Badge}
 */
function snowflake(cx, cy, r, sw, color) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 2;
    /** @type {(d: number, angle?: number) => [number, number]} */
    const at = (d, angle = a) => [cx + Math.cos(angle) * d, cy + Math.sin(angle) * d];
    const [bx, by] = at(r * 0.62);
    /** @type {(turn: number) => string} */
    const branch = (turn) => {
      const angle = a + turn;
      return strokeLine(bx, by, bx + Math.cos(angle) * r * 0.3, by + Math.sin(angle) * r * 0.3, sw, color);
    };
    return [strokeLine(cx, cy, ...at(r), sw, color), branch(Math.PI / 4), branch(-Math.PI / 4)].join("\n");
  }).join("\n");
}

/**
 * A small sun of radius `r`, filled like {@link brightnessGlyph}'s.
 *
 * @type {Badge}
 */
function smallSun(cx, cy, r, sw, color) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return strokeLine(cx + c * r * 0.68, cy + s * r * 0.68, cx + c * r, cy + s * r, sw, color);
  }).join("\n");
  return `<circle cx="${cx}" cy="${cy}" r="${r * 0.42}" fill="${color}"/>\n${rays}`;
}

/**
 * A flame of half-height `r`, a tenth taller than the other badges since it's narrower: a rounded base, a main tongue
 * leaning right and a smaller one on the left, with a teardrop cut out of its base. The cut-out keeps a margin of `sw`.
 *
 * @type {Badge}
 */
function flame(cx, cy, badgeR, sw, color) {
  const r = badgeR * 1.1;
  /** @type {(x: number, y: number) => string} */
  const at = (x, y) => `${cx + x * r} ${cy + y * r}`;
  const outer = `M ${at(0, 1)}
    C ${at(-0.72, 1)} ${at(-0.85, 0.4)} ${at(-0.58, -0.05)}
    C ${at(-0.46, -0.25)} ${at(-0.46, -0.45)} ${at(-0.52, -0.64)}
    C ${at(-0.24, -0.5)} ${at(-0.14, -0.32)} ${at(-0.12, -0.16)}
    C ${at(-0.06, -0.55)} ${at(0.18, -0.78)} ${at(0.08, -1)}
    C ${at(0.52, -0.72)} ${at(0.82, -0.22)} ${at(0.68, 0.35)}
    C ${at(0.58, 0.8)} ${at(0.3, 1)} ${at(0, 1)} Z`;
  const [ix, iy, ir] = [cx, cy + r * 0.5, r * 0.48 - sw / 2];
  const inner = `M ${ix} ${iy + ir}
    C ${ix - ir * 0.78} ${iy + ir} ${ix - ir * 0.78} ${iy} ${ix} ${iy - ir}
    C ${ix + ir * 0.78} ${iy} ${ix + ir * 0.78} ${iy + ir} ${ix} ${iy + ir} Z`;
  return `<path d="${outer} ${inner}" fill="${color}" fill-rule="evenodd"/>`;
}

/**
 * The thermometer with its bar low and a snowflake, for a cool temperature.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function coolGlyph(size, { color = "#FFFFFF" } = {}) {
  return thermometerWith(size, color, 0.25, snowflake);
}

/**
 * The thermometer with a sun, for a warm temperature.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function warmGlyph(size, { color = "#FFFFFF" } = {}) {
  return thermometerWith(size, color, 1, smallSun);
}

/**
 * The thermometer with its bar full and a flame, for a hot temperature.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function hotGlyph(size, { color = "#FFFFFF" } = {}) {
  return thermometerWith(size, color, 1, flame);
}

/**
 * Where the Scene glyphs put the thermometer and the sun, as shares of the canvas: the thermometer's center, the
 * sun's center and the share of its size it's drawn at, and the vertical line the sun is cut down. The cut leaves the
 * sun's top and bottom rays whole, and a gap before the thermometer's bulb. Together they're centered on the canvas.
 */
const SCENE = { thermometerX: 0.254, sunX: 0.574, sunScale: 0.82, cut: 0.484 };

/**
 * The part of a sun centered at (`cx`, `cy`) right of the vertical line at `cut`, which has to be left of its center:
 * its filled core of radius `core`, cut straight, and the five rays that don't cross the line, from `rayIn` to
 * `rayOut` and `sw` wide.
 *
 * @param {number} cx
 * @param {number} cy
 * @param {number} core
 * @param {number} rayIn
 * @param {number} rayOut
 * @param {number} cut
 * @param {number} sw
 * @param {string} color
 * @returns {string}
 */
function halfSun(cx, cy, core, rayIn, rayOut, cut, sw, color) {
  const halfChord = Math.sqrt(core ** 2 - (cx - cut) ** 2);
  // From the top of the cut, the long way round the right, to its bottom.
  const disc = `<path d="M ${cut} ${cy - halfChord} A ${core} ${core} 0 1 1 ${cut} ${cy + halfChord} Z" fill="${color}"/>`;
  // Up, then clockwise to down: the rays on the left would cross the cut.
  const rays = Array.from({ length: 5 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 2;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    return strokeLine(cx + c * rayIn, cy + s * rayIn, cx + c * rayOut, cy + s * rayOut, sw, color);
  }).join("\n");
  return `${disc}\n${rays}`;
}

/**
 * The Scene key's glyph, for a key that sets the brightness and the temperature at once: the thermometer of
 * {@link temperatureGlyph} on the left, and the sun of {@link brightnessGlyph} on the right, cut down a vertical line.
 * The sun is drawn smaller to fit, with the same strokes.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function sceneGlyph(size, { color = "#FFFFFF" } = {}) {
  const sw = size * 0.065;
  const [tx, sx, cut] = toCanvas(size, [SCENE.thermometerX, SCENE.sunX, SCENE.cut]);
  // The core as large as the sun of brightnessGlyph draws it, and its rays where that sun has them, at the sun's scale.
  const [core, rayIn, rayOut] = toCanvas(size, [
    (0.16 + 0.065 / 2) * SCENE.sunScale,
    0.27 * SCENE.sunScale,
    0.4 * SCENE.sunScale,
  ]);
  return `<g transform="translate(${tx - size / 2} 0)">${temperatureGlyph(size, { color })}</g>
    ${halfSun(sx, size / 2, core, rayIn, rayOut, cut, sw, color)}`;
}

/*
 * The glyphs of the monitor keys. Unlike those above, which fill a plugin's key, they're drawn at the size they take on
 * a tile, as measured on the monitor icons: each spans a little over half of it, with strokes of about 6%.
 */

// The stroke of the monitor keys' line glyphs, as a share of the canvas.
const MONITOR_STROKE = 0.06;

/**
 * The monitor the desktop computers stand in front of, the same in each so that only the computer changes between
 * them: its outline, drawn along the middle of its stroke (left, right, top, bottom, corner radius), its foot (left,
 * right, middle, thickness), and the gap its strokes leave before the computer. The outline's right is where the tower
 * cuts it. The monitor goes on behind the tower, to `hiddenRight`, and shows there behind a computer that covers less
 * of it.
 */
const DESK_MONITOR = /** @type {const} */ ({
  outline: [0.249, 0.553, 0.316, 0.595, 0.035],
  hiddenRight: 0.633,
  foot: [0.317, 0.553, 0.6965, 0.045],
  gap: 0.041,
});

/**
 * A laptop: its screen's outline, open at the bottom, over a solid base with rounded lower corners.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function laptopGlyph(size, { color = "#FFFFFF" } = {}) {
  /** @type {(share: number) => number} */
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  // The screen's outline, drawn along the middle of its stroke.
  const [left, right, top, bottom, r] = toCanvas(size, [0.284, 0.72, 0.316, 0.56, 0.035]);
  // The base: a flat top, and rounded lower corners.
  const [baseLeft, baseRight, baseTop, baseBottom, br] = toCanvas(size, [0.196, 0.808, 0.625, 0.719, 0.07]);
  return `<path d="M ${left} ${bottom} V ${top + r} A ${r} ${r} 0 0 1 ${left + r} ${top}
    H ${right - r} A ${r} ${r} 0 0 1 ${right} ${top + r} V ${bottom}"
    stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="M ${baseLeft} ${baseTop} H ${baseRight} V ${baseBottom - br}
    A ${br} ${br} 0 0 1 ${baseRight - br} ${baseBottom} H ${baseLeft + br}
    A ${br} ${br} 0 0 1 ${baseLeft} ${baseBottom - br} Z" fill="${color}"/>`;
}

/**
 * A desktop computer: a monitor's outline, open on the right where the tower stands in front of it, its foot, and the
 * tower, with two drive slots and a power light cut out of it.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function computerGlyph(size, { color = "#FFFFFF" } = {}) {
  /** @type {(share: number) => number} */
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  const [left, right, top, bottom, r] = toCanvas(size, DESK_MONITOR.outline);
  const [footLeft, footRight, footY, footH] = toCanvas(size, DESK_MONITOR.foot);
  const [towerLeft, towerRight, towerTop, towerBottom, tr] = toCanvas(size, [0.594, 0.781, 0.286, 0.714, 0.035]);
  const [slotLeft, slotRight, slotH] = toCanvas(size, [0.643, 0.732, 0.049]);
  const slotTops = toCanvas(size, [0.344, 0.438]);
  const [lightX, lightY, lightR] = toCanvas(size, [0.688, 0.583, 0.03]);
  const slots = slotTops.map((y) => roundedRect(slotLeft, y, slotRight, y + slotH, slotH / 2)).join(" ");
  const light = `M ${lightX - lightR} ${lightY} A ${lightR} ${lightR} 0 1 0 ${lightX + lightR} ${lightY}
    A ${lightR} ${lightR} 0 1 0 ${lightX - lightR} ${lightY} Z`;
  return `<path d="M ${right} ${top} H ${left + r} A ${r} ${r} 0 0 0 ${left} ${top + r}
    V ${bottom - r} A ${r} ${r} 0 0 0 ${left + r} ${bottom} H ${right}"
    stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"/>
    <line x1="${footLeft + footH / 2}" y1="${footY}" x2="${footRight - footH / 2}" y2="${footY}"
    stroke="${color}" stroke-width="${footH}" stroke-linecap="round"/>
    <path d="${roundedRect(towerLeft, towerTop, towerRight, towerBottom, tr)} ${slots} ${light}"
    fill="${color}" fill-rule="evenodd"/>`;
}

/**
 * A padlock: a shackle over a solid body with a slot across it, or a keyhole with `keyhole`. The slot or keyhole is cut
 * out, showing the tile behind it, unless `slot` gives it a color of its own, as the monitor keys' lock does.
 *
 * `open` unlocks it, in one of three styles: `"up"` lifts the shackle, its right leg out of the body; `"short"` keeps
 * the shackle at its locked height, its right leg stopping short above the body; `"side"` swings the shackle right,
 * its left leg in the body's right side and its right leg hanging free past the body's edge. The first two leave the
 * body where the locked one is, so a key switching between them only moves the shackle. The side-opened lock is wider,
 * so it's centered as a whole.
 *
 * @param {number} size the side of its square canvas
 * @param {LockOptions} [options]
 * @returns {string} its SVG markup
 */
export function lockGlyph(size, { color = "#FFFFFF", slot, keyhole = false, open = false } = {}) {
  /** @type {(share: number) => number} */
  const at = (share) => share * size;
  const sw = at(0.062);
  // The shackle, drawn along the middle of its stroke, down into the body. Swung to the side, it moves right by its
  // own width. Lifted, it rises by `LOCK_LIFT`. Open, its right leg stops `LOCK_GAP` above the body, or level with the
  // body's top once it hangs past the body's edge.
  const [lockedLeft, lockedRight, shackleTop, shackleBottom] = toCanvas(size, [0.4065, 0.5935, 0.255, 0.43]);
  const swing = open === "side" ? lockedRight - lockedLeft : 0;
  const [shackleLeft, shackleRight] = [lockedLeft + swing, lockedRight + swing];
  const lift = open === "up" ? at(LOCK_LIFT) : 0;
  const arcR = (shackleRight - shackleLeft) / 2;
  const [bodyLeft, bodyRight, bodyTop, bodyBottom, br] = toCanvas(size, [0.3125, 0.6875, 0.411, 0.754, 0.06]);
  const rightLegBottom = !open ? shackleBottom : open === "side" ? bodyTop : bodyTop - at(LOCK_GAP);
  // The side-opened lock spans from the body's left edge to the outside of the free leg: moved left by half of what
  // that adds, it's centered again.
  const shift = open === "side" ? -(shackleRight + sw / 2 - bodyRight) / 2 : 0;
  const hole = keyhole ? keyholePath(size) : roundedRect(...toCanvas(size, [0.4025, 0.577, 0.5975, 0.636, 0.016]));
  const lock = `<path d="M ${shackleLeft} ${shackleBottom} V ${shackleTop - lift + arcR}
    A ${arcR} ${arcR} 0 0 1 ${shackleRight} ${shackleTop - lift + arcR} V ${rightLegBottom}"
    stroke="${color}" stroke-width="${sw}"${open ? ' stroke-linecap="round"' : ""}/>
    <path d="${roundedRect(bodyLeft, bodyTop, bodyRight, bodyBottom, br)}${slot ? "" : ` ${hole}`}"
    fill="${color}" fill-rule="evenodd"/>${slot ? `\n    <path d="${hole}" fill="${slot}"/>` : ""}`;
  return shift ? `<g transform="translate(${shift} 0)">${lock}</g>` : lock;
}

// How far an open lock's shackle is lifted, and how far its free leg stops above the body, as shares of the canvas.
const LOCK_LIFT = 0.07;
const LOCK_GAP = 0.045;

/**
 * A keyhole in the lock's body, as one outline, so it can be cut out of the body: a round head, and below it a stem
 * that widens toward its rounded foot.
 *
 * @param {number} size
 * @returns {string}
 */
function keyholePath(size) {
  const [cx, cy, r] = toCanvas(size, [0.5, 0.562, 0.043]);
  const [topHalf, footHalf, foot, footR] = toCanvas(size, [0.018, 0.032, 0.686, 0.011]);
  // Where the stem's sides leave the head, on its lower half.
  const join = cy + Math.sqrt(r ** 2 - topHalf ** 2);
  return `M ${cx - topHalf} ${join} A ${r} ${r} 0 1 1 ${cx + topHalf} ${join}
    L ${cx + footHalf} ${foot - footR} A ${footR} ${footR} 0 0 1 ${cx + footHalf - footR} ${foot}
    H ${cx - footHalf + footR} A ${footR} ${footR} 0 0 1 ${cx - footHalf} ${foot - footR} Z`;
}

/**
 * A speaker: its cabinet's outline, with a small ring for the tweeter near the top and a larger one for the woofer.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function speakerGlyph(size, { color = "#FFFFFF" } = {}) {
  /** @type {(share: number) => number} */
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  // The rings take a thinner stroke, which keeps the tweeter's hole open.
  const ringSw = at(SPEAKER_RING_STROKE);
  // The cabinet's outline and the rings, drawn along the middle of their strokes.
  const [left, right, top, bottom, r] = toCanvas(size, [0.3, 0.7, 0.22, 0.78, 0.05]);
  const [cx, tweeterY, tweeterR, wooferY, wooferR] = toCanvas(size, [0.5, 0.36, 0.055, 0.6, 0.1]);
  return `<rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" rx="${r}"
    stroke="${color}" stroke-width="${sw}"/>
    <circle cx="${cx}" cy="${tweeterY}" r="${tweeterR}" stroke="${color}" stroke-width="${ringSw}"/>
    <circle cx="${cx}" cy="${wooferY}" r="${wooferR}" stroke="${color}" stroke-width="${ringSw}"/>`;
}

const SPEAKER_RING_STROKE = 0.05;

/**
 * Headphones: a headband arching over two ear cups, each a solid pill standing apart from it, inside its ends and
 * reaching below them.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function headphonesGlyph(size, { color = "#FFFFFF" } = {}) {
  /** @type {(share: number) => number} */
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  // The headband, drawn along the middle of its stroke: a half circle whose ends run straight down.
  const [cx, arcY, arcR, bandBottom] = toCanvas(size, [0.5, 0.48, 0.25, 0.66]);
  // The cups, by their outer edges: each a gap inside the band's end.
  const [gap, cupWidth, cupTop, cupBottom, cr] = toCanvas(size, [0.025, 0.15, 0.5, 0.78, 0.065]);
  const left = cx - arcR + sw / 2 + gap;
  const right = cx + arcR - sw / 2 - gap - cupWidth;
  /** @type {(x0: number) => string} */
  const cup = (x0) => `<rect x="${x0}" y="${cupTop}" width="${cupWidth}" height="${cupBottom - cupTop}" rx="${cr}"
    fill="${color}"/>`;
  return `<path d="M ${cx - arcR} ${bandBottom} V ${arcY} A ${arcR} ${arcR} 0 0 1 ${cx + arcR} ${arcY} V ${bandBottom}"
    stroke="${color}" stroke-width="${sw}"/>
    ${cup(left)}
    ${cup(right)}`;
}

/**
 * A Mac Studio in front of a monitor, as {@link computerGlyph} has its tower: the monitor's outline, open where the Mac
 * stands in front of its lower right corner, and its foot. The Mac is a squat box with its two ports, card slot and
 * light cut out low on its front, over a narrower base. The monitor's foot and the Mac's base stand on one line.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function macStudioGlyph(size, { color = "#FFFFFF" } = {}) {
  /** @type {(share: number) => number} */
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  // The Mac covers less of the monitor than the tower does, so the monitor shows up to its full width.
  const [left, , top, bottom, r] = toCanvas(size, DESK_MONITOR.outline);
  const right = at(DESK_MONITOR.hiddenRight);
  const [footLeft, footRight, footY, footH] = toCanvas(size, DESK_MONITOR.foot);
  const gap = at(DESK_MONITOR.gap);
  // The Mac's box, its right edge where the tower's is, over its base, which ends where the monitor's foot does.
  const floor = footY + footH / 2;
  const [macWidth, macHeight, macRight, mr, baseInset, baseGap, baseH] = toCanvas(
    size,
    [0.35, 0.17, 0.781, 0.035, 0.045, 0.014, 0.018],
  );
  const macBottom = floor - baseH - baseGap;
  const [macLeft, macTop] = [macRight - macWidth, macBottom - macHeight];
  // The front's details, low on it, by their centers: the ports from the box's left edge, the slot from its left edge
  // and the light from its right edge, the slot and the light on one line.
  const [portXs, portW, portH, portY] = [[0.042, 0.066].map(at), at(0.014), at(0.042), macBottom - at(0.052)];
  const [slotLeft, slotRight, slotH] = [macLeft + at(0.098), macLeft + at(0.196), at(0.014)];
  const [lightX, lightR, detailY] = [macRight - at(0.042), at(0.01), macBottom - at(0.032)];
  /** @type {(cx: number, cy: number, w: number, h: number) => string} */
  const pill = (cx, cy, w, h) => roundedRect(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, Math.min(w, h) / 2);
  const ports = portXs.map((x) => pill(macLeft + x, portY, portW, portH)).join(" ");
  const slot = pill((slotLeft + slotRight) / 2, detailY, slotRight - slotLeft, slotH);
  const light = `M ${lightX - lightR} ${detailY} A ${lightR} ${lightR} 0 1 0 ${lightX + lightR} ${detailY}
    A ${lightR} ${lightR} 0 1 0 ${lightX - lightR} ${detailY} Z`;
  // Where the monitor's outline and its foot stop, the gap short of the Mac's top and of its left side.
  const [rightEnd, bottomEnd] = [macTop - gap, macLeft - gap];
  const footEnd = Math.min(footRight, bottomEnd);
  return `<path d="M ${right} ${rightEnd} V ${top + r} A ${r} ${r} 0 0 0 ${right - r} ${top} H ${left + r}
    A ${r} ${r} 0 0 0 ${left} ${top + r} V ${bottom - r} A ${r} ${r} 0 0 0 ${left + r} ${bottom} H ${bottomEnd}"
    stroke="${color}" stroke-width="${sw}" stroke-linejoin="round"/>
    <line x1="${footLeft + footH / 2}" y1="${footY}" x2="${footEnd - footH / 2}" y2="${footY}"
    stroke="${color}" stroke-width="${footH}" stroke-linecap="round"/>
    <path d="${roundedRect(macLeft, macTop, macRight, macBottom, mr)} ${ports} ${slot} ${light}"
    fill="${color}" fill-rule="evenodd"/>
    <rect x="${macLeft + baseInset}" y="${floor - baseH}" width="${macWidth - 2 * baseInset}"
    height="${baseH}" rx="${baseH / 2}" fill="${color}"/>`;
}
