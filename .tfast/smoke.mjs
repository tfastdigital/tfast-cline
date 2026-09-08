import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(path.join(root, 'apps/vscode/package.json'));
const { runTests } = require('@vscode/test-electron');
delete process.env.ELECTRON_RUN_AS_NODE;
const tools = path.join(root, '.tfast/tools');
const workspace = path.join(tools, 'smoke-workspace');
fs.mkdirSync(workspace, { recursive: true });
await runTests({
  vscodeExecutablePath: process.env.TFAST_VSCODE_EXECUTABLE,
  extensionDevelopmentPath: process.env.TFAST_SMOKE_EXTENSION_DIR || path.join(tools, 'vsix/extension'),
  extensionTestsPath: path.join(root, '.tfast/host-smoke.cjs'),
  extensionTestsEnv: { TFAST_SMOKE_RESULT: path.join(root, '.tfast/artifacts/host-smoke.json') },
  launchArgs: [workspace, '--user-data-dir', path.join(tools, 'vscode-userdata'),
    '--extensions-dir', path.join(tools, 'vscode-extensions'),
    '--disable-extensions', '--skip-welcome', '--skip-release-notes', '--disable-workspace-trust'],
});
