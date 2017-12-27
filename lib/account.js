const async = require('async');
const request = require('request');
const auth = require('./auth');
const diagnose = require('./diagnose');

module.exports = (callback) => {
	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		request({
			method: 'GET',
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
	}, callback);
}
