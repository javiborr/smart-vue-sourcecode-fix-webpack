const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    configureWebpack: {
      plugins: [
        new CopyPlugin([
            { 
                from: 'src/source-dev/smart.grid*.js', 
                to: 'js/[name].[ext]', 
                toType: 'template'
            }
          ]),
      ]
    }
  }