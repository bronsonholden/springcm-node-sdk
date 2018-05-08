const isUuid = require('./is-uuid');
const SpringCMDocument = require('./springcm-document');

module.exports = function (path, callback) {
  var makeDocument = (err, obj) => {
    if (err) {
      return callback(err);
    }

    callback(null, new SpringCMDocument(obj));
  };

  switch (typeof path) {
  case 'string':
    if (isUuid(path)) {
      this.enqueueRequest({
        method: 'GET',
        baseUrl: this.getBaseUrl(),
        uri: `/documents/${path}`,
        headers: {
          'Authorization': `bearer ${this.authToken}`
        },
        qs: {
          'expand': 'parentfolder,path,lock,attributegroups'
        }
      }, 1, makeDocument);
    } else {
      this.enqueueRequest({
        method: 'GET',
        baseUrl: this.getBaseUrl(),
        uri: '/documents',
        headers: {
          'Authorization': `bearer ${this.authToken}`
        },
        qs: {
          'path': path,
          'expand': 'parentfolder,path,lock,attributegroups'
        }
      }, 1, makeDocument);
    }
    break;
  case 'object':
    var uid = path.getUid();

    this.enqueueRequest({
      method: 'GET',
      baseUrl: this.getBaseUrl(),
      uri: `/documents/${uid}`,
      headers: {
        'Authorization': `bearer ${this.authToken}`
      }
    }, 1, makeDocument);
    break;
  default:
    setImmediate(() => {
      callback(new Error('Invalid document requested'));
    });
    break;
  }
};
