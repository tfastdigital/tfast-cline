# TFast build tools

- Bun 1.3.13, Windows x64, installed 2026-09-08 from the official `oven-sh/bun` GitHub release ZIP: https://github.com/oven-sh/bun/releases/tag/bun-v1.3.13
- Local executable: `.tfast/tools/bun-windows-x64/bun.exe`, with `bunx.exe` hardlinked to it for upstream scripts. Version verified as 1.3.13. No system PATH changes; the build wrapper supplies a process-local PATH.
- Node 24.12.0: existing `C:/Program Files/nodejs/node.exe` installation, compatible with the repository's Node >=22 requirement.
- Dependencies are installed with Bun and the repository lockfile. Generated artifacts and downloaded tools are ignored by Git.

From a PowerShell terminal with Node and Git on PATH, run `node .tfast/build.mjs`. This builds SDK dependencies and the production extension, packages a TFast VSIX into `.tfast/artifacts`, and restores the original source manifest even on normal build failure. The build does not publish to either marketplace.

- Gitleaks 8.30.1 Windows x64, official gitleaks/gitleaks release ZIP, installed 2026-09-08 to .tfast/tools/gitleaks for the required pre-commit secret scan. Version check passed.
