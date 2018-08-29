const async = require('async');
const _ = require('lodash');
const matcher = require('matcher');
const SpringCMFolder = require('./springcm-folder');

module.exports = function (expr, options, callback) {
  if (typeof callback !== 'function') {
    callback = options;
    options = {
      includeDocuments: false
    };
  }

  var exprParts = expr.split('/');

  if (exprParts[0] === '') {
    exprParts = exprParts.slice(1);
  }

  if (exprParts[exprParts.length - 1] === '') {
    exprParts.pop();
  }

  async.waterfall([
    (callback) => {
      if (!options.parent) {
        this.getFolder('/', (err, f) => {
          if (err) {
            return callback(err);
          }

          options.parent = f;

          callback();
        });
      } else {
        return callback();
      }
    },
    (callback) => {
      this.getSubfolders(options.parent, (err, folders) => {
        if (err) {
          return callback(err);
        }

        var exactMatches = [];
        var matches = [];

        // Step through the path of each folder. If each level matches
        // at least one level in the wildcard expression, we can scan each
        // of its subfolders as well. If each level matches all levels of
        // the wildcard expression, it is an exact match, so we return it.
        folders.forEach((f) => {
          // Never look in trash
          if (f.getName() === 'Trash') {
            return;
          }

          var count = 0;

          for (var i = 0; i < exprParts.length; ++i) {
            // For cases where we're searching for any parent path, we need
            // to catch exact matches before partial matches.
            if (exprParts[i] === '**' && i < exprParts.length - 1 && exprParts[i + 1] === f.getName()) {
              exactMatches.push(f);
              return;
            }

            // If the folder name exactly matches the expression part, but
            // it isn't a wild card, add it as a partial match and stop
            // since we don't want to return e.g. lib if lib/* is requested.
            // Exception is if we're comparing the very last part, or the
            // part is **, as we allow that to match any path.
            if (exprParts[i] === f.getName() && i < exprParts.length - 1 || exprParts[i] === '**') {
              matches.push(f);
              return;
            }

            var m = matcher.isMatch(f.getName(), exprParts[i], {
              caseSensitive: false
            });

            if (m) {
              count += 1;
            } else {
              break;
            }
          }

          if (count === exprParts.length) {
            exactMatches.push(f);
          }

          if (count > 0) {
            matches.push(f);
          }
        });

        if (matches.length === 0) {
          return callback(null, {
            folders: exactMatches,
            documents: []
          });
        }

        async.mapSeries(matches, (match, callback) => {
          // Build subexpression. If any path is queried (**), don't slice
          // it.
          var subExpr;

          // Pass any path expr down
          if (exprParts[0] === '**') {
            subExpr = exprParts.join('/');
          } else {
            subExpr = exprParts.slice(1).join('/');
          }

          this.glob(subExpr, {
            parent: match,
            includeDocuments: options.includeDocuments
          }, callback);
        }, (err, results) => {
          if (err) {
            return callback(err);
          }

          callback(null, {
            folders: _.flatten(results.map(r => r.folders)).concat(exactMatches),
            documents: _.flatten(results.map(r => r.documents))
          });
        });
      });
    },
    (results, callback) => {
      // Don't look for documents except at least possible folder level
      if (!options.includeDocuments || exprParts.length > 2) {
        return callback(null, results);
      }

      this.getDocuments(options.parent, (err, documents) => {
        if (err) {
          return callback(err);
        }

        var filtered = documents.filter((d) => {
          return matcher.isMatch(d.getPath(), expr, {
            caseSensitive: false
          });
        });

        if (filtered.length > 0) {
          results.documents = results.documents.concat(filtered);
        }

        callback(null, results);
      });
    }
  ], callback);
};
