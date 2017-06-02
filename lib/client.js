const assert = require('assert');
const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');

function Client() {
}

Client.prototype.request = function (options, callback) {
	assert(typeof(callback) === 'function');

	// Default to HTTPS
	var protocol = options.protocol === 'http:' ? http : https;
	var method = options.method || 'GET';
	var params = options.params ? `?${querystring.stringify(options.params)}` : '';
	var href = options.href;
	var hostname = options.hostname;
	var headers = options.headers;
	var body = options.body;
	var path = options.path;

	if (href) {
		href = url.parse(href);
		hostname = href.hostname;
		path = href.path + path;
	}

	body = JSON.stringify(body);
	headers['Content-Length'] = headers['Content-Length'] || body.length;

	var req = protocol.request({
		method: method,
		hostname: hostname,
		path: path + params,
		headers: headers
	}, (res) => {
		var body = '';

		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			body += chunk;
		}).on('end', () => {
			var data = JSON.parse(body);

			callback(this.diagnose(data), data);
		});
	});

	req.on('error', (err) => {
		callback('HTTP request error: ' + err);
	});

	req.write(body);

	req.end();
}

Client.prototype.diagnose = function (data) {
	// Authenticate API errors
	if (data.error) {
		return data.errorDescription;
	}

	// Object API errors
	if (data.Error) {
		return `${data.Error.ErrorCode} ${data.Error.DeveloperMessage}`;
	}

	return null;
}

module.exports = Client;
