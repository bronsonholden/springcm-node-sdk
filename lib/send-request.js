const request = require('request');
const _ = require('lodash');

module.exports = function (req, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var readStream = _.get(options, 'readStream');
  var writeStream = _.get(options, 'writeStream');
  var requestHandler = _.get(options, 'requestHandler');

  var r = request(req, (err, res, body) => {
    var contentType = _.get(res, [ 'headers', 'content-type' ]);

    if (contentType && contentType.indexOf('application/json') > -1 && typeof body === 'string') {
      body = JSON.parse(body);
    }

    if (err) {
      return callback(err);
    }

    // Check for auth errors
    if (_.has(body, 'error') && _.has(body, 'errorDescription')) {
      return callback(new Error(_.get(body, 'errorDescription')));
    }

    if (_.get(body, 'Error.ErrorCode') === 101) {
      var validationErrors = _.map(_.get(body, 'ValidationErrors'), (err) => {
        return `${_.get(err, 'ErrorCode')} ${_.get(err, 'DeveloperMessage')}`;
      });

      return callback(new Error(validationErrors.join('\n')));
    }

    // API errors
    if (_.has(body, 'Error')) {
      var code = _.get(body, 'Error.HttpStatusCode');
      var desc = _.get(body, 'Error.DeveloperMessage');
      var msg = _.get(body, 'Error.ErrorCode');

      return callback(new Error(`${code} ${desc} (error ${msg})`));
    }

    return callback(null, res, body);
  });

  if (writeStream) {
    r.pipe(writeStream);
  }

  if (readStream) {
    readStream.pipe(r);
  }

  if (requestHandler) {
    requestHandler(r);
  }
};
