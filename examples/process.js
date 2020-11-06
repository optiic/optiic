const optiic = new (require('optiic'))({
  apiKey: 'api_test_key' // Not required, but having one removes limits (get your key at https://optiic.dev).
});

let options = {
  image: 'https://via.placeholder.com/468x60?text=We+love+Optiic!', // url of the image
  mode: 'ocr', // ocr
};

optiic.process(options)
.then(result => {
  console.log(result);
})
