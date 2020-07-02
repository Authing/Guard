const fs = require('fs');
require('dotenv').config()
const filename = 'dist/index.html'
fs.writeFileSync(
  filename, 
  fs.readFileSync(filename)
    .toString()
    .replace(/process.env.API_POINT/g, `'${process.env.API_POINT}'`)
    .replace("process.env.PUBLIC_KEY", `'${process.env.PUBLIC_KEY}'`)
);