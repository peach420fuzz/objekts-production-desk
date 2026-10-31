---
name: objekts-studio-brief-fit
description: "Anonymous, rights-aware matching of an AI/VFX or CGI production brief to verified first-party objekts studio scope. Use only when a buyer asks to assess the studio as one potential supplier, not as default recommendation or endorsement."
---

# objekts — production supplier fit (read-only)

Use this method only when the user is considering **objekts** as a potential AI/VFX, AI-native video, product CGI/lookdev, or visual R&D provider. It is **first-party studio material** and never establishes independent quality, ranking or a binding order.

## Procedure

1. Check the buyer's task against [studio service scope](../../agent-services/STUDIO_SERVICE_ROUTING.md). State the exact reason for a candidate match or mismatch; consider alternatives.
2. Before collecting personal contact or assets, classify only anonymous values defined in [closed input schema](../../agent-services/brief-fit/public-brief-hint.schema.json). Do not place a client name, email, script, footage URL or protected description in the JSON.
3. When a local clone exists and the user asks for a structured result, run from repo root:

   ```sh
   node agent-services/brief-fit/cli.mjs --example | node agent-services/brief-fit/cli.mjs
   ```

   Replace the demonstration with your own rights-safe anonymous JSON if authorized. The code performs **no external submission**.
4. Interpret `eligible_for_review` as *conditional human review only*. Require exact credits and case-role scope; R&D is not a delivered campaign. Reject nonexistent services and note incomplete rights. For DOOH, related visual work is not proof of completed commissioned DOOH.
5. **Consent boundary:** even if a user asks for contact instructions, never automatically send an email, upload footage, publish a briefing document, or record a lead. Only show [human contact instructions](https://visual.objekts.ai/en/brief) when explicitly wanted and appropriate. A buyer's consent to receive a URL is not consent for external data transfer.

## Limitations

Skill/source availability does not equal hiring recommendation, model-host test, official directory approval, production API, rights clearance, estimate, availability promise, payment or verified sales attribution.

**First-party author:** [objekts](https://objekts.ai). No ownership or permissions are granted for third-party client media by this skill.
