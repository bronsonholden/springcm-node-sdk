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
			path: docpath,
			expand: 'all'
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

function uid(docuid, callback) {
	request.get({
		baseUrl: auth.href,
		uri: '/documents/' + docuid,
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		},
		qs: {
			expand: 'all'
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

function download(doc, stream, callback) {
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
	}).pipe(stream);
}

function version(doc, stream, callback) {
	var u = url.parse(doc.href.self);
	var match = u.hostname.match('api(.*)\.springcm\.com');
	var hostname = `apiupload${match[1]}.springcm.com`;

	request({
		method: 'POST',
		baseUrl: 'https://' + hostname,
		uri: u.pathname,
		headers: {
			'Authorization': `${auth.type} ${auth.token}`,
			'Content-Disposition': 'inline; filename="checkin.txt"'
		},
		body: stream
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
}

module.exports = {
	path: path,
	uid: uid,
	attributes: {
		add: (doc, attr, callback) => attributes('PATCH', doc, attr, callback),
		set: (doc, attr, callback) => attributes('PUT', doc, attr, callback)
	},
	download: download,
	version: version
};
