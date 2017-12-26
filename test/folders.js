const fs = require('fs');
const SpringCM = require('../index');

SpringCM.auth.login(process.env.SPRINGCM_DATACENTER, process.env.SPRINGCM_CLIENT_ID, process.env.SPRINGCM_CLIENT_SECRET, (err, token) => {
	if (err) {
		return console.log('Auth error: ', err);
	}

	SpringCM.folder.root((err, folder) => {
		if (err) {
			return console.log(err);
		}

		SpringCM.folder.documents(folder, (err, documents) => {
			if (err) {
				return console.log(err);
			}

			SpringCM.document.uid(documents[0].href.self.slice(-36), (err, doc) => {
				console.log(doc);
			});
		});
	});
});
