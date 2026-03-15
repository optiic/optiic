const Optiic = require('optiic');

const optiic = new Optiic({
  apiKey: 'api_test_key', // Not required, but having one removes limits (get your key at https://optiic.dev).
});

optiic.process({
  url: 'https://optiic.dev/assets/images/samples/we-love-optiic.png',
  mode: 'ocr',
})
.then(result => {
  console.log(result);
});
