const isUuid = require('./is-uuid');
const SpringCMFolder = require('./springcm-folder');

module.exports = function (path, callback) {
  var makeFolder = (err, obj) => {
    if (err) {
      return callback(err);
    }

    callback(null, new SpringCMFolder(obj));
  };

  if (path !== null) {
    switch (typeof path) {
    case 'string':
      if (path === '/') {
        return this.getRootFolder(callback);
      } else if (isUuid(path)) {
        this.enqueueRequest({
          method: 'GET',
          baseUrl: this.getBaseUrl(),
          uri: `/folders/${path}`,
          headers: {
            'Authorization': `bearer ${this.authToken}`
          },
          qs: {
            'expand': 'path,parentfolder,attributegroups'
          }
        }, 1, makeFolder);
      } else {
        this.enqueueRequest({
          method: 'GET',
          baseUrl: this.getBaseUrl(),
          uri: '/folders',
          headers: {
            'Authorization': `bearer ${this.authToken}`
          },
          qs: {
            'path': path,
            'expand': 'path,parentfolder,attributegroups'
          }
        }, 1, makeFolder);
      }
      return;
    case 'object':
      if (path.getPath() === '/') {
        return this.getRootFolder(callback);
      } else {
        this.enqueueRequest({
          method: 'GET',
          baseUrl: this.getBaseUrl(),
          uri: `/folders`,
          headers: {
            'Authorization': `bearer ${this.authToken}`
          },
          qs: {
            'path': path.getPath(),
            'expand': 'path,parentfolder,attributegroups'
          }
        }, 1, makeFolder);
      }
      return;
    default:
      break;
    }
  }

  setImmediate(() => {
    callback(new Error('Invalid folder requested'));
  });
};
