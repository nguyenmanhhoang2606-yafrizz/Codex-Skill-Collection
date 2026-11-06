"""Build the offline deliverable with its embedded license notices."""
import os
from pathlib import Path
import subprocess

example = Path(__file__).resolve().parent
root = example.parents[1]
skill = Path(os.environ.get('TEARDOWN_SKILL_DIR', Path.home() / '.agents/skills/teardown'))
subprocess.run(['node', str(skill / 'sims/build.mjs'), str(example)], cwd=root, check=True)
html = (root / 'teardown-out/dist/desert-eagle-viewer.html').read_text()
notices = '\n\n'.join(name + '\n' + (skill / name).read_text() for name in [
    'LICENSE', 'node_modules/three/LICENSE', 'node_modules/@fontsource-variable/inter/LICENSE',
    'node_modules/@fontsource/jetbrains-mono/LICENSE'])
html = html.replace('</body>', '<script type="text/plain" id="third-party-notices">\n' +
                    notices.replace('</script', '<\\/script') + '\n</script>\n</body>')
(example / 'demo.html').write_text(html)
print('Deliverable:', example / 'demo.html', len(html.encode()), 'bytes')
