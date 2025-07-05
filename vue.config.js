const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/plane_knowledge_graph/'
    : '/',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://47.115.45.110:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
