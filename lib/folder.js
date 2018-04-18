const fs = require('fs');
const path = require('path');
const url = require('url');
const request = require('request');
const moment = require('moment');
const async = require('async');
const auth = require('./auth');
const diagnose = require('./diagnose');
const Folder = require('./object/folder');
const Document = require('./object/document');

function root(callback) {
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
				uri: '/folders',
				qs: {
					'systemfolder': 'root',
					'expand': 'attributegroups'
				},
				headers: {
					'Authorization': `${auth.type} ${auth.token}`
				},
				json: true
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					if (err) {
						callback(err);
					} else {
						var folder = new Folder(body);

						folder.path = '/' + folder.name;

						callback(null, folder);
					}
				});
			});
		});
	}, callback);
}

function uid(fuid, callback) {
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
				uri: '/folders/' + fuid,
				headers: {
					'Authorization': `${auth.type} ${auth.token}`
				},
				qs: {
					'expand': 'path,attributegroups'
				},
				json: true
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					if (err) {
						callback(err);
					} else {
						callback(null, new Folder(body));
					}
				});
			});
		});
	}, callback);
}

function fpath(fldpath, callback) {
	if (fldpath === '/') {
		return root(callback);
	}

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
				uri: '/folders',
				headers: {
					'Authorization': `${auth.type} ${auth.token}`
				},
				qs: {
					'path': fldpath,
					'expand': 'path,attributegroups'
				},
				json: true
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					if (err) {
						callback(err);
					} else {
						callback(null, body);
					}
				});
			});
		});
	}, callback);
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
						diagnose(err, body, res, (err) => {
							if (err) {
								callback(err);
							} else {
								callback(null, body);
							}
						});
					});
				});
			}, callback);
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
							diagnose(err, body, res, (err) => {
								if (err) {
									callback(err);
								} else {
									callback(null, body);
								}
							});
						});
					});
				}, callback);
			});
		}
	});
}

function rfolders(folder, offset, limit, callback) {
	var u = url.parse(folder.href.folders);

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
					'Authorization': `${auth.type} ${auth.token}`
				},
				qs: {
					'offset': offset,
					'limit': limit
				}
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					if (err) {
						return callback(err);
					}

					var items = [];
					var data = JSON.parse(body);

					data['Items'].forEach((item) => {
						items.push(new Folder(item));
					});

					callback(null, items);
				});
			});
		});
	}, callback);
}

function folders(folder, callback) {
	var u = url.parse(folder.href.folders);

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
				},
				qs: {
					'offset': 0,
					'limit': 1
				}
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					if (err) {
						return callback(err);
					}

					var data = JSON.parse(body);

					const divisor = 1000;
					var n = Math.floor(data['Total'] / divisor);
					var r = data['Total'] % divisor;

					async.times(n + 1, (i, callback) => {
						var offset = i * divisor;
						var limit = i === n ? r : divisor;

						rfolders(folder, offset, limit, (err, folders) => {
							callback(err, folders);
						});
					}, (err, arrays) => {
						if (err) {
							return callback(err);
						}

						var folders = [].concat.apply([], arrays);

						// Fix path, because expand=path doesn't work on
						// folders request (only individual folder)
						folders.forEach((subfolder) => {
							subfolder.path = folder.path + '/' + subfolder.name;
						});

						callback(null, folders);
					});
				});
			});
		});
	}, callback);
}

function subfolder(folder, name, callback) {
	return fpath(folder.path + name, callback);
}

function uploadpath(folder, docpath, options, callback) {
	var name = path.basename(docpath);
	var u = url.parse(folder.href.upload);

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
				diagnose(err, body, res, (err) => {
					callback(err);
				});
			});
		});
	}, callback);
}

function upload(folder, stream, name, options, callback) {
	var u = url.parse(folder.href.upload);

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

			var s = stream;

			if (typeof(stream) === 'function') {
				s = stream();
			}

			request({
				method: 'POST',
				baseUrl: 'https://' + u.hostname,
				uri: u.pathname,
				headers: {
					'Authorization': `${auth.type} ${auth.token}`,
					'Content-Type': 'application/pdf'
				},
				qs: {
					name: name
				},
				body: s
			}, (err, res, body) => {
				diagnose(err, body, res, (err) => {
					callback(err);
				});
			});
		});
	}, callback);
}

function documents(folder, callback) {
	var u = url.parse(folder.href.documents);

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

			const limit = 1000;
			var documents = [];
			var retrieved = 0;
			var total;

			async.waterfall([
				(callback) => {
					// Request for just 1 document so we get the total for the folder
					request({
						method: 'GET',
						baseUrl: 'https://' + u.hostname,
						uri: u.pathname,
						headers: {
							'Authorization': `${auth.type} ${auth.token}`
						},
						qs: {
							expand: 'path',
							offset: 0,
							limit: 1
						}
					}, (err, res, body) => {
						diagnose(err, body, res, (err) => {
							if (err) {
								return callback(err);
							}

							var data = JSON.parse(body);
							total = data['Total'];
							callback();
						});
					});
				},
				(callback) => {
					async.until(() => {
						return retrieved >= total;
					}, (callback) => {
						request({
							method: 'GET',
							baseUrl: 'https://' + u.hostname,
							uri: u.pathname,
							headers: {
								'Authorization': `${auth.type} ${auth.token}`
							},
							qs: {
								offset: retrieved,
								limit: limit,
								expand: 'path'
							}
						}, (err, res, body) => {
							diagnose(err, body, res, (err) => {
								if (err) {
									return callback(err);
								}

								var data = JSON.parse(body);

								retrieved += data['Items'].length;
								var docs = data['Items'].map((doc) => {
									var d = new Document(doc);

									d.path = path.join(folder.path, d.name);

									return d;
								});

								documents = documents.concat(docs);
								callback();
							});
						});
					}, (err) => {
						callback(null, documents);
					});
				}
			], (err, documents) => {
				if (err) {
					return callback(err);
				}

				callback(null, documents);
			});
		});
	}, callback);
}

// Convert body response to Folder object.
function b2f(callback) {
	return (err, body) => callback(err, body && new Folder(body));
}

module.exports = {
	root: root,
	path: (path, callback) => fpath(path, b2f(callback)),
	subfolder: (folder, name, callback) => subfolder(folder, name, b2f(callback)),
	create: (parent, name, callback) => create(parent, name, b2f(callback)),
	get: (path, callback) => get(path, b2f(callback)),
	uid: uid,
	uploadpath: uploadpath,
	upload: upload,
	folders: folders,
	documents: documents
};
