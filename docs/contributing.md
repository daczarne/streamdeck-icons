# Contributing

- [Changes go through pull requests](#changes-go-through-pull-requests)
- [Small pull requests](#small-pull-requests)
- [Commit messages and pull request text](#commit-messages-and-pull-request-text)
- [Changes come with their checks](#changes-come-with-their-checks)
- [Consumers pin a commit](#consumers-pin-a-commit)
- [Dependencies](#dependencies)
- [Unused code](#unused-code)
- [Working with Claude](#working-with-claude)

This document describes how work on this repository is done: how changes reach `main`, how they are sliced and recorded, and what each one has to bring with it. Style is covered separately, in [the style guide][style-guide].

## Changes go through pull requests

Nothing is pushed to `main`. Every change, however small, is made on its own branch and reaches `main` through a pull request, which is squash-merged. Pushing to the repository and merging are the maintainer's. `.github/CODEOWNERS` makes the maintainer the owner of every file, so a pull request from anyone else needs the maintainer's approval before it can be merged.

Branch names are flat kebab-case, without `/`: `monitor-pack`, not `feature/monitor-pack`.

## Small pull requests

Each pull request is small and focused on one thing, because large ones are hard to review. An issue doesn't have to be closed by a single pull request: it can take several, and work that grows beyond it becomes its own issue.

When work turns up that doesn't belong in the current branch, it becomes an issue instead of being added to the branch.

## Commit messages and pull request text

Since pull requests are squash-merged, their title and description become the commit on `main`. They are the history of the repository, so that's where the care goes: they are written for someone reading that history later, and an inaccuracy is fixed there.

Commit messages on a branch disappear in the squash. They stay short and accurate, but they aren't polished or rewritten after the fact.

## Changes come with their checks

The icons are drawn by code, and their files are generated from it and committed.

- `npm run check:icons` checks every pack against what Stream Deck's Icon Library needs, and CI regenerates every pack and the type declarations to check that the committed files are what the code generates. A change to the code is committed with the icons and declarations it regenerates.
- `npm run typecheck` checks the types that the doc comments declare, and `npm run check:docs` that every function has one.
- What only the Deck can show (how an icon looks on a key, whether the library finds it) is checked by hand, with the checks in [`docs/manual_testing/`][manual-testing]. A change that needs new manual checks adds them there, in the same pull request.
- A change meant to leave the icons and the exports as they are, such as a refactoring, shows it: regenerating the packs and the declarations changes no file.

## Consumers pin a commit

Plugins draw their own images from this package's exports (the glyphs, the palette and `svgDoc`), installed from GitHub and pinned to a commit. A change here reaches a plugin only when the plugin updates the commit it depends on, regenerates its images and commits them, so its history records which icons it was built from.

So the exports are a contract. Renaming or removing one, or changing what a glyph draws by default, breaks or changes a plugin the next time it updates. The type declarations in `types/` are that contract in a form a reviewer can read: a change to an export's name, its parameters or its options shows up in their diff. Such a change says so in its pull request, and adds an option with the old behavior as its default where it can, as the glyphs' `color` and `level` do.

## Dependencies

Every dependency is pinned, and every upgrade is a deliberate change of its own.

- `package.json` declares exact versions only, never ranges. The project `.npmrc` sets `save-exact=true`, so `npm install <package>` records an exact version, and `ignore-scripts=true`, so no install runs install scripts.
- An upgrade is `npm install <package>@<version>`, followed by a review of the lockfile diff. Exact versions don't pin transitive dependencies, only the lockfile does, so it stays committed and installs use `npm ci`.
- The Node and the npm the repository is worked on with are pinned in `devEngines` in `package.json`, and npm refuses to install or run a script with any other. They're in `devEngines` rather than `engines` because npm checks `devEngines` only in the project being installed: a plugin that installs the glyphs builds with its own Node and npm, not this repository's. Node's version is also in `.node-version`, which `n` and CI read.
- Node 24 ships with npm 11, so npm is installed on its own, from its tarball, checked against the integrity hash the registry publishes for it (`npm view npm@<version> dist.integrity`), and with `--ignore-scripts`. CI does the same, against the hash recorded in its workflow. Switch Node with `n --preserve`, which keeps the npm installed: without it, `n` puts back the npm that ships with Node. Upgrading Node or npm changes `devEngines`, and `.node-version` or the version and hash in the workflow, together.
- GitHub Actions are pinned to full commit SHAs, with the version as a trailing comment, checked against the release tag. Like npm packages, they're upgraded by hand.
- CI's runners are pinned to an Ubuntu release (`ubuntu-24.04`), not `ubuntu-latest`, which GitHub moves to a new release on its own schedule. A release's image still gets GitHub's updates, but a new release can drop tools and change the default versions of others. Moving to a newer release is an upgrade of its own.

The package's dependencies are all development dependencies, so plugins that import the glyphs install none of them: `opentype.js`, which lays text out from the font when building the packs, Biome, which lints and formats the code, and TypeScript with `@types/node`, which check its types. `@types/node` is pinned to the newest version whose minor doesn't go past the Node in `.node-version`, since its minor versions don't follow Node's one for one. Biome ships as a native binary, one optional dependency per platform, so its upgrades can't be reviewed from source in the lockfile diff, which still shows which packages changed and where they come from. Its type-aware rules, such as `noFloatingPromises`, are in its experimental nursery group, so an upgrade can change what they report: run `npm run lint` on the upgrade and look at what changed. A new dependency is flagged and justified in its pull request. The font in `fonts/` is vendored rather than installed, and pinned by its hash in `scripts/check-packs.mjs`: replacing it is a deliberate change of its own, like an upgrade.

## Unused code

Code or configuration that is unused, misleading or contradicts a decision already made is removed.

## Working with Claude

- When asked for a command, Claude replies with the command and doesn't run it. Steps that change what the Deck shows, like linking a pack, are the user's to run, while looking at the hardware.

[manual-testing]: manual_testing/
[style-guide]: style_guide.md
