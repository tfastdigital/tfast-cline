# Build validation — 2026-09-08

Built `tfast-dev-ai-4.1.17.vsix` (8.71 MB) with Bun 1.3.13 and Node 24.12.0 on Windows x64.

Passed: frozen-lockfile dependency installation, SDK production builds, extension/webview TypeScript checks, VS Code compatibility typecheck, production webview build, lint, extension bundle, VSIX packaging, three authentication callback tests, package identity/assets/license checks, and activation in VS Code 1.136.1. The packaged extension registered its TFast commands and opened its sidebar in an isolated host.

SHA256: `439AD7B2ED82F8378A1E9EB8ECFF3C78B0EAC309EB76E332B7E6CAD5E782F413`

Rebuild: `node .tfast/build.mjs`

Verify on Windows: `./.tfast/verify.ps1 -Vsix .tfast/artifacts/tfast-dev-ai-4.1.17.vsix`

Install from VS Code's Extensions menu → Install from VSIX, using a dedicated TFast Dev AI profile. Select the file in `.tfast/artifacts/`.

Live provider requests and the full upstream test suite were not run. Python-controller integration is not included. Hosted authentication services may need registration of the fork callback; API-key providers can be configured directly. Local detailed logs and host-test evidence are ignored by Git.
