# Design to Product engineering and design guidance

## Product clarity

Cut decorative taglines, redundant helper text and secondary labels when clear
hierarchy and controls already communicate their purpose. Fix confusing layout
before adding more explanation. Retain text needed for accessibility, validation,
permissions, privacy, pricing, safety and unfamiliar actions. Brevity must not
remove information people need to make a sound decision.

## UX, DX and AX

Prefer decisions that improve user experience (UX), developer experience (DX)
and agent experience (AX) together. Prioritize user outcomes and accessibility;
state material tradeoffs rather than claiming every dimension always improves.
Preserve approved identity, existing contracts and unrelated work. Verify the
behavior affected by a change before claiming it still works.

## Evidence and design scope

Keep theme selection, layout approval and implementation status distinct.
Report measured findings, model critique and human/user evidence separately.
Do not call library entries researched or validated until their evidence exists.
Use the phased plan in `docs/NEXT_VERSION_PLAN.md` for expansion; its targets are
planned work, not features already shipped. Keep the installed skill modular and
load only references relevant to the current surface/task.
