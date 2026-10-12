#!/usr/bin/env node
/**
 * Links every icon pack (each `*.sdIconPack` folder at the root) into Stream Deck's icon packs folder on macOS, so
 * Stream Deck loads it from the repository, or removes the links with `--unlink`. Stream Deck only finds a new pack
 * when it starts. After that, a change shows the next time the Icon Library is opened.
 */
import { lstatSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const ICON_PACKS = path.join(homedir(), "Library/Application Support/com.elgato.StreamDeck/IconPacks");
const unlink = process.argv.includes("--unlink");

for (const pack of readdirSync(".").filter((name) => name.endsWith(".sdIconPack"))) {
  const link = path.join(ICON_PACKS, pack);
  // A link to a folder that's gone still counts, so this doesn't follow it.
  const existing = lstatSync(link, { throwIfNoEntry: false });
  // Only ever replace or remove a link: a folder there is an installed pack, which isn't ours to touch.
  if (existing !== undefined && !existing.isSymbolicLink()) {
    console.error(`${link} is not a link: remove the installed pack by hand first`);
    process.exitCode = 1;
    continue;
  }
  if (existing !== undefined) {
    rmSync(link);
  }
  if (unlink) {
    console.log(existing !== undefined ? `unlinked ${pack}` : `${pack} was not linked`);
  } else {
    symlinkSync(path.resolve(pack), link);
    console.log(`linked ${pack} -> ${link}`);
  }
}
