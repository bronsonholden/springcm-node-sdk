module.exports = function (req, priority, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (this.closing) {
    process.nextTick(() => {
      callback(new Error('Client is currently shutting down'));
    });
  } else {
    this.queue.push({
      request: req,
      options: options,
      callback: callback
    }, priority, (err, data) => {
      /**
       * Callback can be called with no data (after rate limit encountered).
       * Only call user-specified callback if we have an actual response.
       */

      if (err) {
        return callback(err);
      }

      if (data) {
        return callback(null, data);
      }
    });
  }
};
