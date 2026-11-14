# Four-second audio/video delivery experiment

This is a UTF-8 text-only companion to [Four Seconds, 189 AAC Packets, 192,000 Decoded Samples](ARTICLE_EN.md), an AI-assisted first-party study by objekts on 13 November 2026.

The [recorded measurements](evidence/measurements.json) came from earlier local synthetic exports. No binary video, WAV or raw PCM is included or offered for download. The source code here creates the original procedural inputs locally, then exports and inspects new files. This is a scientific reproduction fixture, not a client clip, a production system or a prior workshop.

## Reproduce locally

Use Python 3.9+ and an already installed FFmpeg/ffprobe with `libx264`, AAC and `pcm_s16le`. The original local run used Python 3.12.16 and FFmpeg/ffprobe 9.0.2. There are no pip dependencies, network requests, models, downloaded fonts or media. The scripts write files and never play audio through speakers.

From this directory, choose a work directory that does not already exist:

```sh
python3 generate_sources.py --out run
python3 measure_exports.py --work run
```

[generate_sources.py](generate_sources.py) writes 96 original PPM frames, a 640×360/24 fps/four-second H.264 input and exactly 192,000 mono PCM16 samples in a 48 kHz WAV. Its pixel functions and PCM arithmetic preserve the earlier authored construction. The video encoding uses the earlier all-intra options.

[measure_exports.py](measure_exports.py) copies that video's compressed stream while encoding AAC/MP4 and PCM/MOV audio. It records packet/frame metadata, decoded PCM byte counts, priming/discard side data, rational time coverage and decoded RGB hashes. It compares both outputs against a decode and packet signature of the generated video input. Inspect `run/RESULT.json` and the adjacent JSON/framehash records. To use individual CLI examples from the article, run them inside your work directory.

The portable scripts were syntax-checked and compared with the earlier source while preparing this text bundle. They were not media-executed again in this packaging stage. Reported numbers refer to the earlier local run; your environment produces its own receipt. Neither script forces the historical AAC packet/sample outcome or treats a mismatching local result as perceptual failure.

## Recorded result and limits

For the historical run, AAC had 189 packets, a 1,024-sample priming skip and a 512-sample discard tail. Its 188 decoded audio frames contained exactly 192,000 samples. PCM/MOV returned the same count and matched the source PCM bytes. Both exports preserved 96 decoded video frames, compressed packet payloads and rational presentation times. The [manifest](evidence/manifest.json) identifies those local files by hash.

The inputs are original procedural pixels and a calibration signal without speech or third-party music. No client or closed-project media is part of this bundle. Equal counts and preserved timestamps do not establish perceptual seamlessness, player-independent gapless delivery or zero playback drift. No listening, continuous playback, human review or production acceptance is claimed.

The linked FFmpeg documentation in the article supports CLI meaning. Historical measurements and generated reproduction results remain separate records; codec and platform differences need their own interpretation.
