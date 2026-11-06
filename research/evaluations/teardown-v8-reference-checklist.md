# Desert Eagle / canonical V8 rebuild

Canonical product: upstream teardown `v8-live` / `v8-shared`, commit
`a91262ac1109051e014662d42ecb0b7bc1f113b1`. The user's latest correction explicitly
excludes the Claude simulator as an implementation/design baseline.

## Requirements and evidence

- [x] Read complete SKILL.md, V8 console, stage, film and live modules.
- [x] Build and open original V8; keep its screenshot at the same 1600×900 viewport.
- [x] Update AGENTS.md to use the examples named in a skill as canonical products,
  distinguish subject references from UI references, and require visual comparison.
- [x] Start console and stage from original source. Preserve all seven panel
  rectangles, controls layout, type/palette, studio pipeline and source notices.
- [x] Keep module responsibilities: geometry, stage, console, pure timeline, live.
- [x] Use the correct Desert Eagle exterior refs; exclude the earlier wrong pistol.
- [x] Readouts and plots derive from the same camera/material state used to render.
- [x] Retain auto-tour cursor, takeover, quality tiers and shader warm-up.
- [x] Review current tour renders and fix geometry/label defects found in them.
- [x] Verify browser interactions, deterministic capture, canonical geometry and offline size.
- [x] Package screenshots, build output and verification evidence.

## Explicit adaptations / limits

- Exterior-only artwork. V8 engine kinematics, combustion, cutaway and internal
  isolation are not reproduced as firearm mechanisms. Those controls become
  surface/finish inspection; charts show actual camera state, not weapon data.
- Measurements are illustration coordinates, not inferred physical dimensions.
- Geometry is stylized and does not establish photoreal or CAD fidelity.
- Original compact typography is retained for visual fidelity; not compliance
  with the skill's general 34px-on-1080 guideline. Portrait has the source-style
  landscape hint, not a fully redesigned mobile layout.
- HTML demo requested; sound score / 60fps film delivery not applicable here.
- Cloud software rendering can check correctness, not integrated-GPU frame rate.
- Source modules and pipeline are reused/adapted; user-uploaded Claude code is
  not copied, executed or incorporated during this rebuild.
- Cannot establish a causal effect of Extra High: model effort setting is not
  observable here and implementation approach changed between the two runs.

## Verification results

- `build.py`: exit 0, HTML 824,497 bytes including dependency notices.
- `verify.cjs`: exit 0, 15 grouped checks passed, no browser errors or HTTP
  requests. All seven panel rectangles, original subtitle typography and three
  transport-button rectangles match the built upstream V8 DOM at 1600×900.
- Pure-time state and 3D canvas pixels repeat exactly after jumping between times.
- Tour review: seven settled views plus transition-beat captures. Corrected a
  detached seam strip and a label that crossed the detail view.
- Verified low quality tier on Chromium / SwiftShader. A concurrent full-quality
  rendering attempt timed out; this is not evidence of integrated-GPU performance.
- Idle hand-back after 25 seconds and automatic tier downgrade logic are present
  but their timing/performance thresholds were not benchmarked.
- Delivered preview.png, comparison.png, tour-sheet.png and verification.json
  alongside demo.html. Comparison includes original V8, new DE and previous DE.

- Serial retry of full-quality tier 0 succeeded at 1280×720 with GTAO enabled;
  inspected and saved as `studio-full.png`. This validates the rendering branch,
  not real-time performance. The earlier concurrent timeout remains recorded.

## Post-audit revision

The results above describe the initial V8 rebuild. The subsequent audit found
interaction defects not covered by those checks. See
[the repair log](de-v8-fixes/CHANGELOG.md) for fixes, new pixel-level regressions
and updated evidence. The current panels show inspection steps and surface notes
in place of the two camera charts.
