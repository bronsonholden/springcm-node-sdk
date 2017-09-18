const assert = require('assert');
const request = require('request');
const fs = require('fs');
const url = require('url');
const auth = require('./auth');
const diagnose = require('./diagnose');
const Document = require('./object/document');

function path(docpath, callback) {
	request.get({
		baseUrl: auth.href,
		uri: '/documents',
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		},
		qs: {
			path: docpath
		},
		json: true
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			callback(err);
		} else {
			callback(null, new Document(body));
		}
	});
}

function attributes(method, doc, attr, callback) {
	assert(method === 'PATCH' || method === 'PUT', 'Invalid attributes method ' + method);

	var u = url.parse(doc.href.self);

	request({
		method: method,
		baseUrl: 'https://' + u.hostname,
		uri: u.pathname,
		headers: {
			'Authorization': `${auth.type} ${auth.token}`,
			'Content-Type': 'application/json'
		},
		body: {
			'attributegroups': attr
		},
		json: true
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			callback(err);
		} else {
			callback(null, doc);
		}
	});
}

function download(doc, callback) {
	var u = url.parse(doc.href.download);

	request({
		method: 'GET',
		baseUrl: 'https://' + u.hostname,
		uri: u.pathname,
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		}
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			callback(err);
		} else {
			callback(null, doc);
		}
	}).pipe(fs.createWriteStream('./the.pdf'));
}

module.exports = {
	path: path,
	attributes: {
		add: (doc, attr, callback) => attributes('PATCH', doc, attr, callback),
		set: (doc, attr, callback) => attributes('PUT', doc, attr, callback)
	},
	download: download
}
