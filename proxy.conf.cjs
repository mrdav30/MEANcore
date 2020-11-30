const HttpsProxyAgent = require('https-proxy-agent');

/*
 * API proxy configuration.
 * This allows you to proxy HTTP request like `http.get('/api/stuff')` to another server/port.
 * This is especially useful during app development to avoid CORS issues while running a local server.
 * For more details and options, see https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md
 */
const proxyConfig = [{
  context: ['/api', '/uac'],
  // pathRewrite: { '^/api': '' },
  target: 'http://localhost:3000',
  changeOrigin: true,
  secure: false
}];

/*
 * Configures a corporate proxy agent for the API proxy if needed.
 */
function setupForCorporateProxy(config) {
  if (!Array.isArray(config)) {
    config = [config];
  }

  const proxyServer = process.env.HTTP_PROXY;
  let agent = null;

  if (proxyServer) {
    console.log(`Using corporate proxy server: ${proxyServer}`);
    agent = new HttpsProxyAgent(proxyServer);
    config.forEach(entry => {
      entry.agent = agent;
    });
  }

  return config;
}

module.exports = setupForCorporateProxy(proxyConfig);
