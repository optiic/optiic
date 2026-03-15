/**
 * Optiic - Advanced OCR & Image Recognition API
 * https://optiic.dev
 */

import WonderfulFetch from 'wonderful-fetch';

const VERSION = '{version}';
const API_HOST = 'https://api.optiic.dev';
const IS_REMOTE_URL = /^https?:\/\/|^\/\//i;
const IS_NODE = typeof process !== 'undefined'
  && Object.prototype.toString.call(process) === '[object process]';

class Optiic {
  constructor(options = {}) {
    this.options = {
      apiKey: '',
      url: API_HOST,
      debug: false,
      ...options,
    };

    if (this.options.debug) {
      console.log('Optiic options', this.options);
    }
  }

  process(options = {}) {
    // Already a FormData instance — send directly
    if (options && typeof options.append === 'function') {
      return this._request('process', options);
    }

    // Normalize options
    options.url = options.url || options.path || options.image || '';
    options.mode = options.mode || 'ocr';
    delete options.path;
    delete options.image;

    // Validate
    if (!options.url) {
      return Promise.reject(new Error('Missing parameter url'));
    }

    if (typeof options.url !== 'string' && !isInputElement(options.url) && !isFileObject(options.url)) {
      return Promise.reject(new Error('Improperly formatted url or image input'));
    }

    // File upload (local path in Node, input element or File object in browser)
    const isLocalPath = typeof options.url === 'string' && !IS_REMOTE_URL.test(options.url);

    if (isLocalPath || isInputElement(options.url) || isFileObject(options.url)) {
      if (isLocalPath && !IS_NODE) {
        return Promise.reject(new Error('This environment does not have permission to use a local path as the url so use a file input instead'));
      }

      const FormDataImpl = IS_NODE ? require('form-data') : window.FormData;
      const formData = new FormDataImpl();

      if (isLocalPath) {
        const fs = require('fs');
        formData.append('image', fs.createReadStream(options.url));
      } else if (isInputElement(options.url)) {
        formData.append('image', IS_NODE ? require('fs').createReadStream(options.url.files[0].path) : options.url.files[0]);
      } else if (isFileObject(options.url)) {
        formData.append('image', IS_NODE ? require('fs').createReadStream(options.url.path) : options.url);
      }

      for (const [key, value] of Object.entries(options)) {
        if (key === 'url' || key === 'image' || typeof value === 'undefined') {
          continue;
        }
        formData.append(key, value);
      }

      return this._request('process', formData);
    }

    // Remote URL → send as JSON body
    return this._request('process', options);
  }

  async _request(path, body) {
    const isForm = body && typeof body.append === 'function';
    const url = `${this.options.url}/${path}`;

    // Add tracking metadata
    if (isForm) {
      body.append('_source', 'library');
      body.append('_version', VERSION);
      body.append('_referrer', getLocation());
    } else {
      body = {
        ...body,
        _source: 'library',
        _version: VERSION,
        _referrer: getLocation(),
      };
    }

    return WonderfulFetch(url, {
      method: 'post',
      body: body,
      response: 'json',
      authorization: this.options.apiKey ? `Bearer ${this.options.apiKey}` : undefined,
      cacheBreaker: false,
      log: this.options.debug,
    });
  }
}

function isInputElement(input) {
  return typeof input === 'object' && input.tagName === 'INPUT' && input.files && input.files[0];
}

function isFileObject(input) {
  return !isInputElement(input) && typeof input === 'object' && typeof input.name === 'string';
}

function getLocation() {
  try {
    return window.location.href;
  } catch (e) {
    return null;
  }
}

// Browser environment
if (typeof window !== 'undefined') {
  window.Optiic = Optiic;
}

export default Optiic;
export { Optiic };
