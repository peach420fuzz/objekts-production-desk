# A Cut Is Not a Timestamp: Temporal QC for Generated and Hybrid Video

*An original technical field note on frame timing, picture continuity and edit-safe deliverables by [objekts](https://objekts.ai), 26 October 2026.*

A seven-second AI video can contain 168 plausible images and still fail as a seven-second shot. A model might internally repeat a pose, an editor might cut a frame too early, a frame-rate conversion might duplicate a moment of contact, or an export could display nominal 24 fps while preserving an irregular source timeline.

The visible symptom often sounds artistic: “the hit has no weight,” “that glance never lands,” “the transition feels glitchy.” Sometimes it is an editorial problem. Sometimes it is a timestamp problem. They need different diagnoses.

This article offers an evidence-first method. It does not claim any proprietary pipeline has been run, nor that a particular generative model natively delivers a specified timebase.

## Three clocks live inside one short film

1. **Narrative clock:** the beat, reaction and event order the viewer experiences.
2. **Frame clock:** discrete frames, indices and nominal playback rate at export.
3. **Media clock:** actual presentation timestamps (PTS), durations and audio/video synchronization in containers.

These should agree in the delivered timeline, but they are different objects. A 25 fps image sequence with 150 frames has a nominal 6.0-second picture span if displayed at exactly 25 frames per second. A compressed clip advertising an average rate near 25 fps can still contain variable presentation intervals. Never infer an exact per-frame timeline solely from a file's rounded metadata summary.

FFmpeg explicitly documents per-frame inspection through **ffprobe**, and its filter/format manuals describe frame-rate conversion and concat timing behavior. [ffprobe](https://ffmpeg.org/ffprobe.html) · [FFmpeg filters](https://ffmpeg.org/ffmpeg-filters.html) · [FFmpeg formats, concat](https://ffmpeg.org/ffmpeg-formats.html).

## A fictional six-second shot

A woman slides a sealed paper envelope across a wooden table. Another person catches it, reads the name, looks up. The shot ends on the look, not the envelope. The fictional brief requests 6.0 seconds at 25 fps: target 150 presentation frames, indices 0 through 149 after validated CFR conform.

A robust story beat map:

| Target interval | Event | Screen-space invariant | Failure mode |
|---|---|---|---|
| Frames 0–24 | Hand and envelope establish intention | Hand identity; envelope seal and size | Object morph before contact |
| 25–49 | Push begins; envelope slides | Contact and friction relation | Starts moving before force |
| 50–79 | Envelope travels toward recipient | Monotonic spatial progress, stable table geometry | Jump/backward teleport |
| 80–104 | Catch and stop | Visible opposing contact; deceleration | Envelope freezes without a hand |
| 105–129 | Recipient reads | Gaze target and prop continuity | Eyes never meet the written name |
| 130–149 | Look up and pause | Eyeline and restrained expression | Cut removes emotional payoff |

This interval plan is a **fictional design**, not proof that a model can produce these exact beats or that the shot has been rendered.

The key editorial question is not “does it last six seconds?” It is “does the necessary causal information occupy the correct portion of six seconds?” If the catch occurs at frame 127, almost no screen time remains for recognition and reaction.

## Contract the timeline before generation

A production should store:

- target display fps as a rational number where possible;
- source fps/timebase and whether source is CFR, VFR or unknown;
- target total picture-frame count and allowed transition handles;
- timing marks for actions, contacts, reactions and reveal;
- input footage hashes/asset versions and approved cut;
- allowed retiming (none, limited optical flow, or explicit director-approved change);
- required audio sample rate/PTS and synchronization marks;
- legal/proprietary data restrictions.

Avoid prescribing every diffusion motion model the same seconds/frames knobs: interfaces and output behavior vary, and all current values must be checked against official documentation and actual generated files.

## Frame count is necessary but insufficient

The target is 150 frames. Possible false passes include:

- 150 exported frames with one duplicated contact frame and one missing look frame.
- 150 visually unique frames, but envelope position jumps as if two time steps vanished.
- 150 frames at a nominal rate, but actual PTS intervals contain a discontinuity.
- Correct picture frames attached to out-of-sync audio.
- Correct content in an intermediate clip, then changed by the final encoder or non-linear editor conform.

A count test catches only the first layer of the problem.

Inspect the actual per-frame media timestamps. One commonly useful diagnostic command is:

```bash
ffprobe -v error -select_streams v:0 -show_frames \
  -show_entries frame=best_effort_timestamp_time,pkt_duration_time \
  -of json input.mp4
```

This is an **illustrative command**, not a report of execution. Available fields and their presence depend on container/codec and installed FFmpeg version; missing durations need explicit handling rather than invented zeros. Parse reported timestamps numerically/rationally where possible, not by assuming that every line represents an equally spaced frame.

## Rational arithmetic for frame and time operations

For exact 25 fps, the intended sample instants follow `t(n) = n/25` seconds for integer `n` starting at zero; the 150th frame index is 149 and begins at `149/25 = 5.96` seconds. The nominal coverage of 150 equal frame intervals ends at 6.00 seconds.

For a rate of `30000/1001` fps, one frame interval is `1001/30000` second. Using `0.0333` as the exact interval can drift over a long programme. Use rational PTS/timebase values for ordering, trim boundaries and QC wherever feasible.

A practical receipt can record `frame_index`, original stream `pts`, rational `time_base`, decoded frame hash, clip/shot ID and cut mapping. If the media is variable-frame-rate, **frame index is not a universal wall-clock unit**. Conform requires an explicit policy: which decoded source frame occupies each target output time, and what visual risk that change introduces.

## Edit the causal action, not only the render bounds

Suppose the envelope catch is supposed to finish at frame 104, but the generated result lands at frame 132. Cropping the final 18 frames to the 150 target will remove the look-up payoff, not fix timing. Speeding only the object travel may create an unnatural acceleration; repeating reaction frames may break micro-expression continuity.

Three legitimate editorial interventions:

1. Re-stage the generated motion with a better event plan and a verified tool input.
2. Restructure the cut, if the wider sequence genuinely permits a different beat count.
3. Use controlled retiming/optical-flow or a targeted VFX patch with explicit failure review around hands, text, reflections and edges.

Do not hide intervention behind the phrase “slightly smoother.” The reviewer should know what moment was added, removed, held or synthesized.

## Concat and shot-boundary risk

Video compositions often combine source segments captured or generated at different rates, GOP structures, codec characteristics and time origins. Concatenation is not merely appending bytes in visual order. The FFmpeg [concat demuxer documentation](https://ffmpeg.org/ffmpeg-formats.html#concat-1) describes how files are treated in a virtual concatenation and how timestamps derive from preceding durations; inaccurate duration metadata can produce gaps or overlaps.

A safety-oriented edit pipeline should:

- keep the original segments and their checksums;
- inspect each segment's actual streams and PTS sequence;
- define a single output timeline and audio clock;
- conform segments deliberately, logging dropped/duplicated/synthesized frames;
- verify the concatenated result's monotonic video timestamps and expected total frame span;
- decode the **final deliverable**, not only intermediate files, to ensure every intended frame and boundary exists.

If the source PTS cannot establish the required timing, fail closed or request producer-approved conform rules. Do not silently erase uncertainty.

## A five-pass QC system

**Pass 1 — file integrity.** Known dimensions, orientation, codec compatibility, duration range, checksum, audio availability, color tags, decode without fatal errors.

**Pass 2 — temporal integrity.** Per-frame PTS monotonicity and expected interval after conform; frame count; first/last image; continuity at every clip boundary. Flag unexpectedly repeated decoded frames but treat legitimate stillness separately.

**Pass 3 — action causality.** Every planned force, contact, object displacement and response appears in the correct order; actor weight and object inertia feel plausible; no backward teleporting.

**Pass 4 — identity/geometry.** Face, hands, wardrobe, architecture, prop size/text and camera-space positions remain stable through each action and edit. Scrub especially around fast contacts.

**Pass 5 — final audience context.** Watch at delivery rate with audio, in the actual sequence and crop. Technical timing can be perfect while the scene's pause is dramatically wrong.

Each pass has distinct reviewers. A machine can check timestamps precisely; it cannot certify the semantic adequacy of the last glance by arithmetic.

## Practical red flags that deserve immediate review

- A hand clearly presses a prop, but the prop moves two frames before contact.
- An expression freezes in a mechanically identical pose during what should be a continuous reaction.
- The face or lettering briefly reassembles at a cut-adjacent frame.
- A source clip is reported as VFR but inserted into a CFR timeline with no conform receipt.
- The final MP4 has more frames than the input storyboard count without intentional holds.
- A sound event is attached to a frame index from an earlier version of the shot.
- The last narrative beat exists in the AI preview but was trimmed from the delivery export.

These are failure *hypotheses*. Prove them with actual frames, PTS and playback before prescribing a fix.

## Hand-off format for editors and production agents

The following small schema is a proposed representation, not a standardized EDL:

```json
{
  "shot_id": "DEMO-S04",
  "fictional_example": true,
  "target_fps": {"num": 25, "den": 1},
  "target_frames": 150,
  "allowed_retime": "review_required",
  "protected": ["performer_identity", "envelope_geometry", "table_layout"],
  "events": [
    {"name": "push_start", "target_frame": 25},
    {"name": "catch_complete", "target_frame": 104},
    {"name": "look_up", "target_frame": 130}
  ],
  "source_pts_status": "unmeasured",
  "qc_status": "NOT_EXECUTED"
}
```

Explicitly marking `NOT_EXECUTED` is better than publishing a fictitious green check. An editor can fill the actual receipt after source inspection and final conform.

## Primary source map

| Source | Owner | What it supports | What it does not support |
|---|---|---|---|
| [ffprobe documentation](https://ffmpeg.org/ffprobe.html) | FFmpeg | Frame/stream metadata and inspection interfaces | Semantic motion or artistic approvals |
| [FFmpeg filters, including fps](https://ffmpeg.org/ffmpeg-filters.html) | FFmpeg | Explicit frame-rate conversion and temporal filtering | A claim that converted frames preserve original motion without artifacts |
| [FFmpeg concat demuxer](https://ffmpeg.org/ffmpeg-formats.html#concat-1) | FFmpeg | File concatenation timestamp/duration caveats | Arbitrary broken-source PTS recovery |
| [objekts Field Note on physical causality](physical-causality-generative-video.md) | objekts | Beat planning and force/contact logic | Frame-accurate verification without decoding footage |

**Our contribution:** fictional six-second beat map, three clocks, five-pass QC, action-first edit diagnosis and proposed handoff schema. No executable pipeline or rendered test result is asserted in this article.

The real unit of quality in generative video is neither the prompt nor the pretty still. It is the delivered **sequence of decisions and consequences, at the correct times**, signed off in the correct timeline.

---

*[objekts](https://objekts.ai) — generative video, commercial AI/VFX, post-production and cinematography-led motion. [Portfolio](https://objekts.ai/en/work/) · [Talk production](https://objekts.ai/en/contact/).*
