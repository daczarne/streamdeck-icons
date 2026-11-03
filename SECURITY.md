# Security

Please report a vulnerability privately, through [GitHub's private vulnerability reporting][report], rather than in a public issue. Say what an attacker could do, and how to reproduce it. Reports are answered as soon as possible, and a fix goes into a new release.

Only the latest release gets fixes.

The packs are SVG icons, drawn by code from shapes only, with no scripts and nothing loaded from elsewhere, which Stream Deck shows in its Icon Library and on keys. A release holds each pack as a zip of its folder, built by this repository's workflow from the commit the release points to, which an attestation records. The glyphs in `src/` are also code that plugins import and run, and the Litra plugin bundles into what it ships. A fix to them reaches a plugin when it updates the commit it pins. A report that an icon or a release's file can do more than show an image, that a release's file isn't what its attestation says, or about the code in `src/`, is in scope.

[report]: https://github.com/daczarne/streamdeck-icons/security/advisories/new
