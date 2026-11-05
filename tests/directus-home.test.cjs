const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');

// Compile the TypeScript helper so the tests also run on the project's Node 18 image.
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'shishiro-test-'));
after(() => fs.rmSync(output, { recursive: true, force: true }));
execFileSync(process.execPath, [
  require.resolve('typescript/bin/tsc'), path.join(__dirname, '../lib/directus-home.ts'),
  '--outDir', output, '--module', 'commonjs', '--target', 'es2020', '--skipLibCheck',
]);
const { fetchCollection } = require(path.join(output, 'directus-home.js'));

test('recovers when Directus briefly fails before returning links', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    if (requests === 1) throw new TypeError('temporary network failure');
    return new Response(JSON.stringify({ data: [{ id: 1, title: 'Link' }] }), { status: 200 });
  };

  const items = await fetchCollection('http://test.invalid/links', { requireItems: true, retryDelayMs: 0 });
  assert.equal(requests, 2);
  assert.equal(items[0].title, 'Link');
});

test('retries an unexpectedly empty required collection', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let requests = 0;
  globalThis.fetch = async () => new Response(JSON.stringify({ data: ++requests === 1 ? [] : [{ id: 1 }] }), { status: 200 });

  const items = await fetchCollection('http://test.invalid/links', { requireItems: true, retryDelayMs: 0 });
  assert.equal(requests, 2);
  assert.equal(items.length, 1);
});

test('surfaces a permissions error without repeatedly requesting it', async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  let requests = 0;
  globalThis.fetch = async () => { requests++; return new Response('', { status: 403 }); };

  await assert.rejects(fetchCollection('http://test.invalid/links', { retryDelayMs: 0 }), /HTTP 403/);
  assert.equal(requests, 1);
});
