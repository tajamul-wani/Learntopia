#!/usr/bin/env node
import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { ESLint } from 'eslint';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Ensure native binaries in WSL have executable permissions
if (process.platform === 'linux') {
  const esbuildBin = resolve(rootDir, 'node_modules/@esbuild/linux-x64/bin/esbuild');
  if (existsSync(esbuildBin)) {
    try { chmodSync(esbuildBin, 0o755); } catch {}
  }
  const nodeBin = resolve(rootDir, 'node_modules/.bin');
  if (existsSync(nodeBin)) {
    try {
      for (const file of readdirSync(nodeBin)) {
        try { chmodSync(join(nodeBin, file), 0o755); } catch {}
      }
    } catch {}
  }
}

// 1. Get staged files directly via git binary without cmd.exe shell wrapper
let stagedFiles = [];
try {
  const stdout = execFileSync('git', ['-c', 'safe.directory=*', 'diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  stagedFiles = stdout.split('\n').map(s => s.trim()).filter(Boolean);
} catch (err) {
  console.error('[pre-commit] Failed to get staged files:', err.message);
  process.exit(1);
}

// 2. Filter for staged JS/JSX files
const jsFiles = stagedFiles.filter(f => /\.(js|jsx|mjs)$/.test(f));

// 3. Lint staged JS/JSX files
if (jsFiles.length > 0) {
  console.log(`[pre-commit] Linting ${jsFiles.length} staged file(s)...`);
  try {
    const eslint = new ESLint({ cwd: rootDir });
    const results = await eslint.lintFiles(jsFiles);
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);
    if (resultText) console.log(resultText);

    const hasErrors = results.some(r => r.errorCount > 0);
    if (hasErrors) {
      console.error('[pre-commit] ESLint found errors. Commit aborted.');
      process.exit(1);
    }
  } catch (err) {
    console.error('[pre-commit] ESLint execution failed:', err.message);
    process.exit(1);
  }
} else {
  console.log('[pre-commit] No JavaScript files staged for linting.');
}

// 4. Run unit tests
console.log('[pre-commit] Running unit tests...');
const vitestEntry = resolve(rootDir, 'node_modules/vitest/vitest.mjs');
const testResult = spawnSync(process.execPath, [vitestEntry, 'run'], {
  cwd: rootDir,
  stdio: 'inherit',
});

if (testResult.status !== 0) {
  console.error('[pre-commit] Unit tests failed. Commit aborted.');
  process.exit(testResult.status || 1);
}

console.log('[pre-commit] All pre-commit checks passed.');
process.exit(0);
