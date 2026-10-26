// A localhost QA bridge is not a real ChatGPT host. These gates prove only
// the recorded browser interactions; they cannot certify ImageGen or likeness.
export const REQUIRED_TABS = ["PRO", "RAW", "LOOK", "RENDER", "STATE", "QUICK"];
export const REQUIRED_POSES = ["FRONT", "3/4", "PROFILE"];
export const REQUIRED_PRESETS = ["Cinematic", "Fashion editorial"];

export function collectFailures(report) {
  const failures = [];
  const fail = (name, reason) => failures.push({ name, reason });
  const steps = Array.isArray(report.steps) ? report.steps : [];
  const required = (name) => {
    const matches = steps.filter(s => s.name === name);
    if (matches.length !== 1) {
      fail(name, `Expected one result, received ${matches.length}`);
      return null;
    }
    const step = matches[0];
    if (step.missing || step.error || step.failed) {
      fail(name, step.error || step.reason || "Required action missing or failed");
      return null;
    }
    return step;
  };
  if (report.fatal) fail("fatal", report.fatal);
  for (const [index, error] of (report.errors || []).entries()) fail(`browser-error-${index}`, error);
  for (const [index, error] of (report.requestsFailed || []).entries()) fail(`request-${index}`, error.error || "Request failed");
  for (const [index, error] of (report.httpErrors || []).entries()) fail(`http-${index}`, `${error.status} ${error.url}`);
  for (const step of steps) {
    if (step.error || step.missing || step.failed) fail(step.name, step.error || step.reason || "Recorded step failed");
    if (step.overflow) fail(step.name, "Horizontal overflow");
  }
  for (const name of ["00-quick-desktop", ...REQUIRED_TABS.map(t => `tab-${t.toLowerCase()}`), "mobile-quick"]) {
    const step = required(name);
    if (!step) continue;
    if (!step.canvas || step.canvas.width <= 0 || step.canvas.height <= 0 || step.canvas.clientWidth <= 0 || step.canvas.clientHeight <= 0) fail(name, "Missing or zero-size geometry canvas");
    if (step.loading) fail(name, "Studio still initializing or loading geometry");
    if (!step.geometryReady) fail(name, "Geometry readiness not observed");
  }
  const hashes = [];
  for (const pose of REQUIRED_POSES) {
    const step = required(`pose-${pose}`);
    if (!step) continue;
    if (!/^[a-f0-9]{64}$/.test(step.canvasScreenshotSha256 || "")) fail(step.name, "Missing canvas screenshot digest");
    else hashes.push(step.canvasScreenshotSha256);
  }
  if (hashes.length === 3 && new Set(hashes).size !== 3) fail("pose-views", "Canonical camera views rendered identical pixels");
  for (const preset of REQUIRED_PRESETS) {
    const step = required(`preset-${preset.toLowerCase().replace(/\s+/g, "-")}`);
    if (step && !step.geometryReady) fail(step.name, "Geometry lost after preset selection");
  }
  const change = required("quick-range-change");
  if (change && (![change.before, change.target, change.after].every(v => Number.isFinite(Number(v))) || Number(change.target) === Number(change.before) || Number(change.after) !== Number(change.target))) fail(change.name, "Range value did not change to requested value");
  const effect = required("quick-edited");
  if (effect && (!effect.geometryReady || !effect.canvasScreenshotSha256 || !effect.beforeCanvasSha256 || effect.beforeCanvasSha256 === effect.canvasScreenshotSha256)) fail(effect.name, "No visible geometry-preview change recorded");
  if (report.photoFixtureRequested) {
    const fit = required("photo-fit-check");
    if (fit && !fit.fitVisible) fail(fit.name, "Photo fit not observed");
    const saved = required("photo-reference-save");
    if (saved && (!saved.clicked || !saved.savedIndicator || saved.errorIndicator)) fail(saved.name, "Reference save not confirmed");
  }
  return [...new Map(failures.map(f => [`${f.name}:${f.reason}`, f])).values()];
}

export function assertReport(report) {
  const failures = collectFailures(report);
  if (failures.length) throw new Error(`FAKE browser QA failed (${failures.length}):\n${failures.map(f => `${f.name}: ${f.reason}`).join("\n")}`);
}
