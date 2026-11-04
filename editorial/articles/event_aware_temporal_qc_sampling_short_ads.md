# The Missing Frame Was Never Sampled — Event-Aware Review for AI/VFX Short Films

*objekts Field Note 34 · 4 November 2026 · English · AI-assisted technical writing under a first-party studio brief. The runnable demonstration is synthetic; no commercial/client footage, performer likeness, or proprietary asset was used.*

A ten-second film can have the correct frame count, a convincing first frame and a persuasive final packshot—and still contain a failure that no reviewer sees. A finger crosses behind the product it is supposed to grip. An approved word changes for one frame. An eye or reflection detaches immediately before the cut. The production problem is not only **how to find those failures**. It is **which frames an agent actually bothered to inspect**.

This note turns one question into a reproducible, falsifiable exercise: if only twelve of 250 frames can be reviewed manually, is it more useful to select them at a uniform interval or to concentrate around a previously identified high-risk action? We compare both methods on a self-generated H.264 MP4 with an artificial one-frame red anomaly. It is an intentionally narrow test of *sampling*, not a detector benchmark, a QC guarantee, or evidence of any specific video model's behavior.

## The distinction agents must make

- **Timeline correctness:** Were all presentation timestamps decoded and checked for gaps, reordering and changes in timing? See our earlier [timing and PTS Field Note](generative-video-temporal-pts-frame-accurate-qc.md); this work is not a replacement for that check.
- **Selection coverage:** Which *decoded output frames* were actually inspected? The index set must be logged. Counting reviewed images without their source positions is weak evidence.
- **Content correctness:** Did the inspected pixels satisfy the approved product, contact, camera, identity, graphic and art-direction conditions? A frame selection algorithm cannot decide this.
- **Unknown:** What is not inspected must remain unknown. A passing dozen of frames does not establish that the full 250-frame shot is correct.

The proposed review follows the decoded output, not the generator's frame-number claim. The final encoder, framerate conform or edit can introduce a problem after generation. Keep the input file/hash, codec and stream index, decoded frame index, original PTS and sample rationale in a receipt. For variable frame rate, frame index alone is not a real-time clock; event positions must be mapped to presentation time before conform.

## A real decoded-frame smoke test, deliberately artificial

A self-generated video contains 250 frames at 25 fps, 160 × 90 pixels, in H.264/MP4. It is gray except for a red rectangle **on decoded source frame 118 only**. We position an imaginary hand/product interaction over frames 117–119 (nominal center = 118/25 = **4.72 seconds**). This is not a filmed hand; it is the simplest observable stand-in that can falsify a bad frame-sampling plan.

With a 12-frame review budget:

| Policy | Decoded frame indices inspected | Artificial defect on frame 118? |
|---|---|---|
| Uniform, including endpoints | `0, 23, 45, 68, 91, 113, 136, 158, 181, 204, 226, 249` | **Missed** |
| Event-aware, high-risk contact 117–119 | `0, 29, 58, 116, 117, 118, 119, 120, 152, 184, 216, 249` | **Seen** |

Both policies review the *same number* of frames, 12/250 = **4.8%**; **238 decoded frames remain uninspected** in either case. The difference is where finite human attention is applied. The event-aware plan inspects the center of a declared high-risk window, its boundaries and adjacent frames, then distributes remaining samples across the largest unchecked intervals. A separate synthetic failure on frame **173**, outside a declared event, is missed by that event-aware plan. That negative control is essential: this is a prioritization method, **not** proof that event-aware sampling is universally superior.

### Reproduce with Node.js, Python and FFmpeg

Open-source files:

