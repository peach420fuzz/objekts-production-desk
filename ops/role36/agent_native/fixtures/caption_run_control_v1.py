#!/usr/bin/env python3
"""Own finite caption-presence control, not OCR or a legibility benchmark.

Create two RGB clips, encode FFV1, independently decode their pixels, run one
declared colour-count detector, and retain every frame and every proposed run.
Only Python's standard library plus existing ffmpeg/ffprobe executables.
"""
import argparse
import csv
from datetime import datetime, timezone
from fractions import Fraction
import hashlib
import json
from pathlib import Path
import shutil
import struct
import subprocess
import sys
import zlib

W, H, FPS, N = 320, 180, 10, 100
BACKGROUND = (28, 42, 55)
FOREGROUND = (255, 255, 255)
BAND = (0, 120, W, H)  # left, top, right-exclusive, bottom-exclusive
FADE_SECONDS = Fraction(1, 1)
MAX_COUNT = 30
GLYPHS = {
    "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def json_file(path, data):
    path.write_text(json.dumps(data, indent=2, allow_nan=False) + "\n")


def run(command, log, input_bytes=None):
    p = subprocess.run(command, input=input_bytes, capture_output=True, check=False)
    log.append({"command": command, "returncode": p.returncode,
                "stderr": p.stderr.decode("utf-8", errors="replace"),
                "stdout_bytes": len(p.stdout), "stdout_sha256": sha(p.stdout)})
    if p.returncode:
        raise RuntimeError(f"command failed ({p.returncode}): {command!r}: {p.stderr[:2000]!r}")
    return p.stdout


def caption_mask():
    points = set()
    for letter, character in enumerate("CAPTION"):
        for row, line in enumerate(GLYPHS[character]):
            for col, value in enumerate(line):
                if value == "1":
                    for dy in range(3):
                        for dx in range(3):
                            points.add((97 + letter * 18 + col * 3 + dx, 135 + row * 3 + dy))
    return sorted(points)


def alpha_at(index, case):
    if 10 <= index <= 19:
        return Fraction(index - 9, 10)
    if 20 <= index <= 29:
        return Fraction(1, 1)
    if 30 <= index <= 39:
        return Fraction(39 - index, 10)
    if case == "low_opacity_hold" and 50 <= index <= 89:
        return Fraction(1, 2)
    return Fraction(0, 1)


def frame_at(index, case, mask):
    # Explicit encoded-RGB arithmetic, nearest integer with ties upwards.
    # This is not a physically linear-light compositor.
    alpha = alpha_at(index, case)
    rgb = tuple((Fraction(c) + alpha * (f - c) + Fraction(1, 2)).numerator //
                (Fraction(c) + alpha * (f - c) + Fraction(1, 2)).denominator
                for c, f in zip(BACKGROUND, FOREGROUND))
    frame = bytearray(bytes(BACKGROUND) * (W * H))
    for x, y in mask:
        offset = (y * W + x) * 3
        frame[offset:offset + 3] = bytes(rgb)
    return bytes(frame), rgb


def threshold_count(frame):
    left, top, right, bottom = BAND
    return sum(frame[(y * W + x) * 3] > 225 and
               frame[(y * W + x) * 3 + 1] > 210
               for y in range(top, bottom) for x in range(left, right))


def save_png(path, rgb):
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    rows = b"".join(b"\0" + rgb[y * W * 3:(y + 1) * W * 3] for y in range(H))
    path.write_bytes(b"\x89PNG\r\n\x1a\n" +
                     chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)) +
                     chunk(b"IDAT", zlib.compress(rows)) + chunk(b"IEND", b""))


def find_runs(rows):
    output, start = [], None
    for i in range(len(rows) + 1):
        clean = i < len(rows) and rows[i]["threshold_clean"]
        if clean and start is None:
            start = i
        if not clean and start is not None:
            end, count = i - 1, i - start
            # Lower middle for an even number of sampled frames, explicitly retained.
            middle = (start + end) // 2
            duration = Fraction(count, FPS)
            output.append({
                "start_frame": start, "end_frame_inclusive": end,
                "start_pts_seconds": str(Fraction(start, FPS)),
                "end_exclusive_seconds": str(Fraction(i, FPS)),
                "frame_count": count, "duration_seconds": str(duration),
                "midpoint_frame": middle,
                "midpoint_source_alpha": rows[middle]["source_alpha"],
                "midpoint_source_caption_present": rows[middle]["source_caption_present"],
                "midpoint_changed_pixels_vs_blank": rows[middle]["decoded_changed_pixels_vs_blank"],
                "midpoint_threshold_count": rows[middle]["threshold_count"],
                "passes_two_fade_duration_filter": duration >= 2 * FADE_SECONDS,
                "disposition": "SOURCE_CAPTION_PRESENT" if rows[middle]["source_caption_present"] else "SOURCE_CAPTION_ABSENT",
                "human_full_resolution_review": "NOT_PERFORMED_BY_SCRIPT",
                "legibility": "NOT_MEASURED",
            })
            start = None
    return output


