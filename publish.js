const fs = require('fs')
fs.writeFileSync('./docs/CNAME',fs.readFileSync('CNAME'));
