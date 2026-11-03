# Stream Deck icon packs

- [The format](#the-format)
- [The installable file](#the-installable-file)
- [Installing while developing](#installing-while-developing)
- [What the Icon Library shows](#what-the-icon-library-shows)
- [Keys keep a copy of their icon](#keys-keep-a-copy-of-their-icon)
- [Sources](#sources)

An icon pack adds icons to Stream Deck's Icon Library, where any key or dial can pick them. It is a package of its own, separate from plugins: the Stream Deck CLI and SDK know nothing about it. This document describes the format and how Stream Deck loads a pack, as found in Elgato's documentation, in installed packs and on the Deck, while building the first pack here.

## The format

A pack is a folder named by its ID in reverse-DNS form, with a `.sdIconPack` extension, such as `com.daczarne.litra.sdIconPack`. The Icon Library shows that ID next to the pack's name.

- **`manifest.json`.** `Name`, `Author`, `Version` and `Icon` (the path to the pack's own icon, best at 56 × 56 px) are required. `Version` has three numbers, such as `1.1.0` in Elgato's Legion pack, not the four of a plugin's, though packs with two, such as `1.0`, load too. `Description`, `URL` and `License` (the path to a `.txt` file) are optional.
- **`icons.json`.** One entry per icon, in the order the library shows them: `path` (relative to `icons/`), `name` (the display name) and `tags` (a list of strings). Elgato marks all three as required, though a pack whose icons have no tags still loads.
- **`icons/`.** The icons, at 144 × 144 px, as SVG, PNG or JPEG, with file names of at most 80 characters. Stream Deck scales them itself, so unlike a plugin's images they come in one size. Animated icons are GIF or WEBP, each with a PNG of the same name next to it, which `icons.json` doesn't list.

## The installable file

Elgato builds packs with Icon Pack Man, a web app that exports a `.streamDeckIconPack` file, installed with a double-click. Stream Deck registers the extension as a document type, as it does `.streamDeckPlugin`, so opening the file opens Stream Deck, which asks to confirm, installs the pack and says it did. The file is only needed to distribute a pack: Stream Deck also loads an unpacked folder.

Its contents aren't documented. Tried on the Deck, it's a zip that holds the pack's `.sdIconPack` folder, as a plugin's file holds its `.sdPlugin` folder. Stream Deck installs the pack as a folder in `IconPacks/`, named as the folder in the zip. A zip of the folder's contents, with `manifest.json` at its root, is refused with an alert.

- **A newer version** of a pack that's installed installs over it: Stream Deck says it did, and the Icon Library shows only the new one.
- **An older version** isn't installed over a newer one: Stream Deck says the pack is already installed, and points to the Icon Library.
- **Uninstalling** is done from the Icon Library, with the trash can next to the pack's name, which asks to confirm. The pack is gone at once, and any version of it installs again from its file.

## Installing while developing

Stream Deck loads every folder in `~/Library/Application Support/com.elgato.StreamDeck/IconPacks/`, including a symlink to a folder elsewhere, so a pack can run from this repository: `npm run link` links every pack there.

- **Adding a pack** takes effect only once Stream Deck is quit and reopened.
- **Changing a pack** it already knows (renaming, adding or removing an icon, or changing the pack's icon) shows the next time the Icon Library is opened. A library that is already open doesn't update.
- **Removing a pack** takes effect at once.
- **An installed pack** has the same folder name as the linked one, so the two can't be there together. `npm run link` refuses to replace a folder that isn't a link, and an installed pack is installed after `npm run unlink`, since installing over a link could reach through it into the repository. For the same reason, a linked pack is removed with `npm run unlink`, never with the Icon Library's trash can, which it offers for a linked pack too.

## What the Icon Library shows

- **The pack.** Its icon, its `Name` and how many icons it has. The pack list capitalizes the name ("Litra (Test)" for "Litra (test)"), while search results show it as written. The `Author` doesn't show anywhere.
- **An icon.** Hovering over it shows its `name` and the pack's name.
- **Opaque icons.** The library draws each icon slightly inset on its own grey key, so an icon that fills its canvas, such as a tile, shows a ring of that grey around it, as icons from the Marketplace do. On the Deck, the icon fills the key, with no ring.
- **Search.** It matches an icon's `name` and its `tags`, ignoring case, and groups the results by pack, next to matching icons from every other pack.

## Keys keep a copy of their icon

When an icon is assigned to a key, Stream Deck copies it into the profile: the key's entry in the profile's `manifest.json` points at an image in the profile's own `Images/` folder, not at the pack. So redrawing an icon in a pack doesn't change the keys that already use it, until it's assigned to them again. A key keeps its icon even after the pack is removed.

## Sources

Checked on Stream Deck 7.6, on macOS, against:

- Elgato's [API glossary for icon packs][api], [icon pack overview][overview] and [icon guidelines][guidelines].
- The packs installed in `IconPacks/`, including Elgato's Legion pack.
- A test pack linked into `IconPacks/` on the Deck, and test packs installed from `.streamDeckIconPack` files.
- The document types Stream Deck's app registers.

[api]: https://docs.elgato.com/stream-deck/icons/api
[guidelines]: https://docs.elgato.com/guidelines/stream-deck/icons
[overview]: https://docs.elgato.com/makers/stream-deck/icon-packs/overview
