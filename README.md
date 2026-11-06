# Codex Skill Collection

Research and versioned source backups of skills evaluated for Codex.

## Teardown

The complete source backup is in `skills/teardown`, from commit
`a91262ac1109051e014662d42ecb0b7bc1f113b1` of
https://github.com/elvarofficial/teardown.
Original MIT license, credits and audio provenance are retained. File checksums
are recorded in `research/teardown-source.json`.

Restore on Linux/macOS with Node.js 20+, npm, Python 3 and Bash:

```sh
bash scripts/setup-teardown.sh
node "$HOME/.agents/skills/teardown/sims/build.mjs" v8-live
```

The setup verifies the backup, installs the user skill and locked npm dependencies,
and downloads Chromium. FFmpeg is additionally required for video/audio workflows.
Existing modified installations are preserved: setup stops if source files differ.
No download from the author's Git repository is needed. Fresh dependency/browser
installation still requires npm and Playwright download services.

This is an environment-local installation, not an account plugin. Restart the
Codex session to check discovery; automatic skill discovery has not been confirmed
in the cloud skill catalog. The agent can read the installed SKILL.md explicitly.
Build output is placed in `teardown-out` under the current working directory.

Cloud tasks are already isolated; use the existing checkout without creating a
Git worktree unless explicitly requested. Publish the prepared environment through
the product to snapshot installed files; live processes do not survive snapshots.
