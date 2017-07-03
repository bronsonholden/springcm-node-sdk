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
}

function authenticate(hostname, clientID, clientSecret, callback) {
	assert(typeof(clientID) === 'function' || typeof(callback) === 'function');

	// Default to env vraiables if client id/secret not provided
	if (typeof(clientID) === 'function') {
		callback = clientID;
		clientID = process.env.SPRINGCM_CLIENT_ID;
		clientSecret = process.env.SPRINGCM_CLIENT_SECRET;
	}

	request.post({
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
		var m = moment().add(body.expires_in, 'seconds');

		auth.token = body.access_token;
		auth.type = body.token_type;
		auth.href = body.api_base_url + '/v201411';
		auth.expires = m.toDate();

		callback(diagnose(err, body, res.headers), body && body.access_token);
	});
}

auth.uatna11 = (clientID, clientSecret, callback) => {
	return authenticate(hostnames.uatna11.auth, clientID, clientSecret, callback);
}

module.exports = auth;
