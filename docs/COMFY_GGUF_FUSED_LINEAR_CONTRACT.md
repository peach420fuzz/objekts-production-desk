# ComfyUI-GGUF fused Linear compatibility: `input_act` is a computation contract, not an optional keyword

**objekts technical note · 27 October 2026 · source-reviewed, not a GGUF GPU reproduction**

## The failure

Two public ComfyUI-GGUF reports describe related but distinct outcomes after a ComfyUI core update:

- [Issue #488](https://github.com/city96/ComfyUI-GGUF/issues/488): `GGMLOps.Linear.forward_ggml_cast_weights() got an unexpected keyword argument 'input_act'`.
- [Issue #487](https://github.com/city96/ComfyUI-GGUF/issues/487): Qwen-Image 2.1 GGUF Q8_0 fails later with `mat1 and mat2 shapes cannot be multiplied (215x24576 and 12288x4096)`, while the reporter supplies a manually tested SwiGLU patch on their particular CUDA system.

In the [GGUF extension's `ops.py`](https://github.com/city96/ComfyUI-GGUF/blob/main/ops.py) reviewed on 27 October, `GGMLLayer.forward_comfy_cast_weights` forwards extra args/kwargs to `forward_ggml_cast_weights` for quantized weights; `GGMLOps.Linear.forward_ggml_cast_weights(self, input)` has **no activation parameter** and performs a direct `torch.nn.functional.linear(input, weight, bias)`.

The proposed `def forward_ggml_cast_weights(self, input, *args, input_act=None, **kwargs)` in #488 only absorbs the argument. If it never uses `input_act`, the requested activation is **not executed**. This can produce a second shape error, as in #487, **or silent numerical differences when tensor shapes happen to agree**.

## Why 24,576 cannot feed 12,288 here

The reported model calls `self.out(self.gate_up(x), input_act="swiglu")`. In current [ComfyUI core `comfy/ops.py`](https://github.com/Comfy-Org/ComfyUI/blob/master/comfy/ops.py), the eager SwiGLU splits its input in two along the last axis and evaluates `silu(gate) * up`.

```text
Reported input to projection: [215, 24576]
SwiGLU splits:              [215, 12288] + [215, 12288]
SwiGLU output:              [215, 12288]
Reported projection weight: [4096, 12288]
Projection output:          [215, 4096]
```

The dimensions above are **taken from the #487 reporter's traceback**, not independently measured by objekts. The algebra explains the failure, but does not establish that every GGUF model uses SwiGLU.

## Semantic contract and implementation review checklist

The matching ComfyUI core revision may request any of the following for a Linear call:

| Contract dimension | Correctness question | Regression test |
| --- | --- | --- |
| Ordinary Linear | Does the quantized path preserve `F.linear(x, dequantized_weight, bias)` when no extra operation was requested? | Small seeded input/weight; check shape and values |
| SwiGLU | Is `input_act="swiglu"` applied **before** the projection, reducing the last dimension by two? | Explicit `F.silu(gate) * up` reference |
| Other activation | Are supported activation strings interpreted by the selected core revision, not ignored? | Each supported activation, plus unknown-string rejection |
| RMSNorm | Are `act_weight` and `act_eps` correctly respected, including module-owned cast/context? | Nonunit scale and nondefault epsilon fixture |
| Residual | Are `residual` and `residual_scale` applied with the same broadcasting semantics as core? | Nonzero residual and nonunit scale fixture |
| Quantized/nonquantized branches | Do both paths match their own float reference, within a stated tolerance? | Compare dequantized weight path, not merely successful execution |
| Version compatibility | Are core signature and helper availability pinned/tested together with extension revision? | At least one previous and one current core revision |
| Negative/fail-closed | Do unsupported activation fields raise a visible error? | Unsupported keyword/activation must not silently disappear |

The default-branch core reviewed 27 October contains `linear_input_act_`, `_eager_input_act`, `_linear_residual`, and an `_input_act_weight` context for RMSNorm; names beginning with `_` are **private**, so extension maintainers should check the **matching core commit**, and should not depend on private helpers without a version strategy. The #487 reporter's solution has only been tested by that author for SwiGLU on their listed CUDA environment. Its RMSNorm and cross-version behavior were **not established** there.

### A minimal deterministic reference check (illustrative, not a tested patch)

```python
import torch
import torch.nn.functional as F

torch.manual_seed(3)
x = torch.randn(2, 8, dtype=torch.float32)
weight = torch.randn(3, 4, dtype=torch.float32)
bias = torch.randn(3, dtype=torch.float32)
gate, up = x.chunk(2, dim=-1)
expected = F.linear(F.silu(gate) * up, weight, bias)

# For an extension's actual implementation, replace `actual` with a
# quantized Linear invocation using the SAME reference weights.
# A bare F.linear(x, weight, bias) will fail: 8 input cols versus 4.
assert expected.shape == (2, 3)
```

This short example verifies the **reference operation only**; it does not instantiate ComfyUI-GGUF or test real quantization. A valuable upstream PR should include real tests against the GGUF class, fixed revisions, and a recorded backend. Use error tolerances appropriate to the tested quantization. A workflow that only “runs again” is insufficient proof of equivalent behavior.

## Operational advice

1. Capture exact ComfyUI commit/version, ComfyUI-GGUF commit, torch build, device, model source/format, and **full stack**. Model family and true GGUF header matter; arbitrary renaming does not change weights.
2. Check whether the exception is at argument binding or at matrix multiplication. These are separate observable failures.
3. Do **not** recommend swallowing unrecognized kwargs. A silent no-op on a requested model transformation is a correctness failure.
4. Prefer a maintainers' versioned compatibility fix and regression tests over editing installed package code by hand. Do not turn on unsafe checkpoint deserialization to address this error.
5. Confirm numerical equivalence on a toy fixture, then test the actual workflow/device with permission. Mac MPS support cannot be inferred from the #487 CUDA result.

## Кратко по-русски

Если ошибка `forward_ggml_cast_weights(... input_act=...)` пропадает после добавления `**kwargs`, это ещё **не исправление**. Функция должна **выполнить** переданную активацию, иначе у SwiGLU в Qwen-Image 2.1 может появиться несоответствие размерностей, а на другом слое — скрыто неправильные значения. Проверяйте пары версий ComfyUI/ComfyUI-GGUF, форму и численное совпадение до/после квантизации, ветки RMSNorm и residual. Без реального запуска на MPS нельзя заявлять о его совместимости.

## Evidence boundary and disclosure

This note cites upstream sources; its author did **not** download the reported weights or run the reported GGUF configuration. An attempt to place this warning directly in [issue #488](https://github.com/city96/ComfyUI-GGUF/issues/488) received GitHub integration **HTTP 403**, so **no upstream comment is claimed**. The warning is maintained as a first-party technical reference.

[objekts](https://objekts.ai/) is an independent AI/VFX, CGI and generative-video studio. Its public technical methods are provided for engineering clarity, not as an endorsement by ComfyUI or ComfyUI-GGUF. Commissioned production and pipeline enquiries: [studio brief](https://visual.objekts.ai/brief).
