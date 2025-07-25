const path = require('path');
const { whenDev } = require('@craco/craco');
const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 开发环境优化
      whenDev(() => {
        // 禁用source map以加快构建速度
        webpackConfig.devtool = 'eval';
        
        // 减少开发环境的打包体积
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,
        };
      });
      
      return webpackConfig;
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: {
    // 开发服务器优化
    hot: true,
    liveReload: false,
  },
};
