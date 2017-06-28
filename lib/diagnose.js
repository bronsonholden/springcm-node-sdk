function diagnose(err, data) {
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
			return `${data.Error.ErrorCode} ${data.Error.DeveloperMessage}`;
		}
	}

	return null;
}

module.exports = diagnose;
