const fs = require('fs');
const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('download-document', function () {
  var springCm;

  this.timeout(10000);

  before(function (done) {
    springCm = new SpringCM(env);
    springCm.connect(done);
  });

  after(function (done) {
    springCm.close(done);
  });

  it('download document by path', function (done) {
    springCm.downloadDocument('/Test.pdf', fs.createWriteStream('./test/Download Test 1.pdf'), (err) => {
      expect(err).to.not.exist;
      done();
    });
  });

  it('download document by uid', function (done) {
    springCm.downloadDocument('0063805f-9b42-e811-9c12-3ca82a1e3f41', fs.createWriteStream('./test/Download Test 2.pdf'), (err) => {
      expect(err).to.not.exist;
      done();
    });
  });

  it('download document by reference', function (done) {
    springCm.getDocument('0063805f-9b42-e811-9c12-3ca82a1e3f41', (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;

      springCm.downloadDocument(doc, fs.createWriteStream('./test/Download Test 3.pdf'), (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });
});
