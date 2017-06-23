const fs = require('fs');
const path = require('path');
const url = require('url');
const request = require('request');
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
		err = diagnose(err, body);

		if (err) {
			callback(err);
		} else {
			callback(null, new Folder(body));
		}
	});
}

function subfolder(folder, name, callback) {
	request.get({
		baseUrl: auth.href,
		uri: '/folders',
		headers: {
			'Authorization': `${auth.type} ${auth.token}`
		},
		qs: {
			'path': folder.path + name,
			'expand': 'path'
		},
		json: true
	}, (err, res, body) => {
		err = diagnose(err, body);

		if (err) {
			callback(err);
		} else {
			callback(null, new Folder(body));
		}
	});
}

function upload(folder, docpath, options, callback) {
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
		err = diagnose(err, body);

		callback(err);
	});
}

module.exports = {
	root: root,
	subfolder: subfolder,
	upload: upload
};
