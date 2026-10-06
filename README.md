# Mockup to Product

A framework-agnostic agent skill for turning an approved visual direction into
working software—with cohesive assets, responsive interfaces, and logic checks
alongside implementation.

Built for websites, SaaS dashboards, mobile and desktop apps, and games. It does
not prescribe a particular framework, backend, image generator, or visual style.

## The workflow

```text
Inspect the product and its constraints
                ↓
Present three distinct design directions
                ↓
User selects a direction
                ↓
Extend it into related screens and key states
                ↓
Prepare isolated assets + implement a complete flow
                ↓
Review logic + compare the running UI with the mockup
                ↓
Verify proportionally + document the handoff
```

Three concepts are the default, not a restriction. If a direction is already
approved, the agent skips that choice rather than restarting the design process.

## What it changes

- **Faithful composition:** follows approved proportions, hierarchy, artwork
  scale, typography and depth—not just a similar palette.
- **Real interfaces:** keeps controls, text, counters and state native rather
  than shipping an interface screenshot as the UI.
- **Responsive behavior:** checks compact screens, safe areas, larger text,
  keyboards and long labels; scrolling is intentional, not an accidental fix.
- **Integrated logic review:** checks relevant async races, persistence, input
  validation and failure states. Game difficulty, turns and collisions are
  conditional guidance, not rules imposed on a business application.
- **Asset discipline:** uses cohesive cutouts and backgrounds, records licensing
  and provenance, and avoids shipping unused variants or temporary files.
- **Practical verification:** focused checks during iteration and an appropriate
  final build. No native rebuild for every small spacing change.
- **Useful handoffs:** records selected references, completed states, validation
  results, limitations and the next exact task.

## Install in Codex

If your Codex environment provides `$skill-installer`, ask:

```text
Use $skill-installer to install the skill from:
https://github.com/MohammedSafwan10/mockup-to-product/tree/main/skills/mockup-to-product
```

Alternatively, download or clone this repository and copy the entire
`skills/mockup-to-product` folder into your Codex environment's supported personal
or project skill directory. Keep its references and `agents` folder together.
Follow your installed client's skill-discovery guidance; reopen/reload the client
if necessary, then confirm the skill is available before invoking it.

See the official [skill-building guidance](https://learn.chatgpt.com/docs/build-skills).

## Use it

```text
Use $mockup-to-product to redesign our appointment-booking app.
Start with three mobile home-screen directions and wait for my choice.
Preserve existing booking APIs. Review loading, validation and retry behavior
alongside implementation. Do not deploy or change production data.
```

Give the agent the codebase, target audience, platforms, constraints and any
references you already like. Specify whether logic changes are permitted and
whether commits, pushes or deployment are authorized.

### SaaS dashboard

```text
Use $mockup-to-product for our analytics dashboard. Show three directions using
the same content. After I choose, extend it to filters, drill-down and empty/error
states. Keep charts accessible and preserve the existing data contract.
```

### Desktop application

```text
Use $mockup-to-product to redesign our file manager. Prioritize keyboard navigation
and dense but readable layouts. Show three directions, then implement one complete
browse/search flow. Do not change filesystem behavior without asking.
```

### Game

```text
Use $mockup-to-product for our puzzle game. Start with three mode-selection
concepts. Once selected, create gameplay/result mockups and matching artwork.
Review each difficulty, pause/reset behavior and audio latency alongside the UI.
```

### Already approved design

```text
Use $mockup-to-product with the attached approved mockup. Do not generate three
new concepts. Inspect it carefully, create related-screen mockups in the same
family, then implement and compare screenshots at the target viewports.
```

## Other agent platforms

The core is a `SKILL.md` instruction bundle with linked references, compatible
with the [Agent Skills format](https://agentskills.io). Hosts supporting that
format may load it through their own installation mechanism; this does not claim
that every platform supports automatic discovery or the same commands.

`agents/openai.yaml` provides optional OpenAI-specific presentation metadata.
The core workflow does not depend on it. For agents without skill discovery,
provide `SKILL.md` and the relevant references explicitly as task instructions.

This repository is a skill bundle, **not** an installable marketplace plugin or
an MCP server. Plugin packaging can be added separately when needed.

## Tools and boundaries

The skill supplies a process—not image generation, hosting, API credentials or a
new model. The host agent needs appropriate capabilities for the requested work:
code/file access, applicable build/test tools, and, when relevant, image generation,
browsing, audio preparation or screenshots.

When a capability is unavailable, the agent should disclose the limitation and
use an appropriate available alternative—not pretend it rendered, tested or
visually verified a result. Supporting image, performance or platform skills can
be used when available; none are bundled here.

The workflow preserves scope and user approval. It does not authorize deployments,
live transactions, destructive migrations, tool installation or external publishing
merely because the user approved a mockup. It also does not guarantee bug-free or
production-ready software.

## Contents

```text
skills/mockup-to-product/
├── SKILL.md
├── agents/openai.yaml
└── references/
    ├── logic-and-verification.md
    └── game-feel-and-audio.md
```

- [Core workflow](skills/mockup-to-product/SKILL.md)
- [Logic and verification](skills/mockup-to-product/references/logic-and-verification.md)
- [Conditional game-feel and audio guidance](skills/mockup-to-product/references/game-feel-and-audio.md)

## Validation and contributions

The initial bundle passes the Codex skill creator's structural validation. That
checks packaging/frontmatter, not whether every agent follows the workflow well.
No cross-platform behavioral certification is claimed.

Useful contributions include reproducible workflow failures, clearer approval
boundaries, and focused platform-independent improvements. Include the request,
host/tool context, observed outcome and expected behavior. Do not include private
code, credentials or customer data in issues.

Keep the shared workflow lean. Put substantial conditional guidance in linked
references instead of adding every platform's tutorial to the main instructions.

## License

[MIT](LICENSE). Third-party assets created or downloaded while using the skill
retain their own licenses; this license does not grant rights to those assets.
