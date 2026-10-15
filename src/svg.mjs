/**
 * Wraps the markup of a glyph drawn on a `size` × `size` canvas into a complete SVG document.
 *
 * @param {number} size
 * @param {string} body the glyph's markup
 * @returns {string}
 */
export function svgDoc(size, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
    ${body}
    </svg>`;
}
