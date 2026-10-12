/**
 * The Litra pack: icons for Logitech Litra lights, from the glyphs of the Litra plugin and variants of them for preset
 * keys. The suns span as much of an icon as the suns of the monitor keys, and the other glyphs are sized to look as
 * large: a thin thermometer needs more room, and the heavy power symbol less. That's smaller than the plugin draws them
 * on its own keys, where a glyph fills the key, and leaves the room around the glyph that the tiles need.
 */
import {
  brightnessGlyph,
  categoryGlyph,
  coolGlyph,
  dimGlyph,
  hotGlyph,
  powerGlyph,
  temperatureGlyph,
  warmGlyph,
} from "../../src/glyphs.mjs";
import { TILES } from "../../src/palette.mjs";

const glyphs = [
  { id: "brightness", name: "Brightness", tags: ["sun", "light"], draw: brightnessGlyph, span: 0.865, packSpan: 0.57 },
  { id: "brightness-low", name: "Brightness low", tags: ["sun", "dim"], draw: dimGlyph, span: 0.865, packSpan: 0.57 },
  {
    id: "temperature",
    name: "Temperature",
    tags: ["thermometer", "kelvin"],
    draw: temperatureGlyph,
    span: 0.815,
    packSpan: 0.62,
  },
  {
    id: "temperature-cool",
    name: "Temperature cool",
    tags: ["thermometer", "kelvin", "snowflake", "cold"],
    draw: coolGlyph,
    span: 0.815,
    packSpan: 0.62,
  },
  {
    id: "temperature-warm",
    name: "Temperature warm",
    tags: ["thermometer", "kelvin", "sun", "warm"],
    draw: warmGlyph,
    span: 0.815,
    packSpan: 0.62,
  },
  {
    id: "temperature-hot",
    name: "Temperature hot",
    tags: ["thermometer", "kelvin", "flame", "hot"],
    draw: hotGlyph,
    span: 0.815,
    packSpan: 0.62,
  },
  {
    id: "power-on",
    name: "Power on",
    tags: ["power"],
    draw: (size, options) => powerGlyph(size, { ...options, on: true }),
    span: 0.54,
    packSpan: 0.52,
    tone: "lit",
  },
  {
    id: "power-off",
    name: "Power off",
    tags: ["power"],
    draw: (size, options) => powerGlyph(size, { ...options, on: false }),
    span: 0.54,
    packSpan: 0.52,
    fade: true,
  },
  {
    id: "power-red",
    name: "Power red",
    tags: ["power", "off", "red"],
    // Off's shape, without the dot that marks lights that are on. Plain, it's the palette's own red.
    draw: (size, options) => powerGlyph(size, { color: TILES.red, ...options, on: false }),
    span: 0.54,
    packSpan: 0.52,
    tone: "red",
  },
];

export default {
  folder: "com.daczarne.litra.sdIconPack",
  tag: "litra",
  glyphs,
  extras: [{ path: "lamp.svg", name: "Lamp", tags: ["light"], draw: categoryGlyph }],
  // The lamp, like the plugin's category.
  logo: categoryGlyph,
};
