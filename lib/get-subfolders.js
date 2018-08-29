const path = require('path');
const async = require('async');
const _ = require('lodash');
const SpringCMFolder = require('./springcm-folder');

module.exports = function (folder, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  // If paging options not provided, get all documents
  if (options.offset && options.limit) {
    this.enqueueRequest({
      method: 'GET',
      baseUrl: folder.getSubfoldersUrl(),
      uri: '/',
      headers: {
        'Authorization': `bearer ${this.authToken}`,
        'Accept': 'application/json'
      },
      qs: {
        'offset': options.offset,
        'limit': options.limit
      }
    }, 1, (err, folders) => {
      if (err) {
        return callback(err);
      }

      callback(null, _.map(_.get(folders, 'Items'), (subfolder) => {
        // subfolders request doesn't return path, so create it
        var p = folder.getPath();

        if (p === '/') {
          p = '';
        }

        subfolder.Path = _.defaultTo(subfolder.Path, `${p}/${subfolder.Name}`);

        return new SpringCMFolder(subfolder);
      }));
    });
  } else {
    const limit = options.limit || 1000;

    this.enqueueRequest({
      method: 'GET',
      baseUrl: folder.getSubfoldersUrl(),
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

      var folders = _.map(_.get(data, 'Items'), (subfolder) => {
        // subfolders request doesn't return path, so create it
        var p = folder.getPath();

        if (p === '/') {
          p = '';
        }

        subfolder.Path = _.defaultTo(subfolder.Path, `${p}/${subfolder.Name}`);

        return new SpringCMFolder(subfolder);
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
        this.getSubfolders(folder, range, callback);
      }, (err, results) => {
        if (err) {
          return callback(err);
        }

        callback(null, folders.concat(_.flatten(results)));
      });
    });
  }
};
