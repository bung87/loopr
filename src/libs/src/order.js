const signer = require('./signer.js');
const ethUtil = require('ethereumjs-util');
const _ = require('lodash');
const BN = require('bn.js');
const Joi = require('joi');

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


    const orderSchema = Joi.object.keys({
        protocol: Joi.string.regex(/^0x[0-9a-fA-F]{40}$/i),
        owner: Joi.string.regex(/^0x[0-9a-fA-F]{40}$/i),
        tokenS: Joi.string.regex(/^0x[0-9a-fA-F]{40}$/i),
        tokenB: Joi.string.regex(/^0x[0-9a-fA-F]{40}$/i),
        amountS: Joi.number().integer().min(0),
        amountB: Joi.number().integer().min(0),
        timestamp: Joi.number().integer().min(0),
        ttl: Joi.number().integer().min(0),
        salt: Joi.number().integer().min(0),
        lrcFee: Joi.number().integer().min(0),
        buyNoMoreThanAmountB: Joi.boolean(),
        marginSplitPercentage: Joi.number().integer().min(0).max(100),
    }).with('protocol', 'owner', 'tokenS', 'tokenB', 'amountS', 'amountB', 'timestamp', 'ttl', 'salt', 'lrcFee', 'buyNoMoreThanAmountB', 'marginSplitPercentage');


    const orderTypes = ['address', 'address', 'address', 'address', 'uint', 'uint', 'uint', 'uint', 'uint', 'uint', 'bool', 'uint8'];

    this.sign = function (privateKey) {

        const validation = Joi.validate(data, orderSchema);

        if (!validation) {
            throw new Error('Invalid Loopring Order');
        }

        const hash = signer.solSHA3(orderTypes, [protocol, owner, tokenS, tokenB,
            new BN(Number(amountS).toString(10), 10),
            new BN(Number(amountB).toString(10), 10),
            new BN(Number(timestamp).toString(10), 10),
            new BN(Number(ttl).toString(10), 10),
            new BN(Number(salt).toString(10), 10),
            new BN(Number(lrcFee).toString(10), 10),
            buyNoMoreThanAmountB,
            marginSplitPercentage]);

        const finalHash = ethUtil.hashPersonalMessage(hash);

        if (_.isString(privateKey)) {
            privateKey = ethUtil.toBuffer(privateKey);
        }

        const signature = ethUtil.ecsign(finalHash, privateKey);

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