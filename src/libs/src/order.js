const signer = require('./signer.js');
const ethUtil = require('ethereumjs-util');
const _ = require('lodash');
const hexUtil = require('./hex-utils.js');
const BN = require('bn.js');

function Order(data) {

    var protocol = data.protocol;
    var owner = data.owner;
    var tokenS = data.tokenS;
    var tokenB = data.tokenB;
    var amountS = data.amountS;
    var amountB = data.amountB;
    var timestamp = data.timestamp;
    var ttl = data.ttl;
    var salt = data.salt;
    var lrcFee = data.lrcFee;
    var buyNoMoreThanAmountB = data.buyNoMoreThanAmountB;
    var marginSplitPercentage = data.marginSplitPercentage;


    const orderTypes = ['address', 'address', 'address', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'uint', 'bool', 'uint8'];

    this.sign = function (privateKey) {
        const hash = signer.solSHA3(orderTypes, [protocol, owner, tokenS, tokenB,
            new BN(Number(amountS).toString(10), 10),
            new BN(Number(amountB).toString(10), 10),
            new BN(timestamp.toString(10), 10),
            new BN(ttl.toString(10), 10),
            new BN(salt.toString(10), 10),
            new BN(lrcFee.toString(10), 10),
            buyNoMoreThanAmountB,
            marginSplitPercentage])
        console.log(hash.toString('hex'));
        if (_.isString(privateKey)) {
            privateKey = Buffer.from(hexUtil.stripHex(privateKey), 'hex');
        }
        const signature = ethUtil.ecsign(hash, privateKey);

        return {
            protocol,
            owner,
            tokenS,
            tokenB,
            amountS,
            amountB,
            timestamp,
            ttl,
            salt,
            lrcFee,
            buyNoMoreThanAmountB,
            marginSplitPercentage,
            v: Number(signature.v.toString()),
            r: '0x' + signature.r.toString('hex'),
            s: '0x' + signature.s.toString('hex')
        }
    };
}

module.exports = Order;