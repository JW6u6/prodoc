const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer:{
    proxy:{
      "/ajax":{
        target:"url",
        ws:false,
        changeOrigin: true
      }
    }
  }
})
