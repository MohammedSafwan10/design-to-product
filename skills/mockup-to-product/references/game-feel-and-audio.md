# Motion, game feel and audio

Read only when motion, gameplay responsiveness or audio is in scope. A business
app generally does not need celebratory sound on every click or perpetual motion.

## Motion and responsiveness

- Separate state updates from decorative feedback; input must not wait for a
  sound decode, long animation or network request that can be handled separately.
- Measure stutter before attributing it to physics. Inspect frame budget, image
  decode/upload, shader startup, allocations and synchronous search/work.
- Prefer a few composited layers or reusable sprites for moving backgrounds.
  Keep oversized textures, blur and particle counts within platform budgets.
- Animate results deliberately: short reveal, clear outcome, stable replay/exit
  actions. Skip/reduce effects for reduced motion; avoid flashes and forced waits.
- Do not change collision boxes to match transparent padding. Define gameplay
  geometry separately and compare it with the visible subject.

## Intentional low-latency sound

- Match emotional tone and repetition frequency. Rapid input should use short,
  quiet tactile cues; a start cue should not be louder than a victory flourish.
- Search reputable sources when new sounds are needed; verify the specific
  asset's license and attribution obligations before shipping. Record creator,
  source URL, original filename, license and modifications. Don't infer a pack's
  license from the hosting site's reputation or call all free downloads CC0.
- Listen to candidates and prepared output. Inspect duration, leading/trailing
  silence and peaks using available audio tools. Trim based on measurements;
  add tiny fades to prevent clicks and set relative volumes through actual use.
- Short effects often benefit from prepared PCM WAV and per-effect preloaded
  playback pools; choose format/sample rate for the platform. Longer music may
  warrant compressed streaming. Do not enforce mono 44.1 kHz for every product.
- Recheck mute after asynchronous preload; respect current preference, background
  policy and resource disposal. Rapid effects should not interrupt unrelated cues.
- If FFmpeg is available, use ffprobe and silencedetect before conversion. Create
  a new prepared output, inspect it, then replace the intended asset; do not
  overwrite the only source or install system tools without appropriate authority.
- Keep downloads/source packs/tool binaries out of production assets and commits.
  Remove old sounds only after checking all consumers.

Example inspection commands (adapt executable paths and null sink to platform):

```text
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 input.wav
ffmpeg -hide_banner -i input.wav -af silencedetect=noise=-45dB:d=0.01 -f null <null-sink>
```

These thresholds are starting points, not fixed trim instructions. If latency
persists, measure event-to-playback timing and investigate the playback path
instead of repeatedly downloading replacement clips.
