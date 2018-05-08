const { describe, it, before, after } = require('mocha');
const moment = require('moment');
const chai = require('chai');
const expect = chai.expect;
const SpringCM = require('../');
const env = require('./env');

chai.use(require('chai-moment'));
chai.use(require('chai-url'));

describe('springcm-folder', function () {
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

  describe('folder access', function () {
    var root;

    before(function (done) {
      springCm.getFolder('/', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        root = folder;
        done();
      });
    });

    it('has root folder full access', function (done) {
      expect(root.canSee()).to.be.true;
      expect(root.canRead()).to.be.true;
      expect(root.canWrite()).to.be.true;
      expect(root.canMove()).to.be.true;
      expect(root.canSetAccess()).to.be.true;
      done();
    });
  });

  describe('folder created/updated date', function () {
    var root;

    before(function (done) {
      springCm.getFolder('/', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        root = folder;
        done();
      });
    });

    it('has create date', function (done) {
      expect(root.getCreateDate()).to.be.beforeMoment(moment());
      done();
    });

    it('has update date', function (done) {
      expect(root.getUpdateDate()).to.be.beforeMoment(moment());
      done();
    });
  });

  describe('folder created/updated user', function () {
    var root;

    before(function (done) {
      springCm.getFolder('/', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        root = folder;
        done();
      });
    });

    it('has created user', function (done) {
      expect(root.getCreateUser()).to.be.a('string');
      done();
    });

    it('has updated user', function (done) {
      expect(root.getUpdateUser()).to.be.a('string');
      done();
    });
  });

  describe('folder links and URLs', function (done) {
    var root;

    before(function (done) {
      springCm.getFolder('/', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        root = folder;
        done();
      });
    });

    it('valid share link', function (done) {
      const shareLink = root.getShareLink();
      expect(shareLink).to.have.protocol('https');
      expect(shareLink).to.contain.path(`/${root.getUid()}`);
      expect(shareLink).to.contain.hostname('springcm.com');
      done();
    });

    it('valid documents URL', function (done) {
      const documentsUrl = root.getDocumentsUrl();
      expect(documentsUrl).to.have.protocol('https');
      expect(documentsUrl).to.contain.hostname('springcm.com');
      done();
    });

    it('valid folders URL', function (done) {
      const foldersUrl = root.getSubfoldersUrl();
      expect(foldersUrl).to.have.protocol('https');
      expect(foldersUrl).to.contain.hostname('springcm.com');
      done();
    });

    it('valid upload URL', function (done) {
      const uploadUrl = root.getUploadUrl();
      expect(uploadUrl).to.have.protocol('https');
      expect(uploadUrl).to.contain.hostname('springcm.com');
      done();
    });
  });

  describe('folder properties', function (done) {
    var root;

    before(function (done) {
      springCm.getFolder('/', (err, folder) => {
        expect(err).to.not.exist;
        expect(folder).to.exist;
        root = folder;
        done();
      });
    });

    it('folder name', function (done) {
      expect(root.getName()).to.be.a('string');
      done();
    });

    it('folder description', function (done) {
      expect(root.getDescription()).to.be.a('string');
      done();
    });
  });
});