def experiment(case, output, ffmpeg, ffprobe, log):
    output.mkdir()
    mask = caption_mask()
    source_frames, colours = zip(*(frame_at(i, case, mask) for i in range(N)))
    source_bytes = b"".join(source_frames)
    video = output / "control.mkv"
    encode = [ffmpeg, "-hide_banner", "-loglevel", "error", "-f", "rawvideo",
              "-pixel_format", "rgb24", "-video_size", f"{W}x{H}", "-framerate", str(FPS),
              "-i", "pipe:0", "-an", "-c:v", "ffv1", "-level", "3", "-pix_fmt", "bgr0",
              "-threads", "1", "-flags", "+bitexact", "-fflags", "+bitexact", "-n", str(video)]
    run(encode, log, source_bytes)
    probe_command = [ffprobe, "-v", "error", "-select_streams", "v:0", "-show_streams", "-show_frames",
                     "-show_entries", "stream=codec_name,width,height,pix_fmt,r_frame_rate,time_base:frame=pts,best_effort_timestamp_time",
                     "-of", "json", str(video)]
    probe = json.loads(run(probe_command, log))
    json_file(output / "ffprobe.json", probe)
    observed = probe["frames"]
    assert len(observed) == N
    assert [Fraction(row["best_effort_timestamp_time"]) for row in observed] == [Fraction(i, FPS) for i in range(N)]
    decoded = run([ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(video), "-map", "0:v:0",
                   "-fps_mode", "passthrough", "-f", "rawvideo", "-pix_fmt", "rgb24", "pipe:1"], log)
    assert decoded == source_bytes, "Encoded/decoded pixels differ; detector result cannot inherit source truth"
    rows = []
    frame_size = W * H * 3
    blank = bytes(BACKGROUND) * (W * H)
    for i in range(N):
        frame = decoded[i * frame_size:(i + 1) * frame_size]
        alpha = alpha_at(i, case)
        count = threshold_count(frame)
        changed = sum(frame[j:j + 3] != blank[j:j + 3] for j in range(0, frame_size, 3))
        rows.append({"frame": i, "pts_seconds": str(Fraction(observed[i]["best_effort_timestamp_time"])),
                     "source_alpha": str(alpha), "source_caption_present": bool(alpha),
                     "source_caption_rgb": list(colours[i]), "source_mask_pixels": len(mask),
                     "decoded_changed_pixels_vs_blank": changed,
                     "threshold_count": count, "threshold_clean": count <= MAX_COUNT,
                     "source_rgb_sha256": sha(source_frames[i]), "decoded_rgb_sha256": sha(frame)})
    runs = find_runs(rows)
    for item in runs:
        i = item["midpoint_frame"]
        name = f"candidate_{i:03d}.png"
        save_png(output / name, decoded[i * frame_size:(i + 1) * frame_size])
        item["candidate_file"] = name
        item["candidate_png_sha256"] = sha((output / name).read_bytes())
    json_file(output / "frames.json", rows)
    with (output / "frames.csv").open("w", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader(); writer.writerows(rows)
    json_file(output / "runs.json", runs)
    assert any(item["passes_two_fade_duration_filter"] for item in runs)
    if case == "low_opacity_hold":
        assert any(item["passes_two_fade_duration_filter"] and item["midpoint_source_caption_present"] for item in runs)
    return {"case": case, "frames": N, "video_sha256": sha(video.read_bytes()), "video_bytes": video.stat().st_size,
            "source_decoded_rgb_equal": True, "observed_pts_match": True, "caption_mask_pixels": len(mask),
            "threshold_clean_frames": sum(row["threshold_clean"] for row in rows),
            "proposed_runs": runs, "per_frame_source_truth_rows": N}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True, help="New directory; existing output is never overwritten")
    args = parser.parse_args()
    ffmpeg, ffprobe = shutil.which("ffmpeg"), shutil.which("ffprobe")
    if not ffmpeg or not ffprobe:
        parser.error("Existing ffmpeg and ffprobe are required; this script installs nothing")
    args.output.mkdir(parents=True, exist_ok=False)
    log = []
    receipt = {"started_at": datetime.now(timezone.utc).isoformat(), "python_version": sys.version,
               "script_sha256": sha(Path(__file__).read_bytes()), "detector": {"red_gt": 225, "green_gt": 210,
               "max_count_for_clean": MAX_COUNT, "band_xyxy_exclusive": BAND, "sampling_fps": FPS},
               "fixture": {"size": [W, H], "frames_per_case": N, "fade_seconds": str(FADE_SECONDS),
               "compositing": "encoded RGB, round nearest with ties upwards", "caption": "CAPTION"},
               "limits": ["Own synthetic pixels only, not the author's video or 52 candidates", "No OCR or legibility metric",
                          "Source alpha is independent ground truth, not recoverable from arbitrary flattened footage",
                          "Long-run failure adds a caption with a 0.5 opacity hold; it does not claim a defect in a measured fade-only dataset"]}
    try:
        receipt["ffmpeg_version"] = run([ffmpeg, "-version"], log).decode().splitlines()[0]
        receipt["ffprobe_version"] = run([ffprobe, "-version"], log).decode().splitlines()[0]
        receipt["cases"] = [experiment(case, args.output / case, ffmpeg, ffprobe, log)
                            for case in ("bounded_fade", "low_opacity_hold")]
        receipt["outcome"] = "COMPLETED"
        returncode = 0
    except Exception as error:
        receipt["outcome"] = "FAILED"
        receipt["error"] = repr(error)
        returncode = 1
    receipt["finished_at"] = datetime.now(timezone.utc).isoformat()
    receipt["commands"] = log
    json_file(args.output / "EXECUTION.json", receipt)
    print(json.dumps({"outcome": receipt["outcome"], "cases": receipt.get("cases"), "error": receipt.get("error")}, indent=2))
    return returncode


if __name__ == "__main__":
    raise SystemExit(main())
