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

  describe('file naming', function () {
    it('default name', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.pdf'), (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('specified name', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
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

  describe('PDF', function () {
    it('application/pdf', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.pdf'), {
          name: 'Test.pdf',
          fileType: 'pdf'
        }, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('application/octet-stream', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
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

  describe('CSV', function () {
    it('text/csv', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.csv'), {
          name: 'Test.csv',
          fileType: 'csv'
        }, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('application/octet-stream', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.csv'), {
          name: 'Test.csv'
        }, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  describe('TXT', function () {
    it('text/plain', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.txt'), {
          name: 'Test.txt',
          fileType: 'txt'
        }, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('application/octet-stream', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.txt'), {
          name: 'Test.txt'
        }, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  describe('DOCX', function () {
    it('application/octet-stream', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.docx'), {
          name: 'Test.docx'
        }, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('application/octet-stream', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.txt'), {
          name: 'Test.txt'
        }, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });

  describe('TIFF', function () {
    it('application/octet-stream', function (done) {
      springCm.getFolder('/Trash', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        springCm.uploadDocument(folder, fs.createReadStream('./test/Test.tiff'), {
          name: 'Test.tiff'
        }, (err) => {
          expect(err).to.not.exist;
          done();
        });
      });
    });
  });
});
