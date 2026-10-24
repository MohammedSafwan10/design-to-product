# Logic review and proportional verification

Select scenarios from the actual feature and its risk. UI polish and logic review
can proceed alongside one another, but change behavior only within authorization.

## Shared state and asynchronous work

- Write down legal states and transitions; disable invalid actions in the domain
  layer as well as the UI. Repeat taps must not duplicate mutations or rewards.
- Test stale responses after reset, navigation, disposal and settings changes.
  Cancel work when possible; use request/generation identities when cancellation
  is insufficient. A late response must not unlock or overwrite a newer state.
- Keep timers, animation completion and audio from owning domain correctness.
  Verify pause/resume/background behavior and define whether time is elapsed
  wall time or active time. Dispose subscriptions and release pending waiters.
- Preserve valid stored data; validate malformed/missing fields and handle
  load-before-save races. Do not reset users' history to simplify testing.

## Games and difficulty

- Verify turn ownership, legal actions, invalid indices, full/occupied cells,
  terminal states, draw precedence and exactly-once result recording.
- Exercise each difficulty with reproducible randomness. Check immediate tactical
  situations and legal output; do not assume deeper search means correct search.
- Keep search snapshots immutable. Order/limit search and move expensive work
  away from the rendering thread where supported. A completed search still needs
  a current-round check before applying its result.
- For collision/physics complaints, compare visible shapes against hitboxes and
  measure frame-time/timestep behavior before changing constants. Use swept
  collision or a stable timestep where warranted; test low-FPS and rapid inputs.
- Test long sessions, repeated restart/pause cycles, capped object lifetime and
  difficulty transitions. Keep fairness separate from visual effects.
- Use exhaustive or property-based checks when tractable (e.g. small board games),
  not an exhaustive search of an unbounded system. State AI limitations honestly.

## Web/mobile data-driven apps

- Verify client/server schema, validation and error mapping; frontend gating is
  not authorization. Exercise relevant owner/role/tenant boundaries server-side.
- Check retries, idempotency, cancellation and optimistic update rollback. Handle
  loading, zero results, partial failure, expired sessions and offline recovery.
- For lists: stable sorting, pagination/filter changes and stale response ordering.
  For forms: keyboard/focus, field errors, submit locking and dirty-state exit.
- Respect existing API compatibility and persistence semantics. Propose migrations
  and obtain necessary authority before changing live data or deployment contracts.
- For payments or sensitive actions, use sandbox fixtures and negative paths;
  never perform live transactions as an incidental design verification step.

## Efficient test selection

1. Reproduce the observed defect and add a focused behavior assertion where useful.
2. Check affected transitions and boundary inputs, not just the happy screenshot.
3. Render representative screens/states at target sizes and larger text.
4. Run static checks and one final applicable build; honor repository requirements.
5. Run broader regressions based on shared code/data risk; summarize failures.

Isolate temporary persistence/ports per test worker. Do not launch overlapping
test processes that share one database, storage file or emulator state. Avoid
tests that merely match implementation wording instead of user-visible behavior.
Do not add a heavyweight harness when a deterministic focused test suffices.

## Example handoff entry

```text
Flow: match setup -> game -> result
Approved: mockups/01-selected.png, 04-game.png, 05-result.png
Implemented: all three; resume/offline state not in scope
Visual check: compact phone + normal phone, larger text, transition frame
Domain checks: invalid input, stale reset, duplicate result, each difficulty
Assets: manifest path; shared sounds retained because another feature uses them
Validation: commands and actual outcomes; unrelated failures listed separately
Next: statistics mockup; user selection needed before generating its artwork
```
