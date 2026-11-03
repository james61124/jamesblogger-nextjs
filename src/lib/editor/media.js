// 拖進編輯器的照片和影片：轉檔、壓縮、命名，再上傳到 R2。
// 設定跟 scripts/convert_media.py 一致：照片最長邊 3000、WebP 品質 90；影片 1080p、30fps、CRF 25、去掉聲音。
//
// 檔名規則：images/<分類>/<文章代號>/<拍攝日期>-<時間>-<內容短碼>.<副檔名>
//   - 拍攝時間從 EXIF 讀，沒有就用檔案的修改時間
//   - 短碼是轉檔後內容的 sha1 前 4 碼，同一張照片重複拖進來不會重複上傳

import { execFile } from "child_process";
import { createHash } from "crypto";
import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { promisify } from "util";
import exifr from "exifr";
import sharp from "sharp";
import { exists, publicUrl, put } from "@/lib/editor/r2";

const run = promisify(execFile);

const IMAGE_MAX_EDGE = 3000;
const IMAGE_QUALITY = 90;
const VIDEO_MAX_LONG = 1920;
const VIDEO_MAX_SHORT = 1080;
const VIDEO_CRF = 25;
const VIDEO_MAX_FPS = 30;

const HEIC = /\.(heic|heif)$/i;
const VIDEO = /\.(mov|mp4|m4v|avi|mkv|webm|3gp)$/i;

const pad = (n) => String(n).padStart(2, "0");
const stamp = (date) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;

async function takenAt(buffer, fallback) {
  try {
    const exif = await exifr.parse(buffer, ["DateTimeOriginal", "CreateDate"]);
    const date = exif?.DateTimeOriginal || exif?.CreateDate;
    if (date instanceof Date && !Number.isNaN(date.getTime())) return date;
  } catch {}
  return fallback;
}

async function withTempDir(fn) {
  const dir = await mkdtemp(path.join(os.tmpdir(), "editor-media-"));
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

// sharp 的預編譯版本讀不了 HEIC，先用 macOS 內建的 sips 轉成 JPEG
async function heicToJpeg(buffer) {
  return withTempDir(async (dir) => {
    const input = path.join(dir, "in.heic");
    const output = path.join(dir, "out.jpg");
    await writeFile(input, buffer);
    await run("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "100", input, "--out", output]);
    return readFile(output);
  });
}

async function convertImage(buffer, name) {
  const source = HEIC.test(name) ? await heicToJpeg(buffer) : buffer;
  const { data, info } = await sharp(source)
    .rotate() // 依 EXIF 轉正
    .resize({ width: IMAGE_MAX_EDGE, height: IMAGE_MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: IMAGE_QUALITY, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, ext: "webp", contentType: "image/webp", kind: "image" };
}

async function convertVideo(buffer, name) {
  return withTempDir(async (dir) => {
    const input = path.join(dir, `in${path.extname(name)}`);
    const output = path.join(dir, "out.mp4");
    await writeFile(input, buffer);
    // 橫的寬度最多 1920、直的寬度最多 1080，高度照比例（ffmpeg 會先依旋轉資訊轉正再縮放）
    const scale = `scale=w='if(gte(iw,ih),min(${VIDEO_MAX_LONG},iw),min(${VIDEO_MAX_SHORT},iw))':h=-2`;
    await run(
      "ffmpeg",
      ["-y", "-i", input, "-vf", scale, "-fpsmax", String(VIDEO_MAX_FPS), "-c:v", "libx264", "-crf", String(VIDEO_CRF),
        "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", output],
      { maxBuffer: 1024 * 1024 * 64 }
    );
    const { stdout } = await run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", output]);
    const [width, height] = stdout.trim().split(",").map(Number);
    return { data: await readFile(output), width, height, ext: "mp4", contentType: "video/mp4", kind: "video" };
  });
}

export async function uploadMedia({ buffer, name, lastModified, category, slug }) {
  const converted = VIDEO.test(name) ? await convertVideo(buffer, name) : await convertImage(buffer, name);
  const when = await takenAt(buffer, new Date(lastModified || Date.now()));
  const hash = createHash("sha1").update(converted.data).digest("hex").slice(0, 4);
  const key = `images/${category}/${slug}/${stamp(when)}-${hash}.${converted.ext}`.toLowerCase();

  const reused = await exists(key);
  if (!reused) await put(key, converted.data, converted.contentType);

  return { url: publicUrl(key), key, width: converted.width, height: converted.height, kind: converted.kind, reused, size: converted.data.length };
}
