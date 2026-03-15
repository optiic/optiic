const assert = require('assert');
const path = require('path');
const fs = require('fs');

// Load API key from backend .env
const envPath = path.resolve(__dirname, '../../optiic-backend/functions/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const API_KEY = envContent.match(/BACKEND_MANAGER_KEY="(.+?)"/)[1];

const TEST_IMAGE_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/800px-Tsunami_by_hokusai_19th_century.jpg';
const TEST_FIXTURE = path.resolve(__dirname, 'fixtures/test-image.png');

// Create test fixture
before(() => {
  const fixturesDir = path.resolve(__dirname, 'fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }
  if (!fs.existsSync(TEST_FIXTURE)) {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BAwAI/AL+hc2rNAAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(TEST_FIXTURE, png);
  }
});

describe('Optiic', () => {
  const Optiic = require('../dist/index.js').default;

  describe('initialization', () => {
    it('should create an instance with default options', () => {
      const optiic = new Optiic();
      assert.strictEqual(optiic.options.apiKey, '');
      assert.strictEqual(optiic.options.debug, false);
    });

    it('should accept custom options', () => {
      const optiic = new Optiic({ apiKey: 'my_key_123' });
      assert.strictEqual(optiic.options.apiKey, 'my_key_123');
    });

    it('should not mutate the passed options object', () => {
      const opts = { apiKey: 'abc' };
      const optiic = new Optiic(opts);
      assert.strictEqual(opts.debug, undefined);
    });
  });

  describe('.process()', () => {
    const optiic = new Optiic({ apiKey: API_KEY });

    describe('validation', () => {
      it('should reject when no url is provided', async () => {
        await assert.rejects(
          () => optiic.process({}),
          { message: 'Missing parameter url' },
        );
      });

      it('should reject when url is empty string', async () => {
        await assert.rejects(
          () => optiic.process({ url: '' }),
          { message: 'Missing parameter url' },
        );
      });

      it('should reject when url is an invalid type', async () => {
        await assert.rejects(
          () => optiic.process({ url: 12345 }),
          { message: 'Improperly formatted url or image input' },
        );
      });

      it('should reject when url is a boolean', async () => {
        await assert.rejects(
          () => optiic.process({ url: true }),
          { message: 'Improperly formatted url or image input' },
        );
      });
    });

    describe('remote URL (live)', () => {
      it('should process an image via remote URL', () => {
        return optiic.process({ url: TEST_IMAGE_URL })
          .then((json) => {
            console.log('Response:', json);
            assert.strictEqual(typeof json, 'object');
            assert.strictEqual(typeof json.text, 'string');
          });
      });

      it('should process with describe mode', () => {
        return optiic.process({ url: TEST_IMAGE_URL, mode: 'describe' })
          .then((json) => {
            console.log('Response:', json);
            assert.strictEqual(typeof json, 'object');
            assert.strictEqual(typeof json.text, 'string');
          });
      });

      it('should accept path as alias for url', () => {
        return optiic.process({ path: TEST_IMAGE_URL })
          .then((json) => {
            console.log('Response:', json);
            assert.strictEqual(typeof json, 'object');
            assert.strictEqual(typeof json.text, 'string');
          });
      });

      it('should accept image as alias for url', () => {
        return optiic.process({ image: TEST_IMAGE_URL })
          .then((json) => {
            console.log('Response:', json);
            assert.strictEqual(typeof json, 'object');
            assert.strictEqual(typeof json.text, 'string');
          });
      });

      it('should pass additional options like language', () => {
        return optiic.process({ url: TEST_IMAGE_URL, language: 'en' })
          .then((json) => {
            console.log('Response:', json);
            assert.strictEqual(typeof json, 'object');
            assert.strictEqual(typeof json.text, 'string');
            assert.strictEqual(json.language, 'en');
          });
      });
    });

    describe('local file upload (live)', () => {
      it('should process a local file path', () => {
        return optiic.process({ url: TEST_FIXTURE })
          .then((json) => {
            console.log('Response:', json);
            assert.strictEqual(typeof json, 'object');
          });
      });
    });

    describe('FormData passthrough (live)', () => {
      it('should accept a pre-built FormData instance', () => {
        const FormData = require('form-data');

        const formData = new FormData();
        formData.append('image', fs.createReadStream(TEST_FIXTURE));
        formData.append('mode', 'ocr');

        return optiic.process(formData)
          .then((json) => {
            console.log('Response:', json);
            assert.strictEqual(typeof json, 'object');
          });
      });
    });
  });
});
