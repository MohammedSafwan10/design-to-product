# Typography and composition craft

Use after choosing a task and before drawing concepts. Sources/access methods
are recorded in `evals/craft-research-v2.json`; these are practitioner guidance,
font documentation and source descriptions, not comparative results.

## Choose the structure before the font

Write the user's question and the content that answers it. Draw a reading-order
thumbnail using real text lengths and meaningful media. Decide where the eye
enters, what it reads next and what action it reaches. Identity can come from a
physical artifact, an editorial voice, a work process or a distinctive output.
Changing color/font on the same information order is a styling variant.

Pentagram's [Public Theater account](https://www.pentagram.com/work/the-public-theater/story)
connects active street typography with a theater's mission and New York context.
Extract that connection-making process, not its wood type, logo or poster layout.
For an unrelated product the right structure can be quiet and conventional.
[GOV.UK guidance](https://www.gov.uk/service-manual/design/making-your-service-look-like-govuk)
requires evidence when existing patterns are adapted and limits use of its
identity outside government. Consistency and originality depend on context.

## Distinguish type systems by their work

| Context | Decisions to prove | Stress specimen |
| --- | --- | --- |
| Editorial | Reading measure, paragraph rhythm, title/byline hierarchy, captions and meaningful pull quotes | Long title, three paragraphs, portrait/landscape media, narrow viewport |
| Expressive display | Letterform/material fit, optical size, proportion and intentional crop | Short and long headline; essential words never cropped |
| Product/mobile | Action labels, field/input distinction, large-text reflow, script metrics | Keyboard, errors, 200% browser text or native text preferences, localization |
| Data/workspace | Numeric alignment, distinguishing ambiguous glyphs, units and comparison density | Negative/zero/missing values, decimals, currencies, long row labels |
| Game | Rendered glyph height, distance, moving scene contrast, player scaling | Bright/dark/busy scenes, settings and long objective text |

These require different specimens and hierarchy; identical size ramps with six
different family names are not six differentiated systems. Use semantic roles,
then tune actual rendered metrics to the content/platform. Document justified
exceptions. Avoid shrinking difficult labels to preserve decorative whitespace.

[Inter's author documentation](https://rsms.me/inter/) distinguishes text/display
optical designs and describes tabular figures and slashed zero. [IBM Plex](https://www.ibm.com/design/language/typography/typeface/)
offers related subfamilies and script-aware planning; its [scale guidance](https://www.ibm.com/design/language/typography/type-scale/)
shows that line metrics need script-specific consideration. Do not apply IBM's
exact brand adjustments to every typeface. Test selected glyphs and fallback.
[Recursive](https://www.recursive.design/) demonstrates a related sans/mono system
and multiple axes; axis count alone does not improve a design.

Use font sources and verified licenses, pin the selected release, keep license
files and measure delivery cost. [Roboto Flex's repository](https://github.com/googlefonts/roboto-flex)
links releases and an OFL license; choose a release deliberately rather than
silently using latest development files. No font files are bundled by this
guidance. Do not assume a font demo licenses its photographs or site artwork.

## Compose for the actual surface

Marketing may use a dominant picture or typographic proposition; a task screen
may need a stable form/list and secondary inspector. Establish alignment and
spacing relationships rather than decorating every component. Keep enough real
content to expose density and failure states. A dashboard must prioritize a
decision; an editorial page must sustain reading; a game HUD must protect play.

[The Pudding's responsive account](https://pudding.cool/process/responsive-scrollytelling/)
explains that a narrative can stay scroll-driven or become stacked graphics on
mobile depending on meaning and performance. Its 2017 viewport implementation
advice is historical; verify current APIs before coding. Never preserve an
animation at the expense of comprehension or browser navigation.

[Xbox text guidance](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/101)
considers configurable size, face, spacing and viewing conditions. A CSS font-size
number does not establish readable glyph height inside a game frame. Native/game
claims require actual runtime and input evidence.

## Review

Look at rendered entry, continuation and failure states at useful resolution.
Read the real words. Record hierarchy, line breaks, alignment, density, crop and
font fallback faults with coordinates or screenshots. Compare original concepts
with equal content. Use independent critique; do not label the builder's own
score a jury or user-study result. See `research-and-evaluation.md` for the protocol.
