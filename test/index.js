const dotenv = require('dotenv');
const nock = require('nock');
const expect = require('chai').expect;
const assert = require('chai').assert;
const auth = require('../lib/auth');
const diagnose = require('../lib/diagnose');
const hostnames = require('../lib/hostnames');
const folder = require('../lib/folder');

dotenv.config();

describe('SDK', function () {
	describe('diagnose() SpringCM responses', function () {
		it('detects authentication errors', function (done) {
			const err = diagnose({
				'error': 100,
				'errorDescription': 'An authentication error'
			});

			expect(err).to.exist;
			expect(err).to.be.a('string');
			expect(err).to.equal('An authentication error');

			done();
		});

		it('detects object API errors', function (done) {
			const err = diagnose({
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
	});

	describe('auth', function () {
		if (!process.env.NOCK_OFF) {
			nock(hostnames.uatna11.auth)
				.post('/apiuser')
				.replyWithError('Error message');

			it('detects request errors', function (done) {
				auth.uatna11((err, token) => {
					expect(token).to.not.exist;
					expect(err).to.exist;
					expect(err).to.be.a('string');

					done();
				});
			});

			beforeEach(function () {
				require('./nock/authenticate.js')();
			});
		}

		it('defaults access token, token type, and expiration to null', function (done) {
			expect(auth.token()).to.equal(null);
			expect(auth.expires()).to.equal(null);
			expect(auth.type()).to.equal(null);
			expect(auth.href()).to.equal(null);

			done();
		});

		it('returns access token', function (done) {
			auth.uatna11(process.env.SPRINGCM_CLIENT_ID, process.env.SPRINGCM_CLIENT_SECRET, (err, token) => {
				expect(err).to.equal(null);
				expect(token).to.be.a('string');

				done();
			});
		});

		it('defaults to .env defined credentials', function (done) {
			auth.uatna11((err, token) => {
				expect(err).to.equal(null);
				expect(token).to.be.a('string');

				done();
			});
		});

		it('stores access token and calculates expiration date', function (done) {
			auth.uatna11((err, token) => {
				var expires = auth.expires();

				expect(expires).to.exist;
				expect(expires).to.be.an('object');
				expect(expires).to.afterDate('date');
				expect(auth.token()).to.equal(token);
				expect(auth.type()).to.equal('bearer');
				expect(auth.href()).to.be.a('string');
			});

			done();
		});
	});

	describe('folder', function () {
		// Ensure we have a token and base URL first
		before(function (done) {
			auth.uatna11((err, token) => {
				done();
			});
		});

		it('gets root folder', function (done) {
			nock(auth.href())
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

		it('handles get root folder error', function (done) {
			nock(auth.href())
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
		})
	});
});
