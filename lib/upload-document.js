const moment = require('moment');
const _ = require('lodash');

module.exports = function (folder, stream, options, callback) {
  this.enqueueRequest({
    method: 'POST',
    baseUrl: folder.getUploadUrl(),
    headers: {
      'Authorizaton': `bearer ${this.authToken}`,
      'Content-Type': 'application/pdf'
    },
    qs: {
      name: _.defaultTo(_.get(options, 'name'), moment().format('YYYY-MM-DD HH.mm.ss ZZ'))
    },
    body: stream
  }, 1, callback);
};
