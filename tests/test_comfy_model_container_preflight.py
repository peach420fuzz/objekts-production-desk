"""Pure-memory regression tests for the read-only container preflight."""
import hashlib
import io
import json
from types import SimpleNamespace
import unittest

from scripts.comfy_model_container_preflight import (
    assess_suffix,
    inspect_file,
    sniff_container,
)


class FakePath:
    def __init__(self, name, data, present=True):
        self.name = name
        self.suffix = "." + name.rsplit(".", 1)[-1] if "." in name else ""
        self._data = data
        self._present = present

    def is_file(self):
        return self._present

    def stat(self):
        return SimpleNamespace(st_size=len(self._data))

    def open(self, mode):
        if mode != "rb":
            raise AssertionError("preflight must be read-only")
        return io.BytesIO(self._data)


class ContainerPreflightTests(unittest.TestCase):
    def test_gguf_magic_and_version(self):
        found = sniff_container(b"GGUF" + (3).to_bytes(4, "little") + b"x" * 16, 24)
        self.assertEqual(found["format"], "gguf")
        self.assertEqual(found["version"], 3)

    def test_safetensors_little_endian_header(self):
        header = b'{"weight":{"dtype":"F32","shape":[1],"data_offsets":[0,4]}}'
        data = len(header).to_bytes(8, "little") + header + b"abcd"
        found = sniff_container(data[:512], len(data))
        self.assertEqual(found["format"], "safetensors_probable")
        self.assertTrue(found["header_within_conservative_limit"])

    def test_lying_safetensors_length_is_not_accepted(self):
        data = (999999).to_bytes(8, "little") + b'{"fake":"header"}'
        self.assertEqual(sniff_container(data, len(data))["format"], "unrecognized")

    def test_html_response_identified(self):
        self.assertEqual(sniff_container(b"  <!DOCTYPE html><html>", 23)["format"], "html_response")

    def test_git_lfs_pointer_identified(self):
        self.assertEqual(sniff_container(b"version https://git-lfs.github.com/spec/v1\n", 43)["format"], "git_lfs_pointer")

    def test_pickle_header_not_executed(self):
        self.assertEqual(sniff_container(b"\x80\x04serialized", 12)["format"], "pickle_possible")

    def test_zip_does_not_imply_valid_torch_file(self):
        self.assertEqual(sniff_container(b"PK\x03\x04xxxx", 8)["format"], "zip_container")
        status, _ = assess_suffix(".ckpt", "zip_container")
        self.assertEqual(status, "PLAUSIBLE_CHECKPOINT_CONTAINER")

    def test_gguf_content_with_safetensors_suffix_rejected(self):
        status, warning = assess_suffix(".safetensors", "gguf")
        self.assertEqual(status, "EXTENSION_CONTAINER_MISMATCH")
        self.assertTrue(warning)

    def test_binary_pointer_is_not_real_model(self):
        status, _ = assess_suffix(".gguf", "git_lfs_pointer")
        self.assertEqual(status, "NOT_A_MODEL_PAYLOAD")

    def test_missing_input_does_not_attempt_open(self):
        report = inspect_file(FakePath("gone.safetensors", b"", present=False))
        self.assertEqual(report["status"], "INPUT_ERROR")

    def test_hash_optional_streamed_locally(self):
        payload = b"GGUF" + (3).to_bytes(4, "little") + b"test" * 350
        report = inspect_file(FakePath("test.gguf", payload), calculate_sha256=True)
        self.assertEqual(report["sha256"], hashlib.sha256(payload).hexdigest())
        self.assertEqual(report["status"], "EXTENSION_MATCHES_HEADER")
        self.assertFalse(report["model_mps_compatible_proven"])

    def test_no_hash_by_default(self):
        report = inspect_file(FakePath("x.gguf", b"GGUF" + (3).to_bytes(4, "little")))
        self.assertNotIn("sha256", report)
        self.assertFalse(report["model_integrity_proven"])


if __name__ == "__main__":
    unittest.main()
