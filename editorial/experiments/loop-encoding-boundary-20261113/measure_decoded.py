#!/usr/bin/env python3
"""Measure saved PPM/RGB files. Never encodes, decodes, plays or fetches media.

The summarize function preserves the historical comparison arithmetic. This
script records new reproduction observations, not a required historical score.
"""
import argparse
import hashlib
import json
from pathlib import Path
import statistics

W, H, N = 640, 360, 96
STRIDE = W * H * 3

def digest(b):
    return hashlib.sha256(b).hexdigest()

def summarize(images):
    lo,hi=34*W*3,327*W*3
    def mae(a,b):
        return sum(abs(x-y) for x,y in zip(a[lo:hi],b[lo:hi]))/(hi-lo)
    adjacent=[mae(images[i],images[i+1]) for i in range(N-1)]
    wrap=mae(images[-1],images[0])
    return {"wrap95_to0_mae":wrap,"interior_min":min(adjacent),
            "interior_median":statistics.median(adjacent),"interior_max":max(adjacent),
            "wrap_over_interior_median":wrap/statistics.median(adjacent),
            "wrap_over_interior_max":wrap/max(adjacent),
            "unique_frame_hashes":len(set(digest(x) for x in images))}


def read_ppm(path):
    raw = path.read_bytes()
    header = f'P6\n{W} {H}\n255\n'.encode()
    if not raw.startswith(header) or len(raw) != len(header) + STRIDE:
        raise ValueError(f'Unexpected PPM header/length: {path.name}')
    return raw[len(header):]


def read_rgb(path):
    raw = path.read_bytes()
    if len(raw) != N * STRIDE:
        raise ValueError(f'{path.name}: expected {N * STRIDE} RGB bytes, got {len(raw)}')
    return [raw[n * STRIDE:(n + 1) * STRIDE] for n in range(N)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--work', type=Path, required=True)
    args = parser.parse_args()
    output = args.work / 'REPRODUCTION_RESULT.json'
    if output.exists():
        raise SystemExit('Refusing to replace REPRODUCTION_RESULT.json')
    source = [read_ppm(args.work / 'frames' / f'frame_{n:03d}.ppm') for n in range(N)]
    endpoint = read_ppm(args.work / 'endpoint_n096.ppm')
    gop96 = read_rgb(args.work / 'gop96.rgb')
    gop1 = read_rgb(args.work / 'gop1.rgb')
    result = {'scope': 'New local reproduction; original synthetic fixture only',
              'width': W, 'height': H, 'frames_per_representation': N,
              'roi_half_open': [0, 34, 640, 327],
              'unit': '8-bit RGB code-value mean absolute difference',
              'ordinary_transitions': 95, 'boundary_transition': [95, 0],
              'source_rgb': summarize(source),
              'gop96_rgb': summarize(gop96),
              'gop1_rgb': summarize(gop1),
              'source_endpoint96_equals_source0': endpoint == source[0],
              'script_sha256': digest(Path(__file__).read_bytes()),
              'limits': ['Headerless RGB has no PTS; inspect saved probes separately',
                         'No target-player restart, continuous playback or perceptual acceptance test',
                         'No historical metric is required to pass; retain build/version evidence']}
    with output.open('x', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
        f.write('\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
