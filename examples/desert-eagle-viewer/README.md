# Desert Eagle — exterior study

A stylized exterior sculpture created by Codex to exercise the teardown skill's
external-scene bundler, `runSim`, shader warm-up, embedded fonts and Three.js.
Open `demo.html` directly in a WebGL-capable browser. It is a single offline file
with embedded third-party license notices. No server or API key is needed.

Controls: four camera views, silver/graphite finishes, drag to orbit, scroll to
zoom, automatic orbit. Camera interaction pauses the orbit; it resumes after 25 seconds of inactivity.
Explicitly switching auto-orbit off keeps it off. Reduced-motion preferences disable
automatic motion at startup. Responsive layouts were checked at 1440×960
and 390×844. The geometry is an approximate visual study in arbitrary scene units.

From the repository root, with teardown installed:

```sh
python3 examples/desert-eagle-viewer/build.py
node examples/desert-eagle-viewer/smoke.cjs
```

The build produces `teardown-out/dist/desert-eagle-viewer.html`. The shipped
`demo.html` contains the same bundle plus license texts from teardown, Three.js,
Inter and JetBrains Mono. Preserve those notices when replacing the shipped demo.
The smoke check exercises the shipped demo; regenerate/copy it before checking a
new build. Browser screenshots and JSON go to `/tmp/teardown-evaluation` by default.
Override `TEARDOWN_SKILL_DIR` and `TEARDOWN_TEST_OUTPUT` when needed.

The browser test allows Chromium's SwiftShader in environments without a GPU.
That validates rendering compatibility, not real-GPU performance.

## Complete presentation edition

- Three selectable design annotations, with descriptions in Vietnamese.
- Brushed metal, exterior bevels, decorative lettering and instanced grip texture.
- PNG export (model canvas with transparency), fullscreen, reset, low/high graphics.
- Reduced-motion support; explicit pause is respected.
- The smoke test covers annotations, PNG file export, fullscreen, quality selection,
  reset and reduced motion in addition to the original interactions.
- `build.py` rebuilds the shipped HTML and preserves license notices automatically.

The artifact is a complete exterior presentation. Its geometry remains stylized;
reference-image fidelity and real-device performance have not been certified.

`preview.mp4` is an eight-second browser recording for a quick look. It has no
audio and is not a 60 fps cinematic export. Use `demo.html` for full interaction.

## Reference edition 02

The current exterior has been redrawn using the user's Desert Eagle side-view
image as the primary visual reference, with the supplied concept sheet as a
secondary material reference. Earlier GSG-1911/other-pistol images were excluded.
`reference-side.png` shows the revised silhouette. Unseen surfaces remain artistic
approximations; the model is not a scan or a certified 1:1 reproduction.