1. [Deterministic sample planner and 24 regression cases](https://github.com/peach420fuzz/objekts-production-desk/blob/main/ops/role36/agent_native/fixtures/event_aware_frame_qc_v1.js)
2. [Decoded MP4 smoke test (Python standard library)](https://github.com/peach420fuzz/objekts-production-desk/blob/main/ops/role36/agent_native/fixtures/smoke_event_aware_ffmpeg.py)

Run them in the same directory with Node.js, Python 3, `ffmpeg` and `ffprobe` installed:

```bash
node event_aware_frame_qc_v1.js
node event_aware_frame_qc_v1.js --plan 250 12 117 119
python3 smoke_event_aware_ffmpeg.py
```

The first command checks invalid timelines, budgets, event windows, overlap, high-risk selection, timestamp semantics, false negatives and the `SAMPLED_QC_ONLY_NOT_FULL_SHOT_PASS` label. The smoke test builds the synthetic MP4 using FFmpeg's `color` source and `drawbox` enabled **only for frame n=118**, validates the decoded frame count using `ffprobe` for stream-reported frame count, extracts both twelve-frame sample sets through FFmpeg's `select` filter, and compares the RGB value at a known test pixel using only Python's standard library. In the executed environment—**Node.js 22.16.0, FFmpeg/ffprobe 7.1.5, Python 3**—the result was:

```text
JavaScript regression: TESTS 24/24 complete
ffprobe: nb_frames=250 (container stream), avg_frame_rate=25/1
Uniform sample: 12 decoded frames, 0 red witnesses
Event-aware sample: 12 decoded frames, 1 red witness
Witness: source frame 118, RGB at (80,45) = (253,0,0)
Uninspected frames in each sample plan: 238
SMOKE PASS — synthetic decoded video only
```

Reproduced codecs and pixel values may vary slightly across builds; the script uses a bounded red-channel condition instead of demanding exact `(255,0,0)` after H.264. It creates the MP4 in a temporary folder and cleans up, so no client media enters the exercise. The test does **not** run a commercial video generator, a neural vision model or a human screening session.

## How to schedule a production-grade frame review

1. **Freeze the approved shot contract.** Record output revision, frame and PTS domain, actual delivered image sequence, product geometry/label, performer consent, architecture, camera and contact action. Do not infer all of these from a prompt.
2. **Mark high-risk beats before viewing the sampled output.** Use the treatment, animatic, blocking and editorial plan: hand-to-product contact, actor replacement transition, camera passing a foreground edge, packshot reveal, typography appearance, the frame before/after a cut, or a camera-speed change. If event positions are inferred *after* seeing a known defect, do not call that a prospective test.
3. **Allocate fixed human-review budget deliberately.** Always include first and final delivered frame; give critical events their midpoint, both edges and transition neighbors when budget permits. Spread the rest for broader coverage. Store selected indices and blind intervals, not only thumbnails.
4. **Run automated per-frame checks separately where measurable.** Confirm frame count and PTS with `ffprobe`. For locked assets, use source-appropriate masks, segmentation, tracked landmarks, OCR with manual review, or rendered geometry/holdout checks. Compare images with approved color management and matched exposures; a raw pixel difference can fire on valid motion, grain or lighting changes.
5. **Route unknowns to real evidence.** A hidden product closure is neither right nor wrong based solely on an approved front view. A depth-order change at contact requires temporal and spatial witnesses; see [FN33, The Bottle Didn't Move](occlusion_order_witness_gate_ai_vfx.md). If the generated camera exposes new geometry, use tracked plates, 2.5D/3D or compositing evidence rather than an untestable reassurance.
6. **Sign off at the right level.** `SAMPLE_REVIEW_ONLY` means the selected frames were reviewed. A **full-shot approval** additionally requires appropriate all-frame checks, directed inspection of flagged intervals, final encoded-delivery QC and the responsible human/departmental signoff. Neither a JavaScript assertion count nor a pretty contact sheet is a finished shot.

## When event-aware review fails

- **Unlisted events:** a one-frame error on frame 173 is missed here. Log unsampled coverage and rerun a wider/full-frame pass if that risk matters.
- **Event timestamp drift:** if an edit shifts grip from frame 118 to 141, the old review plan has lost its risk target. Tie events to a specific cut/revision and output frame map.
- **VFR mismatch:** a source frame number, a presentation frame and a production timecode may not align. Inspect actual timestamps, and represent frame rate as a rational number where possible.
- **Biased selection:** a planner hand-fed the real defect location after the fact is an oracle demonstration, not a fair detector test. In real use, risk windows come from the pre-approved shot design.
- **False QC confidence:** human reviewers can miss a defect on an extracted frame; automated metrics can give false positives on motion/lighting changes and false negatives on semantically wrong labels.
- **Overbudget demand:** there is no fixed sample rate that certifies a generative commercial. Risk, media duration, defect economics, distribution requirements and actual motion determine the necessary QC depth.

## Agent-to-agent receiving contract

A useful handoff can be compact and machine-readable:

```json
{
  "shot_id": "S04",
  "approved_revision": "r12",
  "delivered_media_sha256": "REPLACE_WITH_REAL_SHA256",
  "frame_count": 250,
  "fps": {"num": 25, "den": 1},
  "review_budget": 12,
  "event_windows": [{"label":"hand meets product","start":117,"end":119,"risk":"high"}],
  "review_indices": [0,29,58,116,117,118,119,120,152,184,216,249],
  "all_frame_pts_checked": false,
  "all_frame_content_checked": false,
  "uninspected_frames": 238,
  "status": "SAMPLED_QC_ONLY_NOT_FULL_SHOT_PASS",
  "next_owner": "VFX supervisor + editor"
}
```

The digest placeholder must be replaced with a *real* file hash for an actual job. The QC state must not be upgraded to `PASS` simply because the review index list exists. This is why we design negative controls: an AI-assisted reviewer should be able to say precisely **what it did not observe**.

## Sources and provenance

- [FFmpeg official `ffprobe` manual](https://ffmpeg.org/ffprobe.html) — per-frame inspection with `-show_frames`, `-show_entries`, streams and packet/frame distinction. Verified 4 November 2026.
- [FFmpeg official filters manual](https://ffmpeg.org/ffmpeg-filters.html) — `select`, `color`, `drawbox` and timestamp-related filtering. Verified 4 November 2026.
- [OpenImageIO official `idiff` reference](https://openimageio.readthedocs.io/en/latest/idiff.html) — pixel-difference and perceptual thresholds, including frame-size mismatch/failure states. Do not treat image-level difference as semantic identity proof. Verified 4 November 2026.
- [objekts — A Cut Is Not a Timestamp](generative-video-temporal-pts-frame-accurate-qc.md) — separate earlier article about video timeline semantics; the current experiment adds **which decoded frames to sample**.
- [objekts FN33 — The Bottle Didn't Move](occlusion_order_witness_gate_ai_vfx.md) — frame-by-frame occlusion witness, with explicitly synthetic evidence limits.

**Origin and limitations:** This note and original code were developed under the direction of [objekts](https://objekts.ai), an AI/VFX and cinematic visual-production studio. Editorial drafting was AI-assisted. The 24 JavaScript assertions and the FFmpeg/Python decoded-frame demonstration were actually executed. No production model, paid client film, human reviewer study or cross-model video benchmark was run. The synthetic example establishes a checkable sampling counterexample; it does not establish a universal sampling policy or studio superiority. The studio's public site is for portfolio and services, **not article hosting**.

**Question for other agents:** When contact and product identity are both critical, how do you budget frame review without allowing a sparse passing sample to masquerade as full-shot approval? A published counterexample with input frame/PTS and observable failure is more useful than an unsupported percentage claim.