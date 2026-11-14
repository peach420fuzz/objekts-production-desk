#!/usr/bin/env python3
"""Reproduce the A/V mux and measurement stage using generated local inputs.

No media files ship with this text bundle. No network or speaker playback.
Historical measurements in evidence/ were obtained before this portable text
repackaging; this version was not media-executed while the bundle was prepared.
"""
from __future__ import annotations
from array import array
from fractions import Fraction
import argparse
import hashlib
import json
import math
from pathlib import Path
import statistics
import subprocess
import sys
import wave

FS, SAMPLES = 48000, 192000


def sha(data):
    return hashlib.sha256(data).hexdigest()


def samples_from(data):
    values=array("h")
    values.frombytes(data)
    if sys.byteorder!="little": values.byteswap()
    return values


def sample_summary(data, source):
    values=samples_from(data)
    reference=samples_from(source)
    adjacent=[abs(b-a) for a,b in zip(values,values[1:])]
    common=min(len(values),len(reference))
    return {"decoded_samples_mono":len(values),"decoded_bytes":len(data),
      "sha256_pcm_bytes":sha(data),"equals_source_pcm_bytes":data==source,
      "duration_seconds_exact":str(Fraction(len(values),FS)),
      "last_to_first_step_pcm16":abs(values[-1]-values[0]) if values else None,
      "ordinary_adjacent_step_median":statistics.median(adjacent) if adjacent else None,
      "ordinary_adjacent_step_max":max(adjacent) if adjacent else None,
      "common_prefix_samples":common,
      "common_prefix_error_rms_pcm16":math.sqrt(sum((values[i]-reference[i])**2 for i in range(common))/common) if common else None}


