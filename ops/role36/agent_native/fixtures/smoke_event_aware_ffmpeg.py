#!/usr/bin/env python3
"""objekts role36.5 | real decoded-frame sample-selection smoke test, 2026-11-04.
Uses ONLY Python stdlib + FFmpeg/FFprobe + Node.js. Creates a synthetic color clip
with an intentional one-frame anomaly at n=118. Nothing here is model/production QC.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
JS = ROOT / "event_aware_frame_qc_v1.js"
SIZE = (160, 90)
FRAMES = 250
BUDGET = 12
DEFECT = 118


def run(cmd, *, stdout=subprocess.PIPE):
    p = subprocess.run(cmd, stdout=stdout, stderr=subprocess.PIPE, check=False)
    if p.returncode:
        raise RuntimeError(f"{cmd[0]} failed ({p.returncode}): {p.stderr.decode(errors='replace')[-2000:]}")
    return p.stdout


def extract_pixels(mp4, selected):
    expr = "+".join(f"eq(n,{i})" for i in selected)
    raw = run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(mp4),
        "-vf", f"select='{expr}'", "-fps_mode", "passthrough",
        "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1"
    ])
    frame_bytes = SIZE[0] * SIZE[1] * 3
    assert len(raw) == frame_bytes * len(selected), (len(raw), frame_bytes, len(selected))
    pixel = (45 * SIZE[0] + 80) * 3
    witnesses = []
    for sample_i, source_n in enumerate(selected):
        r, g, b = raw[sample_i*frame_bytes + pixel: sample_i*frame_bytes + pixel + 3]
        if r > 180 and r > 2*g and r > 2*b:
            witnesses.append({"source_frame": source_n, "rgb": [r, g, b]})
    return witnesses


def main():
    for tool in ("ffmpeg", "ffprobe", "node"):
        if not shutil.which(tool):
            raise SystemExit(f"Missing required external tool: {tool}")
    assert JS.is_file(), f"Missing {JS}"
    with tempfile.TemporaryDirectory(prefix="objekts-fn34-") as td:
        mp4 = Path(td) / "test_250f.mp4"
        run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-f", "lavfi", "-i", "color=c=gray:s=160x90:r=25:d=10",
            "-vf", "drawbox=x=45:y=20:w=70:h=50:color=red:t=fill:enable='eq(n,118)'",
            "-frames:v", "250", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "15",
            str(mp4)
        ])
        probe = json.loads(run([
            "ffprobe", "-v", "error", "-select_streams", "v:0",
            "-show_entries", "stream=nb_frames,avg_frame_rate", "-of", "json", str(mp4)
        ]))
        stream = probe["streams"][0]
        assert stream["nb_frames"] == "250" and stream["avg_frame_rate"] == "25/1", stream
        plan = json.loads(run(["node", str(JS), "--plan", "250", "12", "117", "119"]))
        event = [s["index"] for s in plan["samples"]]
        uniform = [round(i*(FRAMES-1)/(BUDGET-1)) for i in range(BUDGET)]
        # JS Math.round and Python round differ for exactly .5; no .5 positions occur for these inputs.
        assert len(event) == len(uniform) == BUDGET
        assert DEFECT not in uniform and DEFECT in event
        uniform_w = extract_pixels(mp4, uniform)
        event_w = extract_pixels(mp4, event)
        assert uniform_w == [], uniform_w
        assert len(event_w) == 1 and event_w[0]["source_frame"] == DEFECT, event_w
        report = {
            "fixture": "self-generated synthetic video, not diffusion output or client media",
            "tools": {"ffmpeg": "run", "ffprobe": "run", "node": "run"},
            "decoded_video": {"frames": FRAMES, "fps": "25/1", "size": "160x90"},
            "event_window": [117, 119],
            "uniform_samples": uniform,
            "event_aware_samples": event,
            "uniform_red_witnesses": uniform_w,
            "event_red_witnesses": event_w,
            "unsampled_frames_per_plan": FRAMES - BUDGET,
            "claim_scope": "sample selection detects deliberately inserted pixel anomaly at one known event; neither sampler certifies unsampled frames"
        }
        print(json.dumps(report, indent=2))
        print("SMOKE PASS: real FFmpeg-decoded event-aware sample caught one-frame red anomaly; uniform did not")


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, RuntimeError, KeyError, ValueError) as ex:
        print(f"SMOKE FAIL: {ex}", file=sys.stderr)
        raise SystemExit(1)

