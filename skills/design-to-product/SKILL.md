---
name: design-to-product
description: Design and implement distinctive websites, apps, dashboards, game interfaces and reusable brand kits with product-specific art direction, comparable concepts, theme/layout approvals, browser inspection and working flows. Use for new interface builds or substantial visual redesigns, not isolated fixes or backend-only tasks.
---

# Design to Product

Turn an approved visual direction into a working product, not a loosely inspired
reskin. Adapt to the existing platform, audience, codebase and authorization.
This workflow is framework-agnostic; it does not require a specific engine,
backend, art style, paid service or image generator.

Honor the requested stage: a theme study, a related-screen preview, a brand kit or
a working flow. Complete that stage without presenting it as the entire product.

## 1. Establish the actual scope

- Read repository guidance and existing design/handoff documents. Inspect the
  relevant screens, navigation, state and data contracts before replacing them.
- Inventory the requested flow: screens, overlays and meaningful states. Count
  states separately from routes; loading, failure and victory are not necessarily
  separate pages. Tell the user what is in scope and what remains.
- Identify audience, platforms, primary action, density and existing brand. Ask
  only for choices that would materially change the direction. Preserve stated
  choices; do not ask the user to choose an already approved theme again.
- Separate visual changes from authorized logic changes. A redesign does not
  authorize a schema migration, new monetization, analytics or a new backend.
  If backend improvements are requested, inspect them alongside implementation.
- Use current primary sources when research is requested or decisions depend on
  changing platform guidance. Record relevant findings, not a generic trend list.
- For visual-direction work, read
  [references/art-direction-and-review.md](references/art-direction-and-review.md).
  The direction catalog and browser inspection are bundled here; no separate
  frontend taste skill is required. Choose the marketing, app or dashboard
  inspection profile according to the actual surface.

## 2. Present distinct directions

Default to three concepts for the first representative screen; honor a different
number requested by the user. Distinguish composition, material, typography and
interaction hierarchy, not just color palettes.

- Keep features and example content comparable so the choice is meaningful.
- Build each direction around the product's actual subject, content or physical
  artifact. Vary composition, typography, imagery and interaction emphasis;
  changing the accent color of the same layout is not another direction. Use
  `node <skill>/scripts/directions.mjs --profile marketing --count 3 --seed 7`
  for original catalog suggestions when useful. Pass actual assets with `--assets`
  and existing brand roles with `--keep`; then use subject/task judgment to select.
  See [references/tooling.md](references/tooling.md) for options and limits.
- Choose an appropriate mockup method: generated raster for art-led concepts,
  editable HTML/design tooling for interactive or text-dense products. Use the
  applicable available skill when generating images. Do not mandate raster art
  for dashboards or treat every product as a glossy game.
- Show each concept clearly labeled, with target viewport and a short rationale.
  Give a recommendation based on the audience and implementation tradeoffs.
- Provide a viewable comparison and usable preview links when supported. Inspect
  the rendered concepts yourself; source files alone are not a visual handoff.
- Make essential controls and long labels plausible. Mockup images can contain
  invented values; clearly distinguish concept data from live functionality.
- Pause for selection before expensive downstream artwork or major visual
  implementation. If the user already approved a reference or delegates the
  choice explicitly, proceed without another approval loop.
- If concepts miss the requested style, identify the concrete mismatch and
  revise only the relevant direction. Do not generate endless random variants.
- Record what was selected: theme/feel, specific layout, complete flow or assets.
  Approval of colors and fonts does not freeze every composition, and an exact
  approved layout should not be casually redesigned. Keep unresolved choices
  explicit without asking the user to approve the same theme again.

## 3. Extend the selected direction

Inspect every approved image yourself at useful resolution. Define a compact
design contract: layout proportions, typography, palette, materials, shadows,
art scale/camera, controls, safe areas and responsive behavior.

Create separate related-screen mockups in the selected family, batching a coherent
flow rather than unrelated pages. Include key setup, active, result and dialog
states where applicable. An approved family can permit direct implementation of
minor states; do not impose a fresh selection round for every dialog.

Preserve the product's shared navigation and accessibility conventions. Different
games or sections may have distinct art directions while keeping common behavior.
Do not turn a game-specific theme into a universal app requirement.

When a product spans web and mobile, demonstrate the chosen family on a few
representative screens before broad implementation if that helps the requested
review. Carry identity across platforms; compose each viewport for its actual
task instead of shrinking a desktop screenshot. Label HTML/raster app studies
as studies rather than claiming a native app exists. For theme/brand previews
and selected-reference organization, read
[references/visual-handoff.md](references/visual-handoff.md).

## 4. Prepare production assets deliberately

- Make an asset manifest: role, source, license/provenance, dimensions, alpha,
  budget and intended fit. Generate/download only missing assets needed now.
- Use isolated artwork and text-free backgrounds. Keep interactive text,
  counters, controls and dynamic state native to the chosen framework.
- A perspective hero is not a playable board. A 3D-looking illustration can be
  implemented in 2D; use real-time 3D only when interaction justifies its cost.
