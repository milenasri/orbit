(function attachWaitlistCount(root) {
  function formatWaitlistCount(count) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error('Expected a valid waitlist count.');
    }

    return `${count} ${count === 1 ? 'person' : 'people'}`;
  }

  function renderWaitlistCount(element, count) {
    if (!element) {
      throw new Error('Waitlist count element was not found.');
    }

    element.textContent = formatWaitlistCount(count);
  }

  async function loadWaitlistCount(options) {
    const settings = options || {};
    const doc = settings.document || root.document;
    const fetcher = settings.fetch || root.fetch;
    const url = settings.url || 'waitlist-count.json';
    const element = doc && doc.getElementById('waitlist-count');

    if (!fetcher) {
      throw new Error('Fetch is not available for waitlist count loading.');
    }

    const response = await fetcher(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Waitlist count request failed with ${response.status}.`);
    }

    const data = await response.json();
    renderWaitlistCount(element, data.count);
  }

  const api = {
    formatWaitlistCount,
    renderWaitlistCount,
    loadWaitlistCount,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  root.OrbitWaitlistCount = api;

  if (root.document) {
    root.document.addEventListener('DOMContentLoaded', function initWaitlistCount() {
      loadWaitlistCount().catch(function handleWaitlistCountError(error) {
        console.error(error);
      });
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
