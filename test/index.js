const dotenv = require('dotenv');
const expect = require('chai').expect;
const assert = require('chai').assert;
const Client = require('../lib/client');
const authenticate = require('../lib/authenticate');
const hostnames = require('../lib/hostnames');

dotenv.config();

describe('SDK', function () {
	describe('HTTP/HTTPS client', function () {
		if (!process.env.NOCK_OFF) {
			beforeEach(function () {
				require('./nock/client.js')();
			});

			// If using Nock, test handling HTTP errors
			it('detects request errors', function (done) {
				var client = new Client();

				client.request({
					method: 'GET',
					hostname: process.env.TEST_BAD_HTTP_REQUEST_HOSTNAME,
					path: '/'
				}, (err, data) => {
					expect(err).to.be.a('string');
					expect(data).to.not.exist;

					done();
				});
			});
		}

		it('accepts JSON responses', function (done) {
			var client = new Client();

			client.request({
				protocol: 'http:',
				method: 'GET',
				hostname: 'ip.jsontest.com',
				path: '/'
			}, (err, data) => {
				expect(err).to.equal(null);
				expect(data).to.exist;
				expect(data.ip).to.exist;
				expect(data.ip).to.be.a('string');

				done();
			});
		});
	});

	describe('POST client ID and client secret', function () {
		if (!process.env.NOCK_OFF) {
			beforeEach(function () {
				require('./nock/authenticate.js')();
			});
		}

		it('returns access token', function (done) {
			authenticate(process.env.SPRINGCM_CLIENT_ID, process.env.SPRINGCM_CLIENT_SECRET, (err, token) => {
				expect(err).to.equal(null);
				expect(token).to.be.a('string');

				done();
			});
		});

		it('detects authentication errors', function (done) {
			authenticate(process.env.TEST_BAD_CLIENT_ID, process.env.TEST_BAD_CLIENT_SECRET, (err, token) => {
				expect(err).to.be.a('string');
				expect(err).to.equal('Invalid Client Id or Client Secret');
				expect(token).to.not.exist;

				done();
			});
		});

		it('defaults to .env defined credentials', function (done) {
			authenticate((err, token) => {
				expect(err).to.equal(null);
				expect(token).to.be.a('string');

				done();
			});
		});
	});
});
