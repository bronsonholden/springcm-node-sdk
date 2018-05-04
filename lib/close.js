module.exports = function (callback) {
  this.closing = true;

  if (!callback) {
    return;
  }

  if (this.queue.length() === 0 && this.queue.running() === 0) {
    setImmediate(callback);
  } else {
    this.queue.drain = callback;
  }
};
