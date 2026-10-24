# Design Taste audit and integration decision

Reviewed 24 October 2026 from the supplied local `design-taste-frontend` package.
Inspected its entry point, README, direction generator, library structure,
browser runner, DOM probe, rule evaluator, source lint, asset-search interface,
evaluation briefs and research methodology. This is a source/workflow review;
it is not a controlled study proving our replacement produces better designs.

## What is useful

- A subject inventory and a specific visual idea precede layout.
- Concepts differ in composition, type and imagery rather than only accent color.
- A direction sheet keeps implementation coherent during long sessions.
- Real screenshots, multiple widths and a fix/look loop are part of completion.
- Imagery has provenance and a purpose; source/code inspection alone is insufficient.
- The research document openly identifies model reviewers and sampling limits.

## Limits observed in the supplied implementation

| Observation | Consequence | Design to Product response |
| --- | --- | --- |
| `judge` and inspector have one marketing-focused policy | Dense apps, utilities and established brands can be penalized for appropriate conventions | Surface-specific marketing/app/dashboard profiles; errors and design advice are distinct |
| Minimum four pictures and eight moving elements are gates | More images or animations can satisfy a counter without improving the task | No mandatory media/motion quota; evaluate content and motion purpose during visual critique |
| Headings longer than two lines fail regardless of purpose | Localized/functional headings can be changed merely to satisfy a house style | Report line counts and clipping; marketing wrap is advice unless an explicit design contract is violated |
| Very low contrast under 2.6:1 fails; remaining sampled low contrast warns | Some text below its required ratio does not block the same way as a palette preference | Fail measured contrast below the applicable text threshold; mark complex compositing as unverified |
| `--allow` suppresses any named rule, including breakage | A passing report can hide functional problems | No general suppression flag for overflow, broken media or runtime errors; design advice remains visible |
| Random selection is tempered by sector/assets and global history | Useful variety, but history is not a product/approval contract | Surface/media filtering and eligibility rationale, followed by agent judgment against the brief; approved tokens are supplied, not randomly replaced |
| Model scores from a gallery sample inform strong universal rules | Marketing fashion can be mistaken for general usability evidence | Report evidence limits and agent critique; do not claim independent human evaluation |
| Runtime exceptions are collected in report entries | Capture alone does not necessarily become a failing finding | Runtime exceptions and failed essential resources are reported as functional findings |

The existing package remains installed and unchanged. Some existing local projects
use its browser helper. Removing it is a separate migration, not part of renaming
this skill.

## Licensing and implementation boundary

The supplied folder contains no code/data redistribution license or identifiable
upstream code-license notice. Its image/font license notes do not establish a
license for its scripts, prose or curated dataset. We therefore do not copy those
files into this MIT repository. The new direction catalog, browser helper,
measurement probe and evaluators are authored for this project. General design
ideas and findings above inform decisions without importing the old research
dataset or claiming its 247-site study as our own.

## Scope of the combined skill

One entry point: `design-to-product`. Internal reference modules cover art
direction, approval/handoff, optional brand exports and implementation checks.
Bundled original tooling offers deterministic direction suggestions and browser
inspection. It does not provide image-generation credits, copy a full media-search
service, guarantee taste, certify accessibility, or replace native device testing.

The repository keeps its existing checkout/remote identity until a separate
repository rename/publish is requested. The skill folder, metadata and invocation
name are changed. No GitHub settings, release or remote push is implied.
