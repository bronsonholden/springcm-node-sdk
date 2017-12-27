const async = require('async');
const request = require('request');
const diagnose = require('./diagnose');

function r(opts, callback) {
	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		var req = request(opts, (err, res, body) => {
			diagnose(err, body, res, (err) => {
				if (err) {
					console.log(err);
					console.log('Retrying in 10 sec');
					return callback(err);
				}

				callback(null, body);
			});
		});

		if (opts.outPipe) {
			req.pipe(opts.outPipe);
		}

		if (opts.inPipe) {
			inPipe.pipe(req);
		}
	}, (err, result) => {
		callback(err, result);
	});
}

module.exports = r;
