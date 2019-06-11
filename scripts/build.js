const fs = require('fs-extra');

console.log(`
Emptying dist '${__dirname}/../dist'
`)

fs.emptyDirSync(__dirname + '/../dist')

console.log(`
Copying favicons to dist'
`)

fs.copyFile('favicon.svg', 'dist/favicon.svg')
fs.copyFile('favicon.png', 'dist/favicon.png')
