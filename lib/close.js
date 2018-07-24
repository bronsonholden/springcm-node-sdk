/**
 * Complete all enqueued requests and close the connection to SpringCM. If
 * provided, the callback function will be called once all enqueued requests
 * have completed. As soon as {@link SpringCM#close close} returns, new requests cannot be
 * enqueued, and most client methods will return an error.
 * @memberof SpringCM
 * @instance
 * @param {function} callback - Called once the client completes all of its enqueued request.
 */
function close(callback) {
  this.closing = true;

  if (!callback) {
    return;
  }

  if (this.reconnectTimeout) {
    clearTimeout(this.reconnectTimeout);

    this.reconnectTimeout = null;
  }

  if (this.queue.length() === 0 && this.queue.running() === 0) {
    setImmediate(callback);
  } else {
    this.queue.drain = callback;
  }
};

module.exports = close;
