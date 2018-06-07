const fs = require('fs');
const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('delete-document', function () {
  var springCm, root;

  this.timeout(20000);

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

  describe('reject invalid documents', function () {
    it('null', function (done) {
      springCm.deleteDocument(null, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('number', function (done) {
      springCm.deleteDocument(12345, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('boolean', function (done) {
      springCm.deleteDocument(true, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });

    it('function', function (done) {
      springCm.deleteDocument(() => true, (err) => {
        expect(err).to.be.an('error');
        done();
      });
    });
  });

  it('delete document by path', function (done) {
    springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
      name: 'Test Delete 1.pdf',
      fileType: 'pdf'
    }, (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;
      springCm.deleteDocument('/Test Delete 1.pdf', (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('delete document by uid', function (done) {
    springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
      name: 'Test Delete 2.pdf',
      fileType: 'pdf'
    }, (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;
      springCm.deleteDocument(doc.getUid(), (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('delete document by reference', function (done) {
    springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
      name: 'Test Delete 3.pdf',
      fileType: 'pdf'
    }, (err, doc) => {
      expect(err).to.not.exist;
      expect(doc).to.exist;
      springCm.deleteDocument(doc, (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });
});
