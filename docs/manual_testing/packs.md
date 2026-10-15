# Testing the packs

- [When to run these checks](#when-to-run-these-checks)
- [Setup](#setup)
- [Checks](#checks)

`npm run check:icons` checks that every pack is complete: every icon listed in `icons.json`, present and sized as Elgato asks, and the manifest's required members set. CI also regenerates the packs, to check that the committed icons are what the code draws. The checks below cover what they take for granted: that Stream Deck loads a pack from the repository, and that its Icon Library shows and finds the icons. How Stream Deck loads and shows a pack is described in [`icon_packs.md`][icon-packs].

## When to run these checks

- After a change to a pack: its icons, its definition in `scripts/packs/` or its `manifest.json`. Run them for that pack.
- After a change to a glyph, the palette or the tiles, which every pack shares. Run them for every pack that uses what changed.
- After a Stream Deck update.

## Setup

Regenerate the packs and link them into Stream Deck:

```shell
npm run icons
npm run link
```

In VS Code, the `Build packs` task regenerates the packs and the type declarations, and checks the packs.

The first time a pack is linked, quit and reopen Stream Deck: it only finds a new pack when it starts. After that, a change shows the next time the Icon Library is opened. Open the Icon Library from any key's image menu (the down chevron, then **Open Stream Deck Icon Library**).

## Checks

1. **The pack is listed.** The Icon Library lists the pack by its `Name` (such as "Litra"), with its own icon and the number of icons in its `icons.json`.
2. **Every icon shows.** Expand the pack: its icons show in the order of `icons.json`. Hovering over an icon shows its name and the pack's name.
3. **Search finds the icons.** Searching for an icon's name finds it, and so does searching for one of its tags. Searching for the pack's own tag (such as "litra") finds every icon in the pack.
4. **An icon works on a key.** Assign one of the pack's icons to a key: the key shows it on the Deck, with the same colors as in the library.
5. **Tiles fill the key.** Assign tiled icons to keys (such as a charcoal and a grey Litra icon, or a monitor's from the devices pack): each tile fills its key on the Deck, with no ring around it, though the Icon Library shows one. Colored glyphs (such as the power symbols' amber and red) read clearly on their tile, and where a glyph also comes plain, it's the same size on both.
6. **Text reads.** On a key, a label (such as "BOTTOM RIGHT" or "Desk Mode ON") is crisp and fits the key, set in the same font as in the Icon Library.

[icon-packs]: ../icon_packs.md
