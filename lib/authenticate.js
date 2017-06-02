const hostnames = require('./hostnames');
const Client = require('./client');

function authenticate(clientID, clientSecret, callback) {
	// Default to env vraiables if client id/secret not provided
	if (typeof(clientID) === 'function') {
		callback = clientID;
		clientID = process.env.SPRINGCM_CLIENT_ID;
		clientSecret = process.env.SPRINGCM_CLIENT_SECRET;
	}

	var client = new Client();

	client.request({
		method: 'POST',
		href: hostnames.auth,
		path: '/apiuser',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: {
			'client_id': clientID,
			'client_secret': clientSecret
		}
	}, (err, data) => {
		callback && callback(err, data && data.access_token);
	});
}

module.exports = authenticate
