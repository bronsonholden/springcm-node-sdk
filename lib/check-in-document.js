const isUuid = require('./is-uuid');
const _ = require('lodash');
const moment = require('moment');
const SpringCMDocument = require('./springcm-document');

module.exports = function (path, stream, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var makeDocument = (err, obj) => {
    if (err) {
      return callback(err);
    }

    callback(null, new SpringCMDocument(obj));
  };

  if (path !== null) {
    var ext = _.defaultTo(_.get(options, 'fileType'), 'pdf');
    var name = _.defaultTo(_.get(options, 'name'), `${moment().format('YYYY-MM-DD HH.mm.ss ZZ')}.${ext}`);
    var contentType;

    switch (_.get(options, 'fileType')) {
    case 'pdf':
      contentType = 'application/pdf';
      break;
    case 'csv':
      contentType = 'text/csv';
      break;
    case 'txt':
      contentType = 'text/plain';
      break;
    default:
      contentType = 'application/octet-stream';
      break;
    }

    switch (typeof path) {
    case 'string':
      if (isUuid(path)) {
        this.enqueueRequest({
          method: 'POST',
          baseUrl: this.getUploadUrl(),
          uri: `/documents/${path}`,
          headers: {
            'Authorization': `bearer ${this.authToken}`,
            'Content-Type': 'multipart/form-data',
            'Content-Disposition': `attachment; filename="${name}"`
          },
          qs: {
            name: name
          },
          body: stream
        }, 1, makeDocument);
      } else {
        this.getDocument(path, (err, doc) => {
          if (err) {
            return callback(err);
          }

          this.checkInDocument(doc, stream, callback);
        })
      }
      return;
    case 'object':
      var uid = path.getUid();

      this.enqueueRequest({
        method: 'POST',
        baseUrl: this.getUploadUrl(),
        uri: `/documents/${uid}`,
        headers: {
          'Authorization': `bearer ${this.authToken}`,
          'Content-Type': 'multipart/form-data',
          'Content-Disposition': `attachment; filename="${name}"`
        },
        body: stream
      }, 1, makeDocument);
      return;
    default:
      break;
    }
  }

  setImmediate(() => {
    callback(new Error('Invalid document requested'));
  });
};
