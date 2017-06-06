const nock = require('nock');
const hostnames = require('../../lib/hostnames');

module.exports = function () {
	// Authentication
	nock('http://ip.jsontest.com')
		.get('/')
		.reply(200, {
			'ip': '0.0.0.0'
		}, {
			'Content-Type': 'application/json',
			'Content-Length': function (req, res, body) {
				return body.toString().length;
			}
		});
	nock('https://httpbin.org')
		.get('/anything')
		.query({
			'field': 'value'
		})
		.reply(200, {
			'args': {
				'field': 'value'
			}
		});
	nock(process.env.TEST_BAD_HTTP_REQUEST_HOSTNAME)
		.get('/')
		.replyWithError('Test HTTP error');
}
