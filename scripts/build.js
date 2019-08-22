const fs = require('fs-extra');
const path = require('path')

const distPathName = path.join(__dirname, '..', 'dist')

console.log(`
Emptying dist '${distPathName}/'`)

fs.emptyDirSync(distPathName)

console.log(`
Copying favicons to dist.
`)

fs.copyFile('favicon.svg', 'dist/favicon.svg')
fs.copyFile('favicon.png', 'dist/favicon.png')
