# Speed Stars — V4 Lite

A trimmed distribution of the Dragonfly Reference Fix V4 build. All six active Unity data and WebAssembly files, shared runtime, mobile controls, original menu, XC page and local launcher are byte-for-byte unchanged. No mesh, material, collider, race method or animation was edited. The previous Dragonfly visibility fix is retained but has not been live-confirmed.

## Play

Extract the ZIP into a **new empty folder**. Windows: run `start.bat` (Python 3 required). macOS/Linux: run `python3 launch.py`. Use the original menu or the navigation links for 600m Rolling Hills and 400m Cross Country. Use Up or Down Arrow for hurdles; mobile touch controls and fullscreen remain available.

## What was removed

- `game.data` and `game.wasm`: unused stock copies; the original events already load `combined.data` and `combined.wasm`.
- `event600-boxes.data`: superseded collision test that predates the continuous mesh fix.
- `event600-no-bales.data` and `native600-no-bales.wasm`: obsolete hills-only fallback.
- The corresponding two diagnostic links on the 600m page. Old query-string links now load the current continuous-hill-and-bales build.
- Redundant README.txt; past check reports are retained under `docs/history/` for reference.

## GitHub Pages

Commit the extracted files at your repository root, including `.nojekyll`. For an existing repository, delete the five obsolete binaries and old README.txt, and replace the remaining files with this snapshot; uploading alone does not remove stale files. The previous check reports can also be moved to `docs/history/`. For GitHub Pages, use Settings → Pages → Deploy from a branch → main / (root). Relative URLs work on repository subpaths. No LFS or build step is required. Git history can still contain old versions; this cleanup shrinks the current snapshot, not prior commits. No change to runtime resolution, physics, compression or loading mechanism; this primarily reduces package/storage size, not FPS or per-event download size.

## Verify

Run `python3 tools/verify.py` to compare active file SHA-256 hashes. If Node.js is installed, the verifier additionally checks all three active WASM binaries. These checks do not establish live gameplay or rendering. Historical reports describe earlier snapshots and may list removed fallback files.

## Rights

Unofficial mod of Speed Stars. Original code, art and trademarks belong to their respective owners. Keep private unless authorized to redistribute; GitHub Pages can expose content publicly. Do not submit modified times as stock records. No source project or original-game license is provided.
