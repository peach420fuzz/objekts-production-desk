// OBJEKTS / role36.5 — synthetic negative control (public research fixture)
// License: CC0-1.0. No real client or talent material.
// Usage: node vehicle_yaw_negative_control.js
"use strict";

function assert(condition, message) {
  if (!condition) throw new Error("ASSERTION FAILED: " + message);
}
function assertNear(actual, expected, tolerance, label) {
  assert(Number.isFinite(actual), label + " must be finite");
  assert(Math.abs(actual - expected) <= tolerance,
    label + ": expected " + expected + ", got " + actual);
}
function project(x, y, z, yawDeg, zDistance = 10, focalPx = 1000) {
  const t = yawDeg * Math.PI / 180;
  const xc = x * Math.cos(t) + z * Math.sin(t);
  const zc = zDistance - x * Math.sin(t) + z * Math.cos(t);
  assert(zc > 0, "point must be in front of camera");
  return {u: 960 + focalPx * xc / zc, v: 540 + focalPx * y / zc};
}
function measure(wheelbaseM, wheelDiameterM, yawDeg) {
  const left = project(-wheelbaseM / 2, 0, 0, yawDeg);
  const right = project(wheelbaseM / 2, 0, 0, yawDeg);
  const top = project(-wheelbaseM / 2, wheelDiameterM / 2, 0, yawDeg);
  const bottom = project(-wheelbaseM / 2, -wheelDiameterM / 2, 0, yawDeg);
  const wheelbasePx = Math.abs(right.u - left.u);
  const diameterPx = Math.abs(top.v - bottom.v);
  return {yawDeg, wheelbasePx, diameterPx, ratio: wheelbasePx / diameterPx};
}
// This scalar test is NOT a vehicle-identity certificate. It only reports a
// model-conditional measurement. Missing pose cannot silently pass.
function checkRatio(observed, expected, poseKnown, tolerance = 0.05) {
  if (!poseKnown || observed == null || expected == null ||
      !Number.isFinite(observed) || !Number.isFinite(expected)) return "UNKNOWN";
  return Math.abs(observed - expected) <= tolerance ? "CONSISTENT" : "CONTRADICTED";
}
function runFixture() {
  const canon = {wheelbaseM: 2.7, wheelDiameterM: 0.65};
  const angle35 = measure(canon.wheelbaseM, canon.wheelDiameterM, 35);
  const angle55 = measure(canon.wheelbaseM, canon.wheelDiameterM, 55);
  const shorter35 = measure(2.55, canon.wheelDiameterM, 35);

  assertNear(angle35.ratio, 3.688220910433057, 1e-10, "35 degree ratio");
  assertNear(angle55.ratio, 2.678782888816986, 1e-10, "55 degree ratio");
  assertNear(shorter35.ratio, 3.4671528191216545, 1e-10, "shortened wheelbase ratio");
  assert(Math.abs(angle55.ratio - angle35.ratio) > 1.0,
    "camera yaw alone changes the measured ratio");
  assert(checkRatio(angle55.ratio, angle35.ratio, true) === "CONTRADICTED",
    "naive comparison falsely rejects unchanged geometry under yaw");
  assert(checkRatio(angle55.ratio, angle55.ratio, true) === "CONSISTENT",
    "pose-conditioned comparison accepts unchanged geometry");
  assert(checkRatio(shorter35.ratio, angle35.ratio, true) === "CONTRADICTED",
    "pose-conditioned comparison catches wheelbase change");
  assert(checkRatio(angle55.ratio, angle35.ratio, false) === "UNKNOWN",
    "unknown pose cannot be treated as a pass");

  return {
    methodology: "ideal pinhole projection; fixed camera center/focal, rigid wheels, no distortion",
    input: {...canon, cameraDistanceM: 10, focalPx: 1000},
    controlA_fixedGeometry_changeYaw: {angle35, angle55,
      naiveAt55: checkRatio(angle55.ratio, angle35.ratio, true),
      poseConditionedAt55: checkRatio(angle55.ratio, angle55.ratio, true)},
    controlB_fixedYaw_changeGeometry: {shorter35,
      poseConditioned: checkRatio(shorter35.ratio, angle35.ratio, true)},
    missingPose: checkRatio(angle55.ratio, angle35.ratio, false),
    checks: "8 assertions passed",
    caveat: "These synthetic 2D metrics cannot establish full vehicle identity; camera pose itself is assumed known, not estimated."
  };
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {project, measure, checkRatio, runFixture};
}
if (typeof process !== "undefined" && process.argv &&
    /vehicle_yaw_negative_control\.js$/.test(process.argv[1] || "")) {
  process.stdout.write(JSON.stringify(runFixture(), null, 2) + "\n");
}