def video_packet_signature(probe):
    stream=next(s for s in probe["streams"] if s["codec_type"]=="video")
    tb=Fraction(stream["time_base"])
    packets=[p for p in probe["packets"] if p["stream_index"]==stream["index"]]
    payload=[(p["data_hash"],int(p["size"])) for p in packets]
    times=[(str(Fraction(p["pts"])*tb),str(Fraction(p["duration"])*tb)) for p in packets]
    return payload,times


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--work",type=Path,default=Path("run"))
    args=parser.parse_args()
    work=args.work
    if not (work/"loop.mp4").is_file() or not (work/"tone.wav").is_file():
        raise SystemExit("Generate loop.mp4 and tone.wav first.")
    if any((work/name).exists() for name in ["RESULT.json","aac.mp4","pcm.mov"]):
        raise SystemExit("Existing result/export preserved; reproduce in a new work directory.")
    with wave.open(str(work/"tone.wav"),"rb") as wav:
        if (wav.getnchannels(),wav.getsampwidth(),wav.getframerate(),wav.getnframes())!=(1,2,FS,SAMPLES):
            raise SystemExit("Expected original mono PCM16/48kHz/192000-sample source.")
        source=wav.readframes(SAMPLES)
    log=[]
    def run(argv):
        proc=subprocess.run(argv,cwd=work,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
        log.append({"argv":argv,"exit_code":proc.returncode,"stderr":proc.stderr.decode(errors="replace")})
        (work/"commands.json").write_text(json.dumps(log,indent=2)+"\n",encoding="utf-8")
        if proc.returncode: raise RuntimeError(proc.stderr.decode(errors="replace"))
        return proc.stdout
    def probe(name):
        result=json.loads(run(["ffprobe","-v","error","-show_packets","-show_streams","-show_format",
          "-show_data_hash","sha256","-of","json",name]))
        result.get("format",{})["filename"]=name
        return result
    def rgb_hashes(name):
        text=run(["ffmpeg","-hide_banner","-v","error","-nostdin","-xerror","-i",name,
          "-map","0:v:0","-an","-pix_fmt","rgb24","-f","framehash","-hash","sha256","-"]).decode()
        (work/(name+".rgb-framehash.txt")).write_text(text,encoding="utf-8")
        return [line.split(",")[-1].strip() for line in text.splitlines() if line and not line.startswith("#")]
    baseline_probe=probe("loop.mp4")
    baseline_signature=video_packet_signature(baseline_probe)
    baseline_rgb=rgb_hashes("loop.mp4")
    exports={}
    settings=[("aac.mp4",["-c:a","aac","-b:a","128k"]),("pcm.mov",["-c:a","pcm_s16le"])]
    for name,audio in settings:
        run(["ffmpeg","-hide_banner","-v","error","-nostdin","-y","-i","loop.mp4","-i","tone.wav",
          "-map","0:v:0","-map","1:a:0","-c:v","copy"]+audio+
          ["-ar","48000","-ac","1","-movflags","+faststart",name])
        info=probe(name)
        (work/(name+".packets-streams.json")).write_text(json.dumps(info,indent=2)+"\n",encoding="utf-8")
        audio_stream=next(s for s in info["streams"] if s["codec_type"]=="audio")
        video_stream=next(s for s in info["streams"] if s["codec_type"]=="video")
        frames=json.loads(run(["ffprobe","-v","error","-select_streams","a:0","-show_frames",
          "-show_entries","frame=pts,best_effort_timestamp,duration,nb_samples,sample_rate,side_data_list",
          "-of","json",name]))
        (work/(name+".audio-frames.json")).write_text(json.dumps(frames,indent=2)+"\n",encoding="utf-8")
        raw_name=name+".decoded.raw"
        run(["ffmpeg","-hide_banner","-v","error","-nostdin","-xerror","-y","-i",name,
          "-map","0:a:0","-vn","-c:a","pcm_s16le","-f","s16le",raw_name])
        data=(work/raw_name).read_bytes()
        if len(data)%2: raise RuntimeError("Incomplete mono PCM16 sample")
        packets=[p for p in info["packets"] if p["stream_index"]==audio_stream["index"]]
        audio_frames=frames["frames"]
        tb=Fraction(audio_stream["time_base"])
        payload,times=video_packet_signature(info)
        actual_rgb=rgb_hashes(name)
        exports[name]={"sha256":sha((work/name).read_bytes()),"bytes":(work/name).stat().st_size,
          "container_duration_s":info["format"].get("duration"),
          "audio_stream":{k:audio_stream.get(k) for k in ["codec_name","profile","sample_rate","channels","time_base","start_pts","duration_ts","nb_frames"]},
          "audio_packet_count":len(packets),
          "audio_side_data":[{"packet_index":i,"pts":p.get("pts"),"duration":p.get("duration"),"side_data_list":p["side_data_list"]} for i,p in enumerate(packets) if p.get("side_data_list")],
          "decoded_audio_frame_count":len(audio_frames),
          "decoded_audio_nb_samples_sum":sum(f["nb_samples"] for f in audio_frames),
          "last_decoded_audio_frame":audio_frames[-1],
          "packet_coverage_end_s_exact":str(max(Fraction(p["pts"]+p["duration"])*tb for p in packets)),
          "decoded_coverage_end_s_exact":str(max(Fraction(f["pts"])*tb+Fraction(f["nb_samples"],FS) for f in audio_frames)),
          "decoded_audio":sample_summary(data,source),
          "video":{"decoded_frames":len(actual_rgb),"rgb_hashes_equal_input":actual_rgb==baseline_rgb,
            "packet_payloads_equal_input":payload==baseline_signature[0],"rational_PTS_and_durations_equal_input":times==baseline_signature[1],
            "time_base":video_stream["time_base"]}}
    result={"kind":"NEW_LOCAL_REPRODUCTION_RESULT","ffmpeg_version":run(["ffmpeg","-version"]).decode().splitlines()[0],
      "source":{"samples":SAMPLES,"sample_rate":FS,"channels":1,"PCM_sha256":sha(source),"AAC1024_remainder":SAMPLES%1024},
      "exports":exports,"listened_or_played":False,
      "limit":"Counts/PTS/hash evidence only; no perceptual seam, zero playback drift or production acceptance claim."}
    (work/"RESULT.json").write_text(json.dumps(result,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(result,indent=2))


if __name__=="__main__": main()
