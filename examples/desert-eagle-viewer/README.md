# Desert Eagle — exterior study

A stylized exterior sculpture created by Codex to exercise the teardown skill's
external-scene bundler, `runSim`, shader warm-up, embedded fonts and Three.js.
Open `demo.html` directly in a WebGL-capable browser. It is a single offline file
with embedded third-party license notices. No server or API key is needed.

Controls: four camera views, silver/graphite finishes, drag to orbit, scroll to
zoom, automatic orbit. User interaction pauses the orbit; it resumes after 25
seconds without camera interaction. Responsive layouts were checked at 1440×960
and 390×844. The geometry is an approximate visual study in arbitrary scene units.

From the repository root, with teardown installed:

```sh
node "$HOME/.agents/skills/teardown/sims/build.mjs" ./examples/desert-eagle-viewer
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
