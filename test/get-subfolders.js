const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('get-subfolders', function () {
  var springCm, root;

  this.timeout(10000);

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

  it('get subfolders', function (done) {
    springCm.getSubfolders(root, (err, folders) => {
      expect(err).to.not.exist;
      expect(folders).to.be.an('array');
      done();
    });
  });
});
