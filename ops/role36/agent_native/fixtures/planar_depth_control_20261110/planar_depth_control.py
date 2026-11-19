# SPDX-License-Identifier: CC0-1.0
"""Blender-only numeric projection control. No rendering, fitting, or occlusion test."""

import argparse
from datetime import datetime, timezone
from fractions import Fraction
import hashlib
import inspect
import json
import math
from pathlib import Path
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector


ROOT = Path(__file__).resolve().parent


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False, allow_nan=False) + "\n")


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rational(value):
    return Fraction(str(value))


def pinhole_oracle(contract, camera, point):
    """No call to Blender: similar triangles, square pixels, fixed +Y view."""
    image = contract["image"]
    width, height = rational(image["width"]), rational(image["height"])
    x, y, z = (rational(v) for v in point["world"])
    depth = rational(camera["distance_to_facade_m"]) + y
    focal_px = width * rational(camera["lens_mm"]) / rational(image["sensor_width_mm"])
    u = width / 2 + focal_px * x / depth
    v = height / 2 - focal_px * (z - rational(contract["world"]["camera_height"])) / depth
    return {"pixel": [float(u), float(v)], "pixel_exact": [str(u), str(v)],
            "depth_m": float(depth), "depth_exact": str(depth), "focal_scale_px_exact": str(focal_px)}


