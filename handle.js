const fs = require('fs');
let txt = fs.readFileSync('node_modules/@vue/cli-service/lib/commands/build/resolveLibConfig.js').toString();
txt = txt.replace(/\/\/ externalize Vue([\s\S]*?)\n\n/g ,"")
fs.writeFileSync('node_modules/@vue/cli-service/lib/commands/build/resolveLibConfig.js', txt);
