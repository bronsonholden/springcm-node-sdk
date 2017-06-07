const dotenv = require('dotenv');
const expect = require('chai').expect;
const assert = require('chai').assert;
const auth = require('../lib/auth');
const diagnose = require('../lib/diagnose');
const hostnames = require('../lib/hostnames');

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
});
