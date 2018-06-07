const async = require('async');

module.exports = function (doc, stream, callback) {
  async.waterfall([
    (callback) => {
      this.getDocument(doc, callback);
    },
    (d, callback) => {
      this.enqueueRequest({
        method: 'GET',
        baseUrl: this.getDownloadUrl(),
        uri: `/documents/${d.getUid()}`,
        headers: {
          'Authorization': `bearer ${this.authToken}`
        }
      }, 1, {
        writeStream: stream
      }, callback);
    }
  ], callback);
};
