const assert = require('assert');

// In case it isn't called earlier
require('dotenv').config();

// Require this be properly defined so we generate correct hostnames
assert(process.env.SPRINGCM_ENVIRONMENT, 'SPRINGCM_ENVIRONMENT not defined');
assert(process.env.SPRINGCM_ENVIRONMENT === 'UAT' || process.env.SPRINGCM_ENVIRONMENT === 'Production', 'Invalid SPRINGCM_ENVIRONMENT definition');

var env = process.env.SPRINGCM_ENVIRONMENT === 'UAT' ? 'uat' : '';
var dataCenter = process.env.SPRINGCM_DATACENTER.toLowerCase();

module.exports = {
	object: `https://api${env}${dataCenter}.springcm.com/api/v201411`,
	auth: `https://auth${env}.springcm.com/api/v201606`,
	download: `https://apidownload${env}${dataCenter}.springcm.com/v201411`,
	upload: `https://apiupload${env}${dataCenter}.springcm.com/v201411`
};
