const async = require('async');
const assert = require('assert');
const request = require('request');
const moment = require('moment');
const hostnames = require('./hostnames');
const diagnose = require('./diagnose');

var auth = {
	token: null,
	expires: null,
	type: null,
	href: null
};

function authenticate(hostname, clientID, clientSecret, callback) {
	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		request({
			method: 'POST',
			baseUrl: hostname,
			uri: '/apiuser',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: {
				'client_id': clientID,
				'client_secret': clientSecret
			},
			json: true
		}, (err, res, body) => {
			diagnose(err, body, res, (err) => {
				if (err) {
					return callback(err);
				}

				var m = moment().add(body.expires_in, 'seconds');

				auth.token = body.access_token;
				auth.type = body.token_type;
				auth.href = body.api_base_url + '/v201411';
				auth.expires = m.toDate();

				callback(err, body && body.access_token);
			});
		});
	}, callback);
}

auth.login = (datacenter, clientID, clientSecret, callback) => {
	if (!hostnames.hasOwnProperty(datacenter)) {
		return callback(new Error('No such SpringCM datacenter: ' + datacenter))
	}

	return authenticate(hostnames[datacenter].auth, clientID, clientSecret, callback);
};

module.exports = auth;
