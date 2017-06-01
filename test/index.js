const dotenv = require('dotenv');
const expect = require('chai').expect;
const assert = require('chai').assert;
const authenticate = require('../lib/authenticate');

dotenv.config();

describe('SDK', function () {
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
	});
});
