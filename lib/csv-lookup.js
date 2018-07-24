const _ = require('lodash');

/**
 * @callback csvLookupCallback
 * @param {Error} err - The Error instance, if any occurred, otherwise null.
 * @param {array} data - Array of matching rows in the CSV file.
 */

/**
 * @memberof SpringCM
 * @instance
 * @param {(string|SpringCMDocument)} path - The path, UID, or SpringCM document to lookup as CSV.
 * @param {object} filter - Filters to apply to the returned data.
 * @param {csvLookupCallback} callback - Called once the operation completes.
 */
function csvLookup(path, filter, callback) {
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

module.exports = csvLookup;
