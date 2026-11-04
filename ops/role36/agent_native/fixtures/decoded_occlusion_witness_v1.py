#!/usr/bin/env python3
"""objekts 36.5 / FN36 - encoded RGB occlusion negative control.

Pure standard-library + FFmpeg/ffprobe. Reproducible synthetic geometry, no
client footage and no claim about automatic semantic matte/depth estimation.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

W, H, N, FPS, BAD_FRAME = 128, 72, 40, 25, 22
BG = (22, 25, 32)
BOTTLE = (34, 106, 195)
HAND = (239, 153, 95)
LABEL = (246, 246, 241)
ROI = (55, 33, 79, 47)  # x0,y0,x1,y1 (exclusive)
WITNESS = (65, 39)
LABEL_ANCHOR = (64, 20)
OUTSIDE_HAND_ANCHOR = (30, 39)
FRAME_BYTES = W * H * 3


def draw_rect(frame: bytearray, rect: tuple[int, int, int, int], color: tuple[int, int, int]) -> None:
    x0, y0, x1, y1 = rect
    assert 0 <= x0 < x1 <= W and 0 <= y0 < y1 <= H
    line = bytes(color) * (x1 - x0)
    for y in range(y0, y1):
        i = (y * W + x0) * 3
        frame[i:i + len(line)] = line


def masks(n: int) -> tuple[tuple[int, int, int, int], tuple[int, int, int, int]]:
    bottle_rect = (55, 8, 79, 67)
    hand_tip = min(105, 30 + n * 4)
    return bottle_rect, (15, 33, hand_tip, 47)


def render(n: int, variant: str) -> bytes:
    assert 0 <= n < N
    assert variant in ('correct', 'wrong_occlusion', 'label_tamper')
    frame = bytearray(bytes(BG) * W * H)
    bottle_rect, hand_rect = masks(n)
    # The artwork, bottle mask, hand mask, label, and scene coordinates are fixed.
    # A single draw-order reversal at n22 is the only authorized experimental delta.
    if variant == 'wrong_occlusion' and n == BAD_FRAME:
        draw_rect(frame, hand_rect, HAND)
        draw_rect(frame, bottle_rect, BOTTLE)
    else:
        draw_rect(frame, bottle_rect, BOTTLE)
        draw_rect(frame, hand_rect, HAND)
    draw_rect(frame, (60, 15, 74, 26), LABEL)
    if variant == 'label_tamper' and n == BAD_FRAME:
        draw_rect(frame, (60, 15, 74, 26), (30, 210, 35))
    return bytes(frame)


def run(argv: list[str], *, input_bytes: bytes | None = None) -> bytes:
    result = subprocess.run(argv, input=input_bytes, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
    if result.returncode != 0:
        raise RuntimeError(f"{' '.join(argv[:5])}: {result.stderr.decode(errors='replace')[-1000:]}")
    return result.stdout


def encode(output: Path, variant: str) -> None:
    input_bytes = b''.join(render(n, variant) for n in range(N))
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
         '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s:v', f'{W}x{H}', '-r', str(FPS),
         '-i', 'pipe:0', '-an', '-c:v', 'ffv1', '-level', '3',
         '-pix_fmt', 'gbrp', str(output)], input_bytes=input_bytes)


def decode(path: Path) -> bytes:
    if not path.is_file():
        raise FileNotFoundError(path)
    data = run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-nostdin',
                '-i', str(path), '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1'])
    if len(data) != N * FRAME_BYTES:
        raise AssertionError(f'decoded length {len(data)} != {N * FRAME_BYTES}')
    return data


def rgb(data: bytes, frame_index: int, xy: tuple[int, int]) -> tuple[int, int, int]:
    x, y = xy
    k = frame_index * FRAME_BYTES + (y * W + x) * 3
    return tuple(data[k:k + 3])


def diff_coordinates(a: bytes, b: bytes, n: int) -> list[tuple[int, int]]:
    start = n * FRAME_BYTES
    return [(i % W, i // W) for i in range(W * H)
            if a[start+i*3:start+i*3+3] != b[start+i*3:start+i*3+3]]


def test(output_dir: Path, keep_media: bool) -> dict:
    for executable in ('ffmpeg', 'ffprobe'):
        if not shutil.which(executable):
            raise RuntimeError(f'MISSING_DEPENDENCY {executable}')
    output_dir.mkdir(parents=True, exist_ok=True)
    paths = {variant: output_dir / f'FN36_{variant}_40frames_25fps.mkv'
             for variant in ('correct', 'wrong_occlusion', 'label_tamper')}
    decoded = {}
    for variant, path in paths.items():
        encode(path, variant)
        decoded[variant] = decode(path)
    good, bad, tamper = (decoded[k] for k in ('correct', 'wrong_occlusion', 'label_tamper'))
    results = {}
    def check(name: str, condition: bool) -> None:
        results[name] = bool(condition)
        if not condition:
            raise AssertionError(name)

    check('40 decoded RGB frames', all(len(x) == 40 * FRAME_BYTES for x in decoded.values()))
    check('decoded baseline equals generated raw exactly', good == b''.join(render(n, 'correct') for n in range(N)))
    check('decoded error equals generated raw exactly', bad == b''.join(render(n, 'wrong_occlusion') for n in range(N)))
    check('correct visible front at contact', rgb(good, BAD_FRAME, WITNESS) == HAND)
    check('wrong visible front at contact', rgb(bad, BAD_FRAME, WITNESS) == BOTTLE)
    check('same label pixels at fixed anchor', rgb(good, BAD_FRAME, LABEL_ANCHOR) == rgb(bad, BAD_FRAME, LABEL_ANCHOR) == LABEL)
    check('same hand pixels outside overlap', rgb(good, BAD_FRAME, OUTSIDE_HAND_ANCHOR) == rgb(bad, BAD_FRAME, OUTSIDE_HAND_ANCHOR) == HAND)
    differing_frames = [n for n in range(N) if good[n*FRAME_BYTES:(n+1)*FRAME_BYTES] != bad[n*FRAME_BYTES:(n+1)*FRAME_BYTES]]
    check('exactly one defective frame', differing_frames == [BAD_FRAME])
    coords = diff_coordinates(good, bad, BAD_FRAME)
    check('changed pixels are exclusively within known overlap', bool(coords) and all(ROI[0] <= x < ROI[2] and ROI[1] <= y < ROI[3] for x, y in coords))
    check('label mutation independently rejected', rgb(tamper, BAD_FRAME, LABEL_ANCHOR) != LABEL)
    check('label mutation is not an occlusion-only error', any(not (ROI[0] <= x < ROI[2] and ROI[1] <= y < ROI[3]) for x, y in diff_coordinates(good, tamper, BAD_FRAME)))
    check('adjacent decoded frames 21 and 23 are identical', all(good[n*FRAME_BYTES:(n+1)*FRAME_BYTES] == bad[n*FRAME_BYTES:(n+1)*FRAME_BYTES] for n in (BAD_FRAME-1, BAD_FRAME+1)))
    meta = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_frames',
                          '-show_entries', 'stream=width,height,avg_frame_rate,nb_read_frames',
                          '-of', 'json', str(paths['wrong_occlusion'])]))
    stream = meta['streams'][0]
    check('ffprobe 128x72 25fps 40 frame stream',
          (stream.get('width'),stream.get('height'),stream.get('avg_frame_rate'),stream.get('nb_read_frames')) == (W,H,'25/1',str(N)))
    summary = {
        'role': '36.5', 'experiment': 'FN36-encoded-occlusion-witness-v1',
        'test_count': len(results), 'passed': sum(results.values()),
        'scope': 'synthetic FFV1 decoded RGB only; no model-generated visual or semantic matte validated',
        'frame_count': N, 'fps': '25/1', 'bad_frame_index': BAD_FRAME,
        'changed_pixels': len(coords), 'changed_frames': differing_frames,
        'contact_rgb_expected': HAND, 'contact_rgb_error': BOTTLE,
        'stable_label_anchor_rgb': LABEL, 'evidence': 'decoded pixel witness + outside-overlap invariant',
        'independently_untested': ['real optical flow','generative model','arbitrary occlusion geometries','human acceptance','client rights'],
        'media': {k:str(v) for k,v in paths.items()} if keep_media else 'temporary media cleaned',
        'checks': results,
    }
    if keep_media:
        (output_dir / 'FN36_test_receipt.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
    return summary


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, help='retain synthetic FFV1 videos and JSON receipt in directory')
    args = parser.parse_args()
    if args.out:
        report = test(args.out, keep_media=True)
    else:
        with tempfile.TemporaryDirectory(prefix='objekts_fn36_') as tmp:
            report = test(Path(tmp), keep_media=False)
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
