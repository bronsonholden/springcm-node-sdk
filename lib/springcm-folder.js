const moment = require('moment');
const _ = require('lodash');

function SpringCMFolder(obj) {
  this.obj = obj;
}

SpringCMFolder.prototype.getName = function () {
  return _.get(this.obj, 'Name');
};

SpringCMFolder.prototype.getPath = function () {
  return _.get(this.obj, 'Path');
};

SpringCMFolder.prototype.getUid = function () {
  var href = _.get(this.obj, 'Href');

  if (href && href.match(/^https:\/\/api(uat){0,1}na\d{2}\.springcm\.com\/v201411\/folders\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
    return href.slice(-36);
  }
};

SpringCMFolder.prototype.getCreateDate = function () {
  return moment(_.get(this.obj, 'CreatedDate'));
};

SpringCMFolder.prototype.getCreateUser = function () {
  return _.get(this.obj, 'CreatedBy');
};

SpringCMFolder.prototype.getUpdateDate = function () {
  return moment(_.get(this.obj, 'UpdatedDate'));
};

SpringCMFolder.prototype.getUpdateUser = function () {
  return _.get(this.obj, 'UpdatedBy');
};

SpringCMFolder.prototype.getDescription = function () {
  return _.get(this.obj, 'Description');
};

SpringCMFolder.prototype.getShareLink = function () {
  return _.get(this.obj, 'BrowseDocumentsUrl');
};

SpringCMFolder.prototype.canSee = function () {
  return _.get(this.obj, 'AccessLevel.See');
};

SpringCMFolder.prototype.canRead = function () {
  return _.get(this.obj, 'AccessLevel.Read');
};

SpringCMFolder.prototype.canWrite = function () {
  return _.get(this.obj, 'AccessLevel.Write');
};

SpringCMFolder.prototype.canMove = function () {
  return _.get(this.obj, 'AccessLevel.Move');
};

SpringCMFolder.prototype.canSetAccess = function () {
  return _.get(this.obj, 'AccessLevel.SetAccess');
};

SpringCMFolder.prototype.getDocumentsUrl = function () {
  return _.get(this.obj, 'Documents.Href');
};

SpringCMFolder.prototype.getSubfoldersUrl = function () {
  return _.get(this.obj, 'Folders.Href');
};

SpringCMFolder.prototype.getUploadUrl = function () {
  var str = _.get(this.obj, 'CreateDocumentHref');

  if (str) {
    return str.replace('{?name}', '');
  } else {
    return str;
  }
};

SpringCMFolder.prototype.getIdentityUrl = function () {
  return _.get(this.obj, 'Href');
};

module.exports = SpringCMFolder;
