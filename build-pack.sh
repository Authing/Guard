#!/bin/bash
VERSION=`node -e '(function() { console.log(require(\"./package.json\").version) })()'`
npx vue-cli-service build --target lib --name Guard.$VERSION ./src/main.js