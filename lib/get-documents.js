const async = require('async');
const _ = require('lodash');
const SpringCMDocument = require('./springcm-document');

module.exports = function (folder, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  async.waterfall([
    (callback) => {
      if (typeof folder !== 'object') {
        this.getFolder(folder, (err, f) => {
          if (err) {
            callback(err);
          }

          callback(null, f);
        });
      } else {
        callback(null, folder);
      }
    },
    (folder, callback) => {
      // If paging options not provided, get all documents
      if (options.offset && options.limit) {
        this.enqueueRequest({
          method: 'GET',
          baseUrl: folder.getDocumentsUrl(),
          uri: '/',
          headers: {
            'Authorization': `bearer ${this.authToken}`,
            'Accept': 'application/json'
          },
          qs: {
            'offset': options.offset,
            'limit': options.limit
          }
        }, 1, (err, documents) => {
          if (err) {
            return callback(err);
          }

          callback(null, _.map(_.get(documents, 'Items'), (doc) => {
            // documents request doesn't return path, so create it
            var p = folder.getPath();

            if (p === '/') {
              p = '';
            }

            doc.Path = _.defaultTo(doc.Path, `${p}/${doc.Name}`);

            return new SpringCMDocument(doc);
          }));
        });
      } else {
        const limit = options.limit || 1000;

        this.enqueueRequest({
          method: 'GET',
          baseUrl: folder.getDocumentsUrl(),
          uri: '/',
          headers: {
            'Authorization': `bearer ${this.authToken}`,
            'Accept': 'application/json'
          },
          qs: {
            'offset': 0,
            'limit': limit
          }
        }, 1, (err, data) => {
          if (err) {
            return callback(err);
          }

          var documents = _.map(_.get(data, 'Items'), (doc) => {
            // documents request doesn't return path, so create it
            var p = folder.getPath();

            if (p === '/') {
              p = '';
            }

            doc.Path = _.defaultTo(doc.Path, `${p}/${doc.Name}`);

            return new SpringCMDocument(doc);
          });

          var ranges = [];

          // Add ranges to query if there are more than 1000 items
          for (var off = _.get(data, 'Items').length; off < _.get(data, 'Total'); off += limit) {
            ranges.push({
              offset: off,
              limit: limit
            });
          }

          async.mapSeries(ranges, (range, callback) => {
            this.getDocuments(folder, range, callback);
          }, (err, results) => {
            if (err) {
              return callback(err);
            }

            callback(null, documents.concat(_.flatten(results)));
          });
        });
      }
    }
  ], callback);
};
