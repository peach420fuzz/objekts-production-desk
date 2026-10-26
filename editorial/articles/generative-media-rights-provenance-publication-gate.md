# A Frame Is Not Publishable Just Because You Generated It: The Rights-and-Provenance Gate

*objekts / Production Field Notes · 26 October 2026 · Rights-sensitive visual production and editorial reuse*

**For:** art directors, producers, agencies, AI image artists, VFX coordinators and editorial teams. [About objekts](https://objekts.ai/en/about).

A generative production board is full of useful material: mood references, artists' frames, campaign stills, performer portraits, digital costume tests, unsuccessful generations, model outputs and approved final images. They may all live on the same canvas. Yet they do **not** share one publication license.

The fact that an image can be downloaded does not prove that the studio can publish it. The fact that a prompt was written in-house does not grant rights to the photographs that conditioned it. A signed output file does not automatically grant a performer-likeness release. A public portfolio page is not a general syndication license.

For a creative studio trying to communicate its expertise, the solution is a visible rights matrix tied to each derivative asset, not a blanket footer declaring "all rights reserved".

## 1. Four questions before publication

For every intended post, article illustration, Pinterest graphic or conference slide, answer these questions independently.

1. **Who created or owns the components?** Photography, production design, music, typefaces, logo, performances, stills and raw visual references can have distinct rightsholders.
2. **What permission was actually granted?** Internal exploration, client presentation, private pitch, public portfolio, paid campaign, editorial feature, social redistribution, print display and sublicensing are different uses.
3. **Who or what is depicted?** A performer, recognizable location, copyrighted artwork, branded package or private document may introduce additional restrictions.
4. **What does the proposed publication reveal?** A final public visual might be cleared while its concept board, job ID, actor reference, private brief or deleted alternate remains confidential.

Record the answer with a source document or explicit owner confirmation. If a permission is only inferred from silence, the safe status is UNKNOWN, not APPROVED.

## 2. Build a component-by-component rights sheet

*Fictional example; all titles and parties are illustrative.*

| Asset | Provenance | Allowed production use | Public social? | Editorial? | Gate |
|---|---|---|---|---|---|
| Studio-written method diagram | Drawn in-house from generic geometry | Internal + portfolio | YES if original components verified | YES | Source proof + QC |
| Licensed stock photograph | Vendor asset with specific license | Production within license terms | CHECK license and redistribution mode | CHECK | License text, credit if required |
| Performer portrait | Supplied by campaign production | Private face/wardrobe lookdev | HOLD | HOLD | Likeness and photo permission |
| Client product artwork | Supplied under NDA | Approved commercial composite | HOLD | HOLD | Client/publicity approval |
| Approved client final frame | Cleared for campaign delivery | Paid creative output | MAYBE | MAYBE | Portfolio and republishing rights differ |
| Original generated abstract texture | Created entirely in studio | Internal graphics | REVIEW | REVIEW | Third-party dependencies and terms |

The distinction between source **usage** and asset **redistribution** matters. A photographer might permit a reference image to inform private lighting studies without permitting its pixels to appear in a design community post.

Do not force every studio team to become a lawyer. Make the producer or rights owner responsible for a traceable decision, and send unresolved cases to qualified review. This article offers a workflow, not jurisdiction-specific legal advice.

## 3. Separate provenance evidence from permission

Technical provenance systems help answer what happened to a file. They do not substitute for contract scope.

The C2PA specification describes signed provenance and editing-history assertions. Its official explainer specifically notes that provenance may be incomplete and that provenance alone cannot establish whether content depicts truth ([C2PA Explainer, §7.2](https://spec.c2pa.org/specifications/specifications/2.4/explainer/Explainer.html)). The [C2PA Content Credentials specification](https://spec.c2pa.org/specifications/specifications/2.4/specs/ContentCredentials.html) defines the technical framework; it is not a universal catalog of human consent or derivative publishing rights.

A useful model has three independent ledgers:

- **File provenance:** original hash, storage path, tool/export chain, source author when known, available C2PA metadata.
- **Contract/permission evidence:** rightsholder, territory, media, duration, paid/organic distribution, adaptation rights, credit terms, revocation or embargo.
- **Creative approval:** which specific image, version, frame crop and accompanying caption were signed off.

A file can pass one ledger and fail another. Do not label it "cleared" until all mandatory gates pass.

## 4. Derived graphics need their own audit

Suppose an art director designs a vertical graphic using a campaign frame, adds typography and posts it as an authorial case study. The added layout does not automatically neutralize the source photograph's rights.

Audit the derivative as a new object:

1. **Pixels:** what exact regions come from third-party sources?
2. **Likeness:** faces, identifiable bodies, tattoos, voices and gestures.
3. **Marks:** logos, typography, packaging, film titles, trademarks and credited collaborators.
4. **Claim:** does the copy accurately represent the studio's role? "Created the film" is different from "AI look-development test".
5. **Context:** is the image shown in a manner that suggests a partnership, award or endorsement that was never granted?
6. **Distribution:** organic Pinterest, paid social, news interview and award submission can have different permissions.

If a concept is visually strong but its rights are uncertain, create a **new fully original technical illustration** showing the same production principle. This often communicates expertise more clearly than a high-gloss still that requires a dozen disclaimers.

## 5. Protect the rejected and confidential material

A rejected output is still an asset, but rejection has multiple meanings:

- rejected for anatomy or visual quality;
- rejected for wrong product geometry;
- rejected because the client changed direction;
- rejected due to rights uncertainty;
- rejected for internal political or legal reasons.

You cannot infer publication permission from the technical reason alone. In fact, a rejected image may reveal confidential concepts or use an unapproved performer transformation that should never be public.

For a private production canvas or ZIP, establish an **explicit export boundary**:

**Internal record → de-identification → original-method extraction → new illustrative example → producer/rights QC → public manuscript → platform-native derivative.**

Keep raw job identifiers, account tokens, unreleased reference boards and private client URLs behind that boundary. An educational article about the methodology does not need these items to be useful.

## 6. Copy and attribution are also visual production assets

An editorial caption should separate facts into categories:

| Claim | Evidence required |
|---|---|
| "Studio developed visual look tests" | Original work products and the confirmed role |
| "Studio directed and delivered the final commercial" | Production credit and delivery confirmation |
| "Featuring [performer]" | Correct name and publication scope |
| "Won [award]" | Official award listing and exact project |
| "AI-generated" | Honest method description; no implication that a vendor is a producer |
| "Editorial by objekts" | Authorship and rights to supplied illustrations |

Write copy based on what is documented, not what a marketing opportunity would ideally sound like.

A useful source map for an article should contain the work name, author, source page, date, specific teaching point and what the studio independently reinterpreted. A source map is not a license: it makes intellectual lineage clearer but does not authorize image reuse.

## 7. Maintain immutable receipts

The rights registry should use stable asset IDs, content hashes and version IDs. Recommended fields:

- asset_id / derivative_of
- original creator/rightsholder
- material categories (photo, face, music, graphics, script)
- permissions as scoped media/territory/duration rather than one Boolean
- byline and collaborator-credit obligations
- confidentiality/embargo restrictions
- owner, reviewer, evidence link, decision date
- generated output hash, crop/master hash
- allowed publication destination
- current status: PRIVATE, REVIEW_ONLY, APPROVED_INTERNAL, APPROVED_PORTFOLIO, APPROVED_SOCIAL, HOLD, REJECTED

Never mutate a past approval retroactively. Record a new decision with a date and an explicit change. If a social post is pulled or permission withdrawn, the ledger should preserve the history of where it was placed and what response is required.

## 8. Practical five-minute editorial gate

Before an image accompanies a publicly distributed article:

- [ ] Source media and creators identified
- [ ] Public redistribution right verified for **this exact destination**
- [ ] Actual studio credit and collaborators confirmed
- [ ] Performer/likeness, brand and location reviewed
- [ ] No NDA, raw Canvas evidence or rejected private variants exposed
- [ ] Crop, caption, languages and context approved
- [ ] New derivative exported, visually QC'd and hashed
- [ ] Real external URL and publication time recorded only after the post exists

If any line is unknown, publish the **text method** and an original diagram instead, or hold the case illustration.

### A small original example

Instead of uploading an unapproved celebrity lookdev board, an art director publishes a schematic of a neutral fictional face with three overlays: anatomical invariants, costume transformation and camera/light treatment. The diagram conveys a rigorous workflow without repurposing the celebrity portrait or the confidential brief.

That is still a valuable publication. It demonstrates how the studio thinks and provides a process that another artist can test.

**Bottom line:** production access, technical provenance, creative approval and publishing rights are four different things. Strong public editorial strategy respects all four.

---

### Source map

- **C2PA, Content Credentials Technical Specification 2.4:** first-party technical description of content provenance and authenticity assertions.
- **C2PA, Explainer 2.4 §7.2:** first-party limits of completeness and truth judgments.
- **objekts first-party studio methodology:** asset/rights/approval separation, generalized and de-identified. The fictional rights matrix is editorial pedagogy, not a record of any client permission.

*No client, performer or third-party imagery reproduced. No legal entitlement is inferred from the cited specification.* Related: [Reference Provenance](reference-provenance-role-based-image-control.md), [Identity Continuity](identity-continuity-generative-stylization.md). [Studio contact](https://objekts.ai/en/contact/).
