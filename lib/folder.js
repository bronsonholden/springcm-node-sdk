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

module.exports = {
	root: root
};
