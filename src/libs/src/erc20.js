const ethUtil = require('ethereumjs-util');
const Validator = require('./validator');
const hexUtil = require('');

function ERC20 {


    const validataor = new Validator();

    this.balanceOf = function (token, add) {

        if(validataor.isValidETHAddress(add)){
            throw new Error('invalid ETH address')
        }

        if(validataor.isValidETHAddress(token)){

            throw new Error('invalid token Address')
        }

        const method = '0x'+ ethUtil.sha3('balanceOf(address)').toString('hex').slice(0,8);
        const value = add

    };


}