# LIVE-01 / LIVE-03: public sources and evaluation gaps (27 October 2026)
**Owner:** 36.4 public technical community outreach; potential transfer to realtime-broadcast R&D. **Desk review only**, no local sports demo, latency measurement or client production.

## Candidate technologies
1. [Robust Video Matting (RVM)](https://github.com/PeterL1n/RobustVideoMatting) / [IPCV mirror](https://github.com/IPCV/VideoMatting): recurrent human matting; author's published throughput figures concern tensor inference, not full live ingest/decode/encode. Its public repository release warns **GPL-3.0**: check exact model/code licensing and commercial integration before embedding. Humans only; do not assume ball/field lines/scoreboard protection.
2. [MatAnyone / MatAnyone 2](https://github.com/pq-yang/MatAnyone) and [MatAnyone 2 project](https://pq-yang.github.io/projects/MatAnyone2/): prompted human matting, quality/temporal edges; inspect current weights, licensing and GPU deployment. Accuracy leaderboards cannot substitute for measured latency or streaming stability.
3. [SAM 2](https://ai.meta.com/blog/segment-anything-2-video/): prompted object tracking/segmentation with open research implementation, announced Apache 2.0 release; practical video stream topology and end-to-end inference benchmark still required.
4. [SAM-MT paper](https://arxiv.org/abs/2607.08688) (July 2026): claims >36FPS for ten targets under paper conditions. No local reproduction, software/license/weights not validated here; candidate for multi-target latency scaling.
5. [Sony Ocellus real-time camera tracking](https://www.broadcastnow.co.uk/tech-innovation/sony-ocellus-brings-marker-free-ar-tracking-to-live-sports/5220437.article), IBC September 2026 demonstration: SLAM/sensor+encoder tracking with Unreal integration for on-air AR. A possible **tracked camera data** reference, not a tested sports environment removal/replacement solution.
6. [Fast sports segmentation experiment](https://github.com/abhimanilal/fast-sports-segmentation): expressly warns one chosen NVIDIA model carries a **noncommercial research** license and suggests sparse detections + propagation. That license blocks an assumption of turnkey commercial broadcast use.

## Discriminating experimental gates
- **Cameras:** 2+ actual feeds with rapid live cuts, lens zoom/focus/focal metadata, geometry/SLAM uncertainty. Separate tracking measurement from keying.
- **Protected truth:** players, referees, ball, field markings, goals, broadcast clocks/scoreboards and audio are from originals. Define pixel-mask ROI and alpha boundaries; never synthesize gameplay.
- **Hardware:** report decode→segment→track→render→key→graphics→encode, per-stage and end-to-end latency distribution, dropped frames, VRAM, GPU model and frame-size 1080p25/50. A paper's raw network FPS does not prove live output p95.
- **Failure cases:** close players crossing, streaking ball, net/transparent edges, camera cut, aggressive zoom, replay insert, score transition, frame/PTS discontinuity. If confidence is low, pass through untouched source.
- **Business/legal:** distribution rights, model-code license, sponsor/league restrictions, branded text validation, operator override.

## Question to researchers
Which *actually executed* broadcast topology combines a calibrated camera track, low-latency foreground/player + small-object masks, deterministic prebuilt 3D background, compositing, score protection and fallback? Please include a latency histogram, not only advertised FPS; precise version/commit, license and reference footage rights.

This note may be cited in a context-relevant technical discussion. It is first-party research by objekts.ai; it is not evidence a realtime sports environment replacement MVP exists.
