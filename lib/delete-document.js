const isUuid = require('./is-uuid');

module.exports = function (path, callback) {
  switch (typeof path) {
  case 'string':
    if (isUuid(path)) {
      this.enqueueRequest({
        method: 'DELETE',
        baseUrl: this.getBaseUrl(),
        uri: `/documents/${path}`,
        headers: {
          'Authorization': `bearer ${this.authToken}`
        }
      }, 1, callback);
    } else {
      this.getDocument(path, (err, doc) => {
        if (err) {
          return callback(err);
        }

        this.deleteDocument(doc.getUid(), callback);
      });
    }
    break;
  case 'object':
    var uid = path.getUid();

    this.enqueueRequest({
      method: 'DELETE',
      baseUrl: this.getBaseUrl(),
      uri: `/documents/${uid}`,
      headers: {
        'Authorization': `bearer ${this.authToken}`
      }
    }, 1, callback);
    break;
  default:
    setImmediate(() => {
      callback(new Error('Invalid document requested'));
    });
    break;
  }
};
