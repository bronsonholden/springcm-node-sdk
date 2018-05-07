const fs = require('fs');
//const { describe, it, before, after } = require('mocha');
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

  it('upload test PDF (default name)', function (done) {
    springCm.getFolder('/SFTP Uploads', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      springCm.uploadDocument(folder, fs.createReadStream('./test/Test.pdf'), (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('upload test PDF (specify name)', function (done) {
    springCm.getFolder('/SFTP Uploads', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      springCm.uploadDocument(folder, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test.pdf'
      }, (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });
});
