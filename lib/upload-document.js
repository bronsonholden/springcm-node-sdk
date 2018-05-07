const moment = require('moment');
const _ = require('lodash');

module.exports = function (folder, stream, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var ext = _.defaultTo(_.get(options, 'fileType'), 'pdf');
  var name =  _.defaultTo(_.get(options, 'name'), `${moment().format('YYYY-MM-DD HH.mm.ss ZZ')}.${ext}`);
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
    contentType = 'application/octet-stream'
    break;
  }

  this.enqueueRequest({
    method: 'POST',
    baseUrl: folder.getUploadUrl(),
    uri: '/',
    headers: {
      'Authorization': `bearer ${this.authToken}`,
      'Content-Type': contentType
    },
    qs: {
      name: name
    },
    body: stream
  }, 1, callback);
};
