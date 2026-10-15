/**
 * Wraps the markup of a glyph drawn on a `size` × `size` canvas into a complete SVG document.
 *
 * @param {number} size
 * @param {string} body the glyph's markup
 * @returns {string}
 */
export function svgDoc(size: number, body: string): string;
