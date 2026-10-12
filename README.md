# Stream Deck icons

Icon packs for Elgato Stream Deck, and the glyphs, palette and SVG helpers they share with Stream Deck plugins. Every icon is drawn by code, so packs and plugins stay in one style, and a style change reaches all of them from one place.

Not an official Elgato or Logitech product.

- [Packs](#packs)
- [Using the glyphs in a plugin](#using-the-glyphs-in-a-plugin)
- [Working on the packs](#working-on-the-packs)
- [Text on icons](#text-on-icons)
- [Layout](#layout)
- [Credits](#credits)

## Packs

| Pack                              | Icons                                                                                                                                                         |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `com.daczarne.litra.sdIconPack`   | Logitech Litra lights: brightness, temperature (cool, warm, hot) and power, used by the Litra plugin's keys                                                   |
| `com.daczarne.devices.sdIconPack` | Devices around the Deck: monitor input switching (a label, a laptop and a computer per monitor, brightness and desk mode), locks, and speakers and headphones |

The Litra pack's glyphs come in three sets: white on transparent, and on a charcoal or a grey tile that fills the key. The devices pack puts each monitor key on its monitor's color, as the keys on the Deck are. The tiles' colors and the glyphs' inks come from one palette, in `src/palette.mjs`. Glyphs are sized to leave room around them on a key, the same size in every set. Labels are text written as paths, from a vendored font, so they look the same on any machine.

## Using the glyphs in a plugin

A plugin installs this package from GitHub, pinned to a commit, as a development dependency:

```shell
npm install --save-dev github:daczarne/streamdeck-icons#<commit-sha>
```

It then draws its own images from the exports, in whatever sizes and formats Stream Deck needs from it:

```js
import { brightnessGlyph, svgDoc } from "@daczarne/streamdeck-icons";

const svg = svgDoc(144, brightnessGlyph(144));
```

Each glyph takes the size of its square canvas, and options such as `color`, and returns SVG markup. The package ships only `src/`, as plain ES modules with nothing to build, so it installs without running scripts. A plugin takes a new style by updating the commit it depends on and regenerating its images.

## Working on the packs

Use the Node version in `.node-version`, and install from the lockfile without install scripts:

```shell
npm ci --ignore-scripts
npm run icons             # regenerate every pack from its definition in scripts/packs/
npm run check:icons       # every pack: manifest complete, every icon listed, sized and present
npm run link              # link every pack into Stream Deck's IconPacks folder (macOS)
npm run unlink            # remove the links
```

Stream Deck only finds a new pack when it starts, so quit and reopen it after the first link. After that, a change shows the next time the Icon Library is opened. In VS Code, the `Build packs` task regenerates the packs and checks them.

[`docs/icon_packs.md`][icon-packs] describes the format and how Stream Deck loads a pack, and [`docs/manual_testing/packs.md`][packs-test] the checks to run on the Deck.

## Text on icons

Text goes on icons as paths, never as SVG text: Stream Deck would draw `<text>` with whatever fonts the machine has, and a label would change font from one machine to the next. `textGlyph` in `scripts/text.mjs` lays each line out from the vendored font and writes its letters as shapes, so a label looks the same everywhere, like a glyph.

A label is a list of lines, split by hand, such as `["BOTTOM", "RIGHT"]`. Every label gets the same size, the one the monitor keys were designed with: capitals 15% of the icon tall, and lines about 29% apart, with the block centered. Labels stay alike that way, so a long word goes on a line of its own rather than in smaller letters. A label whose letters would come within 5% of an icon's edge stops `npm run icons` with an error naming the line, rather than run off the key: "BOTTOM" is about as wide as a line can be, and three lines as many as fit.

To update or replace the font:

1. Download the new file from a pinned commit of the Noto project's distribution, [`notofonts/notofonts.github.io`][noto-dist], rather than from `main`, so the address always serves the same file. Its license comes from the font's source repository, at a pinned commit too.
2. Update the hash and the source comment of `FONT` in `scripts/check-packs.mjs`, and the license in `fonts/OFL.txt` if it changed.
3. Run `npm run icons` and review the labels: a new font, even a new version of the same one, can move every letter. Check them on the Deck with [`docs/manual_testing/packs.md`][packs-test].

## Layout

- `src/` is what plugins import: the glyphs (`glyphs.mjs`), the palette (`palette.mjs`) and `svgDoc` (`svg.mjs`).
- `scripts/packs/` holds one definition per pack: its icons, their names and tags, in the order the Icon Library shows them. `scripts/pack-builder.mjs` writes a definition out as the pack's icons and `icons.json`, with helpers for common patterns, such as each glyph plain and on every tile.
- Each `*.sdIconPack/` folder at the root is a pack, as Stream Deck loads it. Its `manifest.json` is written by hand, and everything else in it is generated.
- `fonts/` holds the font labels are drawn from, Noto Sans Bold, with its license. `scripts/text.mjs` lays a label out from it with [opentype.js][opentype], the repository's one dependency, and writes each letter as a path. `npm run check:icons` checks the font against its pinned hash.

## Credits

The first glyphs (the power symbol, the lamp and the action-list icons) come from Seth Sheppard's original Litra plugin, and the rest were drawn here. The package is MIT licensed: see [`LICENSE`][license]. The labels are set in [Noto Sans][noto], by the Noto Project Authors, under the SIL Open Font License: see [`fonts/OFL.txt`][ofl].

[icon-packs]: docs/icon_packs.md
[license]: LICENSE
[noto]: https://notofonts.github.io
[noto-dist]: https://github.com/notofonts/notofonts.github.io
[ofl]: fonts/OFL.txt
[opentype]: https://github.com/opentypejs/opentype.js
[packs-test]: docs/manual_testing/packs.md
