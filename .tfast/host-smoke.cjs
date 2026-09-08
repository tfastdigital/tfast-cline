const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vscode = require('vscode');

exports.run = async function () {
  const id = 'tfastdigital.tfast-dev-ai';
  const extension = vscode.extensions.getExtension(id);
  assert.ok(extension, `Packaged extension ${id} was not discovered`);
  await extension.activate();
  assert.equal(extension.isActive, true);
  const commands = await vscode.commands.getCommands(true);
  for (const suffix of ['plusButtonClicked', 'settingsButtonClicked', 'focusChatInput']) {
    assert.ok(commands.includes(`tfast-dev-ai.${suffix}`), `Missing command ${suffix}`);
  }
  await vscode.commands.executeCommand('tfast-dev-ai.SidebarProvider.focus');
  const build = path.join(extension.extensionPath, 'webview-ui/build');
  assert.ok(fs.existsSync(build), 'Packaged webview is missing');
  fs.writeFileSync(process.env.TFAST_SMOKE_RESULT, JSON.stringify({
    extension: id, version: extension.packageJSON.version,
    vscode: vscode.version, activation: 'passed', commands: 'passed',
    sidebar: 'opened', timestamp: new Date().toISOString(),
    liveProviderRequest: 'not tested',
  }, null, 2));
};
