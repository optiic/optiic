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

  function Optiic(options) {
    options = options || {};
    options.environment = options.environment || environment;
    options.apiKey = options.apiKey || '';

    options.local = typeof options.local === 'undefined' ? false : options.local;

    this.options = options;
  };

  Optiic.prototype.process = function (options) {
    var This = this;
    var formData;
    if (!NodeFormData) {
      // NodeFormData = window.FormData;
      NodeFormData = require('form-data');
      // if (typeof window !== 'undefined' && typeof window.FormData !== 'undefined') {
      //   NodeFormData = window.FormData;
      // } else {
      //   NodeFormData = require('form-data');
      // }
    }
    if (!nodeFetch) {
      // nodeFetch = window.fetch;
      nodeFetch = require('node-fetch');
      // if (typeof window !== 'undefined' && typeof window.fetch !== 'undefined') {
      //   nodeFetch = window.fetch;
      // } else {
      //   nodeFetch = require('node-fetch');
      // }
    }
    fs = fs || require('fs');

    options = options || {};
    options.url = options.url || options.path || '';
    options.mode = options.mode || 'ocr';

    return new Promise(function(resolve, reject) {
      var config = {};

      // Checks
      if (!options.url) {
        return reject(new Error('Missing parameter url'))
      }

      config = {
        method: 'POST',
        path: 'process'
      }

      if (!isRemoteURL.test(options.url)) {
        let keys = Object.keys(options);
        formData = new NodeFormData();
        formData.append('image', fs.createReadStream(options.url));
        for (var i = 0, l = keys.length; i < l; i++) {
          if (keys[i] === 'url') {
            continue;
          }
          formData.append(keys[i], options[keys[i]]);
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
    var contentJSON = 'application/json';
    var serverAddy;

    if (This.options.local) {
      config.hostname = 'localhost';
      config.path = 'process';
      config.port = 5000;
    }

    return new Promise(function(resolve, reject) {
      var https = require('https');
      var method = (config.method || 'POST').toUpperCase();
      var isForm = body && typeof body.append === 'function';

      // config = {
      //   'method': method,
      //   'hostname': config.hostname || 'api.optiic.dev',
      //   'port': config.port || 443,
      //   'path': config.path,
      //   'headers': {
      //     // 'x-dreamfactory-api-key': 'YOUR_API_KEY',
      //     'cache-control': 'no-cache',
      //     'Content-Type': isForm ? body.getHeaders()['content-type'] : contentJSON,
      //     // 'Content-Length': Buffer.byteLength(body.toString()),
      //     'Accept': contentJSON,
      //   }
      // }
      console.log('isForm', isForm);
      console.log('request', config, body);
      // console.log('body.getHeaders()', isForm ? body.getHeaders() : '');

      if (This.options.local) {
        serverAddy = 'http://localhost:5000/process'
      } else {
        serverAddy = 'https://api.optiic.dev/process'
      }
      // Make request
      fetch(serverAddy, {
        method: 'post',
        // body: isForm ? body.toString() : stringify(body || {}),
        // body: isForm ? body : stringify(body || {}),
        body: body,
        // headers: isForm ? body.getHeaders() : contentJSON,
      })
      // .then(res => res.json())
      .then(function (res) {
        if (res.status >= 200 && res.status < 300) {
          res.json()
          .then(function (json) {
            return resolve(json);
          })
          .catch(function (e) {
            return reject(e);
          })
        } else {
          return reject(new Error(res.statusText));
        }
      })
      .catch(function (e) {
        console.error('BAD', e);
      })
      // var req = https.request(config, function(res) {
      //   var chunks = [];
      //
      //   res.on('data', function (chunk) {
      //     chunks.push(chunk);
      //   });
      //
      //   res.on('end', function() {
      //     var body = Buffer.concat(chunks);
      //     if (res.statusCode >= 200 && res.statusCode < 300) {
      //       return resolve(JSON.parse(body.toString()));
      //     } else {
      //       console.error('-----e 2', res);
      //       return reject(new Error(res.statusMessage));
      //     }
      //   });
      //
      //   res.on('error', function(e) {
      //     console.error('-----e 2', e);
      //     return reject(e);
      //   });
      //
      // });
      //
      // if (method === 'POST') {
      //   req.write(isForm ? body.toString() : stringify(body || {}));
      // }
      //
      // req.end();
    });
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
