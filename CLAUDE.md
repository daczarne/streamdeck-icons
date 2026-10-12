# CLAUDE.md

- [Project](#project)
- [Read before changing things](#read-before-changing-things)
- [Layout](#layout)
- [Commands](#commands)
- [Supply chain](#supply-chain)
- [Testing on the hardware](#testing-on-the-hardware)
- [Workflow](#workflow)
- [Style](#style)

## Project

Icon packs for Daniel's Stream Deck, one per topic, and the glyphs, palette and SVG helpers they share with his Stream Deck plugins. The packs so far are Litra's, for the Logitech Litra plugin in `daczarne/streamdeck-litra`, which draws its own images from this package's exports, and the devices pack, for the devices around Daniel's Deck, starting with his monitor input switching keys. The repository is public.

Daniel's setup: macOS on a Mac Studio, and a Stream Deck + XL running Stream Deck 7.6. The packs aren't distributed: they run linked from the repo.

Daniel knows little about design, and expects Claude to lead on colors, sizes and shapes: propose, show, and let him judge on the Deck. The palette in `src/palette.mjs` comes from icons he drew for his monitor input switching keys, and new icons follow it.

## Read before changing things

- `docs/contributing.md`: how work is done here. Changes go through pull requests, come with their checks, and dependencies are pinned. It also explains why the exports are a contract with the plugins.
- `docs/style_guide.md`: the conventions the linters don't enforce (see [Style](#style)).
- `docs/icon_packs.md`: the icon pack format, and how Stream Deck loads and shows a pack, checked on the Deck. Add to it when a change finds out something new.
- `docs/adding_a_pack.md`: how to add a pack, from its manifest to its label and its first check on the Deck. Each pack gets its own label.
- `docs/manual_testing/packs.md`: the checks that only the Deck can prove. Before asking Daniel to look at the Deck, point to them.

## Layout

- `src/` is what plugins import, through `src/index.mjs`: the glyphs in `glyphs.mjs`, the palette in `palette.mjs`, and `svgDoc` in `svg.mjs`. Each glyph takes the size of its canvas and options such as `color`, and returns SVG markup. The Litra plugin's glyphs fill their canvas, as its keys need, and a pack scales them down to its size with `span` and `packSpan`. The glyphs of the devices pack are drawn at the size they take on a tile, and go in as they are. A new option keeps the old behavior as its default, so plugins that update draw the same images.
- `scripts/packs/` holds one definition per pack: its icons, in the order the Icon Library shows them, with their names and tags. `scripts/pack-builder.mjs` writes a definition out as the pack's icons and `icons.json`, and offers helpers to build the list: `plainGlyphs` and `tiledGlyphs` for a glyph plain and on every tile scheme (the Litra pack), `tile` and `scaled` for a pack that places each icon itself (the devices pack). `scripts/generate-packs.mjs` lists the packs to build.
- Each `*.sdIconPack/` folder at the root is a pack: `manifest.json`, written by hand, and `icons.json`, `icons/` and `icon.svg`, generated and committed.
- `scripts/check-packs.mjs` checks every pack, and the font against its hash, and `scripts/link-packs.mjs` links them into Stream Deck.
- Text goes on icons as paths, never as SVG `<text>`, which Stream Deck would draw with whatever fonts the machine has. `scripts/text.mjs` lays it out from `fonts/NotoSans-Bold.ttf` with `opentype.js`, at the cap height and line spacing measured on the monitor keys, the same for every label. Lines are split by hand, and a label that comes within 5% of an icon's edge stops the build: it needs shorter lines, not smaller letters. It lives in `scripts/`, not `src/`, so plugins that import the glyphs don't need the font or the library.

## Commands

```shell
n auto                    # switch to the Node version in .node-version
npm ci --ignore-scripts   # install from the lockfile, without install scripts
npm run icons             # regenerate every pack
npm run check:icons       # every pack: manifest complete, every icon listed, sized and present
npm run link              # link every pack into Stream Deck (macOS)
npm run unlink            # remove the links
```

To see a change before showing Daniel, render the SVGs to a contact sheet in the scratchpad (with `sharp`, from the plugin repo's `node_modules`, or any SVG renderer), at 144 px and at the Deck's 72 px, and look at it.

## Supply chain

Daniel treats supply-chain risk as a hard requirement. The package's one dependency is `opentype.js`, a development dependency with no dependencies of its own, used only to build the packs. A new one is flagged and justified, with a narrower alternative offered. The font in `fonts/` is vendored from the Noto project's distribution, pinned to a commit there and to its hash in `scripts/check-packs.mjs`, and replaced only deliberately, like a dependency. npm packages and GitHub Actions are pinned to exact versions, and each upgrade is its own change: see the "Dependencies" section of `docs/contributing.md`.

## Testing on the hardware

- `npm run link` links every pack into `~/Library/Application Support/com.elgato.StreamDeck/IconPacks/`. Stream Deck only finds a new pack once it's quit and reopened. After that, a change shows the next time the Icon Library is opened.
- A key keeps a copy of the icon it was given, so redrawing an icon doesn't change the keys that already use it.
- Claude can't see the Deck. Daniel looks at the Icon Library and the keys, and can share screenshots, which are enough to judge an icon. Colors in his screenshots are exact, so they can be sampled.

## Workflow

`docs/contributing.md` describes branches, pull requests and checks. On top of it:

- Create branches with `git switch -c`.
- Commit messages explain the why and end with the `Co-Authored-By` trailer for Claude. Commit only when Daniel asks.
- `.github/workflows/main.yaml` runs Markdown lint, CSpell, the packs' check, and a regeneration that must change nothing, on every pull request and on `main`. Locally, `/lint` and the `Lint` VS Code task run the same checks.
- Write the pull request title and description with the `pr-description` skill.
- Draft issues with the `github-issues` skill, and post them only when Daniel asks. The skill works on the issues of both this repository and `daczarne/streamdeck-litra`, whichever the session started in.

## Style

`docs/style_guide.md`, `.editorconfig`, the Markdown lint configuration and CSpell (with the dictionaries in `.cspell/`) are the authority on style.
