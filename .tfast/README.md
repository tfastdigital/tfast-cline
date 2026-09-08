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

Before distributing a custom VSIX, use `.tfast/extension-identity.json` as the intended manifest identity. It is configuration for future packaging, not an active manifest override. Upstream source and build manifests are intentionally preserved in this initial fork setup. A release build must apply that identity, verify provider callbacks and package references, and be tested in VS Code.

Use a dedicated VS Code profile named `TFast Dev AI` for the custom extension. Cline's command and view IDs still overlap, so do not enable the official Cline extension in the same profile. Changing the publisher/name alone does not make both extensions compatible side by side. Marketplace publication requires ownership of the publisher account; this setup does not publish anything.

## Setup validation

The initial setup validates Git remotes, branch ancestry, and the upstream-check helper. It does not certify a production extension build or a live model request. Keep inherited release/publishing workflows disabled unless intentionally configured for this fork.
