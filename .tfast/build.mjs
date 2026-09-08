import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('..', import.meta.url));
const app = path.join(root, 'apps/vscode');
const manifest = path.join(app, 'package.json');
const original = fs.readFileSync(manifest, 'utf8');
const identity = JSON.parse(fs.readFileSync(path.join(root, '.tfast/extension-identity.json'), 'utf8'));
const localBun = path.join(root, '.tfast/tools/bun-windows-x64/bun.exe');
const bun = fs.existsSync(localBun) ? localBun : 'bun';
const env = { ...process.env, PATH: [path.dirname(bun), path.join(root, 'node_modules/.bin'), process.env.PATH].join(path.delimiter) };
const run = (args, cwd = app) => execFileSync(bun, args, { cwd, env, stdio: 'inherit' });
if (execFileSync(bun, ['--version'], { encoding: 'utf8' }).trim() !== '1.3.13') throw new Error('Bun 1.3.13 is required.');
const artifacts = path.join(root, '.tfast/artifacts');
fs.mkdirSync(artifacts, { recursive: true });
run(['run', 'build:sdk'], root);
try {
  const pkg = JSON.parse(original.replaceAll('claude-dev', identity.name).replaceAll('"cline.', `"${identity.name}.`));
  Object.assign(pkg, identity);
  for (const view of pkg.contributes.viewsContainers.activitybar) view.title = 'TFast Dev AI';
  fs.writeFileSync(manifest, JSON.stringify(pkg, null, 2) + '\n');
  run(['run', 'package']);
  // Build already completed above; suppress the duplicate prepublish build only.
  delete pkg.scripts['vscode:prepublish'];
  fs.writeFileSync(manifest, JSON.stringify(pkg, null, 2) + '\n');
  run(['x', '--no-install', 'vsce', 'package', '--no-dependencies', '--out', path.join(artifacts, `tfast-dev-ai-${pkg.version}.vsix`)]);
} finally {
  fs.writeFileSync(manifest, original);
}