def create_camera(scene, specification, image):
    data = bpy.data.cameras.new("Hypothesis_" + specification["id"])
    data.type = "PERSP"
    data.lens = specification["lens_mm"]
    for name in ("sensor_width", "sensor_height"):
        setattr(data, name, image[name + "_mm"])
    data.sensor_fit = image["sensor_fit"]
    data.shift_x, data.shift_y = image["shift_x"], image["shift_y"]
    data.clip_start, data.clip_end = image["clip_start_m"], image["clip_end_m"]
    obj = bpy.data.objects.new(data.name, data)
    scene.collection.objects.link(obj)
    obj.location = specification["location"]
    # Blender local -Z forward becomes world +Y; local +Y up becomes world +Z.
    obj.rotation_euler = (math.pi / 2, 0, 0)
    return obj


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, default=ROOT / "outputs")
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
    out = args.out.resolve()
    out.mkdir(parents=True, exist_ok=True)
    if any(out.iterdir()):
        raise RuntimeError("Refusing to overwrite existing evidence: choose an empty --out directory")
    contract_path = ROOT / "CONTRACT.json"
    contract = json.loads(contract_path.read_text())
    image = contract["image"]
    assert image["width"] == image["height"] and image["pixel_aspect_x"] == image["pixel_aspect_y"] == 1
    assert contract["world"]["camera_forward"] == "+Y"
    scene = bpy.context.scene
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1
    scene.unit_settings.length_unit = "METERS"
    scene.render.resolution_x, scene.render.resolution_y = image["width"], image["height"]
    scene.render.resolution_percentage = image["percentage"]
    scene.render.pixel_aspect_x, scene.render.pixel_aspect_y = image["pixel_aspect_x"], image["pixel_aspect_y"]
    cameras = {c["id"]: create_camera(scene, c, image) for c in contract["cameras"]}
    for point in contract["points"]:
        obj = bpy.data.objects.new(point["id"], None)
        scene.collection.objects.link(obj)
        obj.location = point["world"]
        obj.empty_display_type = "PLAIN_AXES"
        obj.empty_display_size = 0.1
    bpy.context.view_layer.update()
    scene.camera = cameras["A"]

    evidence = {"schema": contract["schema"], "started_utc": datetime.now(timezone.utc).isoformat(),
                "runtime": {"blender": bpy.app.version_string, "python": sys.version, "executable": bpy.app.binary_path},
                "contract_sha256": sha256(contract_path), "script_sha256": sha256(Path(__file__)),
                "projection_helper_source_sha256": sha256(Path(inspect.getfile(world_to_camera_view))),
                "scene": {"width": scene.render.resolution_x, "height": scene.render.resolution_y,
                          "percentage": scene.render.resolution_percentage,
                          "pixel_aspect": [scene.render.pixel_aspect_x, scene.render.pixel_aspect_y],
                          "units": scene.unit_settings.system, "scale_length": scene.unit_settings.scale_length},
                "camera_states": {}, "projections": {}, "comparisons": [], "checks": []}
    for specification in contract["cameras"]:
        cid = specification["id"]
        cam = cameras[cid]
        rotation = cam.matrix_world.to_3x3()
        evidence["camera_states"][cid] = {
            "location": list(cam.location), "rotation_euler": list(cam.rotation_euler),
            "matrix_world": [list(row) for row in cam.matrix_world], "type": cam.data.type,
            "lens_mm": cam.data.lens, "sensor_width_mm": cam.data.sensor_width,
            "sensor_height_mm": cam.data.sensor_height, "sensor_fit": cam.data.sensor_fit,
            "shift": [cam.data.shift_x, cam.data.shift_y], "clip_m": [cam.data.clip_start, cam.data.clip_end],
            "right_world": list(rotation @ Vector((1, 0, 0))),
            "up_world": list(rotation @ Vector((0, 1, 0))),
            "forward_world": list(rotation @ Vector((0, 0, -1)))
        }
        rows = {}
        for point in contract["points"]:
            actual_world = bpy.data.objects[point["id"]].matrix_world.translation.copy()
            ndc = world_to_camera_view(scene, cam, actual_world)
            pixels = [ndc.x * image["width"], (1 - ndc.y) * image["height"]]
            oracle = pinhole_oracle(contract, specification, point)
            rows[point["id"]] = {
                "set": point["set"], "world": list(actual_world), "ndc": list(ndc), "pixel": pixels,
                "oracle": oracle, "absolute_pixel_error": [abs(a - b) for a, b in zip(pixels, oracle["pixel"])],
                "absolute_depth_error_m": abs(ndc.z - oracle["depth_m"]),
                "positive_depth_inside_frame": ndc.z > 0 and 0 <= ndc.x <= 1 and 0 <= ndc.y <= 1
            }
        evidence["projections"][cid] = rows

    checks = evidence["checks"]
    tolerance = contract["predeclared_checks"]["absolute_pixel_tolerance"]
    all_rows = [r for rows in evidence["projections"].values() for r in rows.values()]
    max_error = max(error for row in all_rows for error in row["absolute_pixel_error"])
    max_depth_error = max(row["absolute_depth_error_m"] for row in all_rows)
    checks.append({"name": "actual_Blender_vs_independent_rational_pinhole", "passed": max_error <= tolerance,
                   "max_absolute_component_error_px": max_error, "predeclared_tolerance_px": tolerance})
    checks.append({"name": "camera_axis_depth_vs_independent_depth", "passed": max_depth_error <= contract["predeclared_checks"]["absolute_camera_depth_tolerance_m"],
                   "max_absolute_error_m": max_depth_error})
    checks.append({"name": "synthetic_points_in_front_and_inside_frame", "passed": all(r["positive_depth_inside_frame"] for r in all_rows)})
    for point in contract["points"]:
        a = evidence["projections"]["A"][point["id"]]
        b = evidence["projections"]["B"][point["id"]]
        delta = [bv - av for av, bv in zip(a["pixel"], b["pixel"])]
        exact_delta = [Fraction(bv) - Fraction(av) for av, bv in zip(a["oracle"]["pixel_exact"], b["oracle"]["pixel_exact"])]
        separation = math.hypot(*delta)
        planar = point["set"] != "off_plane_heldout"
        passed = (all(v == 0 for v in exact_delta) and max(abs(v) for v in delta) <= tolerance) if planar else separation > contract["predeclared_checks"]["minimum_off_plane_hypothesis_separation_px"]
        evidence["comparisons"].append({"point": point["id"], "set": point["set"], "B_minus_A_px": delta,
                                        "B_minus_A_exact_rational_px": [str(v) for v in exact_delta],
                                        "separation_px": separation, "expected_relation": "same" if planar else "different",
                                        "passed": passed})
    checks.append({"name": "all_six_facade_labels_agree_two_ground_controls_diverge", "passed": all(r["passed"] for r in evidence["comparisons"])})
    evidence["all_declared_checks_passed"] = all(c["passed"] for c in checks)
    evidence["claim_limits"] = contract["interpretation"]
    write_json(out / "RESULTS.json", evidence)
    bpy.ops.wm.save_as_mainfile(filepath=str(out / "synthetic_cameras.blend"), check_existing=False)
    print(json.dumps({"all_declared_checks_passed": evidence["all_declared_checks_passed"],
                      "max_projection_component_error_px": max_error,
                      "ground_separations_px": [r["separation_px"] for r in evidence["comparisons"] if r["set"] == "off_plane_heldout"],
                      "results": str(out / "RESULTS.json")}, sort_keys=True))
    if not evidence["all_declared_checks_passed"]:
        raise AssertionError("Declared projection control failed; see preserved RESULTS.json")


if __name__ == "__main__":
    main()
