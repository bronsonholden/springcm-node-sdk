require('dotenv').config();

const fs = require('fs');
const async = require('async');
const SpringCM = require('./index');

async.waterfall([
	(callback) => {
		SpringCM.auth.uatna11(process.env.SPRINGCM_CLIENT_ID, process.env.SPRINGCM_CLIENT_SECRET, (err, token) => {
			if (err) {
				return callback(err);
			}

			callback();
		});
	},
	(callback) => {
		SpringCM.document.path('/SFTP Downloads/Test.txt', (err, doc) => {
			if (err) {
				return callback(err);
			}

			callback(null, doc);
		});
	},
	(doc, callback) => {
		SpringCM.document.checkout(doc, (err, href) => {
			if (err) {
				return callback(err);
			}

			callback(null, href);
		});
	},
	(href, callback) => {
		console.log(href);
		SpringCM.document.checkin(href, fs.createReadStream('./test.txt'), (err) => {
			if (err) {
				return callback(err);
			}

			callback();
		});
	}
], (err) => {
	if (err) {
		console.log(err);
	}
});
