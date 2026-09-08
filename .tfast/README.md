# TFast Cline development

This is an independent TFast fork of Cline, retaining the original Apache-2.0 license and attribution. It is not an official Cline release.

- Original: https://github.com/cline/cline
- Fork: https://github.com/tfastdigital/tfast-cline
- Custom work: `tfast/development`
- Keep `main` as an upstream baseline. Make enhancements on the custom branch.

## Receive updates

From the repository root, with Node >=22 and Git on PATH:

```powershell
git switch tfast/development
node .tfast/update.mjs --check
node .tfast/update.mjs
```

The helper refuses dirty worktrees and unexpected upstream URLs. It fetches the original repository and merges new commits into a review branch. It never force-pushes or automatically changes the development branch. Resolve any conflicts, run Cline's build and relevant tests, then use the commands printed by the helper to fast-forward development and push it. If abandoning a conflicted merge, run `git merge --abort` and switch back to `tfast/development`.

GitHub's Sync fork button updates the fork's baseline; it does not incorporate updates into your custom branch. Use the helper for that step. Upstream changes can still require manual conflict resolution and compatibility work.

## VS Code development

Open this checkout in VS Code. Follow root `AGENTS.md` and `CONTRIBUTING.md`; the extension is in `apps/vscode`. This revision requires Bun 1.3.13 and Node >=22. No Ollama installation is required to maintain this fork. Select and authenticate an API provider in the extension when running agent tasks.

Keep TFast-specific integration code in a separate module where practical and minimize edits to upstream files. The Python TFast controller remains a separate repository; it has not been integrated into Cline by this setup.

## Separate extension identity

Run `node .tfast/build.mjs` to build a custom VSIX. The wrapper applies `.tfast/extension-identity.json` during the production build, updates contributed command and view IDs using Cline's nightly-build convention, and restores the upstream manifest afterward. Output is written to `.tfast/artifacts/`. The authentication redirect uses the configured extension identity. The wrapper never publishes a release.

Use a dedicated VS Code profile named `TFast Dev AI` for the custom extension. Although contributed command and view IDs are renamed, coexistence with official Cline is not validated. Marketplace publication requires ownership of the publisher account. API-key providers can be configured in the extension; hosted OAuth providers may require registering the fork's callback URI with the service operator.

## Setup validation

See [BUILD-RESULT.md](BUILD-RESULT.md) for production build and packaged VS Code activation results. Live model requests require provider configuration. Keep inherited release/publishing workflows disabled unless intentionally configured for this fork.
