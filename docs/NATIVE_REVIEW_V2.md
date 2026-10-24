# Native Windows review V2

Reviewed 24 October 2026 by an independent model critic. This is screenshot critique and evidence auditing, not human usability research or an independent integration-test rerun.

## Evidence

Read `skills/design-to-product/evals/native-windows/report.json` and viewed all seven named PNGs: transit-normal, transit-offline, audio-normal, audio-export-failure, beacon-normal, beacon-wrong-input and beacon-complete. Captures are 1264 × 681 RepaintBoundary renders from the compiled Windows Flutter integration-test run. OS chrome is excluded. The builder reports passed checks; the reviewer did not execute those checks.

## Initial findings (resolved in refreshed captures)

- **Observed failure: clipped audio export message.** In audio-export-failure.png the export-unavailable text begins around y676 and is visibly cut by the 681px bottom edge. Make the full error readable without clipping, preserve track selection, then regenerate the capture.
- **Control clarity advice.** The mint transport glyph at bottom left of audio-normal.png resembles three tiny marks. Clarify its playback/transport meaning with a recognizable icon or readable label, and separately verify semantics.

## What the pictures support

Transit has readable route choices and a clear selected state. Offline copy accurately distinguishes a retained sample route from unavailable live departures. Audio mute visibly changes waveform color and speaker icon; the no-source-media disclosure is present. Beacon has readable wrong-input recovery and a completion state expressed through both 3/3 text and an explicit message, in addition to colored active beacons. No clipping was observed in Transit or Beacon at the captured dimensions.

## Limits

This establishes Windows runtime evidence only. The phone-shaped Transit layout is hosted on Windows. Android/iOS devices and emulators, mobile safe areas/keyboards/lifecycle, physical controllers, actual audio playback, network services, native export, assistive technology and OS chrome remain unverified. Keyboard injection reported by the builder is not physical-device or human task evidence. Numeric contrast, focus ordering and accessible names cannot be certified from these PNGs.

Machine-readable review: `skills/design-to-product/evals/native-review-v2.json`. These findings describe the captures viewed; subsequent fixes need regenerated evidence and an explicit follow-up.

## Browser follow-up (separate evidence)

Fresh isolated Chromium captures at390×844 were viewed for dashboard-science and market-letterpress. Both produced no measured findings. Letterpress heading/swatches no longer overlap. Science deliberately uses a horizontally scrollable plot with named keyboard-focusable region; phone users must scroll to see right-hand wavelengths. A visible scroll cue would improve discoverability. The science favicon returned404; there were no other reported runtime issues.

Northline was separately stressed at390×568 with computed font sizes doubled. The East selection correctly changed yellow emphasis and pressed state, the root did not overflow (375px content against390px viewport), and no measured findings were emitted. The screenshot was viewed. Readable HTML route-summary text now accompanies the small SVG labels. The summary was then changed to a two-column count/label layout and a deliberate NORTH/LINE wordmark wrap opportunity; these final two refinements require rerender.

Final Northline follow-up: rerendered and viewed the last wordmark/summary refinements at390×568 with doubled computed fonts. No measured findings; wordmark, summary and selected East state remain readable without root overflow. Evidence: `skills/design-to-product/evals/artifacts/native-review-v2/northline-390-enlarged-final.png`. This supersedes the previous rerender-pending note, within the stated browser stress scope.

## Refreshed native audio review — resolved

Viewed regenerated audio-normal.png and audio-export-failure.png from the actual Windows Flutter integration run. The complete export-unavailable message now appears immediately below the source-media disclosure near the heading; it is readable and no longer cut off at the bottom. The previous ambiguous transport glyph is replaced by the explicit **Playhead** label in both captures. The muted first track and current playhead remain visible. Both original observations are resolved within these captured states.

The source runtime report again states passed. The parent reports analyzer zero issues and hot reload; the independent reviewer did not rerun these commands. No open observed visual faults remain in this review scope. Android/iOS, native accessibility, physical inputs, audio output, OS chrome and human usability remain unverified.
