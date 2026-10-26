# ComfyUI model fails before sampling: inspect the container before blaming MPS

**Publisher:** [objekts](https://objekts.ai/) · 27 October 2026 · English/Russian technical field note for AI/VFX operators. **Evidence level:** static inspection of upstream ComfyUI and GGUF loader source + a synthetic, in-memory preflight utility test. No private weights inspected; no Apple Silicon inference benchmark.

A Qwen image workflow on Apple Silicon can show `_pickle.UnpicklingError: Unsupported operand 1` under a node named `UNETLoader`. That message describes the **checkpoint deserialization path**, not necessarily an MPS kernel failure. Conversely, an `MPS out of memory` event inside the sampler is a different class of fault and needs a different first experiment. Treating both as “the Mac cannot run the model” obscures the cheapest discriminating test.

## Exact loader boundary in upstream code

Core ComfyUI currently resolves `UNETLoader.unet_name` under `diffusion_models` and passes the selected file path through `comfy.sd.load_diffusion_model` into `comfy.utils.load_torch_file`. The latter selects its reader based on the **file extension**:

- `.safetensors` / `.sft`: safe-tensors loading path;
- **other extensions**: `torch.load(..., weights_only=True)` in the PyTorch checkpoint path.

The separate [ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF) project documents the distinct **Unet Loader (GGUF)** node for GGUF-encoded diffusion weights, plus platform/version qualifications. A GGUF file selected in stock `UNETLoader` is not proof of an MPS bug; blindly changing its extension to `.safetensors` cannot convert the container. A `weights_only=False` override is **not** a general-purpose fix: PyTorch warns that pickle loading can execute arbitrary code from untrusted sources.

Sources: [ComfyUI `UNETLoader`](https://github.com/Comfy-Org/ComfyUI/blob/master/nodes.py), [`load_torch_file`](https://github.com/Comfy-Org/ComfyUI/blob/master/comfy/utils.py), [ComfyUI-GGUF README](https://github.com/city96/ComfyUI-GGUF#usage), [PyTorch serialization security](https://docs.pytorch.org/docs/stable/notes/serialization.html). The incident that prompted this note was [ComfyUI issue #17376](https://github.com/Comfy-Org/ComfyUI/issues/17376), which did **not** include the selected diffusion filename, so its exact cause remains unconfirmed.

## Local, read-only container preflight

The [small Python utility](../scripts/comfy_model_container_preflight.py) reads at most 512 initial bytes for identification, and optionally streams a full SHA-256 when requested. It **does not** import PyTorch, deserialize pickle, call an MCP endpoint, download anything or alter the file. It prints **basename only**, not the local source directory.

```bash
python3 scripts/comfy_model_container_preflight.py /absolute/path/to/selected_diffusion_file
python3 scripts/comfy_model_container_preflight.py --sha256 /absolute/path/to/selected_diffusion_file
python3 -m unittest discover -s tests -p 'test_comfy_model_container_preflight.py'
```

`--sha256` reads the entire potentially multi-gigabyte file; omit unless comparing with an authoritative published checksum. If the source package does not publish a checksum, matching a local hash alone proves nothing about a genuine download.

| Sniffed first bytes | Classification, **not validation** | Next check |
|---|---|---|
| `GGUF` + 4-byte version | GGUF *magic only* | Is the workflow using the documented GGUF loader? Check that loader's exact Mac/PyTorch compatibility. |
| Little-endian 8-byte header length, then `{` | Likely safetensors header | Extension `.safetensors`; trusted download size/checksum; appropriate architecture and loader. |
| `PK\x03\x04` | ZIP container, possibly PyTorch checkpoint | Never assume the ZIP contains legitimate weights; compare official source and expected model type. |
| Pickle protocol marker `0x80` | Possible pickle stream | Do **not** deserialize untrusted model bytes to investigate. |
| Git LFS pointer text | Model was not downloaded, only a pointer | Retrieve real model through the legitimate artifact host. |
| HTML `<!DOCTYPE` / `<html` | Likely error/auth page saved as file | Investigate legitimate download route, not ComfyUI settings. |
| Unknown/mismatched magic and extension | Unverified or suspicious | Verify source and expected format; do not rename to force a loader. |

**Exit semantics:** 0 = no known hard container/extension mismatch according to this limited classifier; **not a model pass**. 1 = local input error. 2 = suspicious/unrecognized content or mismatched extension. The script avoids client IDs, external telemetry and transmitting model bytes. Running it on a client's proprietary model should still follow the client's authorized local-processing policy.

The accompanying [12 Python unit tests](../tests/test_comfy_model_container_preflight.py) use **in-memory fake files**. All 12 passed on the execution host in this 27-Oct development cycle; no actual checkpoint was opened, no Apple MPS kernel was run, and no fresh-checkout test was performed. The tests verify header classification and extension flags, not model correctness.

## The smallest useful diagnostic conversation

Ask for four **non-secret** facts, in order:

1. Exact failing node class (`UNETLoader` vs a GGUF/custom loader), and the selected model's **filename extension**.
2. The first exception and call stack, not only a generic “GPU crash” label. Did failure happen during `load_torch_file`, after graph execution started, or during sampler/memory allocation?
3. Artifact origin, published model format/size and expected checksum. Do not request the weights or private customer prompts in a public issue.
4. Whether a **known-good, official** small-format model loads in the *same current* node and environment. Isolate file/loader from hardware without a full reinstall.

If an unrelated custom node fails importing `transformers` at startup, record it separately; a nearby warning does not prove it caused the loader exception. Do not advise global dependency replacement before locating the actual failure point.

## Русская версия: порядок диагностики без переустановки

Когда ComfyUI на Apple Silicon сообщает `Weights only load failed` или `Unsupported operand 1` в `UNETLoader`, **сначала проверяется формат самого файла и выбранный узел**, а не память GPU. В исходниках штатный загрузчик выбирает `safetensors` по расширению, а для других файлов может перейти к `torch.load(weights_only=True)`. Это и объясняет, почему ошибка десериализации возникает до первого шага семплера.

1. Посмотри имя и расширение файла именно в проблемном `Load Diffusion Model`. Логи соседних VAE и text encoder не гарантируют, что найден проблемный diffusion-файл.
2. Если это `.gguf`, проверь исходную документацию [ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF), наличие совместимого узла `Unet Loader (GGUF)`, его поддержку конкретного семейства модели и версии PyTorch/macOS. Не считай сам факт наличия custom node доказательством совместимости.
3. Если это `.safetensors`, сопоставь **фактический заголовок**, размер и официальный источник. Переименование файла не преобразует веса. Неполная загрузка, LFS-pointer и сохранённая HTML-страница могут выглядеть как «модель» в папке.
4. Выполни локальную **читающую** проверку скриптом выше, не отправляя приватные файлы сторонним сервисам. Хэш включай только при наличии проверяемого эталона.
5. Не отключай `weights_only` ради обхода исключения. При реальной ошибке `MPS out of memory` это уже **другая ветка**: память/квантизация/размер задачи исследуются только после успешного открытия весов.

Для воспроизводимого отчёта обычно достаточно версии ComfyUI/PyTorch, типа устройства, имени файла с расширением, класса загрузчика, точного стека и того, загружается ли известный эталонный checkpoint в том же окружении. Клиентские материалы и ключи не публикуются.

**Studio and support boundary:** [objekts](https://objekts.ai/) develops AI/VFX, CGI and generative-video pipelines for commissioned visual production. This note is an independently published first-party troubleshooting method, not an official ComfyUI/PyTorch endorsement or a free remote repair service; production inquiries are opt-in via the [studio brief](https://visual.objekts.ai/brief).
