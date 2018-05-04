module.exports = function (req, priority, callback) {
  if (this.closing) {
    process.nextTick(() => {
      callback(new Error('Client is currently shutting down'));
    });
  } else {
    this.queue.push({
      request: req
    }, priority, callback);
  }
};
