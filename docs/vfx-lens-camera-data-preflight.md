# Lens, plate and on-set data preflight for VFX shoots

**Practical reference by [objekts](https://objekts.ai/)** — independent AI/VFX, CGI and hybrid film production studio. Published openly 2026-10-26. This reference is educational and is not an on-set safety plan, a universal platform deliverable, or a replacement for the production's appointed VFX supervisor and camera/post supervisors. A commissioned, shot-specific preparation and technical review is a separate paid service.

## The core production decision

You cannot recreate an unrecorded lens state, original camera media, accurate physical interaction, or missing background plate by writing a better prompt. A **capture item is valuable only when a named downstream task depends on it and someone is assigned to acquire and verify it**. Avoid unscoped "collect everything" instructions: they waste crew time and still omit the item the compositor needs.

For each VFX shot, create a row with: stable `shot_id`, script/board revision, intended VFX operation, recommended method, exact image/timebase requirements, camera/lens assumptions, capture item, operator, when captured, verification, destination and fallback.

### Decision matrix: requirement → on-set evidence

| Downstream task | Pre-shoot question | Capture or test to **consider** | Acceptance / failure boundary |
| --- | --- | --- | --- |
| Reconstruct camera motion / add 3D set extension | Is motion/parallax consistent with an observable camera, and will the physical geometry be stable? | Camera originals, slate/shot/take & timing, focal/focus/iris/zoom and lens ID, sensor recording mode, surveys/set distances, lens distortion calibration; tracking fiducials if shot needs them | Trial solve on representative plate, checked against known points and held-out details; log fit errors and ambiguous scale, not just solver green light |
| Replace/remove signage, buildings, crowds or rigs | Can any underlying content be recovered, and is there sufficient unobstructed coverage? | Clean plates, texture/tile references, stills from adjacent positions, compatible exposure/focus and adequate handles | Test hardest occlusion, edge blur, camera movement, moving shadows/reflections; if the background cannot be physically recorded, plan CG reconstruction |
| Integrate reflective/refractive products or CG objects | Does the inserted material need scene-true highlights, contact shadows and interactions? | Shot/setup-specific illumination reference (HDRI where justified), diffuse/specular spheres or gray/chrome references, linear color reference/chart, practical prop dimensions/materials; exposure brackets and reference orientation | Compare specular lobe, highlight movement, roughness, contact and foreground color under shot light; a generic HDRI may not represent moving practicals |
| Roto/composite hair, fabric, motion-blurred foreground | What crosses in front of the effect, and can edges be retained? | Original high-quality camera source, edge-critical takes, optional additional clean background/witness view, practical interaction and spill references | Multi-frame matte/composite at intended shutter/ISO/grade; preserve true performer identity and motion; no assumption of perfect AI segmentation |
| LED/virtual production | Will shutter, tracking, refresh, frustum and lens/display color cause artifacts? | Test camera and exact display/renderer setup, calibration and color path, shutter/refresh, lens and LED wall geometry/moire sample | Camera-shot moving sequence at target settings, not screen-captured demo; record which subsystem owns corrections |
| Generative background, atmosphere, invisible enhancement | Is change bounded, and what must remain physically exact? | Approved actual footage/clean plate, locked foreground geometry, motion/lighting reference, provenance/usage rights | Temporal and parallax evaluation over a representative shot; static image is not motion proof; retain a deterministic fallback |
| Multi-vendor editorial to finishing | Can every material be traced to source and conform correctly? | Original camera files and matching transfer/manifests, scene/take/timecode, frame rate, sensor mode, framing metadata, applicable lens/grade transforms, OCIO/ACES/AMF/CDL/FDL instructions if show uses them | Full small loop: source → dailies → editorial EDL/AAF/XML → VFX pull → reviewed comp → conform; confirm framing, color, duration, metadata and naming across departments |

This matrix lists potential items, **not mandatory captures for every shot**. The appointed production stakeholders establish priorities and show-specific specs.

## Camera, lens and timebase card: exact fields

For each shot or setup, record the **observed or approved** values below, explicitly marking `UNKNOWN` when missing. Do not fill from a model's memory of a camera system.

```yaml
shot_id: SC032_SH004
script_revision: R7                        # fictional example key
method: hybrid_CG_environment
camera_body: UNKNOWN                     # exact model / body ID
recording_format: UNKNOWN                # RAW/log, codec, resolution and bit depth
recording_sensor_mode: UNKNOWN           # crop, anamorphic, open-gate or other mode
frame_rate_fps: UNKNOWN                  # specify rational timebase if fractional
shutter: UNKNOWN                         # angle/time; rolling behavior if relevant
lens_make_model_serial: UNKNOWN
focal_length_mm: UNKNOWN                 # actual, not guessed from framing
zoom_position: UNKNOWN                   # if zoom lens
focus_distance: UNKNOWN                 # units, measured/read if possible
iris_t_stop: UNKNOWN                     # log actual marking; not assumed f-stop
lens_distortion_profile: PENDING_TEST
anamorphic_squeeze: UNKNOWN
stabilization_mode: UNKNOWN              # in-body/lens/post stabilization status
camera_mount_and_tracking: UNKNOWN
camera_height_and_set_reference: UNKNOWN
white_balance_iso: UNKNOWN
framing_and_de_squeeze: PENDING_LOOP
color_pipeline_and_luts: PENDING_SHOW_SPEC
source_timecode_and_sync: UNKNOWN
clean_plate: PENDING_SHOT_PLAN
hdr_reference: CONDITIONAL
capture_owner: UNASSIGNED
qc_owner: UNASSIGNED
handoff_storage_and_manifest: UNASSIGNED
```

Do not treat the fictionally labelled example as captured evidence or a recommended camera setup. Record actual values from DIT/camera reports and lens metadata where available, then cross-check with picture and slate. A lens marking is an input, not a verified geometric calibration.

## Lens and optics planning: the non-obvious checks

1. **Same focal length is not the same projection.** Camera height, sensor mode, crop, lens optical distortion, squeeze, focus, breathing, post stabilization and framing/crop also control geometry. Confirm all when critical to extensions/matchmoves.
2. **Lens distortion is a function of the actual lens and settings.** A nominal 40 mm value or LUT from another serial number does not prove the current plate's distortion, especially with variable focus/zoom and anamorphic optics. Coordinate any charts and a representative capture with the appointed lens/data team.
3. **Rolling shutter and aggressive motion** can invalidate a naive rigid/global solve. Test fast pans, whip moves, drones and high-frequency vibration with the intended acquisition settings. Plan altered blocking, a different camera path or an advanced solve when necessary.
4. **Motion blur, depth of field and bloom** change both tracking observability and compositor integration. Note shutter, moving subject/camera speed, focal distance, iris and focus pulls. A sharp clean chart alone does not represent a blurred tracking plate.
5. **Original vs derived framing matters.** Slate, source crop, anamorphic desqueeze, stabilisation and editorial reframing can change where the pixels belong. Save authoritative framing transforms and test an end-to-end source-to-VFX-to-conform roundtrip.
6. **Do not claim millimetre-perfect survey without measurement.** Document coordinate origin, units, reference photos, observed dimensions, tolerances and scan registration accuracy when reconstruction genuinely needs them.

## On-set collection plan: assign a reason and a recipient

| Item | Trigger | Owner to nominate | Receipt / acceptance check |
| --- | --- | --- | --- |
| Original footage and editorial identity | All VFX-designated takes | Camera/DIT/production editorial | Card/reel identity, checksum/transfer policy, scene-take-timecode match |
| Clean plate | Removal, replacement, keying or complex behind-subject comp | 1st AD, camera, VFX data lead as show directs | Same camera setup and relevant movement/lighting; labelled plate and take |
| Witness camera | Ambiguous action, fast spatial motion, difficult occlusion or interaction | VFX supervisor/production camera | Orientation, sync/clock reference, calibration/registration method, frame coverage |
| Lighting/HDR reference | CG integration/reflection-critical inserts | VFX data lead/lighting | Correct shot/location/lighting state, dynamic range and orientation evidence |
| Color chart and gray/chrome reference | Show color protocol and photometric matching demands | Camera/DIT/VFX data lead | ID, setup/take, camera space, known processing chain; not beauty-grade JPEG alone |
| Measurements / LiDAR / photogrammetry | CG set match, tracked object, large extension | Survey/scanning vendor appointed by production | Scale control, coordinate convention, scan completeness and accuracy report |
| Lens calibration | Critical camera matching, variable lens/zoom/focus, specialty lens | Camera/lens department with VFX supervisor | Recorded lens serial + state, matching chart dataset and reproducible solve |
| Rights / consent / source provenance | AI-assisted or licensed source usage; identifiable people/assets | Legal/production | Allowed use, retention, provider handling and approval path documented |

**Acceptance is not collection.** An HDR panorama without orientation, a clean plate with changed lighting, a LiDAR scan with unknown scale, or a lens grid with mismatched focal state may be expensive yet unusable. Have the downstream vendor name its minimum viable data **before the shoot** and perform a small test against that requirement.

## Loop test: before the first important VFX shooting day

Select one shot representing each **distinct camera format/path**, especially unusual cameras (drone, crash camera, slow-motion, miniature, underwater, phones). Execute a tiny representative path:

1. Record camera-original source, slate/timing, camera report and ancillary sidecar data.
2. Apply the intended DIT/dailies normalization, de-squeeze, display/look metadata; preserve the actual reference appearance and source provenance.
3. Send a short proxy or editorial ingest through the intended edit system, ensuring scene/take naming, handles, timecode and ratio survive.
4. Pull an actual VFX plate with the project-prescribed color space/precision; compare geometry, framing, aspect, channel values, metadata and timebase to authoritative inputs.
5. Return a one-frame and moving-shot VFX test with its color/look metadata through editorial/finishing. Confirm the same visible result and exact correct sequence position.
6. Sign off with named owner, test-media hash/checksum policy, version, issue list and whether the result is provisional or accepted.

Platform-specific requirements vary. For context, Netflix's partner documentation describes loop tests to catch end-to-end changes in image, color, metadata, framing and naming; Netflix's own MPS post describes ACES Metadata Files, Framing Decision Lists and auditability in camera-file processing. This is not a statement that every production uses Netflix's exact deliverable spec.

## Failure classes and pre-shoot remedies

- **No accurate lens/camera record** → fail closed on guaranteed tracking/geometry claims; request chart/test or reconsider composition and movement before shooting.
- **No usable clean plate** → evaluate CG/paint/reconstruction costs, reshoot feasibility, or revised camera/subject blocking; do not promise generic fill will solve motion, occlusion and reflections.
- **Bad HDRI / wrong lighting state** → supplementary photography or physically motivated lighting reconstruction with uncertain cost; reflective integration may need re-design.
- **Color transform ambiguity / changed edit framing** → stop silent double-transform; perform a controlled VFX loop test and record exact OCIO/ACES/AMF/CDL/FDL path when applicable.
- **Generative result changes identities, text or spatial relations** → move critical pixels to deterministic comp/CG/practical elements, test multiple frames and build a fallback.
- **Confidential material uploaded without production clearance** → stop, establish owner/rights/storage and provider policy before further external processing.

## What an independent paid pre-shoot review can actually deliver

A remote consultant can work from a rights-cleared **script or sequence extract, boards, creative intent, camera/optics list, location/stage conditions, timing and delivery specs**, then produce a versioned shot breakdown, method alternatives, at-risk shot tests, camera/capture instructions, questions for production departments, and a handoff / escalation map. Real-world data collection, shooting, certified survey, safety and physical on-set supervision remain separate crew/production tasks.

For an optional *commissioned* shot-specific technical VFX-preparation review: [objekts](https://objekts.ai/), [cinema/episodic VFX](https://objekts.ai/services/film-series-vfx), **salute@objekts.ai**. This guide is first-party studio-authored marketing/education, not independent endorsement or proof that an actual production hired the studio.

## Primary technical references

- [Visual Effects Society — On-Set VFX Data Collection and Usage Guide, announced 30 April 2026](https://vesglobal.org/press-releases/on-set-vfx-data-collection-and-usage-guide/) — source of industry data taxonomy and cross-department usage rationale (the guide is CC BY 4.0; this page is separately authored rather than reproducing it).
- [VES On-Set Data Guide v1.0.0 PDF](https://ves-on-set-data.org/data/On-Set_VFX_Data_Collection_and_Usage_Guide_v1.0.0.pdf) — detailed categories and workflow.
- [Netflix Technology Blog — Scaling Camera File Processing at Netflix, 24 April 2026](https://netflixtechblog.com/scaling-camera-file-processing-at-netflix-6dab2b1e80be) — camera metadata, automated VFX plate paths, ASC framing metadata, ACES/AMF, and validation.
- [Netflix Studio Partner — VFX Pull & New Masters guidance](https://studiopartner.netflix.net/studio/vfxpulls-newmasters) — the platform's own loop-test explanation, subject to show-specific requirements.
