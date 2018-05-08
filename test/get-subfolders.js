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

  it('get all subfolders', function (done) {
    springCm.getSubfolders(root, (err, folders) => {
      expect(err).to.not.exist;
      expect(folders).to.be.an('array');
      done();
    });
  });

  it('get paged subfolders', function (done) {
    springCm.getSubfolders(root, {
      offset: 0,
      limit: 3
    }, (err, folders) => {
      expect(err).to.not.exist;
      expect(folders).to.be.an('array');
      done();
    });
  });

  it('get subfolders (explicit limit)', function (done) {
    springCm.getSubfolders(root, {
      limit: 3
    }, (err, folders) => {
      expect(err).to.not.exist;
      expect(folders).to.be.an('array');
      done();
    });
  });
});
