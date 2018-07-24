const path = require('path');
const _ = require('lodash');
const SpringCMFolder = require('./springcm-folder');

/**
 * @callback createFolderCallback
 * @param {Error} err - The Error instance, if any occurred, otherwise null.
 * @param {SpringCMFolder} folder - The newly created folder.
 */

/**
 * Create a new folder or hierarchy of folders in SpringCM.
 * @memberof SpringCM
 * @instance
 * @param {string} folderPath - Path for the new folder(s).
 * @param {object=} [options={ exclusive: true }] - Options for folder creation.
 * @param {boolean} options.exclusive - If true, the target folder will only be created if it doesn't already exist.
 * @param {createFolderCallback} callback - Called once the operation completes.
 */
function createFolder(folderPath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {
      exclusive: true
    };
  }

  if (typeof folderPath !== 'string' || !path.isAbsolute(folderPath) || folderPath[0] !== '/') {
    return setImmediate(() => {
      callback(new Error('Invalid folder path'));
    });
  }

  if (folderPath === '/') {
    this.getRootFolder(callback);
  } else {
    this.createFolder(path.dirname(folderPath), {
      exclusive: false
    }, (err, parent) => {
      if (err) {
        return callback(err);
      }

      this.getFolder(folderPath, (err, folder) => {
        if (err && err.message.indexOf('404') < 0) {
          return callback(err);
        }

        // Non-exclusive only matters if the folder actually exists
        if (folder && !options.exclusive) {
          return callback(null, folder);
        }

        this.enqueueRequest({
          method: 'POST',
          baseUrl: this.getBaseUrl(),
          uri: '/folders',
          headers: {
            'Authorization': `bearer ${this.authToken}`,
            'Content-Type': 'application/json'
          },
          json: {
            'Name': path.basename(folderPath),
            'ParentFolder': {
              'Href': parent.getIdentityUrl()
            }
          }
        }, 1, (err, folder) => {
          if (err) {
            return callback(err);
          }

          callback(null, new SpringCMFolder(_.merge(folder, {
            'Path': folderPath
          })));
        });
      });
    });
  }
};

module.exports = createFolder;
