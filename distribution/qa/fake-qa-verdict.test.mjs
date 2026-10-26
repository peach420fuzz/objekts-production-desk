import { test } from "node:test";
import assert from "node:assert/strict";
import { assertReport, REQUIRED_TABS, REQUIRED_POSES, REQUIRED_PRESETS } from "./fake-qa-verdict.mjs";

function passingReport() {
  const view = name => ({ name, geometryReady: true, loading: false, overflow: false, canvas: {width: 900, height: 600, clientWidth: 900, clientHeight: 600} });
  return { errors: [], requestsFailed: [], httpErrors: [], steps: [
    view("00-quick-desktop"), ...REQUIRED_TABS.map(t => view(`tab-${t.toLowerCase()}`)), view("mobile-quick"),
    ...REQUIRED_POSES.map((p,i) => ({name: `pose-${p}`, canvasScreenshotSha256: String(i+1).repeat(64)})),
    ...REQUIRED_PRESETS.map(p => view(`preset-${p.toLowerCase().replace(/\s+/g, "-")}`)),
    {name: "quick-range-change", before: "0", target: 0.5, after: "0.5"},
    {...view("quick-edited"), beforeCanvasSha256: "a".repeat(64), canvasScreenshotSha256: "b".repeat(64)}
  ]};
}
test("complete browser interaction evidence passes without claiming native generation", () => assert.doesNotThrow(() => assertReport(passingReport())));
const mutations = {
  "missing tab": r => r.steps.splice(r.steps.findIndex(s => s.name === "tab-pro"),1),
  "caught click failure": r => r.steps.find(s => s.name === "tab-pro").error = "Timeout clicking PRO",
  "missing pose": r => r.steps.splice(r.steps.findIndex(s => s.name === "pose-PROFILE"),1),
  "identical poses": r => r.steps.filter(s => s.name.startsWith("pose-")).forEach(s => s.canvasScreenshotSha256 = "a".repeat(64)),
  "missing preset": r => r.steps.splice(r.steps.findIndex(s => s.name === "preset-fashion-editorial"),1),
  "no quick controls": r => r.steps.find(s => s.name === "quick-range-change").missing = true,
  "unchanged range": r => r.steps.find(s => s.name === "quick-range-change").after = "0",
  "unchanged geometry preview": r => r.steps.find(s => s.name === "quick-edited").canvasScreenshotSha256 = "a".repeat(64),
  "page exception": r => r.errors.push("Unexpected TypeError"),
  "network failure": r => r.requestsFailed.push({error:"net::ERR_FAILED"}),
  "HTTP error": r => r.httpErrors.push({status:403,url:"/gnm/model.bin"}),
  "mobile overflow": r => r.steps.find(s => s.name === "mobile-quick").overflow = true,
  "zero canvas": r => r.steps.find(s => s.name === "00-quick-desktop").canvas.width = 0,
  "initialization stuck": r => r.steps.find(s => s.name === "00-quick-desktop").loading = true,
  "geometry not ready": r => r.steps.find(s => s.name === "00-quick-desktop").geometryReady = false,
  "duplicate evidence": r => r.steps.push({...r.steps[0]}),
  "failed requested photo fit": r => {r.photoFixtureRequested = true; r.steps.push({name:"photo-fit-check",fitVisible:false},{name:"photo-reference-save",clicked:true,savedIndicator:true});},
  "failed requested reference save": r => {r.photoFixtureRequested = true; r.steps.push({name:"photo-fit-check",fitVisible:true},{name:"photo-reference-save",clicked:false,savedIndicator:false});}
};
for (const [name, mutate] of Object.entries(mutations)) test(`deliberate ${name} fails the release gate`, () => {
  const report = passingReport(); mutate(report);
  assert.throws(() => assertReport(report), /FAKE browser QA failed/);
});
test("photo saving passes only when all requested evidence exists", () => {
  const report=passingReport(); report.photoFixtureRequested=true;
  report.steps.push({name:"photo-fit-check",fitVisible:true},{name:"photo-reference-save",clicked:true,savedIndicator:true,errorIndicator:false});
  assert.doesNotThrow(() => assertReport(report));
});
