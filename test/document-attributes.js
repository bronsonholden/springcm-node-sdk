const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const SpringCM = require('../');
const env = require('./env');

describe('set-document-attributes & update-document-attributes', function () {
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

  it('set document attributes by path', function (done) {
    springCm.setDocumentAttributes('/Test.pdf', {
      'Attribute Group': {
        'Attribute Field': {
          'Value': 'Test Attribute Value'
        }
      }
    }, (err) => {
      expect(err).to.not.exist;
      done();
    });
  });

  it('set document attributes by path', function (done) {
    springCm.setDocumentAttributes('/Test.pdf', {
      'Attribute Group': {
        'Attribute Field 2': {
          'Value': 'Test Attribute Value'
        }
      }
    }, (err) => {
      expect(err).to.not.exist;
      done();
    });
  });
});
