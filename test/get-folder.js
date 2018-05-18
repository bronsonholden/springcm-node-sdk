const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('get-folder', function () {
  var springCm;

  this.timeout(10000);

  before(function (done) {
    springCm = new SpringCM(env);
    springCm.connect((err) => {
      expect(err).to.not.exist;
      done();
    });
  });

  after(function (done) {
    springCm.close(done);
  });

  describe('reject invalid folders', function () {
    it('null', function (done) {
      springCm.getFolder(null, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('number', function (done) {
      springCm.getFolder(12345, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('boolean', function (done) {
      springCm.getFolder(true, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('function', function (done) {
      springCm.getFolder(() => true, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });
  });

  it('get folder by path', function (done) {
    springCm.getFolder('/', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      done();
    });
  });

  it('get folder by UID', function (done) {
    springCm.getFolder('9e13a8a0-7c7e-e611-bb8d-6c3be5a75f4d', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      done();
    });
  });

  it('get folder by reference', function (done) {
    springCm.getFolder('/', (err, f1) => {
      expect(err).to.not.exist;
      expect(f1).to.exist;

      springCm.getFolder(f1, (err, f2) => {
        expect(err).to.not.exist;
        expect(f2).to.exist;
        // Should be the same folder...
        expect(f1.getUid()).to.equal(f2.getUid());

        done();
      });
    });
  });
});
