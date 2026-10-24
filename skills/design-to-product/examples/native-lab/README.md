# Native runtime evidence lab

An original Flutter application with three different tasks: transit route review,
an audio workspace and a playable 2D beacon puzzle. Sample data and generated
waveforms only. No live booking, audio source or external service is claimed.

Requires an existing Flutter SDK and the target platform toolchain. From this
directory, run `flutter run -d windows` to inspect the application. The repository
does not install SDKs, accept platform licenses or include compiled binaries.

```text
flutter analyze
flutter test integration_test/native_flow_test.dart -d windows --dart-define=EVIDENCE_DIR=<absolute-ignored-output-directory>
```

The test injects input, verifies domain states and captures the running Flutter
render boundary. Output excludes OS chrome and is not a physical-input or user
study. The last recorded Windows run passed; portable PNGs and the report are in
`../../evals/native-windows/`. Review source hashes and runtime metadata before
treating an older report as evidence for a changed build.

Android project files allow a future authorized device/emulator run, but no
Android or iOS runtime result is recorded. A phone-shaped layout running on
Windows does not verify mobile keyboard, safe areas, permissions or lifecycle.
The puzzle is a native Flutter 2D interaction, not a 3D game-engine benchmark.
