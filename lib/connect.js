const moment = require('moment');
const _ = require('lodash');

/**
 * Callback specification for {@link SpringCM#connect SpringCM.connect}.
 * @callback connectCallback
 * @param {Error} err - The Error instance, if any occurred, otherwise null.
 */

/**
 * Attempt to connect to SpringCM with the client's configured REST API user
 * credentials.
 * @memberof SpringCM
 * @instance
 * @param {connectCallback} callback - Called once the connection to SpringCM is complete.
 */
function connect(callback) {
  this.enqueueRequest({
    method: 'POST',
    baseUrl: this.getAuthUrl(),
    uri: '/apiuser',
    body: {
      'client_id': this.clientId,
      'client_secret': this.clientSecret
    },
    json: true
  }, 1, (err, data) => {
    if (err) {
      return callback(err);
    }

    this.authToken = _.get(data, 'access_token');
    this.expires = moment().add(_.get(data, 'expires_in'), 'seconds');

    this.reconnectTimeout = setTimeout(() => {
      this.connect(() => { });
    }, (_.get(data, 'expires_in') * 1000) - 60000);

    callback();
  });
};

module.exports = connect;
