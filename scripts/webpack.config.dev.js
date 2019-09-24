const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = env => ({
  devServer: {
    contentBase: path.join(__dirname, '..'),
    compress: true,
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
      ENV_TARGET: JSON.stringify((env && env.ENV_TARGET) || 'production')
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, '..', 'index.ejs'),
      templateParameters: {
        isProduction: false
      },
      minify: false
    })
  ]
})
