const fs = require('fs-extra');

console.log(`
Emptying dist '${__dirname}/../dist'
`)

fs.emptyDirSync(__dirname + '/../dist')
