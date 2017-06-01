SpringCM Node.js REST API SDK
=============================

[![Build Status](https://travis-ci.org/paulholden2/springcm-nodejs-sdk.svg?branch=master)](https://travis-ci.org/paulholden2/springcm-nodejs-sdk) [![Coverage Status](https://coveralls.io/repos/github/paulholden2/springcm-nodejs-sdk/badge.svg?branch=master)](https://coveralls.io/github/paulholden2/springcm-nodejs-sdk?branch=master)

This SDK currently provides a limited feature set, as it was created and is developed primarily for internal IT work at Stria.

To use this SDK, you must create a `.env` file in the root of your project taht defines some environment variables used to access SpringCM. Alternatively, you can simply define these when running your application, like so:

```
SPRINGCM_CLIENT_ID=abcdefg-hijklm npm start
```

Note: All of the following variables are *required*.

| Variable | Description |
|----------|-------------|
| SPRINGCM_ENVIRONMENT | The SpringCM environment to access. Must be `UAT` or `Production`. |
| SPRINGCM_DATACENTER | The SpringCM data center to access. Typically this is `NA11`. |
| SPRINGCM_CLIENT_ID | The SpringCM client ID (provided by support staff) for your API user. |
| SPRINGCM_CLIENT_SECRET | The SpringCM client secret (provided by support staff) for your API user. |

Should you opt to use a `.env` file, please do **not** share or publish it in **any way**. This file obviously contains sensitive information regarding your SpringCM account, and should be manually created and never stored in source control or similar shared media. Create it to provide your application access to SpringCM, and destroy it when it is no longer needed.

Accessing the REST API requires you create an API user in your SpringCM account and assign a client ID to that user in the REST API section of Account Preferences. Once set, you can use the API by providing the client ID and corresponding secret. The client ID and client secret are provided by SpringCM's support staff on request. For more information, visit [this webpage](https://developer.springcm.com/guides/rest-api-authentication).
