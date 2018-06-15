const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('get-folder', function () {
  var springCm;

  this.timeout(15000);

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

  it('create top-level folder, delete by path', function (done) {
    springCm.createFolder('/Top Level 1', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      expect(folder.getPath()).to.equal('/Top Level 1');
      springCm.deleteFolder('/Top Level 1', (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('create top-level folder, delete by UID', function (done) {
    springCm.createFolder('/Top Level 2', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      expect(folder.getPath()).to.equal('/Top Level 2');
      springCm.deleteFolder(folder.getUid(), (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('create top-level folder, delete by ref', function (done) {
    springCm.createFolder('/Top Level 3', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      expect(folder.getPath()).to.equal('/Top Level 3');
      springCm.deleteFolder(folder, (err) => {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('create multi-level folder, delete by path', function (done) {
    springCm.createFolder('/Top Level 4/Mid Level', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      expect(folder.getPath()).to.equal('/Top Level 4/Mid Level');
      springCm.deleteFolder('/Top Level 4/Mid Level', (err) => {
        expect(err).to.not.exist;
        springCm.getFolder('/Top Level 4', (err, folder) => {
          expect(err).to.not.exist;
          expect(folder).to.exist;
          expect(folder.getPath()).to.equal('/Top Level 4');
          springCm.deleteFolder('/Top Level 4', (err) => {
            expect(err).to.not.exist;
            done();
          });
        });
      });
    });
  });

  it('create multi-level folder, delete by UID', function (done) {
    springCm.createFolder('/Top Level 5/Mid Level', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      expect(folder.getPath()).to.equal('/Top Level 5/Mid Level');
      springCm.deleteFolder(folder.getUid(), (err) => {
        expect(err).to.not.exist;
        springCm.getFolder('/Top Level 5', (err, folder) => {
          expect(err).to.not.exist;
          expect(folder).to.exist;
          expect(folder.getPath()).to.equal('/Top Level 5');
          springCm.deleteFolder('/Top Level 5', (err) => {
            expect(err).to.not.exist;
            done();
          });
        });
      });
    });
  });

  it('create multi-level folder, delete by ref', function (done) {
    springCm.createFolder('/Top Level 6/Mid Level', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      expect(folder.getPath()).to.equal('/Top Level 6/Mid Level');
      springCm.deleteFolder(folder, (err) => {
        expect(err).to.not.exist;
        springCm.getFolder('/Top Level 6', (err, folder) => {
          expect(err).to.not.exist;
          expect(folder).to.exist;
          expect(folder.getPath()).to.equal('/Top Level 6');
          springCm.deleteFolder('/Top Level 6', (err) => {
            expect(err).to.not.exist;
            done();
          });
        });
      });
    });
  });

  it('create multi-level folder, delete parent by path', function (done) {
    springCm.createFolder('/Top Level 7/Mid Level', (err, folder) => {
      expect(err).to.not.exist;
      expect(folder).to.exist;
      expect(folder.getPath()).to.equal('/Top Level 7/Mid Level');
      springCm.deleteFolder('/Top Level 7', (err) => {
        expect(err).to.not.exist;
        springCm.getFolder('/Top Level 7/Mid Level', (err, folder) => {
          expect(err).to.exist;
          expect(folder).to.not.exist;
          done();
        });
      });
    });
  });
});
