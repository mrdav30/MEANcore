const path = require('path');
const SitemapGenerator = require('advanced-sitemap-generator');

// create generator
const generator = SitemapGenerator('https://meancore.com', {
  stripQuerystring: false,
  ignoreHreflang: false,
  filepath: path.join(process.cwd(), 'sitemap.xml'),
  excludeUrls: []
});

generator.on('add', (url) => {
  // log url
  console.log('Successfully added URL ' + url);
});

generator.on('ignore', (url) => {
  // log ignored url
  console.log('Ignoring URL ' + url);
});

// register event listeners
generator.on('done', () => {
  // sitemaps created
  console.log('Successfully created sitemap')
});

generator.on('error', (error) => {
  console.log(error);
  // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
});

// start the crawler
generator.start();
