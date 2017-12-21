const fs = require('fs');
const path = require('path');
const url = require('url');
const request = require('request');
const async = require('async');
const auth = require('./auth');
const diagnose = require('./diagnose');
const Folder = require('./object/folder');

function root(callback) {
	request.get({
		baseUrl: auth.href,
		uri: '/folders',
		qs: {
			'systemfolder': 'root'
		},
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		},
		json: true
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			callback(err);
		} else {
			callback(null, body);
		}
	});
}

function fpath(fldpath, callback) {
	if (fldpath === '/') {
		return root(callback);
	}

	request.get({
		baseUrl: auth.href,
		uri: '/folders',
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		},
		qs: {
			'path': fldpath,
			'expand': 'path'
		},
		json: true
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			callback(err);
		} else {
			callback(null, body);
		}
	});
}

function create(parent, name, callback) {
	async.waterfall([
		(callback) => {
			if (parent.path === '/') {
				root((err, body) => {
					callback(err, body);
				});
			} else {
				fpath(parent.path, (err, body) => {
					callback(err, body);
				});
			}
		},
		(body, callback) => {
			request.post({
				baseUrl: auth.href,
				uri: '/folders',
				headers: {
					'Authorization': `${auth.type} ${auth.token}`
				},
				body: {
					'name': name,
					'parentfolder': body
				},
				json: true
			}, (err, res, body) => {
				err = diagnose(err, body, res);

				if (err) {
					callback(err);
				} else {
					callback(null, body);
				}
			});
		}
	], (err, body) => {
		if (err) {
			callback(err);
		} else {
			callback(null, body);
		}
	});
}

// Create folder if it doesn't exist
function get(fldpath, callback) {
	fpath(fldpath, (err, fld) => {
		if (!err) {
			return callback(null, fld);
		} else {
			fpath(path.dirname(fldpath), (err, parent) => {
				request.post({
					baseUrl: auth.href,
					uri: '/folders',
					headers: {
						'Authorization': `${auth.type} ${auth.token}`
					},
					body: {
						'name': path.basename(fldpath),
						'parentfolder': parent
					},
					json: true
				}, (err, res, body) => {
					err = diagnose(err, body, res);

					if (err) {
						callback(err);
					} else {
						callback(null, body);
					}
				});
			});
		}
	});
}

function rfolders(folder, offset, limit, callback) {
	var u = url.parse(folder.href.folders);

	request.get({
		baseUrl: 'https://' + u.hostname,
		uri: u.pathname,
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		},
		qs: {
			'offset': offset,
			'limit': limit
		}
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			return callback(err);
		}

		var items = [];

		body['Items'].forEach((item) => {
			items.push(new Folder(item));
		});

		callback(null, items);
	});
}

function folders(folder, callback) {
	var u = url.parse(folder.href.folders);

	request.get({
		baseUrl: 'https://' + u.hostname,
		uri: u.pathname,
		headers: {
			'Authorization': `${auth.type} ${auth.token}`,
			'Accept': 'application/json'
		},
		qs: {
			'offset': 0,
			'limit': 1
		}
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		if (err) {
			return callback(err);
		}

		var data = JSON.parse(body);

		var n = Math.floor(data['Total'] / 1000);
		var r = data['Total'] % 1000;

		for (var i = 0; i <= n; ++i) {

		}

		console.log(n, r);

		callback(null);
	});
}

function subfolder(folder, name, callback) {
	return fpath(folder.path + name, callback);
}

function uploadpath(folder, docpath, options, callback) {
	var name = path.basename(docpath);
	var u = url.parse(folder.href.upload);

	request.post({
		baseUrl: 'https://' + u.hostname,
		uri: u.pathname,
		headers: {
			'Authorization': `${auth.type} ${auth.token}`,
			'Content-Type': 'application/pdf'
		},
		qs: {
			name: name
		},
		body: fs.createReadStream(docpath)
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		callback(err);
	});
}

function upload(folder, stream, name, options, callback) {
	var u = url.parse(folder.href.upload);

	request.post({
		baseUrl: 'https://' + u.hostname,
		uri: u.pathname,
		headers: {
			'Authorization': `${auth.type} ${auth.token}`,
			'Content-Type': 'application/pdf'
		},
		qs: {
			name: name
		},
		body: stream
	}, (err, res, body) => {
		err = diagnose(err, body, res);

		callback(err);
	});
}

// Convert body response to Folder object.
function b2f(callback) {
	return (err, body) => callback(err, body && new Folder(body));
}

module.exports = {
	root: (callback) => root(b2f(callback)),
	path: (path, callback) => fpath(path, b2f(callback)),
	subfolder: (folder, name, callback) => subfolder(folder, name, b2f(callback)),
	create: (parent, name, callback) => create(parent, name, b2f(callback)),
	get: (path, callback) => get(path, b2f(callback)),
	uploadpath: uploadpath,
	upload: upload,
	folders: folders
};
