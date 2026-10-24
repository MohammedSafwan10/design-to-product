# Design to Product: next-version plan

Planning date: 24 October 2026. Status: **proposal and initial source review**.
The current shipped catalog still contains 12 flat entries and three browser
profiles. No 150-entry library, native adapters, gallery study or comparative
design benchmark has been completed by this planning work.

## Outcome

Build a self-contained design system and workflow that produces distinctive,
appropriate, usable interfaces across surfaces. Aim for professional craft:
specific ideas, strong typography and composition, coherent imagery, intentional
interaction, complete states and verified behavior. A memorable first impression
must survive use, content changes and small screens. Do not promise virality,
Apple/Figma endorsement or universal superiority.

The source review found a thin catalog and real inspection gaps. More entries
alone will not fix either. Research, rendered examples, counterexamples and
evaluation must drive expansion.

## 1. Surface coverage and library targets

| Surface | Primary design concerns | Coverage target after pilot |
| --- | --- | --- |
| Public/marketing web | Content argument, proof, identity, imagery, first action, section rhythm, phone composition | 25+ reviewed recipes |
| Product web | Real tasks, navigation, forms, multi-step flows, permissions, recovery | 25+ reviewed recipes |
| Mobile apps | Touch, thumb reach, safe areas, keyboard, large text, interrupted/offline flows, platform navigation | 25+ reviewed recipes |
| Desktop apps | Resizable windows, keyboard/commands, panes, menus, document/workspace persistence | 25+ reviewed recipes |
| Dashboards/workspaces | Information priority, density, tables, charts, filters, exceptions, drill-down, audit context | 25+ reviewed recipes |
| Game interfaces | HUD/world readability, input mode, safe zones, action feedback, menus, inventory, pause/settings | 25+ reviewed recipes |

The target is at least 150 **surface-specific recipes**, not a claim that 150
fundamentally different art-direction families exist. Shared families can have
meaningful surface adaptations. Report unique families and adaptations separately.
Palette/font swaps do not count as additional directions. Brand kits are a shared
asset capability, not an excuse to duplicate a surface catalog.

Pilot 6–8 rendered recipes per surface first. Grow to 25+ in reviewed batches only
when each batch fills an actual coverage gap. Counts are a planning target, not
a reason to publish filler or describe draft entries as validated.

## 2. Separate the reusable dimensions

| Module | Contents and review requirements |
| --- | --- |
| Art-direction families | Product-specific idea, hierarchy, composition, material/imagery language, fit and failure cases |
| Surface recipes | A family's task-appropriate navigation, layout, density and responsive/resize behavior |
| Hero/entry compositions | Marketing claim/evidence and artifact demonstrations; app entry hierarchy; desktop workspace entry; game menu/HUD composition |
| Section and screen patterns | Marketing sections plus search, list/detail, capture/review, checkout, settings, timeline, monitoring, inventory and other real tasks |
| Typography systems | Roles, licensed font choices, metrics, fallbacks, numerals, script coverage, zoom/Dynamic Type and localization behavior |
| Palette systems | Semantic colors, light/dark variants, contrast pair evidence, status/chart colors, high-contrast and non-color cues |
| Imagery treatments | Original photos, generated context art, illustration, product UI, framing, crop rules, provenance, delivery budgets |
| Motion and input | Hierarchy/feedback intent, input conventions, state transitions, reduced-motion alternatives, controller/keyboard/touch behavior |
| State contracts | Loading, empty, denied permission, offline, failure, recovery, interruption and truthful success |
| Evidence | Sources, rights, rendered examples, stress cases, observations, uncertainty and review status |

Initial token/pattern pilots should be small: approximately six typography
systems, eight semantic palette systems and six imagery treatments, expanded
only when actual recipes need them. Do not generate arbitrary hundreds of
combinations or prescribe a universal number of pictures, colors or animations.

Use a lean searchable index with per-entry files. Load only the relevant surface,
task and selected recipe. A bigger catalog must not inflate every prompt or make
agents inspect hundreds of unrelated presets.

## 3. Recipe schema and distinctness

Proposed fields:

```text
id, version, familyId, surface, title, idea, audience, tasks,
worksWellWhen, avoidWhen, distinctFrom, density, navigation,
composition, patternIds, typeRecipeIds, paletteRecipeIds,
imagery, requiredAssets, inputModes, brandConstraints,
responsiveRules, stateContracts, accessibilityRisks,
performanceBudget, sources, examplePaths, reviewStatus
```

Every published recipe should have a representative original render, a second
content/state stress case, actual fit/avoid rationale and review evidence. Prefer
structured constraints to long generic prose. Store draft, reviewed and validated
states explicitly. Validate references, duplicate ideas, missing examples and
unsupported combinations.

