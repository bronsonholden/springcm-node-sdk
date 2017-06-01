const nock = require('nock');
const hostnames = require('../../lib/hostnames');

module.exports = function () {
	// Authentication
	nock(hostnames.auth)
		.post('/apiuser', {
			'client_id': process.env.SPRINGCM_CLIENT_ID,
			'client_secret': process.env.SPRINGCM_CLIENT_SECRET
		}).reply(200, {
			'access_token': process.env.TEST_ACCESS_TOKEN,
			'token_type': 'bearer',
			'expires_in': 3600,
			'api_base_url': 'https://api.base.url'
		}, {
			'Content-Type': 'application/json',
			'Content-Length': function (req, res, body) {
				return body.toString().length;
			}
		});
	// Invalid authentication
	nock(hostnames.auth)
		.post('/apiuser', {
			'client_id': process.env.TEST_BAD_CLIENT_ID,
			'client_secret': process.env.TEST_BAD_CLIENT_SECRET
		}).reply(401, {
			'error': 'invalid_client',
			'errorDescription': 'Invalid Client Id or Client Secret'
		}, {
			'Content-Type': 'application/json',
			'Content-Length': function (req, res, body) {
				return body.toString().length;
			}
		});
}
