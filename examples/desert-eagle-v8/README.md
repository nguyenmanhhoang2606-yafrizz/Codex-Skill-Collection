# Desert Eagle · V8 Reference Edition

Open **[demo.html](demo.html)** in a browser with WebGL. It is a self-contained
offline page. [Preview](preview.png) · [V8 comparison](comparison.png) ·
[Tour contact sheet](tour-sheet.png).

This edition uses **the skill author's V8 example as its canonical product**.
It is not based on the uploaded Claude simulator. The earlier
[custom console](../desert-eagle-console/demo.html) remains available for comparison.

## What is reused

`console.js` starts from the original `v8-shared/console.js`: all seven panel
rectangles, title/readout positions, font hierarchy, controls, surface-index row,
operator pointer and leader-line renderer retain the original layout. The original
engine-specific chart contents are replaced with a scrub-enabled inspection
timeline and contextual exterior-surface notes. `stage.js` starts from the original V8 stage and
retains its environment, GTAO/MSAA pipeline, shadow catcher and quality API;
the geometry adapter and floor height change for this subject.

`live.js` retains the original fixed-canvas CSS, tier settings, takeover/idle-tour
pattern and control arrangement. `film.js` uses its pure-time tour, easing and
operator-cursor pattern with an exterior-specific script. These two modules are
adaptations, not identical upstream copies. The original backup in `skills/teardown`
and the installed skill are untouched. Source commit and hashes are in
[provenance.json](provenance.json); upstream MIT and dependency notices are embedded
in the HTML.

## Controls

- Drag to orbit, scroll to zoom, 1–5 to select camera, H to hide the console.
- Pause/Space pauses or resumes the same scripted tour; ±15° steps the camera angle.
- Tour position scrubs the scripted presentation. Tour speed controls scripted
  playback and is preserved across pause, seek and resume.
- Silver, graphite and clay change the actual material. Callouts, edges, focus
  and charts toggle their corresponding display. Click a numbered surface to
  highlight it and smoothly reframe that region. Reset restores the initial camera; Save exports the 3D canvas PNG.
- The tour chip resumes automatic presentation. Ordinary interaction returns
  to the tour after 25 seconds idle; explicit pause and reduced-motion settings
  keep the scene still until playback is requested. Explicit Play works even
  with reduced motion; camera inspection transitions then happen immediately.

The author-style dense console is intended for desktop/landscape. Portrait is
scaled and shows a rotation hint. It is not a redesigned mobile interface.

## Scope and evaluation

The model is an artistic exterior study based on the supplied Desert Eagle
references, with chamfered surfaces, rounded frame/grip, stipple and lettering.
It has no internal operating mechanism, engineering dimensions or assembly model.
Engine cutaway/combustion/pressure controls do not apply and are replaced by
finish/display controls and camera data; this is not full feature parity with V8.
The selected-surface card describes that surface; its roughness readout explicitly
reports the metal finish, not measured physical properties.

The reasoning-effort setting is not visible to the implementation. This iteration
also changes the workflow and template reuse, so it is **not a controlled A/B test
of Extra High**. Judge the rendered result separately from attribution of its cause.

## Reproduce

After the repository's teardown setup:

```sh
python3 examples/desert-eagle-v8/build.py
node "$HOME/.agents/skills/teardown/sims/build.mjs" v8-live
node examples/desert-eagle-v8/verify.cjs
node examples/desert-eagle-v8/regressions.cjs
```

`TEARDOWN_SKILL_DIR` can select another skill installation. Verification output
is written to `/tmp/de-v8-verification`. `?capture&quality=2` selects deterministic
low-tier capture; `quality=0` selects the full GTAO studio. Normal use chooses and
adapts quality using the V8 tier strategy. Cloud tests use software rendering;
real integrated-GPU performance and Safari/Firefox are not claimed verified.

## Repair history

The [repair log](../../research/evaluations/de-v8-fixes/CHANGELOG.md) records
reproductions, fixes and remaining limitations. The
[prior audit](../../research/evaluations/de-v8-audit/README.md) is retained as a
historical report about the pre-fix version, not the current behavior.
