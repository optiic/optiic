(function (root, factory) {
  // https://github.com/umdjs/umd/blob/master/templates/returnExports.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  var fs;
  var NodeFormData;
  var nodeFetch;

  var environment = (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') ? 'node' : 'browser';
  var isRemoteURL = /^https?:\/\/|^\/\//i;
  var CONTENT_JSON = 'application/json';
  var SOURCE = 'library';
  var VERSION = '1.0.1';

  function Optiic(options) {
    options = options || {};
    options.environment = options.environment || environment;
    options.apiKey = options.apiKey || '';

    options.local = typeof options.local === 'undefined' ? false : options.local;

    if (options.local) {
      console.log('Optiic options', options);
    }

    this.options = options;

  };

  function _checkLocalPathString(input) {
    return typeof input === 'string' && !isRemoteURL.test(input);
  }

  function _checkInputElement(input) {
    return typeof input === 'object' && input.tagName === 'INPUT' && input.files && input.files[0];
  }

  function _isFileObject(input) {
    return !_checkInputElement(input) && typeof input === 'object' && typeof input.name === 'string';
  }

  function _isFormData(input) {
    return input && typeof input.append === 'function';
  }

  Optiic.prototype.process = function (options) {
    var This = this;
    var formData;
    var isFormData = _isFormData(options);
    var config = {
      method: 'POST',
      path: 'process'
    }

    if (!NodeFormData) {
      NodeFormData = This.options.environment === 'browser' ? window.FormData : require('form-data');
    }
    if (!nodeFetch) {
      nodeFetch = This.options.environment === 'browser' ? window.fetch : require('wonderful-fetch');
    }

    if (!This.options.apiKey || This.options.apiKey.includes('test') || This.options.apiKey.includes('your_api')) {
      console.warn('You are not using an Optiic API Key. Please get one at https://optiic.dev/signup');
    }

    return new Promise(function(resolve, reject) {
      var isLocalPathString = _checkLocalPathString(options.url);
      var isInputElement = _checkInputElement(options.url);
      var isFileObject = _isFileObject(options.url);


      if (isFormData) {
        return This._request(config, options)
        .then(function (r) {
          return resolve(r);
        })
        .catch(function (e) {
          return reject(e);
        });
      }

      options = options || {};
      options.url = options.url || options.path || options.image || '';
      options.mode = options.mode || 'ocr';
      delete options.path;
      delete options.image;

      // Checks
      if (!options.url) {
        return reject(new Error('Missing parameter url'))
      } else if (typeof options.url !== 'string' && !isInputElement && !isFileObject) {
        return reject(new Error('Improperly formatted url or image input'))
      } else if (isLocalPathString && This.options.environment !== 'node') {
        return reject(new Error('This environment does not have permission to use a local path as the url so use a file input instead'))
      }

      if (isLocalPathString || isInputElement || isFileObject) {
        var keys = Object.keys(options);
        formData = new NodeFormData();
        if (This.options.environment === 'node') {
          fs = fs || require('fs');
        }
        if (isLocalPathString) {
          formData.append('image', fs.createReadStream(options.url));
        } else if (isInputElement) {
          formData.append('image', This.options.environment === 'node' ? fs.createReadStream(options.url.files[0].path) : options.url.files[0]);
        } else if (isFileObject) {
          formData.append('image', This.options.environment === 'node' ? fs.createReadStream(options.url.path) : options.url);
        }
        for (var i = 0, l = keys.length; i < l; i++) {
          var key = keys[i];
          if (key === 'url' || key === 'image' || typeof options[key] === 'undefined') {
            continue;
          }
          formData.append(key, options[key]);
        }
        options = formData;
      }

      return This._request(config, options)
      .then(function (r) {
        return resolve(r);
      })
      .catch(function (e) {
        return reject(e);
      });

    });
  };

  Optiic.prototype._request = function (config, body) {
    var This = this;
    var method = (config.method || 'post').toLowerCase();
    var isForm = body && typeof body.append === 'function';
    var serverAddy;
    var headers = {
      'cache-control': 'no-cache',
      'Accept': CONTENT_JSON,
    }

    if (isForm) {
      body.append('apiKey', This.options.apiKey);
      body.append('_source', SOURCE);
      body.append('_version', VERSION);
      body.append('_referrer', getLocation());
    } else {
      headers['Content-Type'] = CONTENT_JSON;
      body.apiKey = This.options.apiKey;
      body._source = SOURCE;
      body._version = VERSION;
      body._referrer = getLocation();
      body = stringify(body);
    }

    return new Promise(function(resolve, reject) {

      if (This.options.local) {
        serverAddy = 'http://localhost:3000/' + config.path;
      } else {
        serverAddy = 'https://api.optiic.dev/' + config.path;
      }

      // Make request
      nodeFetch(serverAddy, {
        method: method,
        body: body,
        headers: headers,
      })
      .then(function (res) {
        if (This.options.local) {
          console.log('Fetch response:', res);
        }
        if (res.status >= 200 && res.status < 300) {
          res.json()
          .then(function (json) {
            return resolve(json);
          })
          .catch(function (e) {
            return reject(e);
          })
        } else {
          res.text()
          .then(function (text) {
            return reject(new Error(text || res.statusText));
          })
          .catch(function (e) {
            return reject(e);
          })
        }
      })
      .catch(function (e) {
        return reject(e);
      })
    });
  }

  function getLocation() {
    try {
      return window.location.href;
    } catch (e) {
      return null;
    }
  }

  function stringify(data) {
    try {
      data = JSON.stringify(data);
    } catch (e) {
    }
    return data;
  }

  // Reference
  if (environment === 'browser') {
    try {
      window.Optiic = Optiic;
    } catch (e) {
    }
  }

  return Optiic;

}));
