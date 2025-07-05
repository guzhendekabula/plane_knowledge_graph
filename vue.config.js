const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  base: "/plane_knowledge_graph/"
})

module.exports = {
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
}
