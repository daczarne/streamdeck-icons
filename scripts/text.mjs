/**
 * Text on icons, written as paths: each letter becomes a shape, laid out from the font file, so Stream Deck draws it
 * the same whatever fonts the machine has. The font is the palette's, vendored in `fonts/` with its license and
 * checked against its hash, so the shapes don't change unless the file does.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// opentype.js is CommonJS to Node, so its functions come through the default import.
import opentype from "opentype.js";

const FONT_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "../fonts/NotoSans-Bold.ttf");
const bytes = readFileSync(FONT_FILE);
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));

// As measured on the monitor keys' labels: the height of a capital letter, and the distance from one line's baseline to
// the next, as shares of the icon.
const CAP_HEIGHT = 0.15;
const LINE_PITCH = 0.286;

// Decimal places kept in the paths: far below a pixel at any size Stream Deck shows, and short to store.
const DECIMALS = 2;

// The margin a label's letters keep from every edge of the icon, as a share of it. The key's frame and rounded corners
// cover the very edge, and "BOTTOM", the widest label so far, keeps about 6.7%.
const MARGIN = 0.05;

/**
 * Lines of text, each centered across an icon of `size`, and the block centered down it, from the top of its first
 * line's capitals to its last line's baseline. Every label gets the same size, so labels look alike whatever their
 * length, and lines are split by the caller. A label whose letters would come within {@link MARGIN} of an edge stops
 * the build, rather than run off the key: it needs shorter lines, or fewer.
 *
 * @param {number} size the side of the icon
 * @param {string[]} lines
 * @param {{ color?: string }} [options]
 * @returns {string} the SVG markup of every line
 */
export function textGlyph(size, lines, { color = "#FFFFFF" } = {}) {
  const capHeight = font.tables.os2.sCapHeight / font.unitsPerEm;
  const fontSize = (CAP_HEIGHT * size) / capHeight;
  const blockHeight = CAP_HEIGHT * size + (lines.length - 1) * LINE_PITCH * size;
  const firstBaseline = (size - blockHeight) / 2 + CAP_HEIGHT * size;
  return lines
    .map((line, i) => {
      const width = font.getAdvanceWidth(line, fontSize, { kerning: true });
      const glyphs = font.getPath(line, (size - width) / 2, firstBaseline + i * LINE_PITCH * size, fontSize, {
        kerning: true,
      });
      const ink = glyphs.getBoundingBox();
      const [low, high] = [MARGIN * size, (1 - MARGIN) * size];
      if (ink.x1 < low || ink.x2 > high || ink.y1 < low || ink.y2 > high) {
        const label = lines.join(" / ");
        throw new Error(`"${label}" doesn't fit an icon: "${line}" comes within ${MARGIN * 100}% of its edge`);
      }
      return `<path d="${glyphs.toPathData(DECIMALS)}" fill="${color}"/>`;
    })
    .join("\n");
}
