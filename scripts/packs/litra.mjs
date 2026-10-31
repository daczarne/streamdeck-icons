/**
 * The Litra pack: icons for Logitech Litra lights, from the glyphs of the Litra plugin and variants of them for preset
 * keys. The suns span as much of an icon as the suns of the monitor keys, and the other glyphs are sized to look as
 * large: a thin thermometer needs more room, and the heavy power symbol less. That's smaller than the plugin draws them
 * on its own keys, where a glyph fills the key, and leaves the room around the glyph that the tiles need.
 */
import {
  brightnessGlyph,
  brightnessStepGlyph,
  categoryGlyph,
  coolGlyph,
  dimGlyph,
  hotGlyph,
  powerGlyph,
  sceneGlyph,
  temperatureGlyph,
  temperatureStepGlyph,
  warmGlyph,
} from "../../src/glyphs.mjs";
import { TILES } from "../../src/palette.mjs";
import { plainGlyphs, tiledGlyphs } from "../pack-builder.mjs";

/** @import { GlyphEntry, Pack } from "../pack-builder.mjs" */

/** @type {GlyphEntry[]} */
const glyphs = [
  { id: "brightness", name: "Brightness", tags: ["sun", "light"], draw: brightnessGlyph, span: 0.865, packSpan: 0.57 },
  { id: "brightness-low", name: "Brightness low", tags: ["sun", "dim"], draw: dimGlyph, span: 0.865, packSpan: 0.57 },
  {
    id: "brightness-up",
    name: "Brightness up",
    tags: ["sun", "light", "step", "up", "plus"],
    draw: (size, options) => brightnessStepGlyph(size, { ...options, step: "up" }),
    span: 0.865,
    packSpan: 0.57,
  },
  {
    id: "brightness-down",
    name: "Brightness down",
    tags: ["sun", "light", "step", "down", "minus"],
    draw: (size, options) => brightnessStepGlyph(size, { ...options, step: "down" }),
    span: 0.865,
    packSpan: 0.57,
  },
  // The badge reaches a little below the sun, which stays the size of the other suns.
  {
    id: "brightness-up-badge",
    name: "Brightness up badge",
    tags: ["sun", "light", "step", "up", "plus", "badge"],
    draw: (size, options) => brightnessStepGlyph(size, { ...options, step: "up", badge: true }),
    span: 0.87,
    packSpan: 0.57,
  },
  {
    id: "brightness-down-badge",
    name: "Brightness down badge",
    tags: ["sun", "light", "step", "down", "minus", "badge"],
    draw: (size, options) => brightnessStepGlyph(size, { ...options, step: "down", badge: true }),
    span: 0.87,
    packSpan: 0.57,
  },
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
    id: "temperature-up",
    name: "Temperature up",
    tags: ["thermometer", "kelvin", "step", "up", "plus"],
    draw: (size, options) => temperatureStepGlyph(size, { ...options, step: "up" }),
    span: 0.815,
    packSpan: 0.62,
  },
  {
    id: "temperature-down",
    name: "Temperature down",
    tags: ["thermometer", "kelvin", "step", "down", "minus"],
    draw: (size, options) => temperatureStepGlyph(size, { ...options, step: "down" }),
    span: 0.815,
    packSpan: 0.62,
  },
  // The badge reaches below the bulb: covering more of the icon, the thermometer stays the size of the others.
  {
    id: "temperature-up-badge",
    name: "Temperature up badge",
    tags: ["thermometer", "kelvin", "step", "up", "plus", "badge"],
    draw: (size, options) => temperatureStepGlyph(size, { ...options, step: "up", badge: true }),
    span: 0.875,
    packSpan: 0.665,
  },
  {
    id: "temperature-down-badge",
    name: "Temperature down badge",
    tags: ["thermometer", "kelvin", "step", "down", "minus", "badge"],
    draw: (size, options) => temperatureStepGlyph(size, { ...options, step: "down", badge: true }),
    span: 0.875,
    packSpan: 0.665,
  },
  {
    id: "scene",
    name: "Scene",
    tags: ["thermometer", "sun", "scene"],
    draw: sceneGlyph,
    span: 0.865,
    packSpan: 0.62,
  },
  {
    id: "scene-dim",
    name: "Scene dim",
    tags: ["thermometer", "sun", "scene", "dim"],
    draw: (size, options) => sceneGlyph(size, { ...options, dim: true }),
    span: 0.865,
    packSpan: 0.62,
  },
  {
    id: "scene-low",
    name: "Scene low",
    tags: ["thermometer", "sun", "scene", "low"],
    draw: (size, options) => sceneGlyph(size, { ...options, level: 0 }),
    span: 0.865,
    packSpan: 0.62,
  },
  {
    id: "scene-low-dim",
    name: "Scene low dim",
    tags: ["thermometer", "sun", "scene", "low", "dim"],
    draw: (size, options) => sceneGlyph(size, { ...options, level: 0, dim: true }),
    span: 0.865,
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

export default /** @satisfies {Pack} */ ({
  folder: "com.daczarne.litra.sdIconPack",
  tag: "litra",
  icons: [...plainGlyphs(glyphs), ...tiledGlyphs(glyphs)],
  // The Beam, like the plugin's category. It stands for the plugin and the pack, where Stream Deck asks for their icon,
  // and is never one of the pack's icons, which are the controls' glyphs.
  logo: categoryGlyph,
});
