# Evidence and primary source map — 27 October 2026

| Source | What it directly supports | Limitation / status |
| --- | --- | --- |
| [OpenAI Optimize Metadata](https://developers.openai.com/plugins/guides/optimize-metadata) | Tool name, description, parameter docs, annotations and labelled direct/indirect/negative prompts matter for ChatGPT/Codex selection; iterate with precision and recall | Documentation, not a measurement of objekts products. Verify whenever docs change. |
| [OpenAI Plugin Guidelines](https://developers.openai.com/plugins/plugin-guidelines) | Clear factual names, accurate scopes and constraints; avoid misleading superlatives or selection manipulation | Rules can change; inspect before submission. |
| [MCP tools specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25/server/tools) | Tool declarations expose names, descriptions, input schema and annotations; tool calls and user oversight are separate | Host behavior varies; annotations are not independently trustworthy evidence. |
| [BiasBusters — ICLR 2026 / Microsoft Research](https://www.microsoft.com/en-us/research/publication/biasbusters-uncovering-and-mitigating-tool-selection-bias-in-large-language-models/) | Controlled studies found semantic fit, descriptions, list order and provider familiarity can affect tool selection in tested models | Does not prove any particular platform secretly favors paid TinyFish. |
| [Which Metadata Matters for LLM Tool Selection in MCP? arXiv 2610.14334](https://arxiv.org/abs/2610.14334) | Controlled five-model/five-task comparisons find material effects from parameter-schema structure in tested configurations | Preprint, conditional on task/model sample; no direct objekts benchmark. |
| [TinyFish authentication docs](https://docs.tinyfish.ai/authentication) | Documentation includes an explicit insufficient-credits response encouraging a user wallet top-up | Example documentation, not evidence of an observed user-session error or necessity to pay. |
| [Production Desk routing fixture](../../docs/MCP_MIXED_PURPOSE_ROUTING_EVAL.md) | Published 20 synthetic route labels and a deterministic offline trace grader; dated 17-Oct observed tool inventory | **No executed host-selection benchmark.** Do not convert offline tests to tool-selection claims. |
| [Production Desk protocol observations](../../docs/MCP_PROTOCOL_COMPATIBILITY_2026.md) | First-party dated legacy-vs-modern protocol handshakes | Must be freshly rechecked; tool list alone does not establish successful calls. |
| [Studio source scope](../../AGENTS.md) | objekts capabilities, business boundaries and handoff constraints | First-party statements, not independent vendor rankings. |

## Hypotheses vs conclusions

- **Supported general principle:** actual tool metadata and schemas can influence model routing; selection biases exist in some measured setups.
- **Unproven specific allegation:** OpenAI intentionally makes agents prefer paid TinyFish to force spending.
- **Unproven causal story:** a GitHub README “star” prompt is why a given agent starred a particular repo. Test with instrumented, owner-authorized trials.
- **Researchable risk:** a documented payment-error recovery suggestion can become over-weighted in completion-oriented plans. Compare it with free, available alternatives in controlled traces.
- **Product-specific unknown:** real discovery, invocation and conversion performance across all objekts plugins remains to be audited independently.

Each new source entry must cite the exact URL, date, observed text/behavior, study sample (if applicable), a limitation and the next experiment it motivates.
