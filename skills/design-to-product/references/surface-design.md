# Surface design

Choose the actual surface and task before a visual recipe. The guidance below is
an original synthesis; linked sources are foundations, not copied templates.
Reviewed 24 October 2026. No listed product was task-tested for this document.

| Surface | Compose around | Stress before expanding |
| --- | --- | --- |
| Marketing web | A specific claim with credible evidence; product artifact, output or place supplies the visual idea | Phone composition, long content, real first action, image failure, slow loading |
| Product web | Current task, navigation and progress; reveal complexity as needed | Form validation, back navigation, permissions, empty/offline/retry, keyboard |
| Mobile app | Primary action, touch reach, readable content, safe areas and continuity | Short screen, keyboard, large text, interrupted flow, denied permission, rotation |
| Desktop app | Persistent work context, commands, resizable panes and documents | Narrow/short window, keyboard only, focus transfer, unsaved changes, restoration |
| Dashboard | Decision or exception, relevant comparison and drill-down context | Missing/stale data, zero vs unknown, long labels, filtering, dense tables, permissions |
| Game UI | Playfield readability and immediate input feedback; stable HUD and accessible settings | Busy/light/dark scenes, controller/keyboard/touch, pause/resume, focus and remapping |

Android's [canonical layouts](https://developer.android.com/develop/ui/views/layout/canonical-layouts)
provide adaptive structures. Treat window space and task relationships as layout
inputs; do not assume that a wider phone screen is a desktop workspace.

[VS Code's interface documentation](https://code.visualstudio.com/docs/editing/getting-started/userinterface)
is a source-described desktop example of persistent work areas and configurable
panes. [Grafana's dashboard documentation](https://grafana.com/docs/grafana/latest/visualizations/dashboards/)
describes panels built from queries and transformations. Their lesson here is
that structure must support actual work/data; decorative bars are not analytics.

[Xbox UI navigation guidance](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/112)
emphasizes predictable focus and consistent interaction. Give repeated controls
stable locations, expose settings access early, and verify each supported input
mode on the actual runtime. Do not certify a game from its DOM shell.

## Composition and anti-generic review

Write the user's question, the next action and the evidence that answers it.
Choose a dominant element and deliberate reading order. Use alignment, spacing,
contrast and density to express relationships. Different sections may need
different structures; repeated task rows can be correct. Preserve familiar
platform behavior while making identity specific to the subject.

Reject unsupported proof, generic slogans, fake metrics, meaningless motion and
identical compositions under unrelated brands. Review these as decisions with
counterexamples, not color/component bans. Compare concepts using equal content
and task coverage; a concept cannot win by omitting difficult controls.

## Imagery and interaction

Use owned/permissioned photographs or UI when available; generated artwork can
carry a product-specific concept but cannot prove a real manufactured product,
customer or event exists. Keep source/license, crop, alpha, delivery dimensions
and budget in an asset manifest. Use consistent camera/material/crop decisions.
Keep text and interactive state native. Favor vectors for reusable marks/icons,
raster for artwork and photographs, actual UI for functional evidence.

Place imagery where it proves a claim or improves comprehension; a utility
screen can need none. Stress crops at target sizes and check labels against busy
backgrounds. Motion needs a role in feedback, orientation or hierarchy, with a
reduced-motion alternative. Neither image count nor animation count is quality.

Related source descriptions: [Stripe Payments](https://stripe.com/payments)
organizes product examples around payment capabilities; [Linear features](https://linear.app/features)
groups work by planning/building and related responsibilities; [Duolingo's 2022
path redesign account](https://blog.duolingo.com/new-duolingo-home-screen-design/)
describes guiding a next lesson. These are first-party content observations,
not independent outcome evidence or current end-to-end app inspection.
