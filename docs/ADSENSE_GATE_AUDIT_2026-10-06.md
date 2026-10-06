# AdSense Gate A — Editorial Inventory Audit — 2026-10-06

## Evidence

The repository review identified a high-risk legacy cohort that should not remain part of the indexable editorial inventory in its current form.

Verified examples:

- Article #2 contained unsupported first-person claims such as personal hardware modifications and personal drop-testing.
- Article #3 used the unsupported credential framing "Security Expert" in its title.
- Articles #4–#9 are short legacy buying guides relative to their stated 7–9 minute reading times and need substantive editorial expansion or consolidation.
- Several newer guides repeat a common marketplace checklist structure. Repetition is not automatically a policy violation, but it reduces differentiation when many pages follow the same template.
- The repository content-writing guidance previously used "personally tested" language that could encourage unsupported experience claims.

## Remediation executed

1. Articles #1 and #2 were rewritten to remove unsupported personal experience and exaggerated product claims and to focus on verifiable buyer-decision methodology.
2. Article #3 title was changed to remove the unsupported "Security Expert" credential.
3. Articles #4–#9 were marked indexable: false while awaiting substantive rewrite/consolidation.
4. The blog metadata now emits noindex, follow for quarantined articles.
5. The sitemap excludes quarantined articles.
6. The content-writer operating guidance was corrected so it does not require or imply personal product testing.
7. Blog article pages were already made content-first by removing direct AdSense and sponsorship blocks.

## Decision

GATE_A_PARTIAL_PASS

The highest-confidence legacy risks identified in this pass have been contained. The entire 62-article library still requires a systematic editorial quality pass before the repository can be marked READY_FOR_REVIEW.

## Next loop

Audit the remaining articles for:

- original decision value
- evidence/source quality
- repetitive structure
- unsupported claims
- commercial intent
- indexability

Then rewrite, merge, or quarantine the remaining weak cohort based on evidence.

## Gate A — full corpus reconciliation

The source inventory was reconciled against expanded-blog-data.ts and the legacy records in blog-data.ts.

### Verified corpus

- Expanded corpus: article IDs 31–62 = 32 records.
- Legacy corpus: article IDs 1–30 = 30 records.
- Total documented article records: 62.
- This resolves the earlier 61/62 documentation drift.

### Quality findings

The expanded corpus is not homogeneous. IDs 41–60 contain a repeated marketplace-guide structure with substantially overlapping language and a generic comparison checklist. Their declared read times are much longer than the amount of distinct editorial material present.

IDs 31–40 contain more developed topic-specific analysis, but IDs 32, 34, 36, 39, and 40 contain first-person/testing language that must be removed or substantiated before publication.

IDs 61 and 62 are materially more developed, but still require factual/source review before being treated as cornerstone content.

### Gate A decision

The previous blanket assumption that the expanded 31–62 corpus was indexable is rejected.

Current indexability policy:
- KEEP / indexable for now: 1, 2, 31, 33, 34, 35, 36, 37, 38, 39, 61, 62 — subject to final factual/editorial verification.
- NOINDEX pending rewrite/merge: 4–9 and 10–30.
- NOINDEX pending rewrite/merge: 41–60.
- Article #3 remains quarantined pending substantive remediation.

This leaves 12 candidate indexable articles from the current corpus before final quality verification.

This is a quality-protection decision, not a claim that Google has approved the site.

### Next gate

Remediate IDs 31–40 and 61–62 for factual integrity, source support, differentiation, and currentness. Then perform a second indexability review before merge.
