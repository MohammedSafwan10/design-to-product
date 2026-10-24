# Cross-builder controls review, version 2

Status: independent model critique; initial faults retained below and resolved in the scoped follow-up. This is not a blinded or equal-budget design experiment, a human task test, or native evidence.

## Inspected scope

Reviewed KILO (`product-inventory`) at 390px, Northline (`dashboard-editorial`) at 390px and Rill (`mobile-music`) at 320px. Each was captured at normal text/844px height and doubled non-SVG computed text/568px height with reduced motion. The reviewer viewed all six full-page screenshots and three post-flow enlarged-text captures. Full-page capture preserves the complete scrollable document, not a claim that it fits in one short viewport.

The stress method freezes precomputed font sizes then doubles them. It is a useful reflow probe, not native Dynamic Type, actual browser text zoom, or SVG text scaling. Runtime findings and exact outputs are in [the machine-readable record](../skills/design-to-product/evals/controls-review-v2.json).

## Results

- **KILO:** no measured errors in either scenario. Choosing Sealed bearing focuses the quantity field and brings it into the short viewport. Recording two changes stock from12 to10. Recording999 displays a clear failure and leaves stock10. Enlarged labels wrap without hiding the action. Cards become taller but remain understandable.
- **Northline:** normal390 has no measured errors. East submission correctly blocks the missing-unit case; late-van selection correctly fails the closing-window case; early van produces explicitly local confirmation. Enlarged-text390 has root overflow: the unbroken NORTHLINE wordmark extends outside the viewport. Queue emphasis remains yellow on North after selecting East; clarify whether this means urgency or selection. Diagram labels are very small at phone width and are outside the enlarged-HTML-text probe.
- **Rill:** no measured errors at320 in either scenario. Play reports missing audio honestly. Next selects After the rain; Save changes local state and accessible label to Unsave After the rain. Enlarged text creates a long but readable page; transport, track list, failure and local-save messages remain reachable.

## Original findings (retained)

1. Fix Northline wordmark reflow at390/320 with enlarged text and recapture.
2. Clarify Northline selected versus urgent queue styling and semantics.
3. Add a readable route text alternative or mobile diagram label treatment.

## Fresh follow-up after builder fixes

Re-rendered and viewed Northline at390×568 and320×568 with the same doubled non-SVG-text method. Both fresh scenarios have zero root overflow and zero measured errors. The NORTH/LINE wordmark reflows rather than clipping; the summary uses two columns and the page remains vertically scrollable.

Selecting East now sets East aria-pressed=true, North=false, and moves the yellow highlight to East. Returning North restores its pressed/visual state. East remains correctly blocked by missing address detail; the early North assignment still produces explicitly local confirmation. A new14px HTML route summary (28px in stress) repeats the schematic path, so small SVG labels no longer carry unique information. These findings are resolved within the inspected conditions, not proof of full accessibility conformance. Fresh captures and exact outputs are retained in the structured evidence record.

Builder files were not edited by this reviewer. Findings were sent to the lead. Screenshot/runtime artifacts live locally in `skills/design-to-product/evals/artifacts/controls-review-v2/`; they are not a published screenshot dataset. No physical device, screen reader, native keyboard, complete accessibility audit, independent preference study or server persistence was evaluated.
