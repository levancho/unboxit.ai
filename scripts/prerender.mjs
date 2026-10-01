import { createServer } from 'vite';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const content = renderToString(createElement(App));
  const template = await readFile('dist/index.html', 'utf8');
  assert.ok(template.includes('<div id="root"></div>'), 'Expected the root placeholder');
  const html = template.replace('<div id="root"></div>', '<div id="root">' + content + '</div>');
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, 'One main heading');
  assert.ok(html.includes('UnboxIt is a free, hands-on guide'));
  assert.ok(html.includes('learning-transcript'));
  assert.ok(html.includes('rel="canonical" href="https://unboxit.ai/"'));
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(data['@graph'][0].url, 'https://unboxit.ai/');
  await writeFile('dist/index.html', html);
  console.log('Prerendered full lesson content; SEO checks passed.');
} finally { await server.close(); }
