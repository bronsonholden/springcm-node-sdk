const async = require('async');

module.exports = function (doc, folder, callback) {
  async.parallel([
    (callback) => {
      if (typeof folder !== 'object') {
        this.getFolder(folder, (err, f) => {
          if (err) {
            return callback(err);
          }

          folder = f;
          callback();
        });
      } else {
        callback();
      }
    },
    (callback) => {
      if (typeof doc !== 'object') {
        this.getDocument(doc, (err, d) => {
          if (err) {
            return callback(err);
          }

          doc = d;
          callback();
        });
      } else {
        callback();
      }
    }
  ], (err) => {
    if (err) {
      return callback(err);
    }

    this.enqueueRequest({
      method: 'PUT',
      baseUrl: doc.getIdentityUrl(),
      uri: '/',
      headers: {
        'Authorization': `bearer ${this.authToken}`
      },
      body: {
        'ParentFolder': folder.obj
      },
      json: true
    }, 1, callback);
  });
};
