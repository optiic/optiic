
<p align="center">
  <a href="https://optiic.dev">
    <img src="https://cdn.itwcreativeworks.com/assets/optiic/images/logo/optiic-brandmark-black-x.svg" width="100px">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/optiic/optiic.svg">
  <img src="https://img.shields.io/bundlephobia/min/optiic.svg">
  <img src="https://img.shields.io/npm/dm/optiic.svg">
  <img src="https://img.shields.io/node/v/optiic.svg">
  <img src="https://img.shields.io/github/license/optiic/optiic.svg">
  <br>
  <br>
  <a href="https://optiic.dev">Site</a> | <a href="https://www.npmjs.com/package/optiic">NPM Module</a> | <a href="https://github.com/optiic/optiic">GitHub Repo</a>
  <br>
  <br>
  <strong>Optiic</strong> is a free image recognition & optical character recognition (OCR) API. Extract text from any image or PDF.
</p>

# Free OCR & image recognition API

## Quick Start

### 1. Get an API Key

Sign up at [optiic.dev/signup](https://optiic.dev/signup) to get your API key. A free tier is available.

### 2. Add to Your Project

**NPM** (Node.js, React, Vue, Next.js, etc.):

```
npm install optiic
```

```js
import Optiic from 'optiic';

const optiic = new Optiic({ apiKey: 'YOUR_API_KEY' });

const result = await optiic.process({
  url: 'https://optiic.dev/assets/images/samples/we-love-optiic.png',
});

console.log(result.text); // "We love Optiic!"
```

**Script tag** (no build tools needed):

```html
<script src="https://cdn.jsdelivr.net/npm/optiic@latest/dist/optiic.min.js"></script>
<script>
  const optiic = new Optiic({ apiKey: 'YOUR_API_KEY' });

  optiic.process({
    url: 'https://optiic.dev/assets/images/samples/we-love-optiic.png',
  }).then(result => {
    console.log(result.text);
  });
</script>
```

## Features

* Extract text from images and PDFs via OCR
* Submit images as remote URLs, local file paths (Node.js), file inputs, or File objects (browser)
* Works in both Node.js and browser environments
* Supports `.png`, `.jpeg`, `.pdf`, and more

## API

### `new Optiic(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | `string` | `''` | Your API key from [optiic.dev](https://optiic.dev) |
| `url` | `string` | `'https://api.optiic.dev'` | API base URL (override for self-hosting or local dev) |
| `debug` | `boolean` | `false` | Enable debug logging |

### `optiic.process(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string`, `HTMLInputElement`, `File` | *required* | Image source: remote URL, local path, file input, or File object |
| `mode` | `string` | `'ocr'` | Recognition mode |
| `language` | `string` | `'en'` | Language hint for OCR |

You can also pass a pre-built `FormData` instance directly to `process()`.

Returns a `Promise` that resolves with:

```js
{
  text: "We love Optiic!",
  language: "en",
}
```

## Usage Examples

### Remote URL

```js
const result = await optiic.process({
  url: 'https://optiic.dev/assets/images/samples/we-love-optiic.png',
});
```

### Local file path (Node.js only)

```js
const result = await optiic.process({
  url: '/Users/username/Desktop/my-image.png',
});
```

### HTML file input (browser)

```html
<input type="file" id="image-input" accept="image/*">

<script>
  document.querySelector('#image-input').addEventListener('change', async (e) => {
    const result = await optiic.process({
      url: e.target,
    });
    console.log(result.text);
  });
</script>
```

### curl

```bash
# OCR with remote URL
curl -X POST https://api.optiic.dev/process \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://optiic.dev/assets/images/samples/we-love-optiic.png"}'

# OCR with local file
curl -X POST https://api.optiic.dev/process \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -F "image=@/path/to/image.png"
```

## Development

```bash
npm start        # Watch mode - rebuilds on file changes
npm run build    # One-time build (ESM, CJS, IIFE)
npm test         # Run tests
```

### Build Outputs

| File | Format | Use Case |
|------|--------|----------|
| `dist/index.mjs` | ESM | `import` in modern bundlers (webpack, Vite, etc.) |
| `dist/index.js` | CJS | `require()` in Node.js |
| `dist/optiic.min.js` | IIFE (minified) | `<script>` tag / CDN |

## License

MIT
