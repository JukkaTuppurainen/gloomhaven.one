const chalk = require('chalk')
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('./webpack.config')

console.log(__dirname)

console.log('Removing dist...')
fs.emptyDirSync(__dirname + '/../dist')

console.log('Running Webpack')
const compiler = webpack(config)
compiler.run((err, stats) => {
  if (err) {
    console.log(chalk.red('Error:'))
    console.log(err)
    process.exit(1)
  }
  if (stats.compilation.errors && stats.compilation.errors.length > 0) {
    console.log(chalk.red('Error:'))
    console.log(stats.compilation.errors)
    process.exit(1)
  }

  console.log(chalk.green('Build successfully.\n'));
})
