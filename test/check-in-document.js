const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');
const fs = require('fs');

describe('check-in-document', function () {
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

  it('check in document by path', function (done) {
    springCm.checkInDocument('/Test Check-in.pdf', fs.createReadStream('./test/Test.pdf'), (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;
      done();
    });
  });

  it('check in document by UID', function (done) {
    springCm.checkInDocument('0dab6601-3841-e911-9c1d-3ca82a1e3f41', fs.createReadStream('./test/Test.pdf'), (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;
      done();
    });
  });

  it('check in document by reference', function (done) {
    springCm.getDocument('/Test Check-in.pdf', (err, d1) => {
      expect(err).to.not.exist;
      expect(d1).to.exist;

      springCm.checkInDocument(d1, fs.createReadStream('./test/Test.pdf'), (err, d2) => {
        expect(err).to.not.exist;
        expect(d2).to.exist;

        done();
      });
    });
  });
});
