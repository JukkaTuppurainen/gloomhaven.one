const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const WebpackShellPlugin = require('webpack-shell-plugin')

const minify = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}

module.exports = env => ({
  entry: [
    path.join(__dirname, '..', 'src', 'index.js')
  ],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(jpg|png|webp|svg|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[sha512:hash:base64:6].[ext]'
            }
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
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: false
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin()
    ]
  },
  output: {
    filename: 'main.[chunkhash:8].js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  plugins: [
    new webpack.DefinePlugin({
      ENV_TARGET: JSON.stringify((env && env.ENV_TARGET) || 'production')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.join(__dirname, '..', 'index.ejs'),
      templateParameters: {
        isProduction: true
      },
      minify
    }),
    new HtmlWebpackPlugin({
      chunks: [],
      filename: 'error.html',
      template: path.join(__dirname, '..', 'error.html'),
      minify
    }),
    new WebpackShellPlugin({
      onBuildStart: ['node scripts/build.js']
    }),
    new MiniCssExtractPlugin({})
  ]
})
