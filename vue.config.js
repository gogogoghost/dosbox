const PrerenderSpaPlugin = require('prerender-spa-plugin');
const path=require('path')
module.exports={
  lintOnSave:false,
  outputDir:'docs',
  productionSourceMap:false,
  chainWebpack:config=>{
    if(process.env.NODE_ENV=='production'){
      config.plugin('ssr').use(new PrerenderSpaPlugin({
        staticDir:path.join(__dirname,'docs'),
        routes:['/']
      }))
    }
  }
}
