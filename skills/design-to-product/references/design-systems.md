# Typography, color and component contracts

Load when defining a selected family or extending a reusable system. Define
semantic roles first; a font list and palette alone are not a design system.

## Typography

Set roles for display, page/screen title, section, body, label, data and help.
Document font family/license, weight, line height, measure, letter spacing,
fallback and language coverage. Evaluate real strings, numerals, punctuation and
mixed scripts. Prefer tabular figures where numeric columns require comparison.
Avoid condensed display styling for long instructions or dense control labels.

[Fluent typography](https://fluent2.microsoft.design/typography) illustrates role
ramps and platform-specific stacks. The principle is a coherent hierarchy that
adapts to context, not one universal pixel scale. Test fallback rendering and
large text before committing to a font. A loaded face does not prove which
glyphs rendered. Alignment should follow writing direction and content use.

Use a few clear hierarchy relationships rather than many nearly equal sizes.
Headlines may be expressive; body and controls must survive real content and
localization. No two-line headline rule may remove essential meaning. Brand
voice may justify uppercase display; long functional text needs readable casing.

## Semantic palette and spacing

Define foreground/background pairs for canvas, surface, raised surface, primary
action, secondary action, selected, focus, disabled, error, warning, success and
information. Preserve non-color cues. Provide light/dark variants only where
needed and measure actual pairs/states, including charts, overlays and images.
Do not turn brand accent into every status or prohibit a brand hue by fashion.

Use a spacing rhythm, task-appropriate density modes, consistent alignments and
clear grouping. Desktop data rows and phone actions have different constraints.
A card, divider, shadow or rounded corner must explain grouping, depth or input;
none is intrinsically good or evidence of AI authorship.

## Accessibility and states

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the web foundation: check relevant
contrast, keyboard access, focus visibility/obscuring, reflow, text enlargement,
errors and motion requirements. Automated checks are partial evidence, not a
certificate. Native platforms require native semantics/device checks as well.

The [target-size explanation](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
describes the 24 CSS pixel AA criterion and its spacing/other exceptions. A
44-pixel comfort target is a design preference or another applicable requirement,
not a universal AA gate. Document which rule, unit and exception was evaluated.

For every reusable component specify anatomy, semantic role, input methods,
default/hover/focus/pressed/selected/disabled/loading/error states and content
limits. Include empty, permission-denied, offline, stale and recovery behavior
where relevant. A success state follows verified domain state, not a timer.

## Scroll surfaces and overflow

Include page and nested scroll areas in the visual contract: long tables,
sidebars, editors, menus and dialogs need deliberate boundaries and reachable
content. Inspect both scroll axes and short viewport heights. Avoid unnecessary
nested scroll traps; make intentional horizontal overflow discoverable without
clipping labels or losing selection/focus. Sticky controls must not obscure a
focused target or the last row.

On the web, native scrollbar styling can coordinate thumb/track colors with a
theme using supported CSS; prefer native scroll behavior over a JavaScript
replacement. Use a stable gutter where it prevents layout shifts. Preserve enough
thumb visibility and usable interaction; thin styling is optional, not a universal
quality requirement. Honor forced-colors/high-contrast settings and allow OS
overlay scrollbars. Do not use `scrollbar-width:none`, blanket `overflow:hidden`
or scroll hijacking to make a screenshot cleaner. On native platforms, follow
the platform's scroll-indicator and input conventions instead of copying web CSS.

Verify wheel, touch, keyboard and focus-driven scrolling where available. A
static screenshot does not establish usable scroll behavior. Record limitations
when the current runner cannot exercise the target device/input.

## Control states, copy and responsive composition

Audit open menus and selected values as separate states. A styled select shell
does not prove its OS popup matches the design. Prefer the project's established
accessible select/popover primitives when custom popup styling is needed; native
pickers remain appropriate for platform conventions and specialized inputs. Do
not introduce a new UI library merely to recolor one menu. In custom controls,
preserve value/form behavior, accessible name, selected/expanded state, keyboard
navigation, typeahead where relevant, Escape, focus, outside dismissal and viewport
collision handling. See the [APG combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
Authoring these states is not proof of screen-reader or device compatibility.

Check the longest selected value, every popup option, enlarged text and narrow
containers. Use wrapping or give the field room; do not let the chevron obscure
the value. Check intermediate widths around actual breakpoints. As a reading
column becomes too narrow or a filter loses its label, change the grid rather
than waiting for a phone-width preset. Avoid artificial vertical alignment that
leaves one heading stranded beneath a long neighboring explanation.

For familiar low-ambiguity actions such as dialog close, use a clear icon with an
accessible name and a practical target. Don't add visible words merely to fill a
button. Keep labels for unfamiliar, destructive or ambiguous actions. Define
hover (pointer), pressed, keyboard focus, disabled and pending states deliberately;
hover is additional feedback, never the only way an action is discoverable.
Respect reduced motion and high-contrast preferences.

Dialogs contain scrolling with `overscroll-behavior` where supported and prevent
the underlying document from scrolling while modal. Preserve and restore page
position, previous styles and focus on close; clean up on component unmount or
failure. Test a wheel/touch gesture at the end of long content. A dimmed backdrop
alone does not lock scrolling. On the web, prefer native dialog or an established
accessible primitive with correct focus management. Keep the close action reachable.

Apply an information budget: one useful heading, a clear primary action and the
facts needed now. Remove repeated statuses, task slugs, decorative slogans and
implementation warnings from the default view when they add no decision value.
Move technical contracts into labeled details; retain privacy, safety, cost,
permission and error facts at the moment they matter. Concision cannot excuse
an unclear action or a misleading success state.

## Portable handoff

Keep portable semantic tokens separate from framework adapters. Record token
names, intended pairs, component usage and exceptions. Verify the target stack's
current APIs before integration. Editable Figma components/variables are useful
when supported, but HTML/raster studies must not be called Figma files or native
apps. Ship only licensed font assets; platform fonts are not automatically
redistributable. Test representative components and stress states before broad
library expansion.
