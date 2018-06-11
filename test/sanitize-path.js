const { describe, it } = require('mocha');
const { expect } = require('chai');
const sanitizePath = require('../lib/sanitize-path');

describe('sanitize-path', function () {
  it('returns null on null paths', function (done) {
    expect(sanitizePath(null)).to.equal(null);
    done();
  });

  it('returns correct document paths', function (done) {
    expect(sanitizePath('/Account/Folder/Document.pdf')).to.equal('/Folder/Document.pdf');
    done();
  });

  it('returns correct folder paths', function (done) {
    expect(sanitizePath('/Account/Folder/')).to.equal('/Folder');
    expect(sanitizePath('/Account/Folder/Subfolder')).to.equal('/Folder/Subfolder');
    done();
  });
});
