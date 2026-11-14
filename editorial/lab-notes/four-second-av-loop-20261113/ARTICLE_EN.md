# Four Seconds, 189 AAC Packets, 192,000 Decoded Samples

*objekts · original synthetic production R&D · 13 November 2026 · AI-assisted first-party study*

A four-second delivery has several counts worth preserving: compressed audio packets, decoded audio frames, decoded samples and video frames. In this small experiment, an AAC/MP4 export contained 189 audio packets yet decoded to exactly 192,000 mono samples. A PCM/MOV export returned the same sample count and reproduced the original PCM bytes. Both retained all 96 video frames and their rational presentation times.

These are measured file results. We did not listen to the sound or test continuous playback, perceptual seamlessness or synchronization in a player.

## The deliberately awkward input

The inputs were entirely original: a procedural soft-cloud image sequence, already encoded as a four-second 640×360 H.264 video at 24 fps, and a newly authored calibration signal. The scene was not rendered again for this test. No client footage, speech, third-party music, generative model or downloaded media was involved.

The sound contains 192,000 signed 16-bit mono samples at 48,000 Hz: exactly 384,000 PCM bytes. Its component frequencies are 173, 287 and 431 Hz, with a four-second amplitude envelope. The source is a known signal, not a recording of a physical acoustic event.

The chosen duration leaves `192000 % 1024 = 512`. It therefore exercises a partial final AAC frame in this encoder configuration. It would be wrong to assume the decoded length merely by multiplying a packet count by 1,024.

## Export with explicit stream selection

The measured run used FFmpeg and ffprobe **9.0.2**. This bundle ships text only. [Generate the original synthetic inputs locally](README.md#reproduce-locally) as `loop.mp4` and `tone.wav`; the reported numbers below come from the earlier local exports. The export options were:

```sh
ffmpeg -hide_banner -v error -nostdin -y \
  -i loop.mp4 -i tone.wav -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a aac -b:a 128k -ar 48000 -ac 1 \
  -movflags +faststart aac.mp4

ffmpeg -hide_banner -v error -nostdin -y \
  -i loop.mp4 -i tone.wav -map 0:v:0 -map 1:a:0 \
  -c:v copy -c:a pcm_s16le -ar 48000 -ac 1 \
  -movflags +faststart pcm.mov
```

`-map` selects the existing video and the WAV audio. `-c:v copy` transfers the compressed video stream; the audio codec is chosen separately. This follows FFmpeg's documented [streamcopy and stream-selection behavior](https://ffmpeg.org/ffmpeg.html#Streamcopy). No explicit duration clamp or trimming filter was applied. The WAV already matched the requested 48 kHz mono audio configuration.

`+faststart` moves the MOV/MP4 index toward the start of the file. It is a container-layout operation, not evidence of gapless playback. The flag is described in the official [MOV/MP4 muxer documentation](https://ffmpeg.org/ffmpeg-formats.html#MOV_002fMPEG_002d4_002fISOMBFF-muxers); it was also checked in the installed muxer help.

## What the actual exports returned

| Observed property | AAC/MP4 | PCM/MOV |
| --- | ---: | ---: |
| Audio codec reported | AAC LC | pcm_s16le |
| Container duration | 4.000000 s | 4.000000 s |
| Audio packets | 189 | 188 |
| Decoded audio frames | 188 | 188 |
| Final decoded audio frame | 512 samples | 512 samples |
| Sum of decoded `nb_samples` | 192,000 | 192,000 |
| Raw decoded mono PCM16 bytes | 384,000 | 384,000 |
| Decoded waveform equals source bytes | No | Yes |
| Decoded video frames | 96 | 96 |
| Video packet payloads and rational PTS/durations preserved | Yes | Yes |

The AAC audio time base was `1/48000`. Its first encoded packet had PTS −1024 and `skip_samples=1024`. Its last packet had PTS 191488 and `discard_padding=512`. The first returned audio frame started at PTS 0; the last returned frame contained 512 samples. For these files, the accounting is:

`189 × 1024 − 1024 priming − 512 padding = 192000 decoded samples`.

This arithmetic starts from full codec-frame slots. The last packet's reported duration was already 512 samples; subtracting its padding again from that presentation duration would count the trim twice.

Both packet coverage and decoded-frame coverage ended at exactly `192000/48000 = 4` seconds. The decoder emitted no extra tail samples. That result depends on the actual metadata and decoder behavior observed here; it is not a guarantee for every AAC file, muxer or player.

The stream-level `nb_frames` field was 189 for AAC and 192,000 for PCM. Treating that field as one universal unit would conflate different codec representations. We retained packet records, decoded frame records and actual decoded bytes separately.

## Inspect the edges, then count decoded output

These commands expose the packet metadata and actual audio-frame sample counts. FFprobe documents the distinct [packet, frame, stream and payload-hash views](https://ffmpeg.org/ffprobe.html#Main-options).

```sh
ffprobe -v error -show_packets -show_streams -show_format \
  -show_data_hash sha256 -of json aac.mp4 > aac-packets.json

ffprobe -v error -select_streams a:0 -show_frames \
  -show_entries frame=pts,best_effort_timestamp,duration,nb_samples,sample_rate,side_data_list \
  -of json aac.mp4 > aac-frames.json

ffmpeg -hide_banner -v error -nostdin -xerror -y -i aac.mp4 \
  -map 0:a:0 -vn -c:a pcm_s16le -f s16le aac.raw
```

For this mono PCM16 output, the raw sample count is `Path("aac.raw").stat().st_size // 2` in Python. Verify the byte length is divisible by two. Repeat the inspection and decode for `pcm.mov`. Keep the channel count explicit: this simple division is a mono calculation.

Video was checked at two levels. FFprobe packet payload hashes/sizes were compared with the existing video source, and each packet's PTS/duration was compared as an exact rational value. Independently decoded RGB hashes also matched for all 96 frames. The video time base remained `1/12288`, with 512-tick presentation steps, or `1/24` second.

The executed RGB check used this command for each export and compared its 96 output hashes with the retained source decode:

```sh
ffmpeg -hide_banner -v error -nostdin -xerror -i aac.mp4 \
  -map 0:v:0 -an -pix_fmt rgb24 -f framehash -hash sha256 -
```

The [framehash muxer](https://ffmpeg.org/ffmpeg-formats.html#framehash) records hashes of the selected output packets. Here the selected output was decoded RGB24. Compressed packet hashes, decoded image hashes and timestamps remain separate evidence.

## Equal duration still leaves a listening question

AAC changed the signal values. Its RMS difference from the source was 21.970479 in signed PCM16 units over 192,000 samples. Its last-to-first sample step was 184 units; the source and PCM/MOV step was 158. The largest ordinary adjacent AAC step was 172. These numbers describe sample values, not audibility.

No speaker output, listening panel, hardware clock comparison or real-time A/V playback test was performed. Exact sample counts and preserved timestamps do not establish a perceptually invisible seam or zero playback drift. Priming and padding samples also are not authored edit handles.

The [recorded measurements](evidence/measurements.json) and [manifest](evidence/manifest.json) describe the earlier local files. Binary clips, WAV and raw PCM are not included or offered as downloads; the scripts regenerate inputs and measure new exports locally. The source PCM SHA256 is `71a03c8397e7611cac7bbd581ebecf720483c7a36ba95a3802b1d24c1d516e0a`. These digests identify the tested files; other builds need their own receipts. The note reuses existing measurements; the portable scripts were statically checked without another media run during packaging. It claims no client result, prior workshop, independent human review or production acceptance.
