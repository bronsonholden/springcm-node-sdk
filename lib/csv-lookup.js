const _ = require('lodash');

module.exports = function (path, filter, callback) {
  if (path !== null) {
    switch (typeof path) {
    case 'string':
      this.getDocument(path, (err, doc) => {
        if (err) {
          return callback(err);
        }

        this.csvLookup(doc, filter, callback);
      });
      return;
    case 'object':
      var uid = path.getUid();
      var filterString = _.join(_.map(filter, (value, column) => {
        return `${column}=${value}`;
      }));

      this.enqueueRequest({
        method: 'GET',
        baseUrl: this.getBaseUrl(),
        uri: `/customdata/${uid}`,
        headers: {
          'Authorization': `bearer ${this.authToken}`
        },
        qs: {
          'filter': filterString
        }
      }, 1, callback);
      return;
    default:
      break;
    }
  }

  setImmediate(() => {
    callback(new Error('Invalid document requested'));
  });
};
