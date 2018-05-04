module.exports = function () {
  if (typeof this.dataCenter !== 'string') {
    return null;
  }

  return `https://auth${this.dataCenter.indexOf('uat') > -1 ? 'uat' : ''}.springcm.com/api/v201606`;
};