- Preserve subject boundaries and cohesive lighting/material/camera across a
  set. Request real transparency for cutouts, inspect alpha and edge halos, and
  test on both light and dark backgrounds. A checkerboard is not transparency.
- Select contain versus cover intentionally. Do not fix a missing subject by
  zooming the entire composition. Use layered assets for responsive composition.
- Inspect final assets after compression/cropping, register them correctly and
  keep source mocks separate from shipped assets. Check resolution and memory
  cost at device scale, not just desktop preview quality.
- When reusable branding is requested, separate source masters from screens.
  Prefer editable vector assets for logos/marks and code-native controls; use
  image generation for artwork that benefits from raster imagery. Bundle font
  licenses/provenance, and outline wordmark exports when predictable rendering
  requires it. Export icon sizes/layers only for relevant targets and check their
  current platform requirements; a generic square PNG is not every platform's kit.
- Use native animation, parallax or sprites for motion according to need; avoid
  a large GIF as the default background solution. Support reduced motion.
- For sound or animation latency/game feel, read
  [references/game-feel-and-audio.md](references/game-feel-and-audio.md).

## 5. Implement a complete vertical slice

Build the selected entry screen and one complete flow before spreading the design
across everything. Reuse tokens and components where behavior actually repeats,
without a large speculative abstraction layer.

- Match major proportions first, then artwork scale/type, then depth/detail.
  Preserve every approved action; do not silently remove features to make it fit.
- Use available-height layout for intended one-page menus. Reserve space for
  primary actions and shrink decorative art before shrinking readable labels.
- Default phone checks: 320x568, 360x800, 390x844 and 430x932 logical pixels;
  add tablet/desktop widths for products that support them. Replace defaults
  when project targets specify different sizes.
- Include safe areas, keyboard, larger text, long/localized labels, focus order,
  readable contrast and practical touch targets. Allow intentional scrolling on
  content-heavy or accessibility layouts; don't force a dashboard into one page.
- Check transition frames as well as static screens. Prevent intrinsic-size
  collapse, one-letter wrapping, disappearing heroes and controls shifting when
  async indicators appear. Keep layout slots stable during loading/animation.
- Preserve navigation, valid stored data and settings. Handle empty/loading/
  failure/offline states where relevant; show honest data rather than decorative
  controls that do nothing. Report showcase-only limitations if requested.
- Review backend/domain behavior as part of each slice. Read
  [references/logic-and-verification.md](references/logic-and-verification.md)
  for the relevant risk category; do not run every scenario indiscriminately.
- Delegation is optional and only used when authorized. Give a logic reviewer a
  bounded contract and avoid simultaneous edits or shared-test storage conflicts.

## 6. Compare, verify, and hand off

For browser surfaces, run the bundled inspector with the appropriate profile:

```text
node <skill>/scripts/inspect.mjs <URL-or-HTML> --profile marketing
node <skill>/scripts/inspect.mjs <URL-or-HTML> --profile app --reduced-motion
```

Read the JSON report and screenshots. Fix functional errors; review warnings and
visual advice with reasons. There is no color ban, media quota or required
animation count. A clean report is not an aesthetic score or a full accessibility
certificate. Inspect task completion and visual craft separately. Use native
platform tooling for native builds and device behavior.

Capture the running implementation using an available platform-appropriate tool;
compare it with the approved reference at a comparable logical viewport. Inspect
hierarchy, crop, spacing, wrapping, contrast, materials and missing details. Do
not claim screenshot verification when only source inspection was possible.

Use proportional checks: focused regression tests after meaningful changes;
analyzer/type checks and the applicable final build before handoff. Run broader
tests when risk or repository guidance requires them. Avoid rebuilding a native
package for each spacing edit. New bundled assets/plugins may require a restart
or reinstall rather than hot reload.

Inspect intentional golden/screenshot changes visually; rerun the focused checks
without baseline-update flags. Distinguish pre-existing failures from regressions
with evidence. Never overwrite unrelated baselines to manufacture a green suite.
Record what was checked, what failed, and what was not verified. Do not promise
"bug-free", "production-ready" or "unbeatable" without supporting evidence.

Maintain one concise project-local handoff document with:

- approved reference paths and composition decisions;
- selected theme versus approved layouts, and anything still exploratory;
- screen/state checklist: approved, implemented, visually verified;
- production asset provenance, licenses and transforms;
- logic contracts, known risks and validation commands/results;
- next exact task and any approval still needed.

Remove legacy code/assets only after checking repository-wide callers and shared
usage. Preserve unrelated edits and exclude temporary processing files, failure
images and generated platform noise from commits. Commit logical changes and
push/release only when authorized, respecting the user's branch instructions.
After a choice, make the selected references easy to find. When cleanup is
requested, remove obsolete selection prompts and update preview links, shared
styles and checks together; archive unselected work proportionately before
removal when recovery is needed. Verify the chosen assets still load. Distinguish
saved locally, versioned in Git, backed up, pushed and deployed; they are different
states. Do not create a full-project ZIP on every iteration by default.
Finish with the outcome, relevant limitations and the next sensible screen.
