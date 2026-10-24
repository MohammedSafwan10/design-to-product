# Research and evaluation

Use for library expansion, comparative claims or a design-quality review. Research
is a decision aid, not permission to copy another product or proof of superiority.

## Evidence before a recipe

Distinguish standards, platform guidance, first-party descriptions, observed
renders, executed tasks, controlled studies, model critique and human/user tests.
Record URL, access date, version, surface, task, method, states, input/viewport,
observation, implication, counterexample, uncertainty and rights. Source-reading
does not prove the product workflow works. A screenshot does not prove usability.
Current seed coverage and retrieval failures are in `docs/RESEARCH_REGISTER.md`
in the source repository; the portable register is `evals/research-register.json`.

Sample effective ordinary products as well as galleries. Balance density, novice
and expert use, constrained assets, languages, input modes and failure states.
The proposed 12 cases per surface are an exploratory target, not completed work
or a representative industry sample. Grow recipes only to fill a recorded gap.
Group related products/templates when splitting development and holdout sets.

Link to sources and author original diagrams/examples. Do not redistribute
screenshots, logos, fonts, code, prose or curated datasets without suitable rights.
Public visibility is not a reuse license. Collect no authenticated/private
customer content without authorization. Record generated artwork as generated.

## Frozen benchmark

`evals/benchmark-v1.json` specifies 12 public development briefs and three
separate scorecards. It contains no results. Before running, freeze skill/model
versions, exact task/data/assets, runtime, allowed tools, budget and rubric in a
run manifest; hash those inputs. Preserve failed runs, retry counts and costs.
If a defect requires changing a brief, version it rather than silently editing
the comparison conditions. The legacy behavioral scenarios remain separate.

Compare baseline/proposed skill under equal conditions. Compare the original
Design Taste only on marketing briefs within its supported scope. For other
surfaces use the existing workflow and an appropriate platform-guided baseline.
Test implementation and task flows as well as screenshot appearance. Emulated
HTML mobile studies do not establish native keyboard, lifecycle or accessibility
behavior; canvas screenshots do not establish controller navigation.

Blind reviewers to skill names, builder reasoning and desired winner. Randomize
A/B order and allow ties; archive the mapping separately. Use at least two
independent critics for the pilot and record disagreement. A builder cannot be
its independent judge. Model critics can screen issues, but correlated model
votes are not human design review or intended-user research. Label each role.
Use actual intended users for unassisted task evidence when feasible; disclose
recruitment, sample size, exclusions and unavailable groups.

Public briefs cannot be a sealed holdout. Create separate unseen briefs before
claiming generalization, keep them out of authoring prompts and do not tune on
their results. Reserve new brands/tasks and vary content/state, not just colors.

## Decision gates

Keep craft, use and technical quality separate. Record per-brief preference,
ties, critical errors and time/cost distributions; never average away a blocked
critical task. A small pilot reports counts and uncertainty, not population
superiority. Compare substantive revisions; cheap fixture tests run more often.
Set a total spend and iteration cap before generation. Stop or revise a batch
when it adds no distinct coverage, repeats compositions or regresses a critical
task. Human recruitment and paid generation need the applicable authorization.

Validate inspector rules against labeled faults and legitimate counterexamples;
publish false-positive/false-negative counts per rule and method. Overlap,
whitespace and repeated-card heuristics begin as advice. Menus, dialogs, empty
states, virtualized data and game canvases defeat naive rectangle/pixel rules.
Unknown coverage is unverified, never an implied pass.

Claims must follow evidence: tested tooling; detector results on named fixtures;
blinded preference on specified briefs; then task outcomes for specified users.
No gallery count or model jury establishes universally better or senior-level
design. Preserve provenance and publish limitations alongside results.
