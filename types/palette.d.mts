/**
 * The palette of every icon: the colors of tiles, glyphs and text, and their font. It was first drawn for the monitor
 * input switching keys, and colors are named by hue rather than by what they were first used for, since the same
 * palette serves every topic.
 */
/** The light ink of glyphs and text, on every tile except the light ones, `grey` and `honey`. */
export const WHITE: "#F2F2F2";
/** The dark ink of glyphs and text, on the light tiles, `grey` and `honey`. */
export const INK: "#24262B";
export namespace TILES {
    let teal: string;
    let blue: string;
    let plum: string;
    let rust: string;
    let slate: string;
    let green: string;
    let red: string;
    let navy: string;
    let aubergine: string;
    let forest: string;
    let honey: string;
    let charcoal: string;
    let grey: string;
}
export namespace ACCENTS {
    let amber: string;
    let cobalt: string;
    let crimson: string;
    let gold: string;
    let ochre: string;
    let orange: string;
    let sage: string;
    let scarlet: string;
    let umber: string;
}
/** The font of text on the tiles, in `WHITE` or `INK` like the glyphs. Google's Noto Sans, under the OFL. */
export const FONT_FAMILY: "Noto Sans";
