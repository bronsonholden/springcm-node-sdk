const dotenv = require('dotenv');
const expect = require('chai').expect;
const assert = require('chai').assert;
const authenticate = require('../lib/authenticate');
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

		it('defaults to .env defined credentials', function (done) {
			authenticate((err, token) => {
				expect(err).to.equal(null);
				expect(token).to.be.a('string');

				done();
			});
		});
	});
});
