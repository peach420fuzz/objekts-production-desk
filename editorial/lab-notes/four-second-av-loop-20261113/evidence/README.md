# Recorded local measurements, not binary downloads

[measurements.json](measurements.json) contains the already executed four-second synthetic A/V case, including first/last audio packet side data, decoded sample counts and video equality results. [manifest.json](manifest.json) identifies the earlier local source and export files by SHA256 and records the text-only packaging boundary.

These records describe previously created local media. The binaries are not included, and no download is promised. The [reproduction instructions](../README.md) and two scripts generate new inputs/exports on the reader's machine without third-party media, models, network requests or speaker playback.

The prior local run used FFmpeg/ffprobe 9.0.2. The portable code was statically checked during this packaging stage; no new media run was performed. Counts, hashes and PTS support the stated file observations. They do not replace listening, real-time A/V synchronization or production review.
