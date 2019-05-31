var puppeteer = require('puppeteer');

// In-memory cache of rendered pages. Note: this will be cleared whenever the
// server process stops. If you need true persistence, use something like
// Google Cloud Storage (https://firebase.google.com/docs/storage/web/start).
const RENDER_CACHE = new Map();

/**
 * @param {string} url URL to prerender.
 * @param {string} browserWSEndpoint Optional remote debugging URL. If
 *     provided, Puppeteer's reconnects to the browser instance. Otherwise,
 *     a new browser instance is launched.
 */
async function ssr(url, browserWSEndpoint) {
  if (RENDER_CACHE.has(url)) {
    return {
      html: RENDER_CACHE.get(url),
      ttRenderMs: 0
    };
  }

  const start = Date.now();

  console.info('Connecting to existing Chrome instance.');
  const browser = await puppeteer.connect({
    browserWSEndpoint
  }); //await puppeteer.launch();
  const page = await browser.newPage();

  // 1. Intercept network requests.
  await page.setRequestInterception(true);

  page.on('request', req => {
    // 2. Ignore requests for resources that don't produce DOM
    // (images, stylesheets, media).
    const whitelist = ['document', 'script', 'xhr', 'fetch'];
    if (!whitelist.includes(req.resourceType())) {
      return req.abort();
    }

    // Don't load Google Analytics lib requests so pageviews aren't 2x.
    const blacklist = ['www.google-analytics.com', '/gtag/js', 'ga.js', 'analytics.js'];
    if (blacklist.find(regex => req.url().match(regex))) {
      return req.abort();
    }

    // 3. Pass through all other requests.
    req.continue();
  });

  try {
    // Add ?headless to the URL so the page has a signal
    // it's being loaded by headless Chrome.
    const renderUrl = new URL(url);
    renderUrl.searchParams.set('headless', '');
    // networkidle0 waits for the network to be idle (no requests for 500ms).
    // The page's JS has likely produced markup by this point, but wait longer
    // if your site lazy loads, etc.
    await page.goto(renderUrl, {
      waitUntil: 'networkidle0',
      timeout: 0
    });
  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content(); // serialized HTML of page DOM.
  //await browser.close();
  await page.close(); // Close the page we opened here (not the browser).

  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page ${url} in: ${ttRenderMs}ms`);

  RENDER_CACHE.set(url, html); // cache rendered page.

  return {
    html,
    ttRenderMs
  };
}

function clearCache() {
  RENDER_CACHE.clear();
}

module.exports = {
  ssr,
  clearCache
};
