# v@VERSION@

## Installing

Each pack is a file of its own below. Download the ones you want and open each: Stream Deck asks to confirm, installs the pack, and its icons appear in the Icon Library, where any key can pick them. The packs are made on macOS, with Stream Deck 7.6, and each release is installed from this page and checked on macOS and on Windows once it's published.

A newer release installs the same way, over the pack installed. To remove a pack, uninstall it from the Icon Library, with the trash can next to its name. Stream Deck won't install an older release over a newer one, so going back to one takes uninstalling the pack first. A key keeps a copy of the icon it was given, so updating or removing a pack doesn't change the keys that already use its icons.

## Verifying the downloads

@PACKS@

To compare a file's SHA-256 with your download's:

- On macOS: `shasum -a 256 <file>`
- On Windows, in PowerShell: `Get-FileHash <file>`

Each file was built by this repository's workflow, from the commit this release points to, which an attestation records. With the [GitHub CLI][gh], check one with:

```shell
gh attestation verify <file> --repo daczarne/streamdeck-icons
```

[gh]: https://cli.github.com
