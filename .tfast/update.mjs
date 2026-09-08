import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('..', import.meta.url));
const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
try {
  if (git('status', '--porcelain')) throw new Error('Commit or stash your changes before checking updates.');
  if (git('branch', '--show-current') !== 'tfast/development') throw new Error('Switch to tfast/development first.');
  const url = git('remote', 'get-url', 'upstream');
  if (url !== 'https://github.com/cline/cline.git') throw new Error(`Unexpected upstream: ${url}`);
  git('fetch', 'upstream', 'main');
  const ahead = git('rev-list', '--count', 'HEAD..upstream/main');
  if (ahead === '0') {
    console.log('TFast already includes the current upstream/main.');
  } else if (process.argv.includes('--check')) {
    console.log(`${ahead} upstream commits available. Run without --check to prepare a review branch.`);
  } else {
    const branch = `tfast/update-${new Date().toISOString().replace(/[:.]/g, '-')}`;
    git('switch', '-c', branch);
    console.log(`Review branch: ${branch}`);
    try { console.log(git('merge', '--no-edit', 'upstream/main')); }
    catch (error) {
      console.error('Merge needs attention. Resolve conflicts and commit, or run git merge --abort. The development branch is unchanged.');
      throw error;
    }
    console.log(`Run the upstream build and tests, then: git switch tfast/development && git merge --ff-only ${branch}`);
    console.log('Publish after review with: git push origin tfast/development');
  }
} catch (error) {
  console.error(error.stderr?.toString() || error.message);
  process.exitCode = 1;
}
