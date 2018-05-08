const fs = require('fs');
const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('move-document', function () {
  var springCm, root, trash;

  this.timeout(10000);

  before(function (done) {
    springCm = new SpringCM(env);
    springCm.connect((err) => {
      expect(err).to.not.exist;
      springCm.getFolder('/', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        root = folder;
        springCm.getFolder('/Trash', (err, folder) => {
          expect(err).to.not.exist;
          expect(folder).to.exist;
          trash = folder;
          done();
        });
      });
    });
  });

  after(function (done) {
    springCm.close(done);
  });

  describe('move document by path', function (d) {
    it('to folder by path', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 1.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument('/Test Move 1.pdf', '/Trash', (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('to folder by UID', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 2.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument('/Test Move 2.pdf', trash.getUid(), (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('to folder by reference', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 3.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument('/Test Move 3.pdf', trash, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  describe('move document by UID', function () {
    it('to folder by path', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 4.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument(doc.getUid(), '/Trash', (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('to folder by UID', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 5.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument(doc.getUid(), trash.getUid(), (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('to folder by reference', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 6.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument(doc.getUid(), trash, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  describe('move document by reference', function () {
    it('to folder by path', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 7.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument(doc, '/Trash', (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('to folder by UID', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 8.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument(doc, trash.getUid(), (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('to folder by reference', function (done) {
      springCm.uploadDocument(root, fs.createReadStream('./test/Test.pdf'), {
        name: 'Test Move 9.pdf',
        fileType: 'pdf'
      }, (err, doc) => {
        expect(err).to.not.exist;
        expect(doc).to.exist;
        springCm.moveDocument(doc, trash, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });
});
