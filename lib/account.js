const request = require('./request');
const auth = require('./auth');
const diagnose = require('./diagnose');

module.exports = (callback) => {
	request({
		method: 'GET',
		baseUrl: auth.href,
		uri: '/accounts/current',
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		},
		json: true
	}, (err, body) => {
		if (err) {
			return callback(err);
		}

		callback(null, {
			id: body.Id,
			name: body.Name
		});
	});
}
