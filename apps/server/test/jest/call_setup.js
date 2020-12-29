require('ts-node/register');

const { setup } = require('./jest.setup');

module.exports = async function () {
  await setup();
};
