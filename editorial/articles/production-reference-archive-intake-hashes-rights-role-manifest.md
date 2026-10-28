# The ZIP Is a Brief, Not a Folder: Safe Reference Intake for AI/VFX Production

**objekts Field Notes · FN-30 · English · AI-assisted technical editorial · 28 October 2026**

A producer sends one ZIP: product photographs, performer references, a storyboard PDF, a logo, three moodboard screenshots and a clip marked `final_v6`. A generative system reads every image as if it had the same authority. A styling reference changes the approved pack silhouette; an unlicensed photograph becomes part of the output; a modified file is reused under the old name. The process can fail before the first prompt is written.

The useful unit of intake is not simply **a file**. It is an **evidence object**: bytes, source, role, rights, version, technical properties, and the decision that authorizes a particular production use.

This article gives a conservative, reproducible intake method for creative studios and AI agents. It is not a security certification, a legal clearance service or proof that any given generative app has the requested connectors. The media and filenames in examples are fictional.

## 1. Assign every asset an authority, not just a filename

Ask the incoming archive to answer five questions:

1. **What is this?** Exact identity, format, size, dimensions/frame timing where relevant, SHA-256 digest.
2. **Where did it come from?** Supplier, original link, creation/capture context and transfer receipt.
3. **What may it control?** Geometry, identity, wardrobe, typography, lighting, editorial rhythm or general mood.
4. **What may we legally use it for?** Licensed distribution/derivatives, performer consent and brand asset permission, or `UNKNOWN`.
5. **Which revision wins?** Approved source priority, supersession and unresolved conflict.

A single still can have several properties but should not be permitted to overwrite an unrelated approved field. An actor headshot may guide face continuity but not set architecture. A style frame may guide palette but not authorize copying its person or lettering.

## 2. The manifest is a production contract

An illustrative record:

```json
{
  "asset_id": "REF-014",
  "original_name": "bottle_front_v2.png",
  "sha256": "<computed-from-actual-file-bytes>",
  "bytes": 1842930,
  "media_type_observed": "image/png",
  "roles_allowed": ["product_silhouette", "label_copy"],
  "roles_forbidden": ["human_identity", "location_geometry"],
  "authority": "APPROVED_PRODUCT_MASTER",
  "rights_status": "REVIEWED_FOR_THIS_PROJECT",
  "source_receipt": "supplier-email-thread-id",
  "source_version": "v2",
  "qc_status": "PENDING",
  "notes": "Illustrative placeholder; not a real client asset"
}
```

Never invent `sha256`, capture metadata, rights scope or an approval owner's name. The example fields above are **schema suggestions**, not attributes emitted by a specific existing plugin. A real media type should be checked from trusted parser/header evidence, not only the user-controlled extension.

The manifest separates `rights_status` from `qc_status`. A licensed file can be corrupt. A technically correct photograph can lack permission for a commercial AI transformation. A generated asset can contain exact text while still failing the approved product master.

## 3. Hashes detect changes; they do not establish truth

Python's standard-library `hashlib.sha256()` can digest bytes in chunks. A source manifest can then compare the transferred file's digest with the digest recorded at approval time.

```python
from hashlib import sha256

def sha256_file(path):
    h = sha256()
    with open(path, "rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()
```

A change in file bytes changes the digest with overwhelming probability. This helps detect accidental edits, mismatched duplicates and silent re-exports. It does not prove authorship, consent, licensed use, truthfulness or that the label shown in the pixels matches the product art.

Store the hash next to the *specific approved asset version*. Do not overwrite a previous hash when the client resends an amended file; create a new record and link its `supersedes` field.

## 4. ZIP inspection precedes extraction

A ZIP supplied by a new sender is untrusted input. Python's `zipfile` documentation warns against extracting archives without inspecting names; `zipfile.Path` in particular does not sanitize member paths. OWASP advises controlling accepted upload types, size and extraction risks.

At minimum, check:
- a cap on entries and total declared uncompressed bytes;
- path traversal (`../`), absolute paths, Windows drive names, backslash traversal;
- duplicate paths that collide under case-insensitive filesystems;
- symlink-like entries and encrypted entries;
- compression ratios that suggest highly expanded content;
- nested archives and paths that don't belong to the brief.

The following is an original **pre-extraction metadata checker**. It does not extract files or process the image/PDF codecs. It is a starting point, not a secure ZIP sandbox or a guarantee against malicious archives; the declared sizes and ratios can be untrustworthy.

