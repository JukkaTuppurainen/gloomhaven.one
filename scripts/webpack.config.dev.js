const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = env => ({
  devServer: {
    // contentBase: path.join(__dirname, '..'),
    compress: true,
    hot: true,
    port: 3000
  },
  devtool: 'inline-source-map',
  entry: './src/index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(jpg|png|webp|svg|ttf)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
            conservativeCollapse: false
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '..')
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV_isAlpha: (env && env['ENV_TARGET']) === 'alpha',
      ENV_isProduction: false,
      ENV_isTest: false
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, '..', 'template.js'),
      templateParameters: {
        isAlpha: (env && env['ENV_TARGET']) === 'alpha',
        isProduction: false
      },
      minify: false
    })
  ]
})
