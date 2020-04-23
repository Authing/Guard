const fs = require('fs');
let txt = fs.readFileSync('node_modules/@vue/cli-service/lib/commands/build/resolveLibConfig.js').toString();
let count = 1;
let start = 0,
  end = 0;
for (let i = 0; i < txt.length; i++) {
  if (txt[i] === '\n') {
    count++;
  }
  if (count === 55) {
    start = i + 1;
  }
  if (count === 66) {
    end = i - 1;
  }
}
let left = txt.slice(0, start);
let content = txt.slice(start, end);
let right = txt.slice(end);
content = content
  .split('\n')
  .map(item => '//' + item)
  .join('\n');
txt = left + content + right;
fs.writeFileSync('node_modules/@vue/cli-service/lib/commands/build/resolveLibConfig.js', txt);
