# Testing a release

- [When to run these checks](#when-to-run-these-checks)
- [Setup](#setup)
- [Checks](#checks)

Development runs the packs linked from the repository, so the Deck never loads what a release ships. These checks run the packs as their users do: downloaded from the release, installed, and used on macOS and on Windows. They cover what nothing else does: that each file installs with a double-click on each system, over an older release, that the installed pack is the one in the repository, and that it's removed cleanly.

## When to run these checks

- On every release, on macOS and on Windows, once it's published (see [the release process][releases]). What they find broken ships fixed in the next release.
- After a change to how the files are made, such as `scripts/pack-packs.mjs` or the `pack` script, on files made with `npm run pack`. Such a file isn't the workflow's, so check 1 doesn't apply to it.

## Setup

On each computer, Stream Deck is installed, and the packs aren't linked there from a clone: an installed pack and a linked one share their folder's name. Where they are, run `npm run unlink` first.

Download every pack's file from the release's page.

## Checks

Run them for every pack.

1. **The download is the file the workflow built.** Its SHA-256, from `shasum -a 256` on macOS or `Get-FileHash` in PowerShell on Windows, is the one the release's notes give for it. With the GitHub CLI, `gh attestation verify <file> --repo daczarne/streamdeck-icons` passes.
2. **It installs.** Open the file: Stream Deck asks to confirm, then installs the pack, and says it did. When an older release of the pack is installed, the new one replaces it, and the Icon Library lists only the new one.
3. **The installed pack is the repository's.** Run [the packs' checks][packs] on it: the Icon Library lists it with as many icons as its `icons.json` has, and its icons show, are found and work on a key as they do linked.
4. **It's removed cleanly.** Uninstall the pack from the Icon Library, with the trash can next to its name: it leaves the list at once, and the keys that use its icons keep them. Opening its file again installs it again.

[packs]: packs.md
[releases]: ../releases.md
