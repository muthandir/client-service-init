const uuid = require('uuid/v4');
/* jshint esversion: 6 */
module.exports = (config) => {
  return ({ requestId = uuid(), organizationId, channel = 'batch' } = {}) => {
    const serviceInit = { requestId, channel, currentClient: { organizationId } };

    serviceInit.clientKey = config.clientKey;
    serviceInit.clientSecret = config.clientSecret;

    // even though this seems redundant, it makes it easy for serialization (like SQS json message. )
    // this organizationId info is used when a worker deserialize a message from json
    // in that case a worker knows the organization id and passes it to this package so it is properly set to the currentClient
    // (which is used in the packages like model factories)
    serviceInit.organizationId = organizationId;

    // this is for all other packages to get the organization Id.
    // in the client auth case it is fairly easy to get the org id,
    // but in the case of cross or auth, things get complicated.
    // this method makes it easy for all other packages.
    serviceInit.getOrganizationId = () => serviceInit.currentClient.organizationId;

    return serviceInit;
  };
};
