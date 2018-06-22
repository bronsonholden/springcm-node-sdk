const async = require('async');
const moment = require('moment');
const _ = require('lodash');

function SpringCM(options) {
  var self = this;

  self.closing = false;
  self.dataCenter = options.dataCenter;
  self.clientId = options.clientId;
  self.clientSecret = options.clientSecret;
  self.authToken = null;
  self.expires = null;

  var queue = async.priorityQueue((task, callback) => {
    if (task.request) {
      return self.sendRequest(task.request, task.options, (err, res, data) => {
        if (err) {
          return callback(err);
        }

        // Rate limiting
        if (_.get(data, 'Error.ErrorCode') === 103) {
          var msec;

          if (_.get(data, 'spoofRateLimit')) {
            msec = 1000;
          } else {
            var reset = _.get(res, [ 'headers', 'x-ratelimit-reset' ]);
            var unlocks = moment.utc(reset, 'ddd, DD MMM YYYY HH:mm:ss z').tz('America/Los_Angeles');
            var now = moment().utc();

            msec = unlocks.diff(now) + 1000;
          }

          this.queue.push({
            idle: msec
          }, 0, () => {
            this.enqueueRequest(task.request, task.options, 1, task.callback);
          });

          return callback();
        }

        return callback(null, data);
      });
    } else if (task.idle) {
      return setTimeout(callback, task.idle);
    }
  });

  self.queue = queue;
}

SpringCM.prototype.getAuthUrl = require('./get-auth-url');
SpringCM.prototype.getBaseUrl = require('./get-base-url');
SpringCM.prototype.getDownloadUrl = require('./get-download-url');
SpringCM.prototype.getUploadUrl = require('./get-upload-url');
SpringCM.prototype.connect = require('./connect');
SpringCM.prototype.close = require('./close');
SpringCM.prototype.enqueueRequest = require('./enqueue-request');
SpringCM.prototype.sendRequest = require('./send-request');
SpringCM.prototype.getRootFolder = require('./get-root-folder');
SpringCM.prototype.getFolder = require('./get-folder');
SpringCM.prototype.createFolder = require('./create-folder');
SpringCM.prototype.deleteFolder = require('./delete-folder');
SpringCM.prototype.getSubfolders = require('./get-subfolders');
SpringCM.prototype.uploadDocument = require('./upload-document');
SpringCM.prototype.downloadDocument = require('./download-document');
SpringCM.prototype.getDocument = require('./get-document');
SpringCM.prototype.getDocuments = require('./get-documents');
SpringCM.prototype.deleteDocument = require('./delete-document');
SpringCM.prototype.moveDocument = require('./move-document');
SpringCM.prototype.setDocumentAttributes = require('./set-document-attributes');
SpringCM.prototype.updateDocumentAttributes = require('./update-document-attributes');
SpringCM.prototype.csvLookup = require('./csv-lookup');

module.exports = SpringCM;
