<p align="center">
  <a href="https://cdn.itwcreativeworks.com/assets/optiic/images/logo/optiic-brandmark-black-x.svg">
    <img src="https://cdn.itwcreativeworks.com/assets/optiic/images/logo/optiic-brandmark-black-x.svg">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/optiic/optiic.svg">
  <br>
  <img src="https://img.shields.io/david/optiic/optiic.svg">
  <img src="https://img.shields.io/david/dev/optiic/optiic.svg">
  <img src="https://img.shields.io/bundlephobia/min/optiic.svg">
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/optiic/optiic.svg">
  <img src="https://img.shields.io/npm/dm/optiic.svg">
  <img src="https://img.shields.io/node/v/optiic.svg">
  <img src="https://img.shields.io/website/https/optiic.dev.svg">
  <img src="https://img.shields.io/github/license/optiic/optiic.svg">
  <img src="https://img.shields.io/github/contributors/optiic/optiic.svg">
  <img src="https://img.shields.io/github/last-commit/optiic/optiic.svg">
  <br>
  <br>
  <a href="https://optiic.dev">Site</a> | <a href="https://www.npmjs.com/package/optiic">NPM Module</a> | <a href="https://github.com/optiic/optiic">GitHub Repo</a>
  <br>
  <br>
  <strong>optiic</strong> is the official npm module of <a href="https://optiic.dev">Optiic</a>, a free image recognition & optical character recognition (OCR) API.
</p>

## Optiic Works in Node AND browser environments
Yes, this module works in both Node and browser environments, including compatability with [Webpack](https://www.npmjs.com/package/webpack) and [Browserify](https://www.npmjs.com/package/browserify)!

## Features
* Image recognition and analysis API
* Provide images as URLs or upload them directly
* OCR
  * Extract text from the supplied image
  * Detect the language of the text

### Getting an API key
You can use so much of `optiic` for free, but if you want to do some advanced stuff, you'll need an API key. You can get one by signing up for an account at [https://optiic.dev/signup](https://optiic.dev/signup).

## Install Optiic
### Install via npm
Install with npm if you plan to use `optiic` in a Node project or in the browser.
```shell
npm install optiic
```
If you plan to use `optiic` in a browser environment, you will probably need to use [Webpack](https://www.npmjs.com/package/webpack), [Browserify](https://www.npmjs.com/package/browserify), or a similar service to compile it.

```js
const optiic = new (require('optiic'))({
  apiKey: 'api_test_key' // Not required, but having one removes limits (get your key at https://optiic.dev).
});
```

### Install via CDN
Install with CDN if you plan to use Optiic only in a browser environment.
```html
<script src="https://cdn.jsdelivr.net/npm/optiic@latest"></script>
<script type="text/javascript">
  let optiic = new Optiic({
    apiKey: 'api_test_Key' // Not required, but having one removes limits (get your key at https://optiic.dev).
  });
</script>
```

### Use without installation
You can use `optiic` in a variety of ways that require no installation, such as `curl` in terminal/shell. See the **Use without installation** section below.

## Example output
If you want to see how `optiic` works, you can try a sample image such as `https://via.placeholder.com/468x60?text=Sample+text` which will result in an output like this:
```js
{
  text: "Sample text",
  language: "en",
}
```

## Using Optiic
After you have followed the install step, you can start using `optiic` to analyze images and perform OCR from within your app!

### .process(options)
Submit and image to process and return the text in the image.
#### options
The options for `process(options)` are as follows.
* image `string`, `HTML Input Element`, `File`: The image to be processed. Can be a local path, remote URL, an HTML input, or a File object.
  * Acceptable Values: `any`
  * Default: `null`
* mode `string`: What type of optical recognition will be run, such as OCR.
  * Acceptable Values: `ocr`
  * Default: `ocr`

#### Remote URL Example
```js
let options = {
  image: 'https://via.placeholder.com/468x60?text=Sample+text', // url of the image
  mode: 'ocr', // ocr
};

optiic.process(options)
.then(result => {
  console.log(result);
})
```

#### Local path Example
```js
let options = {
  image: '/Users/username/Desktop/my-image.png', // local path to the image
  mode: 'ocr', // ocr
};

optiic.process(options)
.then(result => {
  console.log(result);
})
```

#### HTML Input Example
```html
<form class="" action="" method="post">
  <input type="file" name="image" accept="image/*">
  <button type="submit">Submit</button>
</form>

<script type="text/javascript">
  var myForm = document.querySelector('form');

  myForm.addEventListener('submit', function (event) {
    event.preventDefault();

    optiic.process({
      image: myForm.querySelector('input[type="file"]'),
    })
    .then(response => {
      console.log(response);
    })
  })
</script>
```

## Extending Capabilities
For a more in-depth documentation of this library and the Optiic service, please visit the official Optiic website.

## Use without installation
### Use Optiic with `curl`
```shell
# OCR with URL
curl -d '{"apiKey": "test_api_key", "mode": "ocr", "url": "https://via.placeholder.com/468x60?text=Sample+text"}' -H 'Content-Type: application/json' https://api.optiic.dev/process

# OCR with image file
curl \
  -F "apiKey=test_api_key" \
  -F "mode=ocr" \
  -F "image=@/Users/username/Desktop/my-image.png" \
  https://api.optiic.dev/process
```

## What Can Optiic do?
[Optiic is a free OCR api](https://optiic.dev) that helps you analyze images and perform OCR (optical character recognition)!

## Final Words
If you are still having difficulty, we would love for you to post
a question to [the Optiic issues page](https://github.com/optiic/optiic/issues). It is much easier to answer questions that include your code and relevant files! So if you can provide them, we'd be extremely grateful (and more likely to help you find the answer!)

## Projects Using this Library
[Somiibo](https://somiibo.com/): A Social Media Bot with an open-source module library. <br>
[JekyllUp](https://jekyllup.com/): A website devoted to sharing the best Jekyll themes. <br>
[Slapform](https://slapform.com/): A backend processor for your HTML forms on static sites. <br>
[SoundGrail Music App](https://app.soundgrail.com/): A resource for producers, musicians, and DJs. <br>
[Hammock Report](https://hammockreport.com/): An API for exploring and listing backyard products. <br>

Ask us to have your project listed! :)
