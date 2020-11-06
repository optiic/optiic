const jetpack = require('fs-jetpack');
const package = require('../package.json');

function prepare() {
  return new Promise(async function(resolve, reject) {
    let index = await jetpack.read('./src/index.js')
      .replace(/{{version}}/gi, package.version)
    await jetpack.write('./dist/index.js', index)
  });
}

return prepare();
