const request = require('request');
const auth = require('./auth');
const diagnose = require('./diagnose');

function Folder(obj) {
	this.name = obj.Name;
	this.created = obj.CreatedDate;
	this.creator = obj.CreatedBy;
	this.updated = obj.UpdatedDate;
	this.updater = obj.UpdatedBy;
	this.desc = obj.Description;
	this.browse = obj.BrowseDocumentsUrl;
	this.access = {
		see: obj.AccessLevel.See,
		read: obj.AccessLevel.Read,
		write: obj.AccessLevel.Write,
		move: obj.AccessLevel.Move,
		create: obj.AccessLevel.Create,
		set: obj.AccessLevel.SetAccess
	},
	this.href = {
		documents: obj.Documents.Href,
		folders: obj.Folders.Href,
		self: obj.Href
	}
}

function root(callback) {
	request.get({
		baseUrl: auth.href(),
		uri: '/folders',
		qs: {
			'systemfolder': 'root'
		},
		headers: {
			'Authorization': `${auth.type()} ${auth.token()}`
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
}
