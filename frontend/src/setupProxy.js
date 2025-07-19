const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy middleware...');
  
  // 代理所有/api开头的请求
  const apiProxy = createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: { '^/api': '/api' },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`Received response from ${req.url}: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`Proxy error: ${err.message}`);
    }
  });
  
  app.use('/api', apiProxy);
  console.log('Proxy middleware setup complete!');
};