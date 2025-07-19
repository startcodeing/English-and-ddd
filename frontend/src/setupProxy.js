const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('Setting up proxy middleware...');
  
  // 添加一个中间件来记录所有请求
  app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
  });
  
  // 代理所有/api开头的请求
  const apiProxy = createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    logLevel: 'debug',
    secure: false,
    pathRewrite: { '^/api': '/api' },
    router: function(req) {
      return 'http://localhost:8080';
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`Received response from ${req.url}: ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error(`Proxy error: ${err.message}`);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(`Proxy error: ${err.message}`);
    }
  });
  
  // 将代理中间件应用到Express应用
  app.use('/api', apiProxy);
  
  console.log('Proxy middleware setup complete!');
};