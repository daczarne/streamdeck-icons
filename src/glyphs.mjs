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

/*
 * The glyphs of the monitor keys. Unlike those above, which fill a plugin's key, they're drawn at the size they take on
 * a tile, as measured on the monitor icons: each spans a little over half of it, with strokes of about 6%.
 */

// The stroke of the monitor keys' line glyphs, as a share of the canvas.
const MONITOR_STROKE = 0.06;

/** A laptop: its screen's outline, open at the bottom, over a solid base with rounded lower corners. */
export function laptopGlyph(size, { color = "#FFFFFF" } = {}) {
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  // The screen's outline, drawn along the middle of its stroke.
  const [left, right, top, bottom, r] = [0.284, 0.72, 0.316, 0.56, 0.035].map(at);
  // The base: a flat top, and rounded lower corners.
  const [baseLeft, baseRight, baseTop, baseBottom, br] = [0.196, 0.808, 0.625, 0.719, 0.07].map(at);
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
 */
export function computerGlyph(size, { color = "#FFFFFF" } = {}) {
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  // The monitor's outline, drawn along the middle of its stroke.
  const [left, right, top, bottom, r] = [0.249, 0.553, 0.316, 0.595, 0.035].map(at);
  const [footLeft, footRight, footY, footH] = [0.317, 0.553, 0.6965, 0.045].map(at);
  const [towerLeft, towerRight, towerTop, towerBottom, tr] = [0.594, 0.781, 0.286, 0.714, 0.035].map(at);
  const [slotLeft, slotRight, slotH] = [0.643, 0.732, 0.049].map(at);
  const slotTops = [0.344, 0.438].map(at);
  const [lightX, lightY, lightR] = [0.688, 0.583, 0.03].map(at);
  const roundedRect = (x0, y0, x1, y1, rr) => `M ${x0 + rr} ${y0} H ${x1 - rr} A ${rr} ${rr} 0 0 1 ${x1} ${y0 + rr}
    V ${y1 - rr} A ${rr} ${rr} 0 0 1 ${x1 - rr} ${y1} H ${x0 + rr} A ${rr} ${rr} 0 0 1 ${x0} ${y1 - rr}
    V ${y0 + rr} A ${rr} ${rr} 0 0 1 ${x0 + rr} ${y0} Z`;
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
 */
export function lockGlyph(size, { color = "#FFFFFF", slot, keyhole = false, open = false } = {}) {
  const at = (share) => share * size;
  const sw = at(0.062);
  // The shackle, drawn along the middle of its stroke, down into the body. Swung to the side, it moves right by its
  // own width. Lifted, it rises by `LOCK_LIFT`. Open, its right leg stops `LOCK_GAP` above the body, or level with the
  // body's top once it hangs past the body's edge.
  const [lockedLeft, lockedRight, shackleTop, shackleBottom] = [0.4065, 0.5935, 0.255, 0.43].map(at);
  const swing = open === "side" ? lockedRight - lockedLeft : 0;
  const [shackleLeft, shackleRight] = [lockedLeft + swing, lockedRight + swing];
  const lift = open === "up" ? at(LOCK_LIFT) : 0;
  const arcR = (shackleRight - shackleLeft) / 2;
  const [bodyLeft, bodyRight, bodyTop, bodyBottom, br] = [0.3125, 0.6875, 0.411, 0.754, 0.06].map(at);
  const rightLegBottom = !open ? shackleBottom : open === "side" ? bodyTop : bodyTop - at(LOCK_GAP);
  // The side-opened lock spans from the body's left edge to the outside of the free leg: moved left by half of what
  // that adds, it's centered again.
  const shift = open === "side" ? -(shackleRight + sw / 2 - bodyRight) / 2 : 0;
  const roundedRect = (x0, y0, x1, y1, rr) => `M ${x0 + rr} ${y0} H ${x1 - rr} A ${rr} ${rr} 0 0 1 ${x1} ${y0 + rr}
    V ${y1 - rr} A ${rr} ${rr} 0 0 1 ${x1 - rr} ${y1} H ${x0 + rr} A ${rr} ${rr} 0 0 1 ${x0} ${y1 - rr}
    V ${y0 + rr} A ${rr} ${rr} 0 0 1 ${x0 + rr} ${y0} Z`;
  const hole = keyhole ? keyholePath(at) : roundedRect(...[0.4025, 0.577, 0.5975, 0.636, 0.016].map(at));
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
 * that widens toward its rounded foot. `at` turns shares of the canvas into its units.
 */
function keyholePath(at) {
  const [cx, cy, r] = [0.5, 0.562, 0.043].map(at);
  const [topHalf, footHalf, foot, footR] = [0.018, 0.032, 0.686, 0.011].map(at);
  // Where the stem's sides leave the head, on its lower half.
  const join = cy + Math.sqrt(r ** 2 - topHalf ** 2);
  return `M ${cx - topHalf} ${join} A ${r} ${r} 0 1 1 ${cx + topHalf} ${join}
    L ${cx + footHalf} ${foot - footR} A ${footR} ${footR} 0 0 1 ${cx + footHalf - footR} ${foot}
    H ${cx - footHalf + footR} A ${footR} ${footR} 0 0 1 ${cx - footHalf} ${foot - footR} Z`;
}


/** A speaker: its cabinet's outline, with a small ring for the tweeter near the top and a larger one for the woofer. */
export function speakerGlyph(size, { color = "#FFFFFF" } = {}) {
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  // The rings take a thinner stroke, which keeps the tweeter's hole open.
  const ringSw = at(SPEAKER_RING_STROKE);
  // The cabinet's outline and the rings, drawn along the middle of their strokes.
  const [left, right, top, bottom, r] = [0.3, 0.7, 0.22, 0.78, 0.05].map(at);
  const [cx, tweeterY, tweeterR, wooferY, wooferR] = [0.5, 0.36, 0.055, 0.6, 0.1].map(at);
  return `<rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" rx="${r}"
    stroke="${color}" stroke-width="${sw}"/>
    <circle cx="${cx}" cy="${tweeterY}" r="${tweeterR}" stroke="${color}" stroke-width="${ringSw}"/>
    <circle cx="${cx}" cy="${wooferY}" r="${wooferR}" stroke="${color}" stroke-width="${ringSw}"/>`;
}

const SPEAKER_RING_STROKE = 0.05;

/**
 * Headphones: a headband arching over two ear cups, each a solid pill standing apart from it, inside its ends and
 * reaching below them.
 */
export function headphonesGlyph(size, { color = "#FFFFFF" } = {}) {
  const at = (share) => share * size;
  const sw = at(MONITOR_STROKE);
  // The headband, drawn along the middle of its stroke: a half circle whose ends run straight down.
  const [cx, arcY, arcR, bandBottom] = [0.5, 0.48, 0.25, 0.66].map(at);
  // The cups, by their outer edges: each a gap inside the band's end.
  const [gap, cupWidth, cupTop, cupBottom, cr] = [0.025, 0.15, 0.5, 0.78, 0.065].map(at);
  const left = cx - arcR + sw / 2 + gap;
  const right = cx + arcR - sw / 2 - gap - cupWidth;
  const cup = (x0) => `<rect x="${x0}" y="${cupTop}" width="${cupWidth}" height="${cupBottom - cupTop}" rx="${cr}"
    fill="${color}"/>`;
  return `<path d="M ${cx - arcR} ${bandBottom} V ${arcY} A ${arcR} ${arcR} 0 0 1 ${cx + arcR} ${arcY} V ${bandBottom}"
    stroke="${color}" stroke-width="${sw}"/>
    ${cup(left)}
    ${cup(right)}`;
}
