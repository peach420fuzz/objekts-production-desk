# Decoded loop-boundary comparison

AI-assisted, first-party original synthetic lab material by objekts. Read [the full note](ARTICLE_EN.md), [historical measurements](measurements.json) and [manifest](manifest.json).

This directory contains UTF-8 text only. No video, image or raw RGB download is provided. Historical values came from local exports on 13 November 2026; this text-only publication packet was completed on 16 November 2026. The portable scripts below were statically checked while packaging; they were not media-executed again. Your reproduction must retain its own result and build information.

## Reproduce locally

Use Python 3.9+ and an already installed FFmpeg/ffprobe with libx264 and support for `-fps_mode passthrough`. No pip package, network, external media or font is needed. Commands create local files without playing sound or opening a player.

Generate a new `run` directory:

```sh
python3 generate_frames.py --out run
cd run
ffmpeg -version > ffmpeg-version.txt
ffprobe -version > ffprobe-version.txt

ffmpeg -hide_banner -v error -nostdin -n -framerate 24 \
  -i frames/frame_%03d.ppm -frames:v 96 -c:v libx264 \
  -preset medium -crf 14 -pix_fmt yuv420p -bf 0 -g 96 \
  -video_track_timescale 12288 -movflags +faststart gop96.mp4

ffmpeg -hide_banner -v error -nostdin -n -framerate 24 \
  -i frames/frame_%03d.ppm -frames:v 96 -c:v libx264 \
  -preset medium -crf 14 -pix_fmt yuv420p -bf 0 -g 1 \
  -video_track_timescale 12288 -movflags +faststart gop1.mp4

ffprobe -v error -count_frames -select_streams v:0 \
  -show_streams -show_frames -show_format -of json gop96.mp4 > gop96-probe.json
ffprobe -v error -count_frames -select_streams v:0 \
  -show_streams -show_frames -show_format -of json gop1.mp4 > gop1-probe.json

ffmpeg -hide_banner -v error -nostdin -xerror -n -i gop96.mp4 \
  -map 0:v:0 -fps_mode passthrough -pix_fmt rgb24 -f rawvideo gop96.rgb
ffmpeg -hide_banner -v error -nostdin -xerror -n -i gop1.mp4 \
  -map 0:v:0 -fps_mode passthrough -pix_fmt rgb24 -f rawvideo gop1.rgb

python3 ../measure_decoded.py --work .
```

[generate_frames.py](generate_frames.py) preserves the original pixel functions. It writes frames 0–95 and a separate endpoint control at 96. The control stays outside the encoded image-sequence pattern. [measure_decoded.py](measure_decoded.py) reads the source PPM and decoded raw RGB, checks exact lengths and uses the earlier comparison arithmetic on rows 34–326. It never invokes an encoder or player. It refuses to replace `REPRODUCTION_RESULT.json`.

Inspect your two probes for decoded counts and timing. The raw RGB metric has no timestamps and cannot replace that inspection. The original full FFmpeg/libx264 build record was not retained; stored container metadata identifies `Lavf63.1.102`. Codec/build and platform changes may change pixels, file hashes and metrics. A reproduction differing from the historical snapshot is a new observation, not automatically a perceptual failure.

This fixture is silent and deliberately abstract. No target-player test, continuous playback, blind perceptual test, client or production approval is claimed. Equal endpoint controls, correct counts and comparative MAE do not certify a seamless delivered loop.
