#!/usr/bin/env node
/**
 * Writes `src/figures.mjs`: the outlines of the characters a number is set in, taken from the palette's font, so that a
 * plugin can set a number in it while it runs, as paths, with neither the font nor opentype.js. Only these characters
 * are written, since every one adds its outline to what a plugin bundles. `npm run icons` runs it before the packs.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { font } from "./text.mjs";

const OUT_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/figures.mjs");

// The figures, the percent sign, and the hyphen, which stands in for a number not known.
const CHARACTERS = "0123456789%-";

/**
 * One character's entry: how far it moves the next one, where its ink starts and ends, across and down, and its
 * outline, in the font's units, with the baseline at 0 and y growing down, as SVG draws it.
 *
 * @param {string} character
 * @returns {string} the entry, as a line of JavaScript
 */
function entry(character) {
  const glyph = font.charToGlyph(character);
  const outline = glyph.getPath(0, 0, font.unitsPerEm);
  const ink = outline.getBoundingBox();
  const fields = [
    `advance: ${glyph.advanceWidth}`,
    `left: ${Math.round(ink.x1)}`,
    `right: ${Math.round(ink.x2)}`,
    `top: ${Math.round(ink.y1)}`,
    `bottom: ${Math.round(ink.y2)}`,
    `path: "${outline.toPathData(0)}"`,
  ];
  // One field to a line, as Biome formats an entry too long for one.
  // A figure is a key without quotes, as Biome writes it, and a sign needs them.
  const key = /^\d$/.test(character) ? character : `"${character}"`;
  return [`    ${key}: {`, ...fields.map((field) => `      ${field},`), "    },"].join("\n");
}

const kerned = [...CHARACTERS].flatMap((a) =>
  [...CHARACTERS].flatMap((b) => (font.getKerningValue(font.charToGlyph(a), font.charToGlyph(b)) === 0 ? [] : [a + b])),
);
if (kerned.length > 0) {
  // The layout adds the advances alone, so a pair the font kerns would come out wrong.
  throw new Error(`the font kerns ${kerned.join(", ")}, which the figures don't carry`);
}

const source = `/**
 * The outlines of the characters a number is set in, from the palette's font (\`fonts/NotoSans-Bold.ttf\`), in its
 * units, \`unitsPerEm\` to the em. Written by \`scripts/generate-figures.mjs\`: regenerate it with \`npm run icons\`
 * rather than edit it. The figures are all as wide, and the font kerns none of these characters. Being the font's
 * outlines, they're under its license, the SIL Open Font License 1.1, in \`LICENSE-OFL.txt\`, which the package ships.
 */

/**
 * One character: how far it moves the next one along, where its ink starts and ends, across and down, and its outline
 * as SVG path data, with the baseline at 0 and y growing down.
 *
 * @typedef {{ advance: number, left: number, right: number, top: number, bottom: number, path: string }} Figure
 */

/**
 * The font's units to the em, the height of its figures above the baseline, and its characters.
 *
 * @type {{ unitsPerEm: number, height: number, characters: Record<string, Figure> }}
 */
export const FIGURES = {
  unitsPerEm: ${font.unitsPerEm},
  height: ${font.tables.os2.sCapHeight},
  characters: {
${[...CHARACTERS].map(entry).join("\n")}
  },
};
`;
writeFileSync(OUT_FILE, source);
console.log("Figures generated.");
