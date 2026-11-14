# SPDX-License-Identifier: CC0-1.0
"""Recheck a saved synthetic camera record with no Blender or producer import.

Portable adaptation of the separate reviewer's 4x4-inverse and Fraction method.
It verifies retained data, not a second Blender execution or a real image solve.
"""
import argparse
from datetime import datetime, timezone
from fractions import Fraction
import hashlib
import json
import math
from pathlib import Path


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inverse4(matrix):
    rows = [[float(v) for v in row] + [float(i == j) for j in range(4)]
            for i, row in enumerate(matrix)]
    for col in range(4):
        pivot = max(range(col, 4), key=lambda i: abs(rows[i][col]))
        if abs(rows[pivot][col]) < 1e-15:
            raise ValueError('Singular camera matrix')
        rows[col], rows[pivot] = rows[pivot], rows[col]
        scale = rows[col][col]
        rows[col] = [v / scale for v in rows[col]]
        for i in range(4):
            if i != col:
                scale = rows[i][col]
                rows[i] = [a - scale * b for a, b in zip(rows[i], rows[col])]
    return [row[4:] for row in rows]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.output.exists():
        parser.error('Output already exists; choose a new evidence path')
    source = args.source.resolve()
    contract = json.loads((source / 'CONTRACT.json').read_text())
    record = json.loads((source / 'outputs/RESULTS.json').read_text())
    image = contract['image']
    limits = contract['predeclared_checks']
    checks = {
        'contract_hash': digest(source / 'CONTRACT.json') == record['contract_sha256'],
        'producer_hash': digest(source / 'planar_depth_control.py') == record['script_sha256'],
        'supported_image': image['width'] == image['height'] == 512 and image['percentage'] == 100
            and image['pixel_aspect_x'] == image['pixel_aspect_y'] == 1
            and image['sensor_fit'] == 'HORIZONTAL' and image['shift_x'] == image['shift_y'] == 0,
        'population': len(contract['cameras']) == 2 and len(contract['points']) == 8
            and set(record['camera_states']) == {'A', 'B'}
            and set(record['projections']) == {'A', 'B'},
    }
    rows = []
    by_id = {}
    for spec in contract['cameras']:
        cid = spec['id']
        camera = record['camera_states'][cid]
        inv = inverse4(camera['matrix_world'])
        fx = image['width'] * camera['lens_mm'] / camera['sensor_width_mm']
        checks[cid + ':intrinsics'] = camera['type'] == 'PERSP' and camera['sensor_fit'] == 'HORIZONTAL' \
            and camera['shift'] == [0, 0] and camera['lens_mm'] == spec['lens_mm'] \
            and camera['sensor_width_mm'] == image['sensor_width_mm']
        checks[cid + ':point_population'] = set(record['projections'][cid]) == {p['id'] for p in contract['points']}
        for p in contract['points']:
            observed = record['projections'][cid][p['id']]
            local = [sum(a*b for a,b in zip(row,[*p['world'],1])) for row in inv]
            x,y,z = [v / local[3] for v in local[:3]]
            depth = -z
            pixel = [image['width']/2 + fx*x/depth, image['height']/2 - fx*y/depth]
            rel = [Fraction(str(v))-Fraction(str(c)) for v,c in zip(p['world'],spec['location'])]
            exact_f = Fraction(image['width']) * Fraction(str(spec['lens_mm'])) / Fraction(str(image['sensor_width_mm']))
            ideal = [Fraction(image['width'],2)+exact_f*rel[0]/rel[1], Fraction(image['height'],2)-exact_f*rel[2]/rel[1]]
            matrix_error = max(abs(a-b) for a,b in zip(pixel,observed['pixel']))
            ideal_error = max(abs(float(a)-b) for a,b in zip(ideal,observed['pixel']))
            depth_error = abs(depth-observed['ndc'][2])
            checks[cid+'/'+p['id']] = observed['world'] == p['world'] \
                and matrix_error <= limits['absolute_pixel_tolerance'] \
                and ideal_error <= limits['absolute_pixel_tolerance'] \
                and depth_error <= limits['absolute_camera_depth_tolerance_m'] \
                and [str(v) for v in ideal] == observed['oracle']['pixel_exact']
            row = {'camera':cid,'point':p['id'],'saved_pixel':observed['pixel'],
                   'matrix_pixel':pixel,'ideal_exact_pixel':[str(v) for v in ideal],
                   'matrix_component_error_px':matrix_error,'ideal_component_error_px':ideal_error,
                   'matrix_depth_error_m':depth_error}
            rows.append(row);by_id[cid,p['id']]=row
    comparisons=[]
    for p in contract['points']:
        a,b = by_id['A',p['id']],by_id['B',p['id']]
        delta=[v-u for u,v in zip(a['saved_pixel'],b['saved_pixel'])]
        exact=[Fraction(v)-Fraction(u) for u,v in zip(a['ideal_exact_pixel'],b['ideal_exact_pixel'])]
        planar=p['world'][1] == contract['world']['facade_plane_y']
        separation=math.hypot(*delta)
        checks['comparison:'+p['id']]=(all(v==0 for v in exact) and max(abs(v) for v in delta)<=limits['absolute_pixel_tolerance']) if planar else separation>limits['minimum_off_plane_hypothesis_separation_px']
        comparisons.append({'point':p['id'],'planar':planar,'separation_px':separation,'B_minus_A_exact':[str(v) for v in exact]})
    result={'checked_at':datetime.now(timezone.utc).isoformat(),'checker_sha256':digest(Path(__file__)),
            'scope':'Portable retained-record recomputation; not a new Blender experiment, fit or visibility test.',
            'projections_checked':len(rows),'checks':checks,'all_checks_passed':all(checks.values()),
            'summary':{'max_matrix_component_error_px':max(r['matrix_component_error_px'] for r in rows),
                       'max_ideal_component_error_px':max(r['ideal_component_error_px'] for r in rows),
                       'max_matrix_depth_error_m':max(r['matrix_depth_error_m'] for r in rows),
                       'max_planar_separation_px':max(r['separation_px'] for r in comparisons if r['planar']),
                       'off_plane_separations_px':[r['separation_px'] for r in comparisons if not r['planar']]},
            'projections':rows,'comparisons':comparisons}
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(result,indent=2,allow_nan=False)+'\n')
    print(json.dumps({'all_checks_passed':result['all_checks_passed'],'projections':len(rows),'summary':result['summary']},indent=2))
    if not result['all_checks_passed']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
