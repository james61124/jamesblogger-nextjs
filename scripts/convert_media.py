#!/usr/bin/env python3
"""Batch-convert travel photos to WebP and videos to web-friendly MP4.

Usage:
    python3 convert_media.py INPUT_DIR OUTPUT_DIR [--keep-audio PATH ...] [--lossless] [--force]
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".tif", ".tiff", ".bmp"}
VIDEO_EXTS = {".mov", ".mp4", ".m4v", ".avi", ".mkv", ".webm", ".3gp"}

IMAGE_MAX_EDGE = 3000
IMAGE_QUALITY = 90
VIDEO_MAX_LONG = 1920
VIDEO_MAX_SHORT = 1080
VIDEO_CRF = 25
VIDEO_MAX_FPS = 30


def human_size(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.1f} {unit}" if unit != "B" else f"{n} B"
        n /= 1024
    return f"{n:.1f} GB"


def report(src: Path, dst: Path, before: tuple[int, int], after: tuple[int, int]) -> None:
    src_size, dst_size = src.stat().st_size, dst.stat().st_size
    ratio = (1 - dst_size / src_size) * 100 if src_size else 0
    change = f"{ratio:.1f}% smaller" if ratio >= 0 else f"{-ratio:.1f}% larger"
    print(
        f"  {before[0]}x{before[1]} -> {after[0]}x{after[1]} | "
        f"{human_size(src_size)} -> {human_size(dst_size)} ({change})"
    )


# ---------- Images ----------

def convert_image(src: Path, dst: Path, lossless: bool = False) -> None:
    with Image.open(src) as im:
        before = im.size
        im = ImageOps.exif_transpose(im)  # apply EXIF orientation
        if not lossless:
            im.thumbnail((IMAGE_MAX_EDGE, IMAGE_MAX_EDGE), Image.Resampling.LANCZOS)  # never upscales
        has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        im = im.convert("RGBA" if has_alpha else "RGB")
        icc = im.info.get("icc_profile")
        tmp = dst.with_name(dst.name + ".part")
        # No exif/xmp passed -> GPS and other metadata are dropped; ICC kept for correct colors.
        if lossless:
            # Original resolution, lossless encoding (quality=100 -> max compression effort, no pixel loss).
            im.save(tmp, "WEBP", lossless=True, quality=100, method=6, icc_profile=icc)
        else:
            im.save(tmp, "WEBP", quality=IMAGE_QUALITY, method=6, icc_profile=icc)
        after = im.size
    tmp.replace(dst)
    report(src, dst, before, after)


# ---------- Videos ----------

def probe_video(path: Path) -> tuple[int, int, bool]:
    """Return (display_width, display_height, has_audio)."""
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-of", "json", str(path)],
        capture_output=True, text=True, check=True,
    ).stdout
    streams = json.loads(out).get("streams", [])
    video = next((s for s in streams if s.get("codec_type") == "video"), None)
    if not video:
        raise ValueError("no video stream found")
    w, h = int(video["width"]), int(video["height"])
    rotation = int(float(video.get("tags", {}).get("rotate", 0)))
    for sd in video.get("side_data_list", []):
        if "rotation" in sd:
            rotation = int(float(sd["rotation"]))
    if abs(rotation) % 180 == 90:
        w, h = h, w
    has_audio = any(s.get("codec_type") == "audio" for s in streams)
    return w, h, has_audio


def target_size(w: int, h: int) -> tuple[int, int]:
    box_w, box_h = (VIDEO_MAX_LONG, VIDEO_MAX_SHORT) if w >= h else (VIDEO_MAX_SHORT, VIDEO_MAX_LONG)
    scale = min(1.0, box_w / w, box_h / h)
    # H.264 + yuv420p needs even dimensions
    return max(2, int(w * scale) // 2 * 2), max(2, int(h * scale) // 2 * 2)


def run_ffmpeg(cmd: list[str], tmp: Path) -> None:
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        tmp.unlink(missing_ok=True)
        raise RuntimeError(result.stderr.strip() or "ffmpeg failed")


def convert_video(src: Path, dst: Path, keep_audio: bool) -> None:
    w, h, has_audio = probe_video(src)
    tw, th = target_size(w, h)
    tmp = dst.with_name(dst.stem + ".part.mp4")
    cmd = [
        "ffmpeg", "-y", "-v", "error", "-i", str(src),
        "-map", "0:v:0",
        "-vf", f"scale={tw}:{th}",  # ffmpeg auto-rotates before filters
        "-fpsmax", str(VIDEO_MAX_FPS),
        "-c:v", "libx264", "-crf", str(VIDEO_CRF), "-preset", "medium",
        "-pix_fmt", "yuv420p", "-profile:v", "high",
        "-map_metadata", "-1", "-map_chapters", "-1",
        "-movflags", "+faststart",
    ]
    if keep_audio and has_audio:
        cmd += ["-map", "0:a:0", "-c:a", "aac", "-b:a", "160k"]
    else:
        cmd += ["-an"]
    cmd.append(str(tmp))
    run_ffmpeg(cmd, tmp)
    tmp.replace(dst)
    if keep_audio and not has_audio:
        print("  note: --keep-audio requested but source has no audio")
    report(src, dst, (w, h), (tw, th))


# ---------- Main ----------

def main() -> int:
    parser = argparse.ArgumentParser(description="Convert photos to WebP and videos to MP4 for the web.")
    parser.add_argument("input", type=Path, help="input folder")
    parser.add_argument("output", type=Path, help="output folder")
    parser.add_argument("--keep-audio", nargs="+", default=[], metavar="PATH",
                        help="videos (relative to input folder) whose audio is kept")
    parser.add_argument("--lossless", action="store_true",
                        help="images only: keep original resolution and encode WebP losslessly")
    parser.add_argument("--force", action="store_true", help="re-convert and overwrite existing outputs")
    args = parser.parse_args()

    src_root, dst_root = args.input.resolve(), args.output.resolve()
    if not src_root.is_dir():
        print(f"Error: input folder not found: {src_root}", file=sys.stderr)
        return 1
    if dst_root == src_root or src_root in dst_root.parents:
        print("Error: output folder must not be inside the input folder", file=sys.stderr)
        return 1

    keep_audio = {Path(p).as_posix() for p in args.keep_audio}

    # Collect jobs and detect output name collisions (e.g. a.jpg + a.png -> a.webp).
    jobs: dict[Path, list[Path]] = {}
    unsupported: list[Path] = []
    for src in sorted(p for p in src_root.rglob("*") if p.is_file()):
        if src.name.startswith("."):
            continue
        ext = src.suffix.lower()
        if ext in IMAGE_EXTS:
            new_ext = ".webp"
        elif ext in VIDEO_EXTS:
            new_ext = ".mp4"
        else:
            unsupported.append(src)
            continue
        dst = dst_root / src.relative_to(src_root).with_suffix(new_ext)
        jobs.setdefault(dst, []).append(src)

    for rel in sorted(keep_audio):
        if not (src_root / rel).is_file():
            print(f"Warning: --keep-audio file not found: {rel}")

    converted = skipped = failed = 0
    for src in unsupported:
        print(f"[ERROR] unsupported format: {src.relative_to(src_root)}")
        failed += 1

    for dst, sources in jobs.items():
        if len(sources) > 1:
            names = ", ".join(str(s.relative_to(src_root)) for s in sources)
            print(f"[WARN] output name conflict -> {dst.relative_to(dst_root)} from: {names}; skipped")
            skipped += len(sources)
            continue

        src = sources[0]
        rel = src.relative_to(src_root)
        if dst.exists() and not args.force:
            print(f"[SKIP] {rel} (output exists)")
            skipped += 1
            continue

        print(f"[CONVERT] {rel} -> {dst.relative_to(dst_root)}")
        try:
            dst.parent.mkdir(parents=True, exist_ok=True)
            if dst.suffix == ".webp":
                convert_image(src, dst, lossless=args.lossless)
            else:
                convert_video(src, dst, keep_audio=rel.as_posix() in keep_audio)
            converted += 1
        except Exception as e:  # keep going on any per-file failure
            print(f"[ERROR] {rel}: {e}")
            failed += 1

    print(f"\nDone: {converted} converted, {skipped} skipped, {failed} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
