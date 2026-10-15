#!/usr/bin/env node
/**
 * Generates every icon pack from its definition in `scripts/packs/`: its icons as SVGs, which Stream Deck scales, its
 * `icons.json` and its own icon. A pack's `manifest.json` is written by hand.
 */
import { writePack } from "./pack-builder.mjs";
import devices from "./packs/devices.mjs";
import litra from "./packs/litra.mjs";

const PACKS = [litra, devices];

for (const pack of PACKS) {
  writePack(pack);
}
console.log("Packs generated.");
