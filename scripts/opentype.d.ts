/**
 * The parts of opentype.js that `scripts/text.mjs` uses, since the package ships no type declarations. Each member is
 * typed as the opentype.js 2.0.0 sources define it.
 */
declare module "opentype.js" {
  /** The box a path's ink spans, in the units it was drawn in. */
  interface BoundingBox {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  /** The outline of some text, laid out at a position and a size. */
  interface Path {
    getBoundingBox(): BoundingBox;
    /** Takes the decimal places to keep, or options that include them. */
    toPathData(options?: number | { decimalPlaces?: number; optimize?: boolean; flipY?: boolean }): string;
  }

  /** How text is laid out. */
  interface RenderOptions {
    kerning?: boolean;
  }

  /** A font, parsed from its file. */
  interface Font {
    unitsPerEm: number;
    tables: { os2: { sCapHeight: number } };
    getAdvanceWidth(text: string, fontSize?: number, options?: RenderOptions): number;
    getPath(text: string, x: number, y: number, fontSize: number, options?: RenderOptions): Path;
  }

  const opentype: {
    /** Parses a font file. A buffer other than an `ArrayBuffer` is copied into one. */
    parse(buffer: ArrayBufferLike): Font;
  };
  export default opentype;
}
