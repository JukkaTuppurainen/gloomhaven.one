const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const minify = {
  collapseWhitespace: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true
}

module.exports = env => {
  const isAlpha = (env && env['ENV_TARGET']) === 'alpha'
  const outputPath = [__dirname, '..', 'dist']
  if (isAlpha) {
    outputPath.push('alpha')
  }

  const plugins = [
    new webpack.DefinePlugin({
      ENV_isAlpha: isAlpha,
      ENV_isProduction: true,
      ENV_isTest: false
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.join(__dirname, '..', 'template.js'),
      templateParameters: {
        isAlpha,
        isProduction: true
      },
      minify
    }),
    new MiniCssExtractPlugin({
      chunkFilename: '[id].[chunkhash:8].css',
      filename: '[name].[chunkhash:8].css'
    })
  ]

  if (!isAlpha) {
    plugins.push(
      new HtmlWebpackPlugin({
        chunks: [],
        filename: 'error.html',
        template: path.join(__dirname, '..', 'error.html'),
        minify
      })
    )
  }

  return {
    entry: [
      path.join(__dirname, '..', 'src', 'index.js')
    ],
    mode: 'production',
    module: {
      rules: [
        {
          test: /favicon/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
                outputPath: isAlpha ? '..' : undefined
              }
            }
          ]
        },
        {
          test: /(?<!favicon)\.(jpg|png|webp|svg|ttf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[sha512:hash:base62:7].[ext]',
                outputPath: isAlpha ? '..' : undefined
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
              loader: MiniCssExtractPlugin.loader
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
      path: path.resolve(...outputPath)
    },
    plugins
  }
}
