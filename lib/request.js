const async = require('async');
const request = require('request');
const diagnose = require('./diagnose');

function r(opts, callback) {
	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		request(opts, (err, res, body) => {
			diagnose(err, body, res, (err) => {
				if (err) {
					return callback(err);
				}

				callback(null, body);
			});
		});
	}, (err, result) => {
		callback(err, result);
	});
}

module.exports = r;
