# Art direction and visual review

Read when proposing or substantially redesigning visual directions. The goal is
a product-specific composition with convincing content and interaction, not a
recognizable collection of fashionable UI effects.

## Use the integrated direction and inspection tools

This skill bundles an original direction catalog and browser inspector. It does
not require another taste skill or inherit a single site's house style. Read
[tooling.md](tooling.md) for command options, surface profiles, evidence limits
and prerequisites. The tool proposes eligible starting hypotheses; the designer
chooses by the actual subject, task and available material.

Use the modular surface index for current candidates and load only the selected
recipe's linked modules. The legacy profile catalog remains available. A recipe
is an authored hypothesis until render/stress evidence and critique support it;
do not describe the 150 draft entries as a completed gallery study. Separate
family, composition, task, type and palette choices rather than counting their
combinations as new art directions.

Use `marketing` for a public argument or product story, `app` for task-focused
screens, and `dashboard` for data/workspace surfaces. Functional input boundaries,
compact tables and familiar system controls can be good design. Do not force
marketing conventions into every surface. Respect explicitly requested references
and existing brands. Do not claim the catalog is a research dataset or that the
inspector independently measures taste.

## Decide before decorating

- Identify the audience's first question and next meaningful action. Arrange the
  first screen to answer that question without relying on small explanatory text.
- Inventory what actually belongs to this product: its output, physical object,
  workflow, vocabulary, environment, constraints or existing visual material.
  Build a concept from that material rather than a category slogan.
- State each direction's idea in a sentence: which product-specific thing drives
  its composition, and how? Test whether changing only the company name leaves
  everything equally plausible. If so, find a more specific decision.
- Give each section or screen a job and enough real content to demonstrate it.
  Do not invent testimonials, customers, press coverage or performance numbers.
  Mark sample operational data and future capabilities clearly.
- Make concept differences structural: information order, scale, alignment,
  navigation emphasis, imagery treatment or material. Preserve comparable task
  coverage so the user chooses a design rather than accidentally losing features.

## Make the craft visible

Choose a dominant element, a legible type hierarchy and consistent alignment.
Let content length shape the composition. Use confident scale and purposeful
color fields where suitable; removing decoration must not leave an empty page.
Typography should express the identity while controls and long text stay easy to
read. Use spacing and grouping to explain relationships, not arbitrary ornaments.

Avoid the unexamined defaults: a generic oversized slogan over equal icon cards,
decorative badges, floating pill navigation, gratuitous gradients/glows, invented
dashboard bars and repeated layouts that could belong to any client. These are
diagnostic prompts, not a universal ban on components with a real product role.
Turn stylistic observations into a specific content/layout decision. An existing
brand color is not a defect merely because it is fashionable elsewhere.

Use a credible image strategy: existing assets, generated subject-specific art,
licensed material or deliberate code-native drawings. Choose based on the task.
Do not pad a scanner or dense app screen with imagery to satisfy a marketing
page's visual density. Do not present generated product photography as evidence
that a product has been manufactured. Keep essential labels, actions and dynamic
state native rather than baking them into artwork.

For interaction, choose one meaningful preview behavior when it helps prove the
design: changing a product type, inspecting an item or expanding real content.
Keep concept-only effects clearly labeled; never simulate successful payments,
delivery or media connection. Motion should support hierarchy or feedback and
respect reduced motion. Do not add spectacle to compensate for weak layout.

## Critique the render, not the intent

Inspect the actual first screen and continuation at desktop/phone sizes relevant
to the product. Read every important label at useful resolution. Check:

- Immediate comprehension and a clear next action.
- Hierarchy, alignment, section rhythm, content density and image crop.
- Typography, line wrapping, text contrast and controls that fit real labels.
- A phone composition that works on its own, including safe areas and scrolling.
- Distinction from the other concepts and continuity across related screens.
- Keyboard/focus, larger text and reduced motion where relevant to this stage.
- Honest loading, empty, error and preview states.

Fix the most consequential visible problems before proposing another direction.
Use the bundled inspector for browser evidence and repeat the visual critique
after the most meaningful fixes. A clean report is not a design judgment. If scoring helps compare concepts, label
scores as the agent's subjective critique, not independent jury or user research.
Report any material unresolved issue; never claim a screenshot/build/device check
that was not performed.

## Capture → inspect → fix → recapture

Choose a small evidence set from the actual change: the first viewport, relevant
continuation, and the states most likely to fail. Include a narrow/short viewport
and intermediate widths around a real layout transition. For control changes,
capture the opened dropdown/dialog and long selected values, not just closed
controls. Exercise keyboard focus, pointer hover where supported, and scrolling
at content boundaries. Use runtime/device evidence for native and in-canvas UI.

Open the resulting screenshots with an image/browser tool and inspect readable
detail. Record specific observations tied to route, viewport and state: clipped
value, cramped reading column, missing feedback, background scroll leak, repeated
copy, weak hierarchy or inconsistent imagery. Separate measured breakage from
subjective craft judgment. A green test suite does not dismiss a visible defect.

Fix the highest-impact observed issue within the approved scope, then capture the
same state again at comparable dimensions. Verify relevant interaction as well
as appearance, and spot-check a neighboring width/state for regressions. Stop
when concrete defects are resolved and the requested design contract is met;
avoid endless arbitrary restyling or rerunning every screen after a minor edit.
Retain useful before/after evidence in the project's ignored output directory and
record unresolved findings in the normal handoff. Do not replace screenshot
inspection with merely creating image files, source-reading or metric counts.

The builder can perform this loop autonomously with available authorized tools.
An independent reviewer is a separate evidence source, used when authorized;
self-review is not an independent comparison or a user study. If the host lacks
capture/view tools or a supported runtime, report the missing evidence and use
available checks without claiming visual or native verification.
