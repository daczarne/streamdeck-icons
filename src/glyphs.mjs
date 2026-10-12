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

export function marketplaceGlyph(size) {
  return `<rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${COLORS.bg}"/> ${lampGlyph(size)}`;
}

export function categoryGlyph(size) {
  // Monochrome white on transparent: the plugin's category, and the lamp of the icon pack
  return lampGlyph(size, { mono: true });
}

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
 * Brightness and Temperature icons: white line art on transparent, like Stream Deck's own. Each is both the key image
 * and the dial icon, since Stream Deck's app pictures a dial with the key image.
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

/** A thermometer whose bar fills `level` of the tube, from the bulb up: all of it unless a glyph says otherwise. */
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

/** The sun outlined rather than filled, for a lower brightness, with the rays of {@link brightnessGlyph}. */
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

/** The thermometer of {@link temperatureGlyph}, moved left, with a badge drawn by `badge` at its upper right. */
function thermometerWith(size, color, level, badge) {
  const sw = size * 0.038;
  const shift = size * (BADGE.thermometerX - 0.5);
  return `<g transform="translate(${shift} 0)">${temperatureGlyph(size, { color, level })}</g>
    ${badge(size * BADGE.x, size * BADGE.y, size * BADGE.r, sw, color)}`;
}

function strokeLine(x1, y1, x2, y2, sw, color) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
    stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`;
}

/** A snowflake of radius `r`: six arms, each with a pair of branches pointing outward. */
function snowflake(cx, cy, r, sw, color) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI) / 3 - Math.PI / 2;
    const at = (d, angle = a) => [cx + Math.cos(angle) * d, cy + Math.sin(angle) * d];
    const [bx, by] = at(r * 0.62);
    const branch = (turn) => {
      const angle = a + turn;
      return strokeLine(bx, by, bx + Math.cos(angle) * r * 0.3, by + Math.sin(angle) * r * 0.3, sw, color);
    };
    return [strokeLine(cx, cy, ...at(r), sw, color), branch(Math.PI / 4), branch(-Math.PI / 4)].join("\n");
  }).join("\n");
}

/** A small sun of radius `r`, filled like {@link brightnessGlyph}'s. */
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
 */
function flame(cx, cy, badgeR, sw, color) {
  const r = badgeR * 1.1;
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

/** The thermometer with its bar low and a snowflake, for a cool temperature. */
export function coolGlyph(size, { color = "#FFFFFF" } = {}) {
  return thermometerWith(size, color, 0.25, snowflake);
}

/** The thermometer with a sun, for a warm temperature. */
export function warmGlyph(size, { color = "#FFFFFF" } = {}) {
  return thermometerWith(size, color, 1, smallSun);
}

/** The thermometer with its bar full and a flame, for a hot temperature. */
export function hotGlyph(size, { color = "#FFFFFF" } = {}) {
  return thermometerWith(size, color, 1, flame);
}
