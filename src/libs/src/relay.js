const fetch = require('node-fetch');
const crypto = require('crypto');
const Validator = require('./validator');
const PrivateKey = require('./privateKey');
const ethUtil = require('ethereumjs-util');
const signer = require('./signer.js');
const Joi = require('joi');
const BigNumber = require('bignumber.js');


function relay(host) {

    const txSchema = Joi.object().keys({
        nonce: Joi.string().regex(/^0x[0-9a-fA-F]{1,64}$/i),
        gasPrice: Joi.string().regex(/^0x[0-9a-fA-F]{1,64}$/i),
        gasLimit: Joi.string().regex(/^0x[0-9a-fA-F]{1,64}$/i),
        to: Joi.string().regex(/^0x[0-9a-fA-F]{40}$/i),
        value: Joi.string().regex(/^0x[0-9a-fA-F]{1,64}$/i),
        data: Joi.string().regex(/^0x[0-9a-fA-F]*$/i),
        chainId: Joi.number().integer().min(1)
    }).with('gasPrice', 'gasLimit', 'to', 'value', 'data').without('nonce', 'chainId');

    const request = {"jsonrpc": "2.0"};

    const validataor = new Validator();

    this.getTransactionCount = async function (add, tag) {

        if (!validataor.isValidETHAddress(add)) {
            throw new Error('invalid ETH address');
        }

        if (!tag) {
            tag = 'latest';
        }
        if (tag !== 'latest' && tag !== 'earliest' && tag !== 'pending') {
            throw new Error('invalid  tag:' + tag);
        }

        const params = [add, tag];
        request.id = id();
        request.method = "eth_getTransactionCount";
        request.params = params;

        return await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }).then(res => res.json()).then(res => {
            if (res.error) {
                throw new Error(res.error);
            }
            return res.result;
        });
    };

    this.getAccountBalance = async function (add, tag) {
        if (!validataor.isValidETHAddress(add)) {
            throw new Error('invalid ETH address');
        }

        if (!tag) {
            tag = 'latest';
        }
        if (tag !== 'latest' && tag !== 'earliest' && tag !== 'pending') {
            throw new Error('invalid  tag:' + tag);
        }

        const params = [add, tag];
        request.id = id();
        request.method = "eth_getBalance";
        request.params = params;

        return await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }).then(res => res.json()).then(res => {
            if (res.error) {
                throw new Error(res.error);
            }
            return new BigNumber(Number(res.result));
        });
    };

    this.getTokenBalance = async function (add, contract) {




    };

    this.generateTx = async function (rawTx,privateKey) {

        const wallet = new PrivateKey();
        wallet.setPrivateKey(ethUtil.toBuffer(privateKey));

        const valid_result = Joi.validate(rawTx, txSchema);

        if (valid_result.error) {
            throw new Error('invalid Tx data ');
        }

        const gasLimit = new BigNumber(Number(rawTx.gasLimit));

        if (gasLimit.lessThan(21000)) {

            throw  new Error('gasLimit must be greater than 21000');
        }

        if (gasLimit.greaterThan(5000000)) {
            throw  new Error('gasLimit is too big');
        }

        // const balance = await this.getAccountBalance(wallet.getAddress());
        //
        // const needBalance = new BigNumber(Number(rawTx.value)) + gasLimit * new BigNumber(Number(rawTx.gasPrice));
        //
        // if (balance.lessThan(needBalance)) {
        //
        //     throw new Error('Balance  is not enough')
        // }

        const nonce = await this.getTransactionCount(wallet.getAddress());

        rawTx.nonce = rawTx.nonce || nonce;
        rawTx.chainId = rawTx.chainId || 1;

        const signed = signer.signEthTx(rawTx, privateKey);
        return {
            tx: rawTx,
            signedTx: signed
        }

    };

    this.sendSignedTx = async function (tx) {

        request.id = id();
        request.method = "eth_sendRawTransaction";
        request.params = [tx];

        console.log(JSON.stringify(request));

        return await fetch(host,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }).then(res => res.json()).then(res => {
            if (res.error) {
                throw new Error(res.error.message);
            }
            return res.result;
        });

    };





    function id() {
        return crypto.randomBytes(16).toString('hex');
    }

}

module.exports = relay;



