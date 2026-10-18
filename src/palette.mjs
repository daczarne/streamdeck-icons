/**
 * The palette of every icon: the colors of tiles, glyphs and text, and their font. It was first drawn for the monitor
 * input switching keys, and colors are named by hue rather than by what they were first used for, since the same
 * palette serves every topic.
 */

/** The light ink of glyphs and text, on every tile except the light ones, `grey` and `honey`. */
export const WHITE = "#F2F2F2";

/** The dark ink of glyphs and text, on the light tiles, `grey` and `honey`. */
export const INK = "#24262B";

/**
 * Tile backgrounds. The comments say what each was first used for: the monitor keys, the Litra keys or the mouse's host
 * keys.
 */
export const TILES = {
  teal: "#3F6E6E", // the left monitor
  blue: "#4C5F86", // the center monitor
  plum: "#6E4F70", // the top right monitor
  rust: "#8C5648", // the bottom right monitor
  slate: "#484C52", // every monitor
  green: "#3E6B4A", // desk mode, while it's off
  red: "#D64541", // desk mode, while it's on, framed in `ACCENTS.amber`
  navy: "#2E4A6B", // the lock, with its slot in `ACCENTS.cobalt`
  aubergine: "#3E2F45", // a darker `plum`, for the Litra keys, dark enough for gold and scarlet glyphs
  forest: "#2F4A3A", // a darker `green`, for the Litra keys, like `aubergine`
  honey: "#E3B547", // a warm yellow, for the Litra keys, light enough to set them apart, with `INK` glyphs
  charcoal: "#2B2E33", // the dark neutral keys, with `WHITE` glyphs
  grey: "#9AA0A8", // the light neutral keys, the charcoal ones inverted, with `INK` glyphs
  // The mouse's host keys: brighter than the monitors' tiles, and in hues none of the other tiles has, so the host keys
  // stand apart from the monitor keys and the navy ones next to them.
  violet: "#5546A0",
  olive: "#7A6A2A",
  cerise: "#A03F68",
};

/** Colors that aren't tiles. */
export const ACCENTS = {
  amber: "#FFB020", // the frame of the desk mode key while it's on
  cobalt: "#33517A", // the slot in the lock, on a `TILES.navy` tile
  crimson: "#9E2A27", // a red glyph on the light tiles, `grey` and `honey`, where brighter reds wash out
  gold: "#F5C542", // lights on: the Power key, and a power symbol on a dark tile
  ochre: "#B07A00", // lights on, on the `grey` tile, where gold would wash out
  orange: "#E5892E", // the background of the dial's touch strip
  sage: "#4A7C59", // a step lighter than `TILES.green`, for a slot or keyhole on it, as `cobalt` is on `navy`
  // A red glyph on the dark tiles, brighter than `TILES.red` to stand out on them, and a keyhole on `TILES.red`.
  scarlet: "#E8584F",
  umber: "#2E1F12", // text on the touch strip's orange
};

/** The font of text on the tiles, in `WHITE` or `INK` like the glyphs. Google's Noto Sans, under the OFL. */
export const FONT_FAMILY = "Noto Sans";
