var CrawlerDetector = require('./crawler-detector/crawler-detector')

module.exports = isBot;

function isBot(userAgent) {
  // create a new Crawler instance
  var crawlerDetector = new CrawlerDetector();

  // check if user agent string is a crawler
  return crawlerDetector.isCrawler(userAgent);
}
