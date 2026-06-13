const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://smart-shop.itheima.net/index.php?s=',
        changeOrigin: true
      }
    }
  }
})
