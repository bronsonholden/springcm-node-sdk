const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('csv-lookup', function () {
  var springCm;

  this.timeout(20000);

  before(function (done) {
    springCm = new SpringCM(env);
    springCm.connect(done);
  });

  after(function (done) {
    springCm.close(done);
  });

  it('by path', function (done) {
    springCm.csvLookup('/Download/Test.csv', {
      'customer_id': 1
    }, (err, rows) => {
      expect(err).to.not.exist;
      expect(rows).to.exist;
      expect(rows).to.be.an('array');
      done();
    });
  });

  it('by UID', function (done) {
    springCm.csvLookup('cfb8cfa2-3959-e811-9c12-3ca82a1e3f41', {
      'customer_id': 1
    }, (err, rows) => {
      expect(err).to.not.exist;
      expect(rows).to.exist;
      expect(rows).to.be.an('array');
      done();
    });
  });

  it('by ref', function (done) {
    springCm.getDocument('cfb8cfa2-3959-e811-9c12-3ca82a1e3f41', (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;
      springCm.csvLookup(doc, {
        'customer_id': 1
      }, (err, rows) => {
        expect(err).to.not.exist;
        expect(rows).to.exist;
        expect(rows).to.be.an('array');
        done();
      });
    });
  });
});
