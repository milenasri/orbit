const assert = require('node:assert/strict');
const test = require('node:test');

const { formatWaitlistCount, renderWaitlistCount } = require('../waitlist-count.js');

test('formats completed Tally submission counts for social proof copy', () => {
  assert.equal(formatWaitlistCount(1), '1 person');
  assert.equal(formatWaitlistCount(8), '8 people');
});

test('rejects invalid waitlist counts', () => {
  assert.throws(() => formatWaitlistCount(-1), /valid waitlist count/);
  assert.throws(() => formatWaitlistCount('8'), /valid waitlist count/);
});

test('renders count into the configured element', () => {
  const element = { textContent: '' };

  renderWaitlistCount(element, 12);

  assert.equal(element.textContent, '12 people');
});
