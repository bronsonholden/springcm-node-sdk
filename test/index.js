const dotenv = require('dotenv');
const nock = require('nock');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const auth = require('../lib/auth');
const diagnose = require('../lib/diagnose');
const hostnames = require('../lib/hostnames');
const folder = require('../lib/folder');
const document = require('../lib/document');
const SpringCM = require('..');

chai.use(require('chai-datetime'));
dotenv.config();

describe('SDK', function () {
	this.timeout(10000);

	describe('diagnose() SpringCM responses', function () {
		it('detects authentication errors', function (done) {
			const err = diagnose(null, {
				'error': 100,
				'errorDescription': 'An authentication error'
			});

			expect(err).to.exist;
			expect(err).to.be.a('string');
			expect(err).to.equal('An authentication error');

			done();
		});

		it('detects object API errors', function (done) {
			const err = diagnose(null, {
				'Error': {
					'ErrorCode': 100,
					'DeveloperMessage': 'An object API error'
				}
			});

			expect(err).to.exist;
			expect(err).to.be.a('string');
			expect(err).to.equal(`100 An object API error`);

			done();
		});

		it('detects request errors', function (done) {
			const err = diagnose(new Error('Error message'));

			expect(err).to.exist;
			expect(err).to.be.a('string');

			done();
		});
	});

	describe('auth', function () {
		this.timeout(10000);

		// Forced error tests can't be performed without nocking an error response
		if (!process.env.NOCK_OFF) {
			it('detects request errors', function (done) {
				nock(hostnames.uatna11.auth)
					.post('/apiuser', {
						'client_id': process.env.TEST_BAD_CLIENT_ID,
						'client_secret': process.env.TEST_BAD_CLIENT_SECRET
					}).replyWithError('Error message');

				auth.uatna11((err, token) => {
					expect(token).to.not.exist;
					expect(err).to.exist;
					expect(err).to.be.a('string');

					done();
				});
			});

			it('detects authentication failure', function (done) {
				nock(hostnames.uatna11.auth)
					.post('/apiuser', {
						'client_id': process.env.TEST_BAD_CLIENT_ID,
						'client_secret': process.env.TEST_BAD_CLIENT_SECRET
					}).reply(401, {
						'error': 'invalid_client',
						'errorDescription': 'Invalid Client Id or Client Secret'
					}, {
						'Content-Type': 'application/json',
						'Content-Length': function (req, res, body) {
							return body.toString().length;
						}
					});

				auth.uatna11((err, token) => {
					expect(token).to.not.exist;
					expect(err).to.exist;
					expect(err).to.be.a('string');

					done();
				});
			});
		}

		it('defaults access token, token type, and expiration to null', function (done) {
			expect(auth.token).to.equal(null);
			expect(auth.expires).to.equal(null);
			expect(auth.type).to.equal(null);
			expect(auth.href).to.equal(null);

			done();
		});

		it('returns access token', function (done) {
			nock(hostnames.uatna11.auth)
				.post('/apiuser', {
					'client_id': process.env.SPRINGCM_CLIENT_ID,
					'client_secret': process.env.SPRINGCM_CLIENT_SECRET
				}).reply(200, {
					'access_token': process.env.TEST_ACCESS_TOKEN,
					'token_type': 'bearer',
					'expires_in': 3600,
					'api_base_url': 'https://api.base.url'
				}, {
					'Content-Type': 'application/json',
					'Content-Length': function (req, res, body) {
						return body.toString().length;
					}
				});

			auth.uatna11(process.env.SPRINGCM_CLIENT_ID, process.env.SPRINGCM_CLIENT_SECRET, (err, token) => {
				expect(err).to.equal(null);
				expect(token).to.be.a('string');

				done();
			});
		});

		it('defaults to .env defined credentials', function (done) {
			nock(hostnames.uatna11.auth)
				.post('/apiuser', {
					'client_id': process.env.SPRINGCM_CLIENT_ID,
					'client_secret': process.env.SPRINGCM_CLIENT_SECRET
				}).reply(200, {
					'access_token': process.env.TEST_ACCESS_TOKEN,
					'token_type': 'bearer',
					'expires_in': 3600,
					'api_base_url': 'https://api.base.url'
				}, {
					'Content-Type': 'application/json',
					'Content-Length': function (req, res, body) {
						return body.toString().length;
					}
				});

			auth.uatna11((err, token) => {
				expect(err).to.equal(null);
				expect(token).to.be.a('string');

				done();
			});
		});
	});

	describe('folder', function () {
		// Ensure we have a token and base URL first
		before(function (done) {
			nock(hostnames.uatna11.auth)
				.post('/apiuser', {
					'client_id': process.env.SPRINGCM_CLIENT_ID,
					'client_secret': process.env.SPRINGCM_CLIENT_SECRET
				}).reply(200, {
					'access_token': process.env.TEST_ACCESS_TOKEN,
					'token_type': 'bearer',
					'expires_in': 3600,
					'api_base_url': 'https://api.base.url'
				}, {
					'Content-Type': 'application/json',
					'Content-Length': function (req, res, body) {
						return body.toString().length;
					}
				});

			auth.uatna11((err, token) => {
				done();
			});
		});

		it('gets root folder', function (done) {
			nock(auth.href)
				.get('/folders')
				.query({
					'systemfolder': 'root'
				})
				.reply(200, {
					'Name': 'Account Name',
					'CreatedDate': '2000-01-01T00:00:00.000Z',
					'CreatedBy': 'user@email.com',
					'UpdatedDate': '2000-01-01T00:00:00.000Z',
					'UpdatedBy': 'user@email.com',
					'Description': 'The root folder of the account',
					'BrowseDocumentsUrl': 'https://browse.documents.url',
					'AccessLevel': {
						'See': true,
						'Read': true,
						'Write': true,
						'Move': true,
						'Create': true,
						'SetAccess': true
					},
					'Documents': {
						'Href': 'https://folder.documents.url'
					},
					'Folders': {
						'Href': 'https://folder.folders.url'
					},
					'ShareLinks': {
						'Href': 'https://folder.sharelinks.url'
					},
					'CreateDocumentHref': 'https://upload.document.url',
					'Href': 'https://current.folder.url'
				}, {
					'Content-Type': 'application/json',
					'Content-Length': function (req, res, body) {
						return body.toString().length;
					}
				});

			folder.root((err, obj) => {
				expect(err).to.equal(null);
				expect(obj).to.exist;
				expect(obj.name).to.be.a('string');

				done();
			});

		});

		it('get subfolder', function (done) {
			nock(auth.href)
				.get('/folders')
				.query({
					'systemfolder': 'root'
				})
				.reply(200, {
					'Name': 'Account Name',
					'CreatedDate': '2000-01-01T00:00:00.000Z',
					'CreatedBy': 'user@email.com',
					'UpdatedDate': '2000-01-01T00:00:00.000Z',
					'UpdatedBy': 'user@email.com',
					'Description': 'The root folder of the account',
					'BrowseDocumentsUrl': 'https://browse.documents.url',
					'AccessLevel': {
						'See': true,
						'Read': true,
						'Write': true,
						'Move': true,
						'Create': true,
						'SetAccess': true
					},
					'Documents': {
						'Href': 'https://folder.documents.url'
					},
					'Folders': {
						'Href': 'https://folder.folders.url'
					},
					'ShareLinks': {
						'Href': 'https://folder.sharelinks.url'
					},
					'CreateDocumentHref': 'https://upload.document.url',
					'Href': 'https://current.folder.url'
				}, {
					'Content-Type': 'application/json',
					'Content-Length': function (req, res, body) {
						return body.toString().length;
					}
				});

			nock(auth.href)
				.get('/folders')
				.query({
					'expand': 'path',
					'path': '/Account Name/Trash'
				})
				.reply(200, {
					'Name': 'Trash',
					'CreatedDate': '2000-01-01T00:00:00.000Z',
					'CreatedBy': 'user@email.com',
					'UpdatedDate': '2000-01-01T00:00:00.000Z',
					'UpdatedBy': 'user@email.com',
					'Description': 'The trash folder',
					'BrowseDocumentsUrl': 'https://browse.documents.url/1234',
					'AccessLevel': {
						'See': true,
						'Read': true,
						'Write': true,
						'Move': true,
						'Create': true,
						'SetAccess': true
					},
					'Documents': {
						'Href': 'https://folder.documents.url/1234'
					},
					'Folders': {
						'Href': 'https://folder.folders.url/1234'
					},
					'Path': '/Account Name/Trash',
					'ShareLinks': {
						'Href': 'https://folder.sharelinks.url/1234'
					},
					'CreateDocumentHref': 'https://upload.document.url/1234',
					'Href': 'https://current.folder.url/1234'
				}, {
					'Content-Type': 'application/json',
					'Content-Length': function (req, res, body) {
						return body.toString().length;
					}
				});

			folder.root((err, root) => {
				expect(err).to.not.exist;
				expect(root).to.exist;

				folder.subfolder(root, 'Trash', (err, fld) => {
					expect(err).to.not.exist;
					expect(fld).to.exist;

					done();
				});
			});
		});

		it('create folder', function (done) {
			var rootFolder = {
				'Name': 'Account Name',
				'CreatedDate': '2000-01-01T00:00:00.000Z',
				'CreatedBy': 'user@email.com',
				'UpdatedDate': '2000-01-01T00:00:00.000Z',
				'UpdatedBy': 'user@email.com',
				'Description': 'The root folder of the account',
				'BrowseDocumentsUrl': 'https://browse.documents.url',
				'AccessLevel': {
					'See': true,
					'Read': true,
					'Write': true,
					'Move': true,
					'Create': true,
					'SetAccess': true
				},
				'Documents': {
					'Href': 'https://folder.documents.url'
				},
				'Folders': {
					'Href': 'https://folder.folders.url'
				},
				'ShareLinks': {
					'Href': 'https://folder.sharelinks.url'
				},
				'CreateDocumentHref': 'https://upload.document.url',
				'Href': 'https://current.folder.url'
			};

			nock(auth.href)
				.get('/folders')
				.query({
					'systemfolder': 'root'
				})
				.reply(200, rootFolder);

			// create() internally requests body of parent by path
			nock(auth.href)
				.get('/folders')
				.query({
					// Optional slash at end of path
					// Minor TODO: requests should clip trailing slashes, as it's only
					// used to more easily concatenate paths and folder/doc names
					'path': /\/Account Name\/?/,
					'expand': 'path'
				})
				.reply(200, rootFolder);

			nock(auth.href)
				.post('/folders', {
					'name': 'TestFolder',
					'parentfolder': rootFolder
				})
				.reply(200, {
					'Name': 'TestFolder',
					'CreatedDate': '2000-01-01T00:00:00.000Z',
					'CreatedBy': 'user@email.com',
					'UpdatedDate': '2000-01-01T00:00:00.000Z',
					'UpdatedBy': 'user@email.com',
					'Description': 'A created test folder',
					'Path': '/Account Name/TestFolder',
					'BrowseDocumentsUrl': 'https://browse.documents.url',
					'AccessLevel': {
						'See': true,
						'Read': true,
						'Write': true,
						'Move': true,
						'Create': true,
						'SetAccess': true
					},
					'Documents': {
						'Href': 'https://folder.documents.url'
					},
					'Folders': {
						'Href': 'https://folder.folders.url'
					},
					'ShareLinks': {
						'Href': 'https://folder.sharelinks.url'
					},
					'CreateDocumentHref': 'https://upload.document.url',
					'Href': 'https://current.folder.url'
				});

			folder.root((err, root) => {
				expect(err).to.not.exist;
				expect(root).to.exist;

				folder.create(root, 'TestFolder', (err, fld) => {
					expect(err).to.not.exist;
					expect(fld).to.exist;

					done();
				});
			});
		});

		if (process.env.NOCK_OFF) {
			it('upload document', function (done) {
				folder.root((err, fld) => {
					expect(err).to.not.exist;
					expect(fld).to.exist;

					folder.upload(fld, __dirname + '/Test.pdf', null, (err) => {
						expect(err).to.not.exist;

						done();
					});
				});
			});
		}

		if (!process.env.NOCK_OFF) {
			it('handles get root folder error', function (done) {
				nock(auth.href)
					.get('/folders')
					.query({
						'systemfolder': 'root'
					})
					.reply(404, {
						'Error': {
							'HttpStatusCode': 404,
							'UserMessage': 'User error message',
							'DeveloperMessage': 'Developer error message',
							'ErrorCode': 1,
							'ReferenceId': '00000000-0000-0000-0000-000000000000'
						}
					}, {
						'Content-Type': 'application/json',
						'Content-Length': function (req, res, body) {
							return body.toString().length;
						}
					});

				folder.root((err, obj) => {
					expect(err).to.exist;
					expect(err).to.be.a('string');
					expect(obj).to.not.exist;

					done();
				});
			});
		}

		it('get folder by path', function (done) {
			nock(auth.href)
				.get('/folders')
				.query({
					'path': '/Trash',
					'expand': 'path'
				})
				.reply(200, {
					'Name': 'Trash',
					'CreatedDate': '2000-01-01T00:00:00.000Z',
					'CreatedBy': 'user@email.com',
					'UpdatedDate': '2000-01-01T00:00:00.000Z',
					'UpdatedBy': 'user@email.com',
					'Description': 'The trash folder',
					'BrowseDocumentsUrl': 'https://browse.documents.url/1234',
					'AccessLevel': {
						'See': true,
						'Read': true,
						'Write': true,
						'Move': true,
						'Create': true,
						'SetAccess': true
					},
					'Documents': {
						'Href': 'https://folder.documents.url/1234'
					},
					'Folders': {
						'Href': 'https://folder.folders.url/1234'
					},
					'Path': '/Account Name/Trash',
					'ShareLinks': {
						'Href': 'https://folder.sharelinks.url/1234'
					},
					'CreateDocumentHref': 'https://upload.document.url/1234',
					'Href': 'https://current.folder.url/1234'
				});

			folder.path('/Trash', (err, fld) => {
				expect(err).to.not.exist;
				expect(fld).to.exist;

				done();
			});
		});
	});

	describe('document', function () {
		var doc = null;
		var attr = {
			'Contracts': {
				'Status': {
					'AttributeType': 'DropDown',
					'RepeatingAttribute': false,
					'Value': 'Active'
				}
			}
		};

		beforeEach(function (done) {
			nock(auth.href)
				.get('/documents')
				.query({
					path: '/Test/Test.pdf'
				})
				.reply(200, {
					'Name': 'Test.pdf',
					'CreatedDate': '2000-01-01T00:00:00.000Z',
					'CreatedBy': 'user@email.com',
					'UpdatedDate': '2000-01-01T00:00:00.000Z',
					'UpdatedBy': 'user@email.com',
					'Description': '',
					'AccessLevel': {
						'See': true,
						'Read': true,
						'Write': true,
						'Move': true,
						'Create': true,
						'SetAccess': true
					},
					'Path': '/Test/Test.pdf',
					'Href': 'https://test.document.url/test-1234',
					'ParentFolder': {
						'Href': 'https://test.document.folder.url'
					}
				});

			document.get('/Test/Test.pdf', (err, res) => {
				expect(err).to.not.exist;
				expect(res).to.exist;

				doc = res;

				done();
			});
		});

		it('get by path', function (done) {
			done();
		});

		it('add attributes', function (done) {
			nock('https://test.document.url')
				.patch('/test-1234', {
					'attributegroups': attr
				})
				.reply(200, {
				});

			document.attributes.add(doc, attr, (err, res) => {
				expect(err).to.not.exist;

				done();
			});
		});

		it('set attributes', function (done) {
			nock('https://test.document.url')
				.put('/test-1234', {
					'attributegroups': attr
				})
				.reply(200, {
				});

			document.attributes.set(doc, attr, (err, res) => {
				expect(err).to.not.exist;

				done();
			});
		});
	});
});