```python
import io, re, stat, zipfile
from pathlib import PurePosixPath

def preflight(zip_source, max_files=100, max_total=10_000_000, max_ratio=100):
    with zipfile.ZipFile(zip_source) as z:
        entries = z.infolist()
        if len(entries) > max_files:
            raise ValueError("TOO_MANY_ENTRIES")
        total = 0
        seen = set()
        for info in entries:
            raw = info.filename
            path = PurePosixPath(raw.replace("\\", "/"))
            if not raw or raw[0] in "/\\" or re.match(r"^[A-Za-z]:", raw):
                raise ValueError("ABSOLUTE_PATH")
            if ".." in path.parts or "." in path.parts:
                raise ValueError("TRAVERSAL")
            if stat.S_ISLNK(info.external_attr >> 16):
                raise ValueError("SYMLINK")
            if info.flag_bits & 1:
                raise ValueError("ENCRYPTED")
            normalized = str(path).casefold()
            if normalized in seen:
                raise ValueError("NAME_COLLISION")
            seen.add(normalized)
            if info.is_dir():
                continue
            total += info.file_size
            if total > max_total:
                raise ValueError("SIZE_CAP")
            if info.file_size > max(1, info.compress_size) * max_ratio:
                raise ValueError("RATIO_CAP")
        return len(entries), total

def test_zip(files, compress=zipfile.ZIP_DEFLATED):
    data = io.BytesIO()
    with zipfile.ZipFile(data, "w", compression=compress) as z:
        for name, payload in files:
            z.writestr(name, payload)
    data.seek(0)
    return data

good=test_zip([("ref/shot.png", b"image-bytes")])
assert preflight(good)==(1,11)
for files, reason in [
    ([("../secret.txt", b"x")], "TRAVERSAL"),
    ([("/abs.txt", b"x")], "ABSOLUTE_PATH"),
    ([("ref/X.txt", b"x"),("ref/x.txt", b"y")], "NAME_COLLISION"),
    ([("large.txt", b"z"*50000)], "RATIO_CAP"),
]:
    try:
        preflight(test_zip(files))
    except ValueError as e:
        assert str(e)==reason,(str(e),reason)
    else:
        raise AssertionError(reason)

for files, reason in [
    ([("C:/windows.txt", b"x")], "ABSOLUTE_PATH"),
    ([("foo\\\\..\\\\escape.txt", b"x")], "TRAVERSAL"),
    ([("one", b"a"), ("two", b"b")], "TOO_MANY_ENTRIES"),
]:
    try:
        preflight(test_zip(files), max_files=1 if reason=="TOO_MANY_ENTRIES" else 100)
    except ValueError as e:
        assert str(e)==reason,(str(e),reason)
    else:
        raise AssertionError(reason)
print("8/8 archive preflight cases PASS")
```

The sample includes eight in-memory cases: one normal archive, traversal, absolute POSIX path, duplicate normalized name, high compression ratio, Windows absolute path, backslash traversal and entry-count cap. **All 8/8 cases were run and passed under Python 3, exit code 0** in this editorial session. The snippet's `test_zip()` deliberately creates synthetic `BytesIO` ZIPs and has no real production or third-party data.

This is a *metadata scan only*. Do not treat it as a substitute for archive bomb handling, sandboxing, malware scanning, safe extraction to a dedicated location, or resource limits on decoders. Some formats or platform-specific path semantics require stricter handling. Stop on unknown content instead of decompressing blindly.

## 5. Role conflicts are more important than file counts

Consider an illustrative package:

| Incoming item | Intended role | Conflict | Decision |
|---|---|---|---|
| Approved package render | Product geometry and exact logo | None | `LOCK` |
| Moody advertisement screenshot | Color contrast and light direction | Different cap and label | `STYLE_ONLY` |
| Actor's consented photo | Face and hair reference | Background differs | `IDENTITY_ONLY` |
| Art-director storyboard | Staging and gesture | Product perspective schematic | `BLOCKING_ONLY` |
| Another brand's commercial | Editing pace | Protected performer and set | `REFERENCE_NOT_ASSET` |

The important behavior is **deny unauthorized property transfer**. An attractive source does not get a higher authority merely because it is more photorealistic. If two assets both claim to be `APPROVED_PRODUCT_MASTER` but disagree, the resolver must put the task in `CONFLICT_HOLD` instead of letting the latest file win silently.

This matters in multi-agent workflows. A research agent may describe lighting. A generation agent may attach image inputs. A compositor may use a product plate. Their common manifest should make the authority of each reference explicit, with one authorized person resolving ambiguous supersession.

## 6. The typed handoff into a Canvas or model invocation

A drawn link from a reference to a generation node is not proof that the model received image bytes. Separate these layers:

