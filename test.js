var fs = require('fs');
if (process.env.port != null) {
    console.log('ENV', process.env.port)
    fs.writeFileSync('debug.txt', process.env.port)
}
