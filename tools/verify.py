"""Verify the active V4 Lite snapshot, optionally including WASM validity."""
from pathlib import Path
import hashlib,json,shutil,subprocess,sys
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'active-sha256.json').read_text())
errors=[name for name,digest in manifest.items() if not (root/name).is_file() or hashlib.sha256((root/name).read_bytes()).hexdigest()!=digest]
if errors: sys.exit('FAIL: '+', '.join(errors))
print(f'PASS: {len(manifest)} active files match SHA-256 checksums.')
node=shutil.which('node')
if node:
    subprocess.run([node,'-e',"for(const f of process.argv.slice(1)){if(!WebAssembly.validate(require('fs').readFileSync(f)))throw Error(f);console.log('PASS WASM: '+f)}",*[str(root/n) for n in manifest if n.endswith('.wasm')]],check=True)
else: print('Node unavailable; optional WASM validation skipped.')
