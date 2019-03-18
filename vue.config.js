const PrerenderSpaPlugin = require('prerender-spa-plugin');
const path=require('path')
module.exports={
  lintOnSave:false,
  productionSourceMap:false,
  chainWebpack:config=>{
    if(process.env.NODE_ENV=='production'){
      config.plugin('ssr').use(new PrerenderSpaPlugin({
        staticDir:path.join(__dirname,'dist'),
        routes:['/']
      }))
    }
  },
  devServer:{
    proxy:{
      '/game':{
        target:'http://127.0.0.1:8081/',
        pathRewrite:{
          '^/game':''
        },
        changeOrigin:true
      }
    }
  }
}
