#!/usr/bin/env bash
set -euo pipefail
repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
python3 - "$repo_dir" <<'PYSETUP'
import hashlib, json, pathlib, shutil, sys
repo=pathlib.Path(sys.argv[1])
src=repo/'skills/teardown'
manifest=json.loads((repo/'research/teardown-source.json').read_text())['sha256']
for name,digest in manifest.items():
    if hashlib.sha256((src/name).read_bytes()).hexdigest()!=digest:
        raise SystemExit('Backup checksum mismatch: '+name)
dst=pathlib.Path.home()/'.agents/skills/teardown'
if dst.exists():
    for name,digest in manifest.items():
        p=dst/name
        if not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest()!=digest:
            raise SystemExit('Existing skill differs; preserve and review it before reinstalling: '+str(p))
else:
    dst.parent.mkdir(parents=True,exist_ok=True)
    shutil.copytree(src,dst)
legacy=pathlib.Path.home()/'.codex/skills/teardown'
if not legacy.exists() and not legacy.is_symlink():
    legacy.parent.mkdir(parents=True,exist_ok=True)
    legacy.symlink_to(dst,target_is_directory=True)
print('Verified backup and installed skill:',dst)
PYSETUP
cd "$HOME/.agents/skills/teardown"
npm ci
./node_modules/.bin/playwright install chromium
