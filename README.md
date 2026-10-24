# Design to Product

One self-contained agent skill for deliberate art direction, comparable mockups,
scoped design selection, reusable identity assets, working interfaces and visual/
logic verification. Supports public websites, apps, dashboards and game UIs.

Formerly **Mockup to Product**. The skill is now `design-to-product`; the existing
repository URL remains `MohammedSafwan10/mockup-to-product` for continuity.

## What is combined

- **Art direction:** a product-specific idea, content hierarchy, imagery strategy,
  typography and responsive composition before decoration.
- **Distinct choices:** three concepts by default, or the user's requested count,
  with comparable content, viewable screenshots and usable previews.
- **Scoped approval:** records theme, layout, flow and asset decisions separately.
  A chosen palette is not automatic approval of every screen.
- **Related screens:** preserves identity while composing each platform for its
  task; HTML studies are clearly distinguished from native implementations.
- **Reusable assets:** vector logos, licensed fonts/tokens and relevant icon
  exports when requested, separate from demo screens and runtime derivatives.
- **Implementation:** one authorized complete flow, real state/error handling and
  task-specific logic checks before expanding to the whole product.
- **Clean handoff:** current references, meaningful verification and requested
  cleanup with shared-usage checks and proportionate recovery.

No separate `design-taste-frontend` skill is required. This revision includes its
own original direction catalog and browser inspection tools. It does **not** copy
that package's code, prose or research dataset, or claim its model-reviewed gallery
study as our own. The [source audit](docs/DESIGN_TASTE_AUDIT.md) records what informed
our decisions and the redistribution boundary.

## Taste without a universal costume

A new color on the same card layout is not a new direction. The skill requires a
specific idea, convincing content, deliberate hierarchy, coherent image treatment
and a phone composition that works on its own. The render is inspected and critiqued;
a clean measurement report is not an aesthetic score.

Surface profiles separate **marketing**, **app** and **dashboard** needs. An existing
brand color, a form boundary or a useful data table is preserved when appropriate.
There is no mandatory photo/video quota, blanket color ban or animation-count gate.
The browser checker distinguishes measured errors, warnings and design advice.
Measured overflow, broken images, runtime exceptions and low sampled text contrast
cannot be silenced with a general allow flag.

These changes are engineering/workflow improvements. They do not prove better
visual outcomes than another skill; that needs broader behavioral comparisons.

## Use

```text
Use $design-to-product to design our product website and app. Show four genuinely
different directions with comparable content. Once I choose a theme, show it on
representative phone screens before implementing the full flow. Preserve our
backend contracts. Do not deploy.
```

```text
Use $design-to-product with this approved layout. Keep its proportions and identity;
skip new concepts. Implement one complete booking flow, including validation,
loading and failure states, then compare the running UI to the reference.
```

```text
Use $design-to-product to refine this existing mark into reusable SVG assets and
website/Android icon exports. The theme is selected; full screen layouts remain
exploratory. Do not generate unrelated platforms or treat a browser study as a
native app build.
```

## Install or migrate

In a Codex environment with `$skill-installer`, ask:

```text
Use $skill-installer to install:
https://github.com/MohammedSafwan10/mockup-to-product/tree/main/skills/design-to-product
```

For a manual install, clone or download this repository, then copy the complete
[`skills/design-to-product`](skills/design-to-product) folder into your host's
supported personal or project skill directory. Keep its references, scripts,
library, license and metadata together. Invoke it as `$design-to-product`.

When migrating an installed `mockup-to-product`, preserve any local customizations
before replacing it. Keep old copies outside discoverable skill directories when
archiving, so agents do not see two competing workflow entries. Reload skill
discovery as required by the host. Do not remove unrelated helper packages that
existing projects still import. No other taste skill needs to be called by this one.

The core follows the Agent Skills folder format. `agents/openai.yaml` is optional
OpenAI-specific presentation metadata; the workflow does not depend on one host.
This repository is a skill bundle, not a marketplace plugin or MCP server.

## Bundled tools

Requires Node 22+. Inspection also requires an installed Chrome, Edge or Chromium;
set `DESIGN_CHROME_PATH` if necessary. No npm install, image API key or logged-in
browser is required for these tools. The inspector launches an isolated profile.

```text
node skills/design-to-product/scripts/directions.mjs --profile marketing --count 4 --seed 21 --assets photography --keep palette,type
node skills/design-to-product/scripts/inspect.mjs path/to/index.html --profile app --widths 320,390,430 --reduced-motion
```

The 12 original catalog entries are starting hypotheses filtered by surface and
available media, with reproducible seeded variety. The agent still decides fit,
exact type/palette and composition; the tool does not understand the brief for you.

Inspection saves fold/full-page PNGs and a JSON report. Complex contrast, closed
shadow roots, native surfaces, keyboard behavior and complete accessibility are
not certified by a DOM sample. Read the [tooling reference](skills/design-to-product/references/tooling.md)
for options, limitations, exit codes and explicit layout contracts. Image creation,
external media search and native builds use the host's available tools; they are
not services provided by this skill.

## Source map

- [Core workflow](skills/design-to-product/SKILL.md)
- [Art direction and rendered critique](skills/design-to-product/references/art-direction-and-review.md)
- [Theme approval, mobile studies, identity and cleanup](skills/design-to-product/references/visual-handoff.md)
- [Logic and verification](skills/design-to-product/references/logic-and-verification.md)
- [Conditional game-feel and audio](skills/design-to-product/references/game-feel-and-audio.md)
- [Tooling and evidence limits](skills/design-to-product/references/tooling.md)
- [Manual behavioral evaluation briefs](skills/design-to-product/evals/scenarios.json)

## Validation

```text
npm test
npm run test:browser
```

Core tests cover media/surface eligibility, unique/reproducible suggestions,
functional findings, explicit layout contracts and local-server confinement.
Browser tests use actual Chromium against readable and deliberately broken
fixtures. They check that usable app UI needs no decorative imagery/animation,
and that resource/runtime/overflow/name/contrast failures are reported.

The skill-creator validator checks structural packaging, not taste or end-to-end
behavior. Manual evaluation briefs are supplied for future authorized comparisons;
they are not claims that an independent study has already run. No production-ready,
WCAG-certified or native-device guarantee is made by the skill.

## License

[MIT](LICENSE) for this repository's own code and instructions. Fonts, artwork and
other third-party assets used in projects retain their own licenses. Source-audit
references do not grant redistribution rights to the inspected third-party package.
