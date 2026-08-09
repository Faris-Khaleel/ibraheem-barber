import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [inputDirectory, outputFile] = process.argv.slice(2);

if (!inputDirectory || !outputFile) {
  throw new Error("Usage: node scripts/pack-ritual-frames.mjs <frames-dir> <output.pack>");
}

const frameNames = (await readdir(inputDirectory))
  .filter((name) => name.endsWith(".webp"))
  .sort();

if (!frameNames.length) throw new Error(`No WebP frames found in ${inputDirectory}`);

const frames = await Promise.all(
  frameNames.map((name) => readFile(path.join(inputDirectory, name))),
);
const header = Buffer.alloc(8 + frames.length * 4);
header.write("RIT1", 0, "ascii");
header.writeUInt32LE(frames.length, 4);
frames.forEach((frame, index) => header.writeUInt32LE(frame.length, 8 + index * 4));

await writeFile(outputFile, Buffer.concat([header, ...frames]));

const payloadBytes = frames.reduce((total, frame) => total + frame.length, 0);
console.log(JSON.stringify({
  outputFile,
  frames: frames.length,
  payloadBytes,
  packedBytes: header.length + payloadBytes,
}));
