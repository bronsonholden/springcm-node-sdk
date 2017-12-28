const async = require('async');
const moment = require('moment');
const assert = require('assert');
const request = require('request');
const fs = require('fs');
const url = require('url');
const auth = require('./auth');
const diagnose = require('./diagnose');
const Document = require('./object/document');

function path(docpath, callback) {
	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		async.waterfall([
			(callback) => {
				if (moment().isAfter(auth.expires)) {
					return auth.relogin(callback);
				}

				callback();
			}
		], (err) => {
			if (err) {
				return callback(err);
			}

			request({
				method: 'GET',
				baseUrl: auth.href,
				uri: '/documents',
				headers: {
					'Authorization': `${auth.type} ${auth.token}`
				},
				qs: {
					path: docpath,
					expand: 'path,attributegroups'
				},
				json: true
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					if (err) {
						callback(err);
					} else {
						callback(null, new Document(body));
					}
				});
			});
		});
	}, callback);
}

function uid(docuid, callback) {
	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		async.waterfall([
			(callback) => {
				if (moment().isAfter(auth.expires)) {
					return auth.relogin(callback);
				}

				callback();
			}
		], (err) => {
			if (err) {
				return callback(err);
			}

			request({
				method: 'GET',
				baseUrl: auth.href,
				uri: '/documents/' + docuid,
				headers: {
					'Authorization': `${auth.type} ${auth.token}`
				},
				qs: {
					expand: 'path,attributegroups'
				},
				json: true
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					if (err) {
						callback(err);
					} else {
						callback(null, new Document(body));
					}
				});
			});
		});
	}, callback);
}

function attributes(method, doc, attr, callback) {
	assert(method === 'PATCH' || method === 'PUT', 'Invalid attributes method ' + method);

	var u = url.parse(doc.href.self);

	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		async.waterfall([
			(callback) => {
				if (moment().isAfter(auth.expires)) {
					return auth.relogin(callback);
				}

				callback();
			}
		], (err) => {
			if (err) {
				return callback(err);
			}

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
				diagnose(err, body, res, (err) => {
					if (err) {
						callback(err);
					} else {
						callback(null, doc);
					}
				});
			});
		});
	}, callback);
}

function download(doc, stream, callback) {
	var u = url.parse(doc.href.download);

	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		async.waterfall([
			(callback) => {
				if (moment().isAfter(auth.expires)) {
					return auth.relogin(callback);
				}

				callback();
			}
		], (err) => {
			if (err) {
				return callback(err);
			}

			request({
				method: 'GET',
				baseUrl: 'https://' + u.hostname,
				uri: u.pathname,
				headers: {
					'Authorization': `${auth.type} ${auth.token}`,
					'Accept': 'application/json'
				}
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					if (err) {
						callback(err);
					} else {
						callback(null, doc);
					}
				});
			}).pipe(stream);
		});
	}, callback);
}

function version(doc, stream, callback) {
	var u = url.parse(doc.href.self);
	var match = u.hostname.match('api(.*)\.springcm\.com');
	var hostname = `apiupload${match[1]}.springcm.com`;

	async.retry({
		times: 10,
		interval: 10000
	}, (callback) => {
		async.waterfall([
			(callback) => {
				if (moment().isAfter(auth.expires)) {
					return auth.relogin(callback);
				}

				callback();
			}
		], (err) => {
			if (err) {
				return callback(err);
			}

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
				diagnose(err, body, res, (err) => {
					if (err) {
						callback(err);
					} else {
						callback();
					}
				});
			});
		});
	}, callback);
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
