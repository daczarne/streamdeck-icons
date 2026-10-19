/**
 * The MX Master 3S pack: keys for the mouse's Easy-Switch hosts. The mouse, outlined then filled, on each of the host
 * tiles: plain, with each host's number in its palm, and with the number on a badge there. The mouse is the devices
 * pack's, at the same size. The number is written as a label is (see `scripts/text.mjs`) and moved into the palm,
 * inverted from what it stands on: in the tile's color on a filled mouse's palm, as if cut out of it, and in the ink in
 * an outlined mouse's. On a badge, which is itself inverted from the body, it's scaled down to fit, and in the ink on a
 * filled mouse's badge, cut out of it, and in the tile's color on an outlined mouse's, which is solid.
 */
import { MOUSE, mouseGlyph } from "../../src/glyphs.mjs";
import { TILES, WHITE } from "../../src/palette.mjs";
import { scaled, tile } from "../pack-builder.mjs";
import { textGlyph } from "../text.mjs";

/** @import { Icon, Pack } from "../pack-builder.mjs" */

// A label's capital height, as `textGlyph` writes it, which the number keeps in the palm, and the number's on the
// badge, as shares of the icon.
const LABEL_CAP = 0.15;
const BADGE_CAP = 0.105;

// The mouse's height, for the pack's own icon, which it fills. The MX Master 3S plugin's category icon takes the same
// size, copied into its `scripts/generate-icons.mjs`, so a change to it is taken there too.
const MOUSE_SPAN = MOUSE.bottom - MOUSE.top;
const LOGO_SPAN = 0.86;

/** The tiles the keys come on, in the order the Icon Library shows them. */
const COLORS = /** @type {const} */ (["violet", "olive", "cerise"]);

/** The hosts, by the numbers on the mouse. */
const HOSTS = [1, 2, 3];

/**
 * A host's number in the palm of a mouse of `size`, in `color`, with capitals `cap` tall: the label's, or the badge's.
 *
 * @param {number} size
 * @param {number} host
 * @param {string} color
 * @param {number} cap
 * @returns {string}
 */
function palmNumber(size, host, color, cap) {
  // A label is centered on the icon, so it's scaled about the middle, then moved by the palm's distance from it.
  const label = scaled(size, textGlyph(size, [String(host)], { color }), LABEL_CAP, cap);
  return `<g transform="translate(${(MOUSE.badge.x - 0.5) * size} ${(MOUSE.badge.y - 0.5) * size})">${label}</g>`;
}

/**
 * The keys on one tile, in one of the mouse's two versions: the plain mouse, one for each host, then one for each host
 * with a badge.
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
    ...[false, true].flatMap((badge) =>
      HOSTS.map((host) => ({
        path: `host-${host}${badge ? "-badge" : ""}${filled ? "-filled" : ""}-${name}.svg`,
        name: `Host ${host}${badge ? " badge" : ""}${version} (${name})`,
        tags: ["mouse", "host", "easy-switch", String(host), ...(badge ? ["badge"] : []), style, name],
        // The number is inverted from what it stands on: the badge, or the body, which are inverted from each other.
        draw: (/** @type {number} */ size) => `${tile(size, color)}
          ${mouseGlyph(size, { color: WHITE, filled, badge })}
          ${palmNumber(size, host, filled === badge ? WHITE : color, badge ? BADGE_CAP : LABEL_CAP)}`,
      })),
    ),
  ];
}

export default /** @satisfies {Pack} */ ({
  folder: "com.daczarne.mx3s.sdIconPack",
  tag: "mx3s",
  icons: [false, true].flatMap((filled) => COLORS.flatMap((name) => tileIcons(filled, name))),
  logo: (size) => scaled(size, mouseGlyph(size), MOUSE_SPAN, LOGO_SPAN),
});
