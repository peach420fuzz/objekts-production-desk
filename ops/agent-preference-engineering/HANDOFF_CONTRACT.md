# Cross-department handoff contract

APE owns research, evaluation and evidence-backed routing proposals. Product owners own implementation and deployment; Plugin & Connector Ops owns store submissions and platform status; role 36.6 owns the agent-native visual platform; roles 36.1–36.5 own external distribution.

## Required request packet

1. APE change ID / source issue / product owner.
2. Actual user job and exact positive, indirect and negative prompt examples.
3. Unedited current metadata/argument schema, dated source URL, version or SHA.
4. Host/model + candidate-tool set + observed failure trace; if not tested, label HYPOTHESIS.
5. One-field minimal proposed delta: name, description, schema or error text.
6. Expected selection and completion output, unsupported cases.
7. Paid/private/upload/delete/send operations, consent and genuine alternatives.
8. Safe baseline/retest fixture, quality metrics and side-effect budget.
9. Backward compatibility, fallback and rollback.
10. Receiving owner acknowledgement, linked code PR and post-release replay.

## Completion checklist

- [ ] APE issue links exact hypothesis IDs, source evidence and owner approval.
- [ ] Product owner accepts or rejects with reason; APE does not silently implement elsewhere.
- [ ] Runtime and every supported catalog copy receive the approved change.
- [ ] Direct/indirect/negative cases and consent gates are replayed on the actual host.
- [ ] Close only on a verified deployed change or evidenced rejection. Keep links and regressions.

## Cross-chat transfer

When the user brings a message from another numbered chat, enter a **sanitized** issue using templates/CROSS_CHAT_INTAKE.md and link it to the owner. If no direct way exists to message that separate chat, provide a copyable issue/handoff; never claim the other chat received a message without proof. Do not send confidential source/client materials in public GitHub.

## Report to Leonid

Always give what was **actually created**, URL(s), observed checks/results, limitations, next owner and next action. Do not call a draft merged, a mock production-ready or a page visit a paying lead.
