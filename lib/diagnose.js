const moment = require('moment-timezone');

function diagnose(err, data, res, callback) {
	if (err) {
		return callback(err);
	}

	if (!data) {
		return callback();
	}

	if (typeof(data) === 'string') {
		data = JSON.parse(data);
	}

	// Authenticate API errors
	if (data.error) {
		return callback(new Error(data.errorDescription));
	}

	// Object API errors
	if (data.Error) {
		if (data.Error.ErrorCode === 101) {
			var str = '';

			data.ValidationErrors.forEach((err) => {
				str += `${err.ErrorCode} ${err.DeveloperMessage}`;
			});

			return callback(new Error(str));
		} else {
			if (res && res.headers && data.Error.ErrorCode === 103) {
				var reset = res.headers['x-ratelimit-reset'];
				var unlocks = moment.utc(reset, 'ddd, DD MMM YYYY HH:mm:ss z').tz('America/Los_Angeles');
				var now = moment().utc();
				var msec = unlocks.diff(now) + 1000;

				console.log(`Rate limit reached, waiting for ${msec} msec`);

				return setTimeout(callback, msec, new Error(`Rate limit reached, requests may resume in ${msec} msec`));
			}
		}
	}

	callback();
}

module.exports = diagnose;
