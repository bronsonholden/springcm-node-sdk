const deasync = require('deasync');

function diagnose(err, data, res) {
	if (err)
		return err.message;

	// Authenticate API errors
	if (data.error) {
		return data.errorDescription;
	}

	// Object API errors
	if (data.Error) {
		if (data.Error.ErrorCode === 101) {
			var str = '';

			data.ValidationErrors.forEach((err) => {
				str += `${err.ErrorCode} ${err.DeveloperMessage}`;
			});

			return str;
		} else {
			if (res && res.headers && data.Error.ErrorCode === 103) {
				var reset = headers['x-ratelimit-reset'];
				var unlocks = new Date(reset);
				var now = new Date();
				var msec = unlocks.getTime() - now.getTime();

				if (msec < 0) {
					return null;
				} else {
					// Tack on an extra few seconds
					msec += 5000;
				}

				console.log('---- Hit rate limit');
				console.log('---- Waiting until ' + reset);
				console.log(`---- Idling for ${Math.floor(msec / 1000) + 1} sec`);

				deasync.sleep(msec);

				console.log('---- Continuing');
			}

			return `${data.Error.ErrorCode} ${data.Error.DeveloperMessage}`;
		}
	}

	return null;
}

module.exports = diagnose;
