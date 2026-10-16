/**
 * The Power key's symbol: a ring open at the top, with a stem through the gap and, when `on`, a dot inside for
 * lights that are on. It's muted grey off and gold on, unless `color` sets both.
 *
 * @param {number} size the side of its square canvas
 * @param {{ on: boolean, color?: string }} options
 * @returns {string} its SVG markup
 */
export function powerGlyph(size: number, { on, color }: {
    on: boolean;
    color?: string;
}): string;
/**
 * A desk lamp: a shade over a stem and a foot, filled in warm orange, or outlined in white with `mono`.
 *
 * @param {number} size the side of its square canvas
 * @param {{ mono?: boolean }} [options]
 * @returns {string} its SVG markup
 */
export function lampGlyph(size: number, { mono }?: {
    mono?: boolean;
}): string;
/**
 * The Litra plugin's marketplace icon: the lamp on a dark rounded tile that fills the canvas.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function marketplaceGlyph(size: number): string;
/**
 * The Litra plugin's category icon, and the Litra pack's own: the lamp, outlined in white on transparent.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function categoryGlyph(size: number): string;
/**
 * The Power action's icon in Stream Deck's action list: the power symbol in white, with heavier strokes than
 * {@link powerGlyph} to read at the list's small size.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function actionIconPower(size: number): string;
/**
 * The Brightness action's icon in Stream Deck's action list: a sun in white.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function actionIconBrightness(size: number): string;
/**
 * The Temperature action's icon in Stream Deck's action list: a thermometer in white.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function actionIconTemperature(size: number): string;
/**
 * The Scene action's icon in Stream Deck's action list: the thermometer of {@link actionIconTemperature} on the left,
 * and the sun of {@link actionIconBrightness} on the right, cut down a vertical line, as {@link sceneGlyph} draws them.
 *
 * @param {number} size the side of its square canvas
 * @returns {string} its SVG markup
 */
export function actionIconScene(size: number): string;
/**
 * Brightness and Temperature icons: white line art on transparent, like Stream Deck's own. Each is both the key image
 * and the dial icon, since Stream Deck's app pictures a dial with the key image.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function brightnessGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * A thermometer whose bar fills `level` of the tube, from the bulb up: all of it unless a glyph says otherwise.
 *
 * @param {number} size the side of its square canvas
 * @param {{ color?: string, level?: number }} [options] `level` is the share of the tube the bar fills, from 0 to 1
 * @returns {string} its SVG markup
 */
export function temperatureGlyph(size: number, { color, level }?: {
    color?: string;
    level?: number;
}): string;
/**
 * The sun outlined rather than filled, for a lower brightness, with the rays of {@link brightnessGlyph}.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function dimGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * The thermometer with its bar low and a snowflake, for a cool temperature.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function coolGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * The thermometer with a sun, for a warm temperature.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function warmGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * The thermometer with its bar full and a flame, for a hot temperature.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function hotGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * The Scene key's glyph, for a key that sets the brightness and the temperature at once: the thermometer of
 * {@link temperatureGlyph} on the left, and the sun of {@link brightnessGlyph} on the right, cut down a vertical line.
 * The sun is drawn smaller to fit, with the same strokes.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function sceneGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * A laptop: its screen's outline, open at the bottom, over a solid base with rounded lower corners.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function laptopGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * A desktop computer: a monitor's outline, open on the right where the tower stands in front of it, its foot, and the
 * tower, with two drive slots and a power light cut out of it.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function computerGlyph(size: number, { color }?: GlyphOptions): string;
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
export function lockGlyph(size: number, { color, slot, keyhole, open }?: LockOptions): string;
/**
 * A speaker: its cabinet's outline, with a small ring for the tweeter near the top and a larger one for the woofer.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function speakerGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * Headphones: a headband arching over two ear cups, each a solid pill standing apart from it, inside its ends and
 * reaching below them.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function headphonesGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * A Mac Studio in front of a monitor, as {@link computerGlyph} has its tower: the monitor's outline, open where the Mac
 * stands in front of its lower right corner, and its foot. The Mac is a squat box with its two ports, card slot and
 * light cut out low on its front, over a narrower base. The monitor's foot and the Mac's base stand on one line.
 *
 * @param {number} size the side of its square canvas
 * @param {GlyphOptions} [options]
 * @returns {string} its SVG markup
 */
export function macStudioGlyph(size: number, { color }?: GlyphOptions): string;
/**
 * The options most glyphs take.
 */
export type GlyphOptions = {
    /**
     * the glyph's ink, in place of its own colors
     */
    color?: string;
};
/**
 * The options of {@link lockGlyph}.
 */
export type LockOptions = {
    /**
     * the lock's ink
     */
    color?: string;
    /**
     * the color of the slot or keyhole, which is cut out without one
     */
    slot?: string;
    /**
     * a keyhole in place of the slot
     */
    keyhole?: boolean;
    /**
     * how the lock is unlocked, if it is
     */
    open?: false | "up" | "short" | "side";
};
/**
 * A badge drawn next to a thermometer, centered at (`cx`, `cy`) with radius `r` and strokes `sw` wide.
 */
export type Badge = (cx: number, cy: number, r: number, sw: number, color: string) => string;
