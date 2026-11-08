/**
 * The outlines of the characters a number is set in, from the palette's font (`fonts/NotoSans-Bold.ttf`), in its
 * units, `unitsPerEm` to the em. Written by `scripts/generate-figures.mjs`: regenerate it with `npm run icons`
 * rather than edit it. The figures are all as wide, and the font kerns none of these characters. Being the font's
 * outlines, they're under its license, the SIL Open Font License 1.1, in `LICENSE-OFL.txt`, which the package ships.
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
export const FIGURES: {
    unitsPerEm: number;
    height: number;
    characters: Record<string, Figure>;
};
/**
 * One character: how far it moves the next one along, where its ink starts and ends, across and down, and its outline
 * as SVG path data, with the baseline at 0 and y growing down.
 */
export type Figure = {
    advance: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    path: string;
};
