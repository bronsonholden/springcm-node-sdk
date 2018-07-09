const moment = require('moment');
const _ = require('lodash');

module.exports = function (callback) {
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
