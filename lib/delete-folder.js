module.exports = function (path, callback) {
  if (!path) {
    return setImmediate(() => {
      callback(new Error('Invalid folder path'));
    });
  }

  switch (typeof path) {
  case 'string':
    this.getFolder(path, (err, folder) => {
      if (err) {
        return callback(err);
      }

      this.deleteFolder(folder, callback);
    });
    break;
  case 'object':
    this.enqueueRequest({
      method: 'DELETE',
      baseUrl: this.getBaseUrl(),
      uri: `/folders/${path.getUid()}`,
      headers: {
        'Authorization': `bearer ${this.authToken}`
      }
    }, 1, callback);
    break;
  }
};
