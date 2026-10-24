# Native evidence and runtime boundaries

Load when the requested result is a native app or in-engine game interface. Use
the product's actual framework and runtime; the bundled Flutter lab is an example,
not a required stack or substitute for the user's application.

## Evidence contract

Record the platform/runtime and version, source fingerprint, build mode, window
or logical dimensions, input method, scenario, assertions, captured artifacts,
errors and known exclusions. Separate a simulator/emulator, physical device,
native desktop runner, offscreen widget test and browser emulation. A render
boundary capture excludes OS chrome; label it rather than calling it a complete
device screenshot. Preserve before/failure/recovery states where relevant.
The bundled source fingerprints normalize CRLF to LF for cross-platform Git
checkouts; screenshot hashes use unchanged binary bytes. Verify that declared
normalization when comparing a report with the current source.

Verify actions against domain state. A timer must not create a connected call,
successful purchase or delivered message. For game input, prove the action and
result in the actual simulation. Do not infer controller/remapping/latency support
from clicking a menu or playing a small keyboard puzzle.

## Bundled reproducible lab

`examples/native-lab` contains native Flutter transit, audio and 2D puzzle tasks.
From that project directory, use the documented `flutter analyze` and Windows
integration-test command. The test uses injected framework input and captures
the running native app. `evals/native-windows/report.json` and PNGs record the
completed Windows run; `evals/native-review-v2.json` records separate screenshot
critique and the audio-error correction. These are scoped observations, not
general Flutter, mobile or game usability certification.

The transit composition is hosted on Windows. There was no connected Android
device/emulator, and Android SDK licensing was incomplete; no licenses were
accepted as part of this work. iOS/macOS were not tested on this Windows host.
Do not mark those platforms verified. Android project sources alone do not
establish a working mobile runtime or a portable screenshot-output adapter.

## Task-specific checks

- Mobile: actual keyboard intrusion, safe areas, large text, rotation,
  interruptions, permission refusal, restoration and platform back behavior.
- Desktop: real window resizing, keyboard navigation, focus transfer, menus,
  scroll areas and persistence/restoration in the supported OS.
- Game: playfield readability under changing scenes, input mappings, pause,
  settings, recovery, text scale and measured frame/input behavior where claimed.

Use available authorized platform tools and proportional tests. Do not install
large SDKs, accept account/license terms or alter another running project merely
to replace an unavailable device result. Report the concrete missing runner and
keep useful source/browser evidence separate while device verification is pending.
