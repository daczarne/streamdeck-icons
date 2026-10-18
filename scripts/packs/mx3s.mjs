/**
 * The MX Master 3S pack: keys for the mouse's Easy-Switch hosts. The mouse, outlined then filled, on each of the host
 * tiles, plain and with each host's number on a badge in its palm. The mouse is the devices pack's, at the same size.
 * The number is written as a label is (see `scripts/text.mjs`), scaled down to the badge and moved onto it: in the ink
 * on a filled mouse's badge, which is cut out of it, and in the tile's color on an outlined mouse's, which is solid.
 */
import { MOUSE, mouseGlyph } from "../../src/glyphs.mjs";
import { TILES, WHITE } from "../../src/palette.mjs";
import { scaled, tile } from "../pack-builder.mjs";
import { textGlyph } from "../text.mjs";

/** @import { Icon, Pack } from "../pack-builder.mjs" */

// A label's capital height, as `textGlyph` writes it, and the number's on the badge, as shares of the icon.
const LABEL_CAP = 0.15;
const BADGE_CAP = 0.105;

// The mouse's height, for the pack's own icon, which it fills.
const MOUSE_SPAN = MOUSE.bottom - MOUSE.top;
const LOGO_SPAN = 0.86;

/** The tiles the keys come on, in the order the Icon Library shows them. */
const COLORS = /** @type {const} */ (["violet", "olive", "cerise"]);

/** The hosts, by the numbers on the mouse. */
const HOSTS = [1, 2, 3];

/**
 * A host's number on the badge of a mouse of `size`, in `color`.
 *
 * @param {number} size
 * @param {number} host
 * @param {string} color
 * @returns {string}
 */
function badgeNumber(size, host, color) {
  // A label is centered on the icon, so it's scaled about the middle, then moved by the badge's distance from it.
  const label = scaled(size, textGlyph(size, [String(host)], { color }), LABEL_CAP, BADGE_CAP);
  return `<g transform="translate(${(MOUSE.badge.x - 0.5) * size} ${(MOUSE.badge.y - 0.5) * size})">${label}</g>`;
}

/**
 * The keys on one tile, in one of the mouse's two versions: the plain mouse, then one for each host.
 *
 * @param {boolean} filled
 * @param {(typeof COLORS)[number]} name the tile's, in `TILES`
 * @returns {Icon[]}
 */
function tileIcons(filled, name) {
  const color = TILES[name];
  const version = filled ? " filled" : "";
  const style = filled ? "filled" : "outlined";
  return [
    {
      path: `mouse${filled ? "-filled" : ""}-${name}.svg`,
      name: `Mouse${version} (${name})`,
      tags: ["mouse", style, name],
      draw: (size) => `${tile(size, color)}
        ${mouseGlyph(size, { color: WHITE, filled })}`,
    },
    ...HOSTS.map((host) => ({
      path: `host-${host}${filled ? "-filled" : ""}-${name}.svg`,
      name: `Host ${host}${version} (${name})`,
      tags: ["mouse", "host", "easy-switch", String(host), style, name],
      draw: (/** @type {number} */ size) => `${tile(size, color)}
        ${mouseGlyph(size, { color: WHITE, filled, badge: true })}
        ${badgeNumber(size, host, filled ? WHITE : color)}`,
    })),
  ];
}

export default /** @satisfies {Pack} */ ({
  folder: "com.daczarne.mx3s.sdIconPack",
  tag: "mx3s",
  icons: [false, true].flatMap((filled) => COLORS.flatMap((name) => tileIcons(filled, name))),
  logo: (size) => scaled(size, mouseGlyph(size), MOUSE_SPAN, LOGO_SPAN),
});
