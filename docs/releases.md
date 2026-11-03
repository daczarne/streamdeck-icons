# Releases

- [When to release](#when-to-release)
- [The version](#the-version)
- [Making a release](#making-a-release)
  - [1. A branch that raises the version](#1-a-branch-that-raises-the-version)
  - [2. The merge drafts the release](#2-the-merge-drafts-the-release)
  - [3. Publishing](#3-publishing)
  - [4. Checking the release](#4-checking-the-release)

This document describes how a release of the icon packs is made, from the branch that raises the version to the published release, and why each step is there. How a pack's file is built, and what it holds, is in the Packaging section of [the README][packaging].

## When to release

There's no schedule. A release is made when what has been merged since the last one is worth installing, and it's made by a pull request that raises the version: nothing else starts one. The packs aren't on Elgato's Marketplace, so a release is a set of files on GitHub, which users download and open. Only the latest release gets fixes (see [`SECURITY.md`][security]): a fix ships in a new release, never in an old one.

Every release holds every pack, each as a file of its own, so a pack that didn't change comes again at the new version. Releasing the packs together keeps one version and one place to find them, and someone who wants one pack still downloads only that one.

## The version

The version is the `version` in `package.json`. Each pack's `manifest.json` repeats it as its `Version`, which the Icon Library reads, and `npm run check:icons` fails when one of them differs. Packs take three numbers, unlike plugins, which take four. The release's tag is `v{major}.{minor}.{patch}`.

Releases follow [semantic versioning][semver]. A key keeps a copy of the icon it was given, so no change to a pack breaks the keys already set up, but a removed or renamed icon is gone from the Icon Library for whoever looks for it there, which makes it a breaking change. Before 1.0, every release raises the minor, breaking changes included.

The version isn't what plugins depend on: they install this package from GitHub, pinned to a commit (see "Consumers pin a commit" in [the contributing guide][contributing]).

## Making a release

### 1. A branch that raises the version

The branch raises `version` in `package.json`, `package-lock.json` with it, and `Version` in each pack's `manifest.json`. `npm version <version> --no-git-tag-version` changes the first two. It also checks `.github/release-notes.md`, which is the same for every release, against what the release changes: what it says about installing the packs, and where they're checked, is still true.

The branch can be the one that brings the release's last change, or one of its own, which only raises the version.

### 2. The merge drafts the release

Once the branch is merged, CI's last job runs on the push to `main`, after every check has passed. When the version has no release yet, drafts included, it:

1. Packs every pack with `npm run pack`, as the Packaging section of [the README][packaging] describes.
2. Records each file's provenance in an attestation, which ties it to the commit and the workflow that built it.
3. Drafts a release tagged `v{major}.{minor}.{patch}`, which holds every pack's file and the notes from `.github/release-notes.md`, with the version filled in and each file listed with its pack's name and its SHA-256, followed by the pull requests merged since the last release, which GitHub lists.

A merge that doesn't raise the version finds its release already made, and drafts nothing.

### 3. Publishing

Publishing the draft is manual, once its notes are read: the pull requests GitHub lists are the release's changes, and their titles should read as such. Publishing creates the tag, on the commit the draft points to.

### 4. Checking the release

Development runs the packs linked from the repository, so the files a release ships are never what the Deck loads there. Each release is therefore installed from its page once it's published, on macOS and on Windows, and checked there as its users run it, following [the release checks][release-checks]. What the checks find broken is fixed through a pull request, and ships in the next release.

[contributing]: contributing.md
[packaging]: ../README.md#packaging
[release-checks]: manual_testing/releases.md
[security]: ../SECURITY.md
[semver]: https://semver.org
