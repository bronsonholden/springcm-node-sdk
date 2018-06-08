const path = require('path');

module.exports = (str) => {
  if (!str) {
    return str;
  } else {
    // This removes the first folder (which is the SpringCM account name)
    return path.posix.join.apply(null, [ '/' ].concat(str.slice(1).split('/').slice(1)));
  }
};
