const fs = require('fs');
const SpringCM = require('../index');

SpringCM.auth.uatna11(process.env.SPRINGCM_CLIENT_ID, process.env.SPRINGCM_CLIENT_SECRET, (err, token) => {
	if (err) {
		return console.log('Auth error: ', err);
	}

	SpringCM.document.path('/SFTP Downloads/Test.pdf', (err, doc) => {
		if (err) {
			return console.log('Get by path error: ', err);
		}

		SpringCM.document.download(doc, fs.createWriteStream('./Test.pdf'), (err, callback) => {
			if (err) {
				return console.log('Download error: ', err);
			}

			console.log('Downloaded');
		});
	});
});
