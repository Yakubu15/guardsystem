'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createApp, PUBLIC_DIR } = require('../server');

let server;
let baseUrl;

test.before(async () => {
    server = createApp().listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => {
    server?.close();
});

test('serves the roster app at the root path', async () => {
    const res = await fetch(`${baseUrl}/`);

    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /text\/html/);

    const body = await res.text();
    assert.match(body, /MFUMO WA RATIBA YA WALINZI/);
});

test('index.html exists with the correct name', () => {
    const file = path.join(PUBLIC_DIR, 'index.html');
    assert.ok(fs.existsSync(file), 'public/index.html should exist');
    assert.ok(!fs.existsSync(path.join(PUBLIC_DIR, 'index.html.txt')));
});

test('unknown API routes return JSON 404', async () => {
    const res = await fetch(`${baseUrl}/api/nope`);

    assert.strictEqual(res.status, 404);
    assert.deepStrictEqual(await res.json(), { error: 'Endpoint not found' });
});

test('unknown page routes fall back to the app shell', async () => {
    const res = await fetch(`${baseUrl}/ratiba`);

    assert.strictEqual(res.status, 404);
    assert.match(await res.text(), /MFUMO WA RATIBA YA WALINZI/);
});