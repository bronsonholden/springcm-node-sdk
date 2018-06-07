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
      options: options
    }, priority, callback);
  }
};
