const webpack = require('webpack')
const fs = require('fs')
const path = require('path')

module.exports = {
  mode: 'development',

  entry: fs.readdirSync(__dirname).reduce((entries, direction) => {
    const fullname = path.resolve(__dirname, direction)
    const entry = path.resolve(fullname, 'app.ts')
    if (fs.statSync(fullname).isDirectory() && fs.existsSync(entry)) {
      entries[direction] = ['webpack-hot-middleware/client', entry]
    }
    return entries
  },{}),

  output: {
    path: path.resolve(__dirname, '__build__'),
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      use: [{
        loader: 'tslint-loader'
      }]
    }, {
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }]
    }]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