Selection order: hard constraints first (surface, actual task, input, content
density, brand, language/scripts, assets, budget), then explain the fit of several
structurally different options. Seeded randomness may break ties. The current
selector does not understand the brief; richer constraints and reasoning must
not be presented as semantic matching before implemented and evaluated.

## 4. Research program

### A. Platform and design-system foundations

Research current official guidance before creating platform-sensitive recipes:
Apple Human Interface Guidelines, Material/adaptive layouts, Fluent, WCAG and
Xbox Accessibility Guidelines. Derive interaction/layout principles and cite
them; do not flatten each system into a decorative theme or copy a branded UI.

### B. Product and craft observations

Pilot approximately 12 public reference cases per surface (72 across six surfaces).
This is exploratory coverage, not a representative industry sample. Include
ordinary effective products alongside editorial/gallery references. Balance
content density, device/input, audience, language, assets and important states.
Study complete public flows where access allows, not only hero screenshots.

Record URL, author/product, date/version, task/audience, viewport/input, examined
states, observed principle, counterexample, uncertainty and allowed reuse.
Preserve source type: standard, platform guidance, first-party case study,
controlled study, gallery observation, model critique or human/user test.

Public access does not grant redistribution rights. Publish links, original
diagrams and owned/permissioned examples. Do not repackage copyrighted screenshots,
fonts, logos, code or another skill's curated dataset without suitable rights.
Do not collect authenticated/private customer screens without authorization.

### C. AI-generated design failure research

Study actual broad-prompt and context-rich outputs rather than assuming a fixed
list of colors or components identifies AI work. Candidate failure patterns:

- Generic slogans with weak task hierarchy or no content-specific idea.
- The same hero/card sequence across unrelated products.
- Decorative charts, unsupported metrics and imagery that proves nothing.
- Poor typography, default-looking token combinations and inconsistent density.
- Desktop composition squeezed onto phones; missing keyboard/controller states.
- Attractive initial screens with incomplete loading, recovery and real flows.
- Prompt fixation: repeated variations of the first generated idea.

These are hypotheses to inspect with counterexamples, not universal bans. A card,
gradient, serif, system font or purple brand can be intentional and effective.
Use observations to make decisions and test results, rather than inventing an
automatic “AI slop percentage.” Distinctiveness and memorability can be reviewed;
virality cannot be guaranteed by a library or screenshot score.

## 5. Inspector evolution: repair, then extend

The council identified specific present-code limits: narrow desktop Chromium is
not mobile/device testing; inline spans can evade heading checks; accessible-name
inference is incomplete; links are excluded from target checks; clipping is mainly
horizontal/control-only; overlap/empty-section detection does not yet exist.

### First: correct baseline evidence

- Measure whole headings including descendant inline text.
- Add explicit viewport tuples, short heights, touch/pointer/DPR settings where
  applicable, while clearly labeling emulation and native/device limits.
- Improve accessible naming using browser accessibility-tree evidence or a
  reviewed optional standards-based auditor. Treat uncertain heuristics as uncertain.
- Include actionable links; distinguish inline-text/spacing exceptions. A 44px
  comfort target is not the universal WCAG AA requirement.
- Add vertical/ancestor clipping and nested-scroll evidence.
- Record readiness/font-timeout outcomes and the scenario actually inspected.
- Distinguish intentionally unused font faces from fallback in visible text.

### Then: layout diagnostics

- Prioritize essential controls occluded by nonancestor layers and fixed chrome
  hiding focused/primary controls, using bounded hit-testing and context.
- Add suspicious text/media collision evidence for review; rectangle intersection
  alone is not a defect (menus, dialogs and illustrations legitimately overlap).
- Add content-density/whitespace maps as advice. Empty states, intentional pauses,
  virtualized tables and canvas regions must not be failed for having blank pixels.
- Inspect selected scroll positions and internal regions; preserve evidence coordinates.
- Add keyboard/focus, dialog/menu, text enlargement, localization, reduced motion
  and loading/error scenario checks as separate authorized tests.

Proposed finding model:

```text
status: pass | fail | unverified | not-applicable
severity: error | warning | advice
confidence: high | medium | low
surface, route, scenario, viewport, inputMode, scrollPosition
ruleId, method, elementEvidence, screenshotCoordinates
coverageLimits, manualReviewStatus
```

Zero findings is not a global pass. Each check must state its coverage. New
detectors need labeled fault fixtures and legitimate counterexamples; measure
false positives and false negatives before making a heuristic a blocking rule.
Keep subjective craft outside deterministic error totals.

### Surface adapters

DOM/browser inspection is one adapter. Native mobile/desktop need screenshots
plus semantics, input and device/runtime evidence from the actual platform.
Canvas/WebGL games need frame, input and scene/UI evidence or accessible overlays;
DOM measurements cannot certify in-canvas labels or hit targets. Unsupported
surfaces return unverified coverage. A themed menu does not prove a usable HUD.

## 6. Design-system quality

Use semantic tokens and component/state contracts, not only preset palettes.
Cover typography roles, spacing, density, surfaces, status, interaction states,
focus, motion, imagery and icon rules. Keep design tokens portable and adapters
appropriate to the actual project stack. Avoid imposing React/Flutter/Figma or
a particular component vendor on every user.

For Figma-targeted work, use editable components, properties/variants and variable
collections when a suitable authorized tool is available. Otherwise provide a
clear token/component specification and real code previews, labeled honestly.
Do not claim a Figma design file exists when only HTML or raster mocks were created.

## 7. Evidence and comparative evaluation

Keep three scorecards separate:

1. Craft: hierarchy, type, composition, imagery, product specificity, cohesion and
   meaningful distinction between concepts, with written screenshot evidence.
2. Use: first-action comprehension, unassisted task success, critical errors,
   recovery, completion-time distributions and qualitative confusion.
3. Technical quality: behavior, accessibility, overflow/clipping, keyboard/focus,
   larger text, localization, motion and relevant performance/build checks.

An attractive average cannot hide a failed critical task.

Start with a small benchmark on marketing/mobile; extend to two briefs per surface
(12 briefs across six surfaces). Compare frozen current/proposed versions under
the same model/tools/content/assets/build budget. Original Design Taste is a
comparison only for marketing scope it supports. Use platform-guided baselines
for native/game work. Record failures/retries and cost, not only final screenshots.

Randomize anonymous A/B presentation and allow ties. Review full flows as well as
first impressions. Builders should not judge their own outputs. Independent
model critics are useful screening, but correlated models are not substitutes
for human designers or intended-user task tests. Record reviewer identity/model,
rubric version and disagreements. Use humans when access/budget permits; do not
invent user results when they are unavailable.

Hold out briefs/brands/families from development, freeze the rubric before running
comparisons, and report sample limits/uncertainty. A large gallery collection is
not proof of causal improvement. Run cheap regression fixtures on tooling changes;
reserve generated comparisons for substantive revisions and cap iterations/spend.
Approve substantial paid generation or participant work separately when needed.

Evidence ladder: tested tooling → measured detector performance on fixtures →
blinded preference on specified briefs → task-success evidence for specified users.
Do not skip to “best”, “senior-level” or “better across platforms” from model votes.

## 8. Council workflow and decisions

For this planning turn the user authorized subagents. Three read-only reviewers
examined library architecture, evaluation methodology and inspection tooling.
They did not edit files or run a human study. Their findings inform this proposal;
their agreement is not validation of design quality.

When future work authorizes a council, separate the builder, craft critic,
interaction/accessibility reviewer and evidence reviewer. Give each a bounded
contract; keep anonymous evaluators separate from builder rationale. The lead
resolves disagreements by evidence and records unresolved risks, rather than
treating majority vote as proof. Independent work can run in parallel; shared
asset/implementation edits need clear ownership.

## 9. Build sequence and release gates

| Phase | Deliverable | Gate before expansion |
| --- | --- | --- |
| 0: baseline correction | Inspector coverage/status fixes and labeled fixtures | Tests demonstrate both faults and legitimate counterexamples; claims match coverage |
| 1: research/taxonomy pilot | Evidence register, schemas and coverage matrix | Sources/rights recorded; surface/task/style distinctions reviewed |
| 2: rendered library pilot | 6–8 recipes per surface plus needed type/palette/pattern modules | Original renders, stress cases, fit/avoid rationale and critique exist |
| 3: evaluation pilot | Frozen-version blind comparisons and task checks where feasible | Report failures, ties, costs and limits; resolve critical regressions |
| 4: controlled expansion | 25+ reviewed recipes per surface and browsable catalog | New entries fill gaps and remain distinguishable; relevant-only loading works |
| 5: adapters/release | Native/game evidence adapters, documentation, packaging | Platform claims verified on supported runners/devices; honest unsupported states |

Some research and baseline repair can proceed in parallel. Do not defer native/game
evidence until making cross-platform claims. Stop or revise a batch when it adds
no distinct coverage, produces repeated compositions or worsens task behavior.
The next sensible execution step is phase 0 plus the phase 1 research register.

## 10. Initial sources reviewed

These seed the research program; they are not a completed gallery/product study.

- [Figma: What is good design in the age of AI?](https://www.figma.com/blog/what-is-good-design-in-the-age-of-ai/) — first-party practitioner perspectives on context, fundamentals and design/code iteration.
- [Figma: You never stop cultivating taste](https://www.figma.com/blog/you-never-stop-cultivating-taste/) — practitioner perspective on critique and care across screens, languages and states; not an experiment.
- [NN/G: AI prototyping in real design contexts](https://www.nngroup.com/articles/ai-prototyping/) — evaluation of specific prototype tasks/prompts; do not generalize one project to every tool or platform.
- [CHI 2024: Design fixation and divergent thinking](https://arxiv.org/abs/2403.11164) — controlled visual-ideation study; relevant to fixation risk, not direct proof about production UI usability.
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) and [accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) — platform foundations and adaptable accessible interfaces.
- [Material canonical layouts](https://m3.material.io/foundations/layout/canonical-examples/overview) and [Android canonical layout guidance](https://developer.android.com/develop/ui/views/layout/canonical-layouts) — adaptive feed, list/detail and supporting-pane structures.
- [Fluent layout](https://fluent2.microsoft.design/layout) and [typography](https://fluent2.microsoft.design/typography) — product/workspace structure and typographic roles.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [target size explanation](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — web accessibility requirements and exceptions.
- [Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines) and [UI navigation](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/112) — game-specific text, input and navigation concerns.

## 11. Implementation checkpoint — 24 October 2026

The original proposal above remains the target and quality gate. The subsequent
implementation added a modular 150-entry **draft** catalog, 20 families,
18 compositions, 36 task patterns, six differentiated candidate typography
ramps, eight opaque semantic palettes and six imagery treatments. The earlier
12-entry selector remains compatible. Exact constraints and family variety are
implemented; semantic prose matching is not.

Thirty-six original browser interface studies now have local interactions,
normal/interrupted states and 72 packaged PNG renders. A searchable catalog loads
the index and selected entry. These are six screens/compositions per surface
within coherent product identities, not 36 unrelated finished brands or native
applications. The studies demonstrate part of the recipe idea, not exact use of
every suggested font and palette module.

Phase 0 now includes heading aggregation, cautious control naming, actionable
link targets, vertical/ancestor clipping, bounded occlusion warnings, sparse-region
advice, explicit viewport tuples/touch emulation, readiness and uncertainty.
Regression fixtures include legitimate overlaps, scrolling, inline links and
text outside a painted ancestor. These remain bounded browser heuristics.

The research register records 11 substantive source reads and two unverified
retrievals. Twelve frozen development briefs and a blind-review protocol exist;
no paired builds or intended-user study has run. All recipes remain draft. A
model council reviewed source/schema/tooling during implementation; its final
independent screenshot-review pass did not complete because the delegated turns
hit an account usage limit. Builder screenshot review and automated checks are
recorded separately in the implementation review.

Next quality work: independent critique of the rendered pilot, richer content
stress cases, recorded public-product/gallery observations toward the exploratory
sample, frozen paired builds, and actual native/game runtime adapters when those
runners exist. These are required before broad reviewed/validated claims. The
new library is usable as a candidate reference while that evidence accumulates.


## 12. Research and runtime checkpoint — 24 October 2026

Added 12 independently authored product identities, 14 substantive primary-source
craft records, two deeper craft references and independent model screenshot
critique. Reviewers captured new/older examples, exercised local actions and
reported concrete defects. Builders corrected those issues; fresh independent
captures resolved headline clipping, small chart labels, enlarged-text overflow,
selection inconsistency and action placement. Scope and initial failed captures
are retained. The comparison is unblinded and uses different briefs/budgets;
the frozen equal-budget benchmark remains unexecuted.

Windows Flutter native integration now passes route/offline, audio control/failure
and a small playable 2D keyboard puzzle. Seven render-boundary captures and source
fingerprints are packaged. A separate critic found a clipped native audio failure
message and unclear slider glyph; both were fixed, hot-reloaded, re-tested and
re-viewed. Flutter analysis reported no issues and live runtime checks found no
errors. These are Windows/harness findings, not Android/iOS, physical device,
assistive-technology, audio output, controller or 3D-engine evidence.

Android SDK lacks a connected device/emulator and has incomplete licensing.
No license terms were accepted or production configuration altered. Device and
platform-specific verification remains pending rather than being replaced by a
Windows phone-shaped composition. All 150 library recipes remain draft; reviewed
example artifacts are separate evidence, not automatic promotion of every recipe.
