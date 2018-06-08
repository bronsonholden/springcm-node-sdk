const _ = require('lodash');
const SpringCMFolder = require('./springcm-folder');

module.exports = function (callback) {
  this.enqueueRequest({
    method: 'GET',
    baseUrl: this.getBaseUrl(),
    uri: '/folders',
    qs: {
      'systemfolder': 'root',
      'expand': 'attributegroups'
    },
    headers: {
      'Authorization': `bearer ${this.authToken}`,
      'Accept': 'application/json'
    }
  }, 1, (err, folder) => {
    if (err) {
      return callback(err);
    }

    callback(null, new SpringCMFolder(_.merge(folder, {
      'Path': '/'
    })));
  });
};
