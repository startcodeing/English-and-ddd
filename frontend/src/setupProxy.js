const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // 简化代理配置
  const apiProxy = createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    // 降低日志级别
    logLevel: 'warn',
    pathRewrite: { '^/api': '/api' },
    // 移除不必要的回调
  });
  
  app.use('/api', apiProxy);
};
