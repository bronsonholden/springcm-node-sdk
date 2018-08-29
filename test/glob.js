//const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('glob', function () {
  var springCm, root;

  // Plenty of time for exhaustive search globs
  this.timeout(300000);

  before(function (done) {
    springCm = new SpringCM(env);
    springCm.connect((err) => {
      expect(err).to.not.exist;
      springCm.getFolder('/', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        root = folder;
        done();
      });
    });
  });

  after(function (done) {
    springCm.close(done);
  });

  it('glob subfolders', function (done) {
    springCm.glob('/Import SpringCM/*', (err, results) => {
      expect(err).to.not.exist;
      expect(results).to.be.an('object');
      done();
    });
  });

  it('glob exact', function (done) {
    springCm.glob('/Import SpringCM/Recurse', (err, results) => {
      expect(err).to.not.exist;
      expect(results).to.be.an('object');
      done();
    });
  });

  it('glob top level', function (done) {
    springCm.glob('/Import */*', {
      includeDocuments: true
    }, (err, results) => {
      expect(err).to.not.exist;
      expect(results).to.be.an('object');
      done();
    });
  });

  it('glob any parent (documents)', function (done) {
    springCm.glob('**/*.pdf', {
      includeDocuments: true
    }, (err, results) => {
      expect(err).to.not.exist;
      expect(results).to.be.an('object');
      done();
    });
  });

  it('glob any parent', function (done) {
    springCm.glob('**/Sub 2', (err, results) => {
      expect(err).to.not.exist;
      expect(results).to.be.an('object');
      done();
    });
  });
});
