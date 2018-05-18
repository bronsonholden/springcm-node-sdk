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
          uri: `/folder/${path}`,
          headers: {
            'Authorization': `bearer ${this.authToken}`
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
            'path': path
          }
        }, 1, makeFolder);
      }
      return;
    case 'object':
      var uid = path.getUid();

      this.enqueueRequest({
        method: 'GET',
        baseUrl: this.getBaseUrl(),
        uri: `/folders/${uid}`,
        headers: {
          'Authorization': `bearer ${this.authToken}`
        }
      }, 1, makeFolder);
      return;
    default:
      break;
    }
  }

  setImmediate(() => {
    callback(new Error('Invalid folder requested'));
  });
};
