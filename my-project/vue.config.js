const path = require('path');
const resolve = dir => path.join(__dirname, dir)
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('pages', resolve('src/pages'))
      .set('static', resolve('src/static'))
      .set('index', resolve('src/pages/index'))
      .set('video', resolve('src/pages/video'))
      .set('personal', resolve('src/pages/personal'))
      .set('search', resolve('src/pages/search'))
  }
}