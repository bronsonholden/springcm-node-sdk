# SpringCM Node.js REST API SDK

[![NPM](https://nodei.co/npm/springcm-node-sdk.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/springcm-node-sdk/)

[![Build Status](https://travis-ci.org/paulholden2/springcm-node-sdk.svg?branch=master)](https://travis-ci.org/paulholden2/springcm-node-sdk) [![Coverage Status](https://coveralls.io/repos/github/paulholden2/springcm-node-sdk/badge.svg?branch=master)](https://coveralls.io/github/paulholden2/springcm-node-sdk?branch=master) [![dependencies Status](https://david-dm.org/paulholden2/springcm-node-sdk/status.svg)](https://david-dm.org/paulholden2/springcm-node-sdk) [![devDependencies Status](https://david-dm.org/paulholden2/springcm-node-sdk/dev-status.svg)](https://david-dm.org/paulholden2/springcm-node-sdk?type=dev)

This SDK currently provides a limited feature set, as it was created and is developed primarily for internal IT work at Stria.

Accessing the REST API requires you create an API user in your SpringCM account and assign a client ID to that user in the REST API section of Account Preferences. Once set, you can use the API by providing the client ID and corresponding secret. The client ID and client secret are provided by SpringCM's support staff on request. For more information, visit [this webpage](https://developer.springcm.com/guides/rest-api-authentication).

# Examples

Below are a few usage examples. Be sure to check the tests folder for more
examples.

## SpringCM Client

#### Connect

Before you can interact with your SpringCM account, you need to connect via
the SpringCM client.

```js
const SpringCM = require('springcm-node-sdk');

// Create a new client
var springCm = new SpringCM({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  dataCenter: 'uatna11' // na11, na21, etc.
});

springCm.connect((err) => {
  // You are now connected
});
```

#### Disconnect

Once you are done using the SpringCM client, you should close the connection,
especially if your program is going to close immediately. Closing the
connection ensures all queued requests and operations are completed.

Comments shown below are only applicable when execution reaches that line,
i.e. comment \#3 occurs after \#2.

```js
// 1) Queue up 10 requests then immediately call close()
springCm.close(() => {
  // 3) All requests are complete. You can exit the program safely.
});

// 2) Requests can no longer be submitted. Most operations will return an error.
```

## Folders

#### Root folder

```js
springCm.getRootFolder((err, root) => {
  // root represents the top level folder of your account
});
```

#### Subfolders

```js
springCm.getRootFolder((err, root) => {
  springCm.getSubfolders(root, (err, folders) => {
    // folders is an array of all folders under the top level /
    // e.g. Trash and Other Sources
  });
});
```

#### Get folder by path

```js
springCm.getFolder('/HR/Employee Files', (err, folder) => {
  // folder is an object referencing the /HR/Employee Files/ folder in SpringCM
});
```

#### Get folder by UID

If you'll know the UID of a folder beforehand, you can reference it by this
UID.

```js
springCm.getFolder('758afbfa-1f18-e812-9d16-3ca24a1e3f40', (err, folder) => {
  // folder is an object referencing the folder with the above UID
});
```

#### Subfolder pages

If you have a folder with a large number of subfolders, you may want to
use paging. To do so, pass an options object as the second argument instead
of the callback.

```js
springCm.getSubfolders(parent, {
  offset: 0,
  limit: 20
}, (err, folders) => {
  // folders is an array of the first (no more than) 20 subfolders
});
```

#### Create a folder

You can create a new folder, or retrieve an existing folder by setting the
`exclusive` option. By default, all folder creation is exclusive, meaning
the operation will fail if the folder already exists. Note that this only
applies to the base folder, i.e. creating `/Contracts/ACME, Inc` with
`exclusive` set to `true` will succeed even if `/Contracts` already exists.

```js
// Creates only if the folder doesn't exist by default
springCm.createFolder('/Contracts/PseudoTech, LLC', (err, folder) => {
  // ...
});

// Get the folder if it already exists
springCm.createFolder('/Contracts/ACME, Inc', { exclusive: false }, (err, folder) => {
  // ...
});
```

#### Upload document to a folder

```js
springCm.getFolder('/Deliveries/Contracts', (err, folder) => {
  springCm.uploadDocument(folder, fs.createReadStream('ACME, Inc 2018.pdf'), (err, doc) => {
    // ...
  });
});
```

## Documents

#### Get document by path

```js
springCm.getDocument('/Contracts/ACME, Inc 01-01-2010.pdf', (err, doc) => {
  // doc is an object representing the contract document
});
```

#### Get document by UID

```js
springCm.getDocument('127bd4e1-368e-1878-9651-ed101cabfdff', (err, doc) => {
  // doc is an object representing the referenced document
});
```

#### Download document

```js
springCm.downloadDocument('127bd4e1-368e-1878-9651-ed101cabfdff', fs.createWriteStream('./Downloaded.pdf'), (err) => {
  // You can also download by path
});

// or

springCm.getDocument('/Contracts/ACME, Inc - Signed.pdf', (err, doc) => {
  springCm.downloadDocument(doc, fs.createWriteStream('./Signed.pdf'), (err) => {
    // ...
  });
});
```

#### Delete document

```js
springCm.deleteDocument('/Contracts/ACME, Inc - Old.pdf', (err) => {
  // doc is now in the Trash folder
});
```

#### Move document

You can reference the source document and target folder by path, UID, or
with an existing object of the corresponding type, e.g.

```js
springCm.moveDocument('/Contracts/ACME, Inc.pdf', '/New Contracts/ACME, Inc/', (err) => {
  // ...
});

springCm.moveDocument('96803885-47f6-4361-9747-1d5962b3b7a4', '/Board Minutes', (err) => {
  // ...
});

springCm.getDocument('96803885-47f6-4361-9747-1d5962b3b7a4', (err, doc) => {
  springCm.moveDocument(doc, '/Trash', (err) => {
    // ...
  });
});
```

#### Query CSV data

```js
springCm.csvLookup('/Admin/Customer Data.csv', {
  'Customer Name': 'ACME, Inc.'
}, (err, rows) => {
  // ...
});
```
