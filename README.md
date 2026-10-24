# Design to Product

One self-contained agent skill for deliberate art direction, comparable mockups,
scoped design selection, reusable identity assets, working interfaces and visual/
logic verification. Supports public websites, apps, dashboards and game UIs.

Formerly **Mockup to Product**. The skill and repository are now
`design-to-product`; GitHub redirects the former repository address.

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
and a phone composition that works on its own. Scrollbars and nested scroll areas
are reviewed with the theme, input and accessibility behavior. The render is inspected and critiqued;
a clean measurement report is not an aesthetic score.

Surface profiles separate **marketing**, **app** and **dashboard** needs. An existing
brand color, a form boundary or a useful data table is preserved when appropriate.
There is no mandatory photo/video quota, blanket color ban or animation-count gate.
The browser checker distinguishes measured errors, warnings and design advice.
Measured overflow, broken images, runtime exceptions and low sampled text contrast
cannot be silenced with a general allow flag.

These changes are engineering/workflow improvements. They do not prove better
visual outcomes than another skill; that needs broader behavioral comparisons.

The expanded candidate library now contains **150 original draft recipes**:
25 each for marketing web, product web, mobile apps, desktop apps, dashboards and
game interfaces. It separates 20 families, 18 compositions, 36 task patterns,
six typography systems, eight semantic palettes and six imagery treatments.
These are authored candidates; they are **not 150 visually reviewed designs**.

A searchable browser catalog includes **36 original interface studies** (six per
surface), local interactions and normal/interrupted states. Native behavior,
backend services and actual gameplay remain unverified. The
[roadmap](docs/NEXT_VERSION_PLAN.md), [research register](docs/RESEARCH_REGISTER.md)
and [implementation review](docs/IMPLEMENTATION_REVIEW.md) distinguish completed
engineering from the research, comparisons and device work still needed.

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
https://github.com/MohammedSafwan10/design-to-product/tree/main/skills/design-to-product
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

The legacy 12-entry `--profile` selector remains compatible. Use the modular
selector for six-surface coverage, exact task/input constraints and family variety:

```text
node skills/design-to-product/scripts/directions.mjs --surface mobile --count 3 --seed 7
node skills/design-to-product/scripts/library.mjs --id mobile/capture-review --modules
npm run library:validate
npm run gallery
```

The gallery command prints a loopback preview URL. It loads only the index and
selected recipe. The agent still decides product fit, type and composition;
filters do not semantically understand a prose brief or overwrite brand roles.

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
- [Surface composition and input guidance](skills/design-to-product/references/surface-design.md)
- [Semantic design systems](skills/design-to-product/references/design-systems.md)
- [Research and comparison method](skills/design-to-product/references/research-and-evaluation.md)
- [Frozen development benchmark](skills/design-to-product/evals/benchmark-v1.json)
- [Browsable catalog](skills/design-to-product/examples/gallery/index.html) (serve over HTTP)
- [Manual behavioral evaluation briefs](skills/design-to-product/evals/scenarios.json)

## Validation

```text
npm test
npm run test:browser
```

Core tests cover media/surface eligibility, unique/reproducible suggestions,
functional findings, explicit layout contracts and local-server confinement.
Browser tests use actual Chromium against readable and deliberately broken
fixtures, all 36 original studies across three viewport/state cases, and focused
local interactions. Library tests check reference integrity and reject unsupported
review promotion. They check that usable app UI needs no decorative imagery/animation,
and that resource/runtime/overflow/name/contrast failures are reported.

The skill-creator validator checks structural packaging, not taste or end-to-end
behavior. Manual evaluation briefs are supplied for future authorized comparisons;
they are not claims that an independent study has already run. No production-ready,
WCAG-certified or native-device guarantee is made by the skill.

## License

[MIT](LICENSE) for this repository's own code and instructions. Fonts, artwork and
other third-party assets used in projects retain their own licenses. Source-audit
references do not grant redistribution rights to the inspected third-party package.
