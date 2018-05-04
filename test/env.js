const dotenv = require('dotenv');

dotenv.config({
  path: './.env'
});

module.exports = {
  dataCenter: process.env.SPRINGCM_DATACENTER,
  clientId: process.env.SPRINGCM_CLIENT_ID,
  clientSecret: process.env.SPRINGCM_CLIENT_SECRET
};
