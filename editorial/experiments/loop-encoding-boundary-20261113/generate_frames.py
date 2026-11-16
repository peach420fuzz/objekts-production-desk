#!/usr/bin/env python3
"""Original procedural frame generator; local text-bundle reproduction only.

Pixel functions are copied without semantic change from the historical renderer.
This entry point makes no encoder/player/network call and refuses an existing
output directory. Packaging this script does not execute it.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import math
from pathlib import Path

W, H, FPS, N = 640, 360, 24, 96

FONT = {
    " ": [0,0,0,0,0,0,0], "/": [1,1,2,4,8,16,16],
    "-": [0,0,0,31,0,0,0], ":": [0,4,4,0,4,4,0],
    "0": [14,17,19,21,25,17,14], "1": [4,12,4,4,4,4,14],
    "2": [14,17,1,2,4,8,31], "3": [30,1,1,14,1,1,30],
    "4": [2,6,10,18,31,2,2], "5": [31,16,16,30,1,1,30],
    "6": [14,16,16,30,17,17,14], "7": [31,1,2,4,8,8,8],
    "8": [14,17,17,14,17,17,14], "9": [14,17,17,15,1,1,14],
    "A": [14,17,17,31,17,17,17], "B": [30,17,17,30,17,17,30],
    "C": [14,17,16,16,16,17,14], "D": [30,17,17,17,17,17,30],
    "E": [31,16,16,30,16,16,31], "F": [31,16,16,30,16,16,16],
    "G": [14,17,16,23,17,17,15], "H": [17,17,17,31,17,17,17],
    "I": [14,4,4,4,4,4,14], "J": [7,2,2,2,18,18,12],
    "K": [17,18,20,24,20,18,17], "L": [16,16,16,16,16,16,31],
    "M": [17,27,21,21,17,17,17], "N": [17,25,25,21,19,19,17],
    "O": [14,17,17,17,17,17,14], "P": [30,17,17,30,16,16,16],
    "Q": [14,17,17,17,21,18,13], "R": [30,17,17,30,20,18,17],
    "S": [15,16,16,14,1,1,30], "T": [31,4,4,4,4,4,4],
    "U": [17,17,17,17,17,17,14], "V": [17,17,17,17,17,10,4],
    "W": [17,17,17,21,21,21,10], "X": [17,17,10,4,10,17,17],
    "Y": [17,17,10,4,4,4,4], "Z": [31,1,2,4,8,16,31],
}

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def text_into(rgb: bytearray, width: int, height: int, x: int, y: int,
              value: str, color=(207,218,229), scale=2) -> None:
    for char in value:
        rows = FONT[char]
        for gy, row in enumerate(rows):
            for gx in range(5):
                if row & (1 << (4-gx)):
                    for sy in range(scale):
                        yy = y + gy*scale + sy
                        for sx in range(scale):
                            xx = x + gx*scale + sx
                            if 0 <= xx < width and 0 <= yy < height:
                                k = (yy*width+xx)*3
                                rgb[k:k+3] = bytes(color)
        x += 6*scale

def ellipse(rgb: bytearray, cx: float, cy: float, rx: float, ry: float,
            top: tuple[int,int,int], bottom: tuple[int,int,int], opacity: float) -> None:
    for y in range(max(34, math.floor(cy-ry)), min(H-33, math.ceil(cy+ry)+1)):
        dy = (y-cy)/ry
        q = 1-dy*dy
        if q <= 0:
            continue
        half = rx*math.sqrt(q)
        mix = max(0., min(1., (dy+1)*.5))
        color = tuple(a+(b-a)*mix for a,b in zip(top,bottom))
        for x in range(max(0, math.floor(cx-half)), min(W, math.ceil(cx+half)+1)):
            dx = (x-cx)/rx
            coverage = max(0., q-dx*dx)
            alpha = opacity*coverage*coverage
            if alpha <= 0:
                continue
            k = (y*W+x)*3
            rgb[k] = round(rgb[k]*(1-alpha)+color[0]*alpha)
            rgb[k+1] = round(rgb[k+1]*(1-alpha)+color[1]*alpha)
            rgb[k+2] = round(rgb[k+2]*(1-alpha)+color[2]*alpha)

def render(frame: int) -> bytes:
    # Discrete phase is explicitly periodic; endpoint control n96 is n0.
    phase = 2*math.pi*(frame % N)/N
    rgb = bytearray()
    for y in range(H):
        u = y/(H-1)
        color = (round(29+69*u), round(43+79*u), round(65+77*u))
        if y < 34 or y >= H-33:
            color = (15,25,38)
        rgb.extend(bytes(color)*W)
    # Far bank: a slow closed trajectory, original softly layered ellipses.
    fx = 34*math.sin(phase+.65)
    fy = 7*math.cos(phase+.65)
    for cx,cy,rx,ry in [(429,119,120,31),(388,107,66,47),(452,91,63,52),(510,111,68,39)]:
        ellipse(rgb,cx+fx,cy+fy,rx,ry,(144,162,181),(104,129,151),.40)
    # Main bank. Independent periodic breathing gives actual unique moments.
    dx = 27*math.cos(phase)
    dy = 8*math.sin(phase)
    for i,(cx,cy,rx,ry) in enumerate([(205,228,213,42),(86,209,78,43),(148,184,88,64),(230,177,91,71),(306,204,88,52)]):
        breath = 1+.035*math.sin(2*phase+i*.7)
        ellipse(rgb,cx+dx,cy+dy,rx*breath,ry/breath,(211,220,225),(111,141,161),.68)
    # Foreground wisp remains part of a separate periodic orbit.
    wx = 36*math.sin(phase-.6)
    wy = 6*math.cos(phase-.6)
    ellipse(rgb,472+wx,276+wy,190,34,(171,191,204),(119,149,172),.40)
    text_into(rgb,W,H,16,10,"ORIGINAL SYNTHETIC / LOOP FIXTURE",scale=2)
    text_into(rgb,W,H,16,H-22,"4S  640X360  24FPS  NO CLIENT INPUT",scale=2)
    return bytes(rgb)

def ppm(path: Path, rgb: bytes, w=W, h=H) -> None:
    path.write_bytes(f"P6\n{w} {h}\n255\n".encode()+rgb)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=False)
    frames = args.out / 'frames'
    frames.mkdir()
    records = []
    for n in range(N):
        rgb = render(n)
        name = f'frame_{n:03d}.ppm'
        ppm(frames / name, rgb)
        records.append({'index': n, 'file': f'frames/{name}',
                        'rgb_sha256': digest(rgb)})
    endpoint = render(N)
    ppm(args.out / 'endpoint_n096.ppm', endpoint)
    descriptor = {'kind': 'NEW_REPRODUCTION_ORIGINAL_SYNTHETIC_NOT_CLIENT_MEDIA',
                  'width': W, 'height': H, 'fps': FPS, 'frames': N,
                  'audio': 'none', 'source_frames': records,
                  'endpoint_control_rgb_sha256': digest(endpoint),
                  'endpoint_control_is_exported': False,
                  'generator_sha256': digest(Path(__file__).read_bytes())}
    with (args.out / 'SOURCE_MANIFEST.json').open('x', encoding='utf-8') as f:
        json.dump(descriptor, f, indent=2)
        f.write('\n')


if __name__ == '__main__':
    main()
