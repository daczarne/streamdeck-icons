#!/usr/bin/env node
/**
 * Packs every icon pack (each `*.sdIconPack` folder at the root) into `release/<id>.streamDeckIconPack`, the file
 * Stream Deck installs when it's opened: a zip that holds the pack's folder, named as it is here, which Stream Deck
 * installs under that name. A zip of the folder's contents is refused (see `docs/icon_packs.md`).
 *
 * The zip is written here, on Node's `zlib`, rather than by a library or the system's `zip`, so packing adds no
 * dependency and runs the same on every system. Its entries are sorted, and dated 1980-01-01, the earliest date a zip
 * holds, so the same files always make the same package, with the same SHA-256.
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { crc32, deflateRawSync } from "node:zlib";

const RELEASE_DIR = "release";

// The zip format's signatures, and the version it needs to extract deflated entries (2.0).
const LOCAL_HEADER = 0x04034b50;
const CENTRAL_HEADER = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY = 0x06054b50;
const VERSION_NEEDED = 20;
// Made on Unix (3, in the high byte), so the entries carry Unix permissions, in the high half of their attributes.
const VERSION_MADE_BY = (3 << 8) | VERSION_NEEDED;
const FILE_MODE = 0o100644;
const DIRECTORY_MODE = 0o040755;
// The MS-DOS attribute that also marks a directory.
const DOS_DIRECTORY = 0x10;
// Bit 11 of the flags: names are UTF-8.
const UTF8_NAMES = 0x0800;
const STORED = 0;
const DEFLATED = 8;
// 1980-01-01 00:00, in MS-DOS's date format: years since 1980, then the month and the day, each from 1.
const DOS_DATE = (0 << 9) | (1 << 5) | 1;
const DOS_TIME = 0;

/**
 * An entry of a zip: a folder, whose name ends in `/`, or a file with its contents.
 *
 * @typedef {{ name: string, data?: Buffer }} Entry
 */

/**
 * Every folder and file under `folder`, as entries named from the root of the zip, which `folder` starts. Hidden
 * files, such as the `.DS_Store` Finder leaves, are left out, as the pack's check leaves them out.
 *
 * @param {string} folder
 * @returns {Entry[]}
 */
function entriesOf(folder) {
  /** @type {Entry[]} */
  const entries = [{ name: `${folder}/` }];
  const children = readdirSync(folder, { withFileTypes: true })
    .filter((child) => !child.name.startsWith("."))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const child of children) {
    const childPath = `${folder}/${child.name}`;
    if (child.isDirectory()) {
      entries.push(...entriesOf(childPath));
    } else {
      entries.push({ name: childPath, data: readFileSync(childPath) });
    }
  }
  return entries;
}

/**
 * A zip of `entries`, each file deflated, unless deflating doesn't make it smaller.
 *
 * @param {Entry[]} entries
 * @returns {Buffer}
 */
function zip(entries) {
  /** @type {Buffer[]} */
  const locals = [];
  /** @type {Buffer[]} */
  const centrals = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, "utf8");
    const contents = data ?? Buffer.alloc(0);
    const deflated = deflateRawSync(contents);
    const method = data !== undefined && deflated.length < contents.length ? DEFLATED : STORED;
    const stored = method === DEFLATED ? deflated : contents;
    const crc = crc32(contents);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(LOCAL_HEADER, 0);
    local.writeUInt16LE(VERSION_NEEDED, 4);
    local.writeUInt16LE(UTF8_NAMES, 6);
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(DOS_TIME, 10);
    local.writeUInt16LE(DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(stored.length, 18);
    local.writeUInt32LE(contents.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBytes, stored);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(CENTRAL_HEADER, 0);
    central.writeUInt16LE(VERSION_MADE_BY, 4);
    central.writeUInt16LE(VERSION_NEEDED, 6);
    central.writeUInt16LE(UTF8_NAMES, 8);
    central.writeUInt16LE(method, 10);
    central.writeUInt16LE(DOS_TIME, 12);
    central.writeUInt16LE(DOS_DATE, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(stored.length, 20);
    central.writeUInt32LE(contents.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    // The extra field's length, the comment's, the disk the entry starts on, and its internal attributes, all 0.
    central.writeUInt32LE(
      data === undefined ? ((DIRECTORY_MODE << 16) | DOS_DIRECTORY) >>> 0 : (FILE_MODE << 16) >>> 0,
      38,
    );
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBytes);

    offset += local.length + nameBytes.length + stored.length;
  }

  const centralDirectory = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(END_OF_CENTRAL_DIRECTORY, 0);
  // This disk, and the disk the central directory starts on, are both 0.
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, centralDirectory, end]);
}

const packs = readdirSync(".").filter((name) => name.endsWith(".sdIconPack"));
rmSync(RELEASE_DIR, { recursive: true, force: true });
mkdirSync(RELEASE_DIR);
for (const pack of packs) {
  const file = path.join(RELEASE_DIR, `${path.basename(pack, ".sdIconPack")}.streamDeckIconPack`);
  writeFileSync(file, zip(entriesOf(pack)));
  console.log("wrote", file);
}
