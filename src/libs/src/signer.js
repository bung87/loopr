const abi = require('ethereumjs-abi');
const _ = require('lodash');
const ethUtil = require('ethereumjs-util');

exports.solSHA3 = function (types, data) {
    const hash = abi.soliditySHA3(types, data);
    return hash;
};