const { describe, it, before, after } = require('mocha');
const moment = require('moment');
const chai = require('chai');
const expect = chai.expect;
const SpringCM = require('../');
const env = require('./env');

chai.use(require('chai-moment'));
chai.use(require('chai-url'));

describe('springcm-document', function () {
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

  describe('document access', function () {
    var doc;

    before(function (done) {
      springCm.getDocument('/Test.pdf', (err, d) => {
        expect(err).to.not.exist;
        expect(d).to.exist;
        doc = d;
        done();
      });
    });

    // Test document in root directory on super admin REST API account for testing
    it('has document full access', function (done) {
      expect(doc.canSee()).to.be.true;
      expect(doc.canRead()).to.be.true;
      expect(doc.canWrite()).to.be.true;
      expect(doc.canMove()).to.be.true;
      expect(doc.canSetAccess()).to.be.true;
      done();
    });
  });

  describe('document created/updated date', function () {
    var doc;

    before(function (done) {
      springCm.getDocument('/Test.pdf', (err, d) => {
        expect(err).to.not.exist;
        expect(d).to.exist;
        doc = d;
        done();
      });
    });

    it('has create date', function (done) {
      expect(doc.getCreateDate()).to.be.beforeMoment(moment());
      done();
    });

    it('has update date', function (done) {
      expect(doc.getUpdateDate()).to.be.beforeMoment(moment());
      done();
    });
  });

  describe('document created/updated user', function () {
    var doc;

    before(function (done) {
      springCm.getDocument('/Test.pdf', (err, d) => {
        expect(err).to.not.exist;
        expect(d).to.exist;
        doc = d;
        done();
      });
    });

    it('has created user', function (done) {
      expect(doc.getCreateUser()).to.be.a('string');
      done();
    });

    it('has updated user', function (done) {
      expect(doc.getUpdateUser()).to.be.a('string');
      done();
    });
  });

  describe('document path', function () {
    var doc;

    before(function (done) {
      springCm.getDocument('/Test.pdf', (err, d) => {
        expect(err).to.not.exist;
        expect(d).to.exist;
        doc = d;
        done();
      });
    });

    it('has document path', function (done) {
      expect(doc.getPath()).to.be.a('string');
      expect(doc.getPath()).to.equal('/Paul Holden UAT/Test.pdf');
      done();
    });
  });

  describe('document parent folder', function () {
    var doc;

    before(function (done) {
      springCm.getDocument('/Test.pdf', (err, d) => {
        expect(err).to.not.exist;
        expect(d).to.exist;
        doc = d;
        done();
      });
    });

    it('has parent folder', function (done) {
      const folder = doc.getParentFolder();
      expect(folder).to.be.an('object');
      expect(folder.getPath()).to.equal('/Paul Holden UAT');
      done();
    });
  });

  describe('document properties', function (done) {
    var doc;

    before(function (done) {
      springCm.getDocument('/Test.pdf', (err, d) => {
        expect(err).to.not.exist;
        expect(d).to.exist;
        doc = d;
        done();
      });
    });

    it('document name', function (done) {
      expect(doc.getName()).to.be.a('string');
      done();
    });

    it('document description', function (done) {
      expect(doc.getDescription()).to.be.a('string');
      done();
    });
  });
});
