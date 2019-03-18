const fs = require('fs')
fs.writeFileSync('./dist/CNAME',fs.readFileSync('CNAME'));
