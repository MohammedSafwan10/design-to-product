# Bundled design tools

These are original tools shipped inside Design to Product. No separate taste
skill, downloaded direction library, browser extension or npm install is required.
The scripts require Node 22+; browser inspection also needs an installed Chrome,
Edge or Chromium. `DESIGN_CHROME_PATH` overrides browser discovery. These tools
do not replace framework builds, native profilers or device testing.

## Modular library

There are 25 draft recipes for each of six surfaces: `marketing`, `product-web`,
`mobile`, `desktop`, `dashboard`, `game`. Families, compositions, patterns,
typography, palettes and imagery load only on request. The 12-entry legacy
`--profile` interface remains compatible.

```text
node <skill>/scripts/directions.mjs --surface mobile --task capture --input touch --count 3
node <skill>/scripts/library.mjs --surface dashboard --count 5
node <skill>/scripts/library.mjs --id mobile/capture-review --modules
node <skill>/scripts/library.mjs --validate
node <skill>/scripts/preview.mjs
```

Filters use exact tags, not natural-language understanding. Selection prefers
family variety after constraints, then seeded tie-breaking. All 150 entries
remain drafts. Thirty-six original browser studies cover six entries per surface
with interrupted-state toggles and local interactions. They do not implement
native apps, a game engine or a backend. Stop the loopback preview with Ctrl+C.

## Direction hypotheses

```text
node <skill>/scripts/directions.mjs --profile marketing --count 4 --seed 21 --brief "Private contact tags" --assets photography --keep palette,type --out .design-to-product/concepts
```

Profiles: `marketing`, `app`, `dashboard`. Available asset kinds are those the
catalog actually requests: `photography`, `product-output`, `illustration`.
Leave unavailable assets out. The catalog filters by surface/media and uses a
seed for reproducible variety. It does not semantically understand the brief or
choose your brand palette. The agent must assess fit and composition. `--keep`
records which brand roles remain fixed; it does not inspect existing CSS.

The JSON includes a concept idea, composition, type roles, useful interaction,
risk and eligibility rationale. When fewer eligible suggestions exist than
requested, it reports the shortfall rather than silently repeating a direction.
Nothing is written unless `--out` is specified. There is no global history file.

Use these as starting hypotheses, not templates to impose on the content. If
none fit, author a different direction with a concrete reason. The agent owns
copy, exact fonts, palette and complete compositions. Keep content/task coverage
comparable between user-facing concepts.

## Browser evidence

```text
node <skill>/scripts/inspect.mjs http://127.0.0.1:4173/ --profile marketing --out .design-to-product/inspection
node <skill>/scripts/inspect.mjs index.html --profile app --widths 320,390,430 --reduced-motion
node <skill>/scripts/inspect.mjs index.html --profile app --viewports 320x568,320x844,390x844 --touch --mobile --device-scale-factor 2
```

Default widths are marketing 1440/768/390, app 390/320/430 and dashboard
1440/1024/390. Pass `--widths` to match the actual target. For local HTML, the
temporary loopback server serves only the file's directory. If assets intentionally
span a larger project directory, use `--root` explicitly. Hidden paths, symlink
escapes, nonstatic extensions and write requests are rejected. No user browser
profile or existing tab is accessed.

Explicit viewport tuples allow equal widths with different heights. Touch,
mobile metrics and DPR are browser emulation, not device verification. Reports
state document/font readiness; application readiness remains unverified.
Completed font loading does not establish completed application data loading.

Output: fold/full-page PNGs per viewport and `report.json`. Three bounded scroll
positions trigger some lazy states; they do not test every route, internal scroll
region or interaction. Full-page height is capped at 16000px. The inspector sends
no clicks, form submissions, permission approvals or API mutations. Loading and
scrolling still execute the page's own scripts; use authorized test/staging
content. Execute authorized task-specific interaction tests separately.

Findings have separate meanings:

- **error:** measured breakage such as overflow, broken images, unnamed controls,
  sampled text contrast below its threshold, runtime exceptions or failed
  resources. Fix these before calling that checked surface complete.
- **warning:** a potential issue or unverified condition, such as small targets,
  complex compositing, unloaded/pending media or browser console errors. Review
  evidence and record a reason when appropriate. A 44px target is a design target,
  not a claim that every smaller control violates a standard.
- **advice:** context-sensitive design considerations. A marketing headline may
  benefit from fewer lines; this is not a universal functional failure.

Ancestor-clipping and five-point control-occlusion findings are warnings with
coordinates and confidence. Child hits and modal/menu coverage have exception
records; these do not establish correct dialog focus management. Large sparse
regions use a bounded text/media occupancy grid and remain advice. Background
art, virtualized content and deliberate whitespace require review. Reports
include uncertainty counts and sampling limits, not an automated AI score.

Exit status: 0 means no measured errors, 1 means measured errors, 2 means a tool,
configuration or loading failure. There is no blanket allow/suppress switch.
Broken content cannot be hidden to satisfy an aesthetic gate. Conversely, a
brand color, standard form border, lack of video or lack of animation is not
automatically an error. Respect reduced motion and verify the real experience.

For an explicit approved layout requirement, `--contract path.json` currently
supports `{"maxHeroLines":2}`. It only enforces that declared heading limit; it
does not automatically check the full approval/brand contract. Record palette,
fonts, layout scope and approved asset paths in the project's normal handoff.

## Limits and interpretation

Contrast checks use ordinary computed text over composited solid backgrounds.
Images, gradients, filters, opacity and blend modes produce an **unverified**
result instead of fabricated ratios. Text is sampled (up to 4000 text nodes).
The probe cannot fully assess occlusion, closed shadow roots, cross-origin
frames, all fonts/glyph fallback, keyboard order, screen-reader behavior or
native system surfaces. Inspect screenshots and use deeper tools where needed.

Review control names, zoom/larger text, keyboard/focus, motion preferences,
loading/error states and actual task completion beyond this measurement pass.
Do not claim WCAG certification or an independent design score from this tool.
The skill's visual critique remains a reasoned judgment by the agent and user.

When prerequisites are missing, use available screenshots/platform tools and
state what was not measured. Do not install a browser, alter global runtimes or
change production configuration merely to make a check pass.
