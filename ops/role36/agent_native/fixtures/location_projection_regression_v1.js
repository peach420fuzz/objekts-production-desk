"use strict";
// Synthetic 2D projection checks. Run beside location_topology_style_delta_v1.js.
// No rendered imagery, camera calibration or model output is assessed here.
const assert = require("node:assert/strict");
const {project, compareLocation, runFixture} = require("./location_topology_style_delta_v1.js");

const checks = [];
function close(name, actual, expected) {
  assert.equal(typeof actual, "number", name + ": visible point must project");
  assert.ok(Number.isFinite(actual), name + ": finite projection required");
  assert.ok(Math.abs(actual - expected) <= 1e-9,
    name + ": got " + actual + ", expected " + expected);
  checks.push({name, actual, expected});
}
function hidden(name, point, camera) {
  assert.equal(project(point, camera), null, name);
  checks.push({name, actual: null, expected: null});
}
const origin = {x: 0, y: 0, yaw: 0, focalPx: 1000};

// Explicit geometric values and coordinate changes are the oracle; they do
// not recalculate the implementation's trigonometric denominator.
close("yaw zero: +X forward, +Y screen-right", project({x: 10, y: 5}, origin), 500);
close("quarter-turn: point on +Y optical axis", project({x: 0, y: 10}, {...origin, yaw: Math.PI / 2}), 0);
close("45 degrees: known off-axis triangle", project({x: 10, y: 5}, {...origin, yaw: Math.PI / 4}), -1000 / 3);
close("common translation preserves yaw-zero projection", project({x: 14, y: 12}, {...origin, x: 4, y: 7}), 500);
close("common translation preserves oblique projection", project({x: 14, y: 12}, {...origin, x: 4, y: 7, yaw: Math.PI / 4}), -1000 / 3);
close("joint 90-degree scene/camera rotation preserves projection", project({x: -5, y: 10}, {...origin, yaw: Math.PI / 2}), 500);
hidden("negative +Y depth stays behind quarter-turned camera", {x: 5, y: -10}, {...origin, yaw: Math.PI / 2});
hidden("point at camera remains unprojectable", {x: 4, y: 7}, {...origin, x: 4, y: 7, yaw: Math.PI / 4});
hidden("existing depth epsilon remains unchanged", {x: 0, y: 0.0005}, {...origin, yaw: Math.PI / 2});

// Peer question: a full reflection preserves pairwise lengths. The existing
// comparator instead uses labeled positions in an approved oriented frame.
const reference = {
  nodes: [{id: "A", kind: "junction", x: 8, y: 0},
          {id: "B", kind: "door", x: 15, y: 7},
          {id: "C", kind: "alley", x: 15, y: -7}],
  edges: [["A", "B"], ["A", "C"]], doors: [{id: "door1", onNode: "B"}],
  palette: "day", weather: "clear"
};
const reflected = {...reference, nodes: reference.nodes.map(p => ({...p, y: -p.y})),
  palette: "dusk", weather: "rain"};
const lengths = points => [[0, 1], [0, 2], [1, 2]].map(([a, b]) =>
  Math.hypot(points[b].x - points[a].x, points[b].y - points[a].y));
assert.deepEqual(lengths(reference.nodes), lengths(reflected.nodes));
checks.push({name: "full reflection preserves every pairwise distance", actual: lengths(reflected.nodes), expected: lengths(reference.nodes)});
const signedTwiceArea = ([a, b, c]) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
assert.equal(signedTwiceArea(reference.nodes), -98);
assert.equal(signedTwiceArea(reflected.nodes), 98);
checks.push({name: "oriented triangle changes handedness under reflection", actual: 98, expected: 98});
const mirrorResult = compareLocation(reference, reflected, origin,
  {allowed: ["palette", "weather"], palette: "dusk", weather: "rain"},
  {visibleIds: ["A", "B", "C"]});
assert.deepEqual(mirrorResult, {status: "REJECT", why: "world-metric-change"});
checks.push({name: "existing labeled world-coordinate check rejects the full reflection", actual: mirrorResult, expected: {status: "REJECT", why: "world-metric-change"}});

const prior = runFixture();
assert.equal(prior.passed, 18, "all original location controls remain passing");
console.log(JSON.stringify({
  scope: "synthetic ground-plane projection only; no image or calibrated-camera validation",
  original_fixture_checks: prior.passed,
  new_projection_checks: 9,
  new_reflection_checks: 3,
  total_new_checks: checks.length,
  checks
}, null, 2));