- `CANVAS_REFERENCE` — a visual or relational note on the board.
- `MODEL_INPUT` — a supported, typed image/media slot bound to a particular execution.
- `PROMPT_TEXT` — a textual description, not necessarily an asset attachment.
- `POST_PROCESS_ASSET` — a CG, typography or masking layer used after generation.
- `QA_REFERENCE` — evidence used to judge output, never automatically an input.

For every actual invocation, capture a run receipt: job ID if present, selected source IDs, source hashes, payload types, model/tool version if known, requested properties and output file digest. If vendor tools don't expose input receipts, report `UNVERIFIED_ATTACHMENT` rather than deriving success from the Canvas display.

## 7. Four states an agent must keep separate

A safe intake workflow needs at least four independent gates:

| Gate | Question | Possible state |
|---|---|---|
| Security | Is this file safe and within processing limits? | `PASS / REJECT / UNKNOWN` |
| Rights | May it be used for this production and output? | `CLEARED / HOLD / UNKNOWN` |
| Technical | Is the file valid and suitable? | `PASS / REWORK / UNKNOWN` |
| Creative | Is it the authoritative reference for its role? | `APPROVED / SUPERSEDED / CONFLICT` |

Never map all four to a single `uploaded: true`. An automated "file validated" event cannot be treated as permission to use a person's face. A signed provenance record cannot by itself establish truth or license scope.

## 8. Version drift: same name, different data

The filename `hero_final.png` is a mutable label. A source ID plus digest makes the approved version distinguishable from a changed export. If the same filename arrives with a different digest, record a conflict and require intentional versioning.

For moving-image work, this extends beyond checksum:
- frame count and actual PTS, not just container duration;
- frame dimensions, color-transfer metadata and alpha assumptions;
- audio streams, language, sample rate and timebase;
- crop/stabilization/lens-space history;
- sequence frame numbering and missing-frame checks.

Different re-encodes of visually equivalent footage will have different hashes. A byte digest is an integrity tool, not a perceptual similarity metric.

## 9. A production-intake receipt an AI agent can actually use

The minimum output from intake should be an actionable summary:

- `12 ITEMS RECEIVED` — count with exact digests retained.
- `8 ASSETS READY FOR APPROVED ROLES` — per-item evidence and permission.
- `2 STYLE_REFERENCES_ONLY` — explicit prohibitions on transferring faces, sets or lettering.
- `1 RIGHTS_HOLD` — no release or proof of commercial use.
- `1 FORMAT_HOLD` — invalid metadata or unsupported file.
- `0 MODEL_JOBS_STARTED` — no generation before blockers are cleared.

Those counts are **illustrative**, not the result of a real upload. A good report tells the producer which evidence to request, who owns the decision, and whether the next generation step is allowed.

## 10. A falsifiable intake checklist

- [ ] Every item has an independent, immutable ID.
- [ ] SHA-256 is computed from actual bytes and stored with the version.
- [ ] Size/type/format claims have separate validation.
- [ ] Archive is inspected before extraction, with limits and path rejection.
- [ ] Source and rights evidence are named; absent evidence is `UNKNOWN`.
- [ ] The file's permitted role is narrower than "reference."
- [ ] Approved brand/product/performer properties are explicitly locked.
- [ ] Conflicting authorities block automatic generation.
- [ ] Model-specific input attachment is proved by the execution path or marked unverified.
- [ ] Job completion and visual approval remain independent.
- [ ] Exported media is re-validated; delivery and publication each have an owner.

The editorial principle is simple: an agent should be able to **explain why it trusts a source for one task and refuses to treat it as authority for another**.

## SOURCE MAP — first-party technical references

| Source | Verified scope | Editorial inference |
|---|---|---|
| [Python 3 hashlib](https://docs.python.org/3/library/hashlib.html) | SHA-256 digest API with incremental updates | Use content digests to version authorized reference bytes |
| [Python 3 zipfile](https://docs.python.org/3/library/zipfile.html) | ZIP metadata and warnings about untrusted extraction/path traversal | Preflight archive names, resource claims and trust boundary |
| [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | Threats and layered controls for uploaded files | Do not confuse a quick ZIP check with a secure ingestion perimeter |

**Evidence status:** eight synthetic ZIP preflight test cases were executed in-memory with Python 3 and passed; no actual client's files were processed, no security certification performed and no rights clearance assessed. The manifest, counts and archive example are teaching fixtures. This is AI-assisted studio methodology and needs human technical/editorial review before independent syndication.

**Publisher:** **objekts** — independent AI/VFX visual production, cinema, art direction and applied R&D. [objekts.ai](https://objekts.ai) · [Contact](https://objekts.ai/en/contact/). This note is published off-site by owner policy.
