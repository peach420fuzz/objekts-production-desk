# A Periodic Source Can Acquire a Boundary Outlier After Encoding

*objekts · AI-assisted first-party lab note · measured 13 November 2026; publication packet reviewed 16 November 2026*

One original four-second image sequence produced two different boundary signatures after H.264 encoding. With `-g 96`, the decoded last-to-first RGB difference exceeded every ordinary adjacent difference in that export. With `-g 1`, it fell within that export's ordinary range, although its absolute boundary difference was larger. The source pictures and animation were unchanged between those encodes.

This is a small measured file example, recorded locally on 13 November. It extends the delivery check in our [earlier loop-design note](https://github.com/peach420fuzz/objekts-production-desk/blob/main/editorial/articles/seamless-generative-video-loop-boundary-world-state_ru.md), whose examples were explicitly illustrative. It does not establish a perceptual seam threshold or a preferred encoding preset.

## Keep the source boundary visible in the evidence

The fixture has 96 original procedural pictures, 640×360 at 24 fps, with no audio. Soft ellipse fields move on periodic paths using `2*pi*(frame % 96)/96`. A separately generated control at index 96 had the same RGB hash as source frame 0. That control was excluded from the 96 exported pictures.

Frames 95 and 0 remain different. They represent consecutive moments around a moving cycle. Appending a duplicate frame 0 would add another displayed interval; matching the control state at index 96 serves a different purpose from duplicating an exported endpoint.

All 96 source frames had distinct RGB hashes. Both encoded four-second clips fully decoded to 96 distinct RGB frames. Source identity, successful decode and the boundary measurement were recorded separately.

## Measure the join against its own neighbours

For each representation, we measured mean absolute difference over RGB bytes in the moving image region: all x coordinates and rows 34 through 326 inclusive. Fixed caption bars were excluded. Coordinates are half-open `[0, 34, 640, 327]`.

For two pictures A and B, the measure is `sum(abs(A-B)) / (640*293*3)`. It is expressed in 8-bit RGB code-value units. It is not a percentage, optical-flow estimate, luminance-only score or measure of geometric displacement.

Each row below contains 95 ordinary adjacent transitions, `0→1` through `94→95`, plus the separate `95→0` join. Values are rounded here; the [measurement snapshot](measurements.json) preserves the earlier recorded precision.

| Representation | Join MAE | Ordinary minimum | Ordinary median | Ordinary maximum | Join / own median |
| --- | ---: | ---: | ---: | ---: | ---: |
| Original RGB | 0.212118 | 0.199147 | 0.221749 | 0.250453 | 0.956568 |
| H.264, `-g 96` | 0.375556 | 0.223981 | 0.263657 | 0.300110 | 1.424412 |
| H.264, `-g 1` | 0.395712 | 0.304688 | 0.337603 | 0.408170 | 1.172123 |

The source join was within its ordinary range. The `-g 96` join exceeded its own maximum. The `-g 1` join returned inside its own range, while the ordinary differences also increased. A dashboard showing only the lower relative ratio could conceal that change in baseline. A dashboard showing only the absolute join value would miss the first export's relative outlier.

These are descriptive comparisons over this short sequence. We did not estimate a population distribution, perform a statistical significance test or establish what a viewer could detect.

## Change one requested option and retain both files

The saved commands and source scripts request `libx264`, preset `medium`, CRF 14, `yuv420p`, no B-frames and a video track timescale of 12,288. The stored container metadata identifies `Lavf63.1.102`; a complete original FFmpeg/libx264 build record was not retained. The requested maximum GOP size changed from 96 to 1. FFmpeg's [libx264 option documentation](https://ffmpeg.org/ffmpeg-codecs.html#libx264_002c-libx264rgb) describes `g` as the maximum GOP size and `bf` as the B-frame setting. A maximum does not promise an exact keyframe spacing for arbitrary inputs.

The two local files were 76,461 and 485,507 bytes respectively. Holding the CRF option constant did not hold file size or reconstructed pixels constant. We did not isolate every internal encoder decision or prove that a particular prediction/quantization mechanism caused the difference.

The [README](README.md) supplies the original procedural generator, commands and a small measurement script. After generating the pictures, the two encode commands differ only at `-g` and the destination name:

```sh
ffmpeg -hide_banner -v error -nostdin -n -framerate 24 \
  -i frames/frame_%03d.ppm -frames:v 96 -c:v libx264 \
  -preset medium -crf 14 -pix_fmt yuv420p -bf 0 -g 96 \
  -video_track_timescale 12288 -movflags +faststart gop96.mp4

ffmpeg -hide_banner -v error -nostdin -n -framerate 24 \
  -i frames/frame_%03d.ppm -frames:v 96 -c:v libx264 \
  -preset medium -crf 14 -pix_fmt yuv420p -bf 0 -g 1 \
  -video_track_timescale 12288 -movflags +faststart gop1.mp4
```

These portable commands use `-n` to preserve an existing output. The historical commands used `-y`; local paths, destination names and the equivalent log-level spelling are also adapted for this bundle. The requested media options are preserved. The portable bundle was source/syntax checked, without running another render, encode or decode during publication preparation.

For measurement, decode each export to RGB24 with `-fps_mode passthrough`; retain dimensions, pixel format and frame count beside the raw bytes. FFmpeg documents [passthrough and its timestamp caveats](https://ffmpeg.org/ffmpeg.html#Advanced-options) and the [headerless raw-video format](https://ffmpeg.org/ffmpeg-formats.html#rawvideo). The metric compares decoded samples in the selected representation. It cannot establish timestamp correctness from a headerless byte file.

## Preserve the unanswered viewing question

The historical command receipts record that both earlier exports and their three-repeat wrappers decoded without fatal errors. Selected decoded contact-sheet pictures and each `95→0→1` triptych were inspected at that time. Those stills showed no gross positional jump in the abstract shapes. The inspection receipt does not claim that every frame was visually reviewed.

No continuous motion playback, target-player restart test, blind audience review or audio listening was performed; the fixture has no audio stream. A three-repeat file decoding successfully does not test a player's restart delay. RGB MAE also depends on the selected region, colour representation and content; a small localized defect can be diluted by an average.

The actionable result is a reason to inspect an exported boundary: keep source and decoded measurements, show ordinary transitions beside the join, and retain absolute values when reporting ratios. Final visual acceptance still requires the intended playback context and creative review.

All pictures and code are original synthetic material. The [manifest](manifest.json) identifies the earlier local files and source receipts. No binary clip or image is included or offered as a download. There is no client result, independent human review, production acceptance or universal claim that all-intra encoding improves loops. The note adds no Field Note number or adopted craft rule.
