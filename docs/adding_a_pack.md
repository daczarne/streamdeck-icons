# Adding a pack

- [One pack per topic](#one-pack-per-topic)
- [Steps](#steps)
- [The pack's label](#the-packs-label)

This document describes how to add a new icon pack to the repository, from its folder to its first check on the Deck. [`icon_packs.md`][icon-packs] describes the format the steps produce, and how Stream Deck loads it.

## One pack per topic

Each pack covers one topic, such as a plugin's lights or the devices around the Deck, and its icons share that topic's tag, so a search for it finds the whole pack. An icon that fits the topic of an existing pack goes there instead.

A pack's topic names everything that belongs to it: its folder, `com.daczarne.<topic>.sdIconPack`, its definition, `scripts/packs/<topic>.mjs`, its tag and its label.

## Steps

1. **Write the manifest.** Create the pack's folder at the root, and in it a `manifest.json`, written by hand: `Name` (what the Icon Library shows), `Author`, `Version`, `Description`, `URL`, and `Icon` set to `icon.svg`, which the build generates. Everything else in the folder is generated.
2. **Write the definition.** `scripts/packs/<topic>.mjs` exports the pack's `folder`, its `tag`, its `icons` in the order the Icon Library shows them, each with a `path`, a `name`, `tags` and `draw`, and its `logo`. `scripts/pack-builder.mjs` has the helpers to build the list: `plainGlyphs` and `tiledGlyphs` for a glyph plain and on every tile scheme, as the Litra pack does, or `tile` and `scaled` to place each icon on a tile of its own, as the devices pack does. Text on an icon is drawn with `textGlyph`, from `scripts/text.mjs`.
3. **Draw the glyphs in `src/`.** A new glyph goes in `src/glyphs.mjs`, so plugins can use it too, and takes its colors from `src/palette.mjs`. Draw it at the size it takes on a tile, as the devices pack's glyphs are, so it goes into the pack as it is. A glyph that a plugin draws to fill its keys, like the Litra glyphs, is scaled down for the pack instead, with `span` and `packSpan`.
4. **List the pack.** Add the definition to `PACKS` in `scripts/generate-packs.mjs`.
5. **Generate and check.** `npm run icons` writes the pack's icons, `icons.json` and `icon.svg`, and `npm run check:icons` checks the pack against what the Icon Library needs. Commit the generated files with the code, since CI regenerates every pack and fails if anything changes.
6. **Add its label.** See [The pack's label](#the-packs-label).
7. **Document it.** Add the pack to the table in `README.md`, and to the packs that `CLAUDE.md` names in its Project section.
8. **Check it on the Deck.** `npm run link` links the new pack into Stream Deck, which only finds it once quit and reopened. Then run the checks in [`manual_testing/packs.md`][packs-test].

## The pack's label

Each pack gets its own label, named after its topic, so the pull requests that change a pack can be found by it. `.github/labeler.yaml` gives it to every pull request that changes the pack's folder or its definition:

```yaml
<topic>:
  - changed-files:
      - any-glob-to-any-file:
          - com.daczarne.<topic>.sdIconPack/**
          - scripts/packs/<topic>.mjs
```

The folder's glob needs its `/**`: the labeler matches globs against the paths of the changed files, and a folder's bare name matches none of them.

Those two globs are enough. A change to the shared code (a glyph, the palette, the pack builder or the font) that changes how a pack looks also regenerates that pack's icons, so it changes the pack's folder and gets the pack's label. A change to the shared code that leaves a pack as it is gets only the shared code's own labels.

[icon-packs]: icon_packs.md
[packs-test]: manual_testing/packs.md
