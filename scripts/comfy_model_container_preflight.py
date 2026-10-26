#!/usr/bin/env python3
"""Read-only, no-import model-container preflight for ComfyUI operators.

No network, no torch.load, no pickle evaluation, no installation or mutation.
Container clues are not proof of model integrity or compatibility.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys

PREFIX_LIMIT = 512
SAFETENSORS_HEADER_LIMIT = 16 * 1024 * 1024
CHUNK_BYTES = 1024 * 1024
TORCH_EXTENSIONS = {".ckpt", ".pt", ".pth", ".bin"}


def sniff_container(prefix: bytes, file_bytes: int) -> dict[str, object]:
    """Classify header bytes without deserializing anything."""
    if prefix.startswith(b"version https://git-lfs.github.com/spec/v1"):
        return {"format": "git_lfs_pointer", "confidence": "header", "details": "Git LFS text pointer, not downloaded model bytes"}
    leading = prefix[:64].lstrip().lower()
    if leading.startswith(b"<!doctype html") or leading.startswith(b"<html"):
        return {"format": "html_response", "confidence": "header", "details": "An HTML document was saved instead of weights"}
    if prefix.startswith(b"GGUF") and file_bytes >= 8:
        version = int.from_bytes(prefix[4:8], "little")
        return {"format": "gguf", "confidence": "magic_only", "version": version}
    if prefix.startswith(b"PK\x03\x04"):
        return {"format": "zip_container", "confidence": "magic_only", "details": "ZIP container; may or may not hold a PyTorch checkpoint"}
    if len(prefix) >= 2 and prefix[:1] == b"\x80" and 0 <= prefix[1] <= 5:
        return {"format": "pickle_possible", "confidence": "magic_only", "details": "Never unpickle untrusted model files"}
    if len(prefix) >= 9 and file_bytes >= 9:
        header_bytes = int.from_bytes(prefix[:8], "little")
        if 2 <= header_bytes <= file_bytes - 8 and prefix[8:9] == b"{":
            return {
                "format": "safetensors_probable",
                "confidence": "header_prefix_only",
                "header_bytes": header_bytes,
                "header_within_conservative_limit": header_bytes <= SAFETENSORS_HEADER_LIMIT,
            }
    if file_bytes == 0:
        return {"format": "empty_file", "confidence": "size"}
    return {"format": "unrecognized", "confidence": "none"}


def assess_suffix(suffix: str, found: str) -> tuple[str, list[str]]:
    """Check only extension/container coherence, not model validity."""
    hints: list[str] = []
    if found in {"git_lfs_pointer", "html_response", "empty_file"}:
        return "NOT_A_MODEL_PAYLOAD", ["Check original download; do not try torch.load or rename the file"]
    if suffix in {".safetensors", ".sft"}:
        if found == "safetensors_probable":
            return "EXTENSION_MATCHES_HEADER", ["Still verify trusted source, exact expected checksum and model architecture"]
        return "EXTENSION_CONTAINER_MISMATCH", ["A safetensors extension does not make the contents safetensors"]
    if suffix == ".gguf":
        if found == "gguf":
            return "EXTENSION_MATCHES_HEADER", ["Core ComfyUI UNETLoader is not a GGUF reader; check the compatible GGUF custom loader and its platform constraints"]
        return "EXTENSION_CONTAINER_MISMATCH", ["A .gguf extension does not make the contents GGUF"]
    if suffix in TORCH_EXTENSIONS:
        if found in {"zip_container", "pickle_possible"}:
            return "PLAUSIBLE_CHECKPOINT_CONTAINER", ["Header alone cannot prove PyTorch checkpoint safety, correctness or compatibility"]
        return "UNRECOGNIZED_CHECKPOINT_CONTENT", ["Do not use weights_only=False to suppress a parser error"]
    if found in {"gguf", "safetensors_probable", "zip_container", "pickle_possible"}:
        return "EXTENSION_REQUIRES_LOADER_REVIEW", ["Verify the original model format, selected ComfyUI node and file extension before renaming or conversion"]
    return "UNKNOWN_FORMAT", ["Check the original model download link, expected size and official checksum"]


def inspect_file(path: Path, calculate_sha256: bool = False) -> dict[str, object]:
    """Read only the supplied file, never send its bytes to a server."""
    report: dict[str, object] = {"filename": path.name, "suffix": path.suffix.lower()}
    try:
        if not path.is_file():
            return {**report, "status": "INPUT_ERROR", "error": "not_a_regular_file"}
        size = path.stat().st_size
        with path.open("rb") as stream:
            prefix = stream.read(PREFIX_LIMIT)
            found = sniff_container(prefix, size)
            digest = None
            if calculate_sha256:
                hashed = hashlib.sha256()
                hashed.update(prefix)
                while chunk := stream.read(CHUNK_BYTES):
                    hashed.update(chunk)
                digest = hashed.hexdigest()
        status, warnings = assess_suffix(path.suffix.lower(), str(found["format"]))
        report.update({
            "file_bytes": size,
            "container": found,
            "status": status,
            "warnings": warnings,
            "model_integrity_proven": False,
            "model_mps_compatible_proven": False,
        })
        if digest is not None:
            report["sha256"] = digest
    except OSError as error:
        report.update({"status": "INPUT_ERROR", "error": type(error).__name__})
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Read-only model-container preflight. No torch/pickle loading or network."
    )
    parser.add_argument("files", nargs="+", type=Path, metavar="MODEL_FILE")
    parser.add_argument("--sha256", action="store_true", help="stream full SHA-256 locally (slow for large models)")
    args = parser.parse_args(argv)
    reports = [inspect_file(path, calculate_sha256=args.sha256) for path in args.files]
    output = {
        "schema_version": "objekts.comfy.model-container-preflight.v0.1",
        "publisher": "objekts.ai",
        "limits": "Header/suffix consistency only: not a validated model, integrity check or MPS compatibility test.",
        "network_called": False,
        "deserialize_executed": False,
        "results": reports,
    }
    print(json.dumps(output, indent=2, ensure_ascii=False))
    if any(row["status"] == "INPUT_ERROR" for row in reports):
        return 1
    if any(row["status"] in {"NOT_A_MODEL_PAYLOAD", "EXTENSION_CONTAINER_MISMATCH", "UNRECOGNIZED_CHECKPOINT_CONTENT", "UNKNOWN_FORMAT"} for row in reports):
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
