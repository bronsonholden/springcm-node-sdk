module.exports = function (path, attributes, callback) {
  if (!path) {
    return setImmediate(() => {
      callback(new Error('Invalid document'));
    });
  }

  switch (typeof path) {
  case 'string':
    this.getDocument(path, (err, doc) => {
      if (err) {
        return callback(err);
      }

      this.enqueueRequest({
        method: 'PUT',
        baseUrl: this.getBaseUrl(),
        uri: `/documents/${doc.getUid()}`,
        headers: {
          'Authorization': `bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        json: {
          'AttributeGroups': attributes
        }
      }, 1, callback);
    });
    break;
  case 'object':
    this.enqueueRequest({
      method: 'PUT',
      baseUrl: this.getBaseUrl(),
      uri: `/documents/${path.getUid()}`,
      headers: {
        'Authorization': `bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      json: {
        'AttributeGroups': attributes
      }
    }, 1, callback);
    break;
  }
};
