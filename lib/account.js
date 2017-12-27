const request = require('request');
const auth = require('./auth');
const diagnose = require('./diagnose');

module.exports = (callback) => {
	request.get({
		baseUrl: auth.href,
		uri: '/accounts/current',
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		},
		json: true
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			return callback(err);
		}

		callback(null, {
			id: body.Id,
			name: body.Name
		});
	});
}
