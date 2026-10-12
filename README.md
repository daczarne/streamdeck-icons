# Stream Deck icons

Icon packs for Elgato Stream Deck, and the glyphs, palette and SVG helpers they share with Stream Deck plugins. Every icon is drawn by code, so packs and plugins stay in one style, and a style change reaches all of them from one place.

Not an official Elgato or Logitech product.

- [Packs](#packs)
- [Using the glyphs in a plugin](#using-the-glyphs-in-a-plugin)
- [Working on the packs](#working-on-the-packs)
- [Layout](#layout)
- [Credits](#credits)

## Packs

| Pack                            | Icons                                                                                                       |
|---------------------------------|-------------------------------------------------------------------------------------------------------------|
| `com.daczarne.litra.sdIconPack` | Logitech Litra lights: brightness, temperature (cool, warm, hot) and power, used by the Litra plugin's keys |

Every glyph of a pack comes in three sets: white on transparent, and on a charcoal or a grey tile that fills the key. The tiles' colors and the glyphs' inks come from one palette, in `src/palette.mjs`. Glyphs are sized to leave room around them on a key, the same size in every set.

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

## Layout

- `src/` is what plugins import: the glyphs (`glyphs.mjs`), the palette (`palette.mjs`) and `svgDoc` (`svg.mjs`).
- `scripts/packs/` holds one definition per pack: its glyphs, their names, tags and sizes. `scripts/pack-builder.mjs` turns a definition into the pack's icons, plain and on every tile, and its `icons.json`.
- Each `*.sdIconPack/` folder at the root is a pack, as Stream Deck loads it. Its `manifest.json` is written by hand, and everything else in it is generated.

## Credits

The first glyphs (the power symbol, the lamp and the action-list icons) come from Seth Sheppard's original Litra plugin, and the rest were drawn here. The package is MIT licensed: see [`LICENSE`][license].

[icon-packs]: docs/icon_packs.md
[license]: LICENSE
[packs-test]: docs/manual_testing/packs.md
