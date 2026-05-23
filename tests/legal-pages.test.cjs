const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('hosted site exposes legal and support pages at the repo root', () => {
  for (const fileName of [
    'privacy.html',
    'terms.html',
    'support.html',
    'delete-account.html',
  ]) {
    const page = fs.readFileSync(path.join(root, fileName), 'utf8');
    assert.match(page, /Orbit/);
    assert.doesNotMatch(page, /https:\/\/orbit\.care/);
  }
});

test('hosted legal and support pages use the current email address', () => {
  const currentEmail = 'matthewt0821@hotmail.com';

  for (const fileName of [
    'privacy.html',
    'terms.html',
    'support.html',
    'delete-account.html',
  ]) {
    const page = fs.readFileSync(path.join(root, fileName), 'utf8');
    const emailMatches = page.match(/mailto:([^"]+)|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) ?? [];

    for (const match of emailMatches) {
      assert.ok(match.includes(currentEmail), `${fileName} contains outdated email ${match}`);
    }
  }
});

test('landing page links legal and support pages only from the footer', () => {
  const page = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const footer = page.match(/<footer[\s\S]*<\/footer>/i)?.[0] ?? '';
  assert.ok(footer, 'index.html must include a footer');

  for (const href of [
    'privacy.html',
    'terms.html',
    'support.html',
    'delete-account.html',
  ]) {
    assert.match(footer, new RegExp(`href="${href}"`));
    assert.equal((page.match(new RegExp(`href="${href}"`, 'g')) ?? []).length, 1);
  }
});
