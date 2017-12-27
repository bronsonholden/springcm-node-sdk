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
		diagnose(err, body, res, (err) => {
			if (err) {
				return callback(err);
			}

			callback(null, {
				id: body.Id,
				name: body.Name
			});
		});
	});
}
