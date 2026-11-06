# Teardown console: requirements and evidence

Source skill: a91262ac1109051e014662d42ecb0b7bc1f113b1.
Baseline inspected: original v8-live was built, opened and screenshot-reviewed in
this conversation. Read SKILL.md and relevant console/stage/live/film contracts.

- [x] Reference: user's Desert Eagle side-view exterior + concept material hints.
  Incorrect GSG-1911 references excluded. No mechanical internals reconstructed.
- [x] Closest example: v8-live. Adapt its 1600×900 overlay grid, title/readout,
  side panels, bottom transport/selection, tour chip and callout projection.
- [x] Modular structure: model.js / stage.js / console.js / film.js / live.js.
- [x] Stage: author-style gradient, studio softboxes, shadow catcher, camera.
- [x] One state drives scene and all displayed camera/material readings.
- [x] Pure capture entry point: SIM.render(t) uses stateAt(t), independent of
  playback history; film frames and live tour share it.
- [x] Warm shaders; embedded fonts and offline bundling; original notices retained.
- [x] Functional browser checks, capture determinism and offline requests.
- [x] Read current renders at 0/6/12/18s and desktop/landscape-phone layouts.
- [x] Package HTML below 1 MB and preserve earlier demo for comparison.

Applicability/deviations:
- Weapon internals, disassembly and operating physics are excluded. No engine
  pressure, timing or invented weapon data copied into this exterior study.
- Charts are camera direction and live material values, not simulated mechanics.
- Arbitrary illustration units; no engineering dimensions inferred from images.
- Integrated-GPU performance cannot be measured on SwiftShader cloud rendering.
- Author's dense desktop console uses small typography. Mobile follows the
  author's landscape recommendation; portrait is a scaled overview with a hint,
  not a claimed full mobile redesign or compliance with 34px text everywhere.
- Deliverable requested here is an interactive HTML demo. Film source/timeline
  support repeatable screenshots; a 60fps narrated/scored video is not claimed.

Verification result (2026-11-06):
- `python3 examples/desert-eagle-console/build.py`: 764,181-byte offline HTML.
- `node examples/desert-eagle-console/smoke.cjs`: all 17 checks passed in Chromium
  with SwiftShader; no console/page errors and zero external network requests.
- State and 3D canvas are identical after render(6), render(19), render(6).
  Full-page PNG byte equality was not used as a gate: Chromium produced a tiny
  UI antialias difference bounded by (836,830)-(838,843), outside the 3D model.
- Reviewed tour frames 0/6/12/18 and 960×540 landscape. Corrected inherited
  dark-theme panel color and text overflow discovered during screenshot review.
- Portrait hint and reduced-motion behavior tested. Phone readability remains
  limited by the intentionally dense, scaled author-style console.
- Test evidence: `examples/desert-eagle-console/verification.json`.
- Model remains stylized procedural exterior geometry; template adherence does
  not establish showcase-level modeling fidelity. No real-device GPU benchmark,
  Firefox/Safari run, fullscreen permission test or 25-second hand-back timing
  test was performed.
