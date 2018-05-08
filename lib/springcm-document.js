const moment = require('moment');
const _ = require('lodash');
const SpringCMFolder = require('./springcm-folder');

function SpringCMDocument(obj) {
  this.obj = obj;
}

SpringCMDocument.prototype.getName = function () {
  return _.get(this.obj, 'Name');
};

SpringCMDocument.prototype.getPath = function () {
  return _.get(this.obj, 'Path');
};

SpringCMDocument.prototype.getUid = function () {
  var href = _.get(this.obj, 'Href');

  if (href && href.match(/^https:\/\/api(uat){0,1}na\d{2}\.springcm\.com\/v201411\/documents\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    return href.slice(-36);
  }

  return null;
};

SpringCMDocument.prototype.getCreateDate = function () {
  return moment(_.get(this.obj, 'CreatedDate'));
};

SpringCMDocument.prototype.getCreateUser = function () {
  return _.get(this.obj, 'CreatedBy');
};

SpringCMDocument.prototype.getUpdateDate = function () {
  return moment(_.get(this.obj, 'UpdatedDate'));
};

SpringCMDocument.prototype.getUpdateUser = function () {
  return _.get(this.obj, 'UpdatedBy');
};

SpringCMDocument.prototype.getDescription = function () {
  return _.get(this.obj, 'Description');
};

SpringCMDocument.prototype.getParentFolder = function () {
  return new SpringCMFolder(_.get(this.obj, 'ParentFolder'));
};

SpringCMDocument.prototype.canSee = function () {
  return _.get(this.obj, 'AccessLevel.See');
};

SpringCMDocument.prototype.canRead = function () {
  return _.get(this.obj, 'AccessLevel.Read');
};

SpringCMDocument.prototype.canWrite = function () {
  return _.get(this.obj, 'AccessLevel.Write');
};

SpringCMDocument.prototype.canMove = function () {
  return _.get(this.obj, 'AccessLevel.Move');
};

SpringCMDocument.prototype.canSetAccess = function () {
  return _.get(this.obj, 'AccessLevel.SetAccess');
};

SpringCMDocument.prototype.getPageCount = function () {
  return _.get(this.obj, 'PageCount');
};

SpringCMDocument.prototype.getIdentityUrl = function () {
  return _.get(this.obj, 'Href');
};

module.exports = SpringCMDocument;
