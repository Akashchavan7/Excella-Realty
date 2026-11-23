// Builds the homepage hero film from the source clips and stills in assets/hero (not in git).
//
//   npm run hero:build        (needs ffmpeg on PATH)
//
// Each stop of the film is two segments: the fly-in to a window ("in") and the walk through the
// room out into the sky ("room"). Where a fly-in was generated in two parts, the parts are joined
// on their shared frame.
//
// The generated clips are 1280x720. They are upscaled to 1080p with Lanczos and a light sharpen,
// which holds up better on large and high-density screens than letting the browser stretch 720p.
// They are encoded with a keyframe every 6 frames so the browser can seek them smoothly while the
// visitor scrolls, plus a centre-cropped version for portrait phones. Each segment also gets its
// opening still at full resolution (the 1672px image the clip was generated from), which the hero
// shows while the film is paused on that frame.
//
// Writes public/hero/* and src/content/hero-film.generated.ts.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const root = process.cwd();
const srcDir = path.join(root, 'assets', 'hero');
const outDir = path.join(root, 'public', 'hero');
const FPS = 24;
const SRC = { w: 1280, h: 720 }; // the generated clips
const OUT = { w: 1920, h: 1080 };
const MOBILE = { w: 960, h: 1080, x: 480, y: 0 }; // centre crop of the 1080p frame for portrait screens
const UPSCALE = `scale=${OUT.w}:${OUT.h}:flags=lanczos,unsharp=5:5:0.55:5:5:0`;

// `frames` keeps that many frames from the start; `to` keeps everything before that time (seconds).
// `still` is the image the segment's first clip was generated from.
const segments = [
  { id: 's1-in', kind: 'in', stop: 'excellaa-primarc', still: 's1-exterior.png', parts: [{ file: 's1-video-1.mp4' }] },
  { id: 's1-room', kind: 'room', stop: 'excellaa-primarc', still: 's1-room.png', parts: [{ file: 's1-video-2.mp4' }] },
  { id: 's2-in', kind: 'in', stop: 'excellaa-florence', still: 's2-exterior.png', parts: [{ file: 's2-video-1.mp4', to: 9.4 }] },
  { id: 's2-room', kind: 'room', stop: 'excellaa-florence', still: 's2-room.png', parts: [{ file: 's2-video-2.mp4' }] },
  // Part b was generated from part a's frame 91, so part a stops just before it.
  { id: 's3-in', kind: 'in', stop: 'excellaa-virtu', still: 's3-exterior.png', parts: [{ file: 's3-video-1a.mp4', frames: 91 }, { file: 's3-video-1b.mp4', to: 7.4 }] },
  { id: 's3-room', kind: 'room', stop: 'excellaa-virtu', still: 's3-room.png', parts: [{ file: 's3-video-2.mp4' }] },
  { id: 's4-in', kind: 'in', stop: 'excellaa-tremont', still: 's4-exterior.png', parts: [{ file: 's4-video-1a.mp4', frames: 191 }, { file: 's4-video-1b.mp4', to: 7.4 }] },
  { id: 's4-room', kind: 'room', stop: 'excellaa-tremont', still: 's4-room.png', parts: [{ file: 's4-video-2.mp4' }] },
];

function run(args, input) {
  const r = spawnSync('ffmpeg', ['-v', 'error', ...args], { input, maxBuffer: 2 ** 31 });
  if (r.status !== 0) throw new Error(`ffmpeg ${args.join(' ')}\n${r.stderr}`);
  return r.stdout;
}

function decode(part) {
  const frames = part.frames ?? (part.to ? Math.round(part.to * FPS) : undefined);
  const args = ['-i', path.join(srcDir, part.file), '-vf', `scale=${SRC.w}:${SRC.h}:flags=lanczos,fps=${FPS}`];
  if (frames) args.push('-frames:v', String(frames));
  return run([...args, '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-']);
}

function encode(raw, out, { crop, crf }) {
  const vf = [UPSCALE, ...(crop ? [`crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`] : [])].join(',');
  run(
    [
      '-y', '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', `${SRC.w}x${SRC.h}`, '-r', String(FPS), '-i', '-',
      '-vf', vf,
      '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      // Short, fixed GOP without B-frames: any frame is at most 5 decodes away, which keeps scrubbing smooth.
      '-g', '6', '-keyint_min', '6', '-sc_threshold', '0', '-bf', '0',
      '-color_range', 'tv', '-colorspace', 'smpte170m', '-color_primaries', 'bt709', '-color_trc', 'iec61966-2-1',
      '-movflags', '+faststart', '-an', out,
    ],
    raw,
  );
}

async function lastFrame(raw, out) {
  const frameSize = SRC.w * SRC.h * 1.5;
  const frame = raw.subarray(raw.length - frameSize);
  const png = run(['-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', `${SRC.w}x${SRC.h}`, '-i', '-', '-vf', UPSCALE, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], Buffer.from(frame));
  await sharp(png).webp({ quality: 82 }).toFile(out);
}

if (!fs.existsSync(srcDir)) {
  console.error(`[hero] ${path.relative(root, srcDir)} not found; the source clips are not in git.`);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) fs.rmSync(path.join(outDir, f));

const manifest = [];
const kb = (f) => Math.round(fs.statSync(f).size / 1024);
for (const seg of segments) {
  const raw = Buffer.concat(seg.parts.map(decode));
  const frames = raw.length / (SRC.w * SRC.h * 1.5);
  const file = (suffix, ext) => path.join(outDir, `${seg.id}${suffix}.${ext}`);
  encode(raw, file('', 'mp4'), { crf: 24 });
  encode(raw, file('-m', 'mp4'), { crop: MOBILE, crf: 26 });
  await sharp(path.join(srcDir, seg.still)).webp({ quality: 88 }).toFile(file('', 'webp'));
  await lastFrame(raw, file('-end', 'webp'));
  console.log(`[hero] ${seg.id}: ${frames} frames, ${kb(file('', 'mp4'))} KB / ${kb(file('-m', 'mp4'))} KB mobile, still ${kb(file('', 'webp'))} KB`);
  manifest.push({ id: seg.id, kind: seg.kind, stop: seg.stop, frames, duration: +(frames / FPS).toFixed(4) });
}

const ts = `// Generated by scripts/build-hero-film.mjs. Do not edit by hand.
export const heroFilmFps = ${FPS};

export const heroFilmSegments = ${JSON.stringify(manifest, null, 2)} as const;
`;
fs.writeFileSync(path.join(root, 'src', 'content', 'hero-film.generated.ts'), ts);
console.log(`[hero] wrote ${manifest.length} segments to public/hero and src/content/hero-film.generated.ts`);
