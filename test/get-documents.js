const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('get-documents', function () {
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

  describe('get all documents', function () {
    it('by path', function (done) {
      springCm.getDocuments('/Download', (err, documents) => {
        expect(err).to.not.exist;
        expect(documents).to.be.an('array');
        done();
      });
    });

    it('by UID', function (done) {
      springCm.getDocuments('aa906d65-52ab-e611-bb8d-6c3be5a75f4d', (err, documents) => {
        expect(err).to.not.exist;
        expect(documents).to.be.an('array');
        done();
      });
    });

    it('by reference', function (done) {
      springCm.getRootFolder((err, root) => {
        springCm.getDocuments(root, (err, documents) => {
          expect(err).to.not.exist;
          expect(documents).to.be.an('array');
          done();
        });
      });
    });
  });
});
