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

  var environment = (Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]') ? 'node' : 'browser';

  function Optiic(options) {
    options = options || {};
    options.environment = options.environment || environment;
    options.apiKey = options.apiKey || '';

    options.local = typeof options.local === 'undefined' ? false : options.local;

    this.options = options;
  };

  Optiic.prototype.process = function (options) {
    let This = this;
    options = options || {};
    options.url = options.url || '';
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
    let This = this;
    var content = 'application/json';

    if (This.options.local) {
      config.hostname = 'localhost';
      config.path = 'process';
      // config.port = 5000;
    }

    return new Promise(function(resolve, reject) {
      var https = require('https');
      var method = (config.method || 'POST').toUpperCase();

      config = {
        'method': method,
        'hostname': config.hostname || 'api.optiic.dev',
        'port': config.port || 443,
        'path': config.path,
        'headers': {
          // 'x-dreamfactory-api-key': 'YOUR_API_KEY',
          'cache-control': 'no-cache',
          'Content-Type': content,
          'Accept': content,
        }
      }

      console.log('config', config);

      // Make request
      var req = https.request(config, function(res) {
        var chunks = [];

        res.on('data', function (chunk) {
          chunks.push(chunk);
        });

        res.on('end', function() {
          var body = Buffer.concat(chunks);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            return resolve(JSON.parse(body.toString()));
          } else {
            return reject(new Error(res.statusMessage));
          }
        });

        res.on('error', function(e) {
          console.log('-----e', e);
          return reject(e);
        });

      });

      if (method === 'POST') {
        req.write(stringify(body || {}));
      }

      req.end();
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
