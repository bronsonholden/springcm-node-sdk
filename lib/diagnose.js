function diagnose(err, data, res, callback) {
	if (err) {
		return callback(err);
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
				var unlocks = new Date(reset);
				var now = new Date();
				var msec = unlocks.getTime() - now.getTime();

				if (msec < 0) {
					return null;
				} else {
					// Tack on an extra few seconds
					msec += 5000;
				}

				setTimeout(callback, msec);
			}
		}
	}

	callback();
}

module.exports = diagnose;
