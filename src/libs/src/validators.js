const ethereumUtil = require('ethereumjs-util');
const ens = require('./ens');
function validator() {
    this.isValidPrivateKey = function(privateKey) {
        if (typeof privateKey === 'string') {
            return privateKey.length === 64;
        } else if (privateKey instanceof Buffer) {
            return privateKey.length === 32;
        } else {
            return false;
        }
    };

    this.isValidETHAddress = function(address) {
        if (!address) {
            return false;
        }
        return validateEtherAddress(address);
    };

    this.isValidHex = function(str) {
        if (typeof str !== 'string') {
            return false;
        }
        if (str === '') return true;
        str =
            str.substring(0, 2) === '0x'
                ? str.substring(2).toUpperCase()
                : str.toUpperCase();
        const re = /^[0-9A-F]+$/g;
        return re.test(str);
    };
    this.isValidENSorEtherAddress = function(address) {
        return this.isValidETHAddress(address) || this.isValidENSAddress(address);
    };

     this.isValidENSAddress = function(address) {
        try {
            const normalized = ens.normalise(address);
            const tld = normalized.substr(normalized.lastIndexOf('.') + 1);
            const validTLDs = {
                eth: true,
                test: true,
                reverse: true
            };
            if (validTLDs[tld]) return true;
        } catch (e) {
            return false;
        }
        return false;
    };

    this.isValidENSName = function(str){
        try {
            return (
                str.length > 6 && ens.normalise(str) !== '' && str.substring(0, 2) !== '0x'
            );
        } catch (e) {
            return false;
        }
    };

    function validateEtherAddress(address) {
        if (address.substring(0, 2) !== '0x') return false;
        else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
        else if (
            /^(0x)?[0-9a-f]{40}$/.test(address) ||
            /^(0x)?[0-9A-F]{40}$/.test(address)
        )
            return true;
        else return isChecksumAddress(address);
    }

    function isChecksumAddress(address) {
        return address === ethereumUtil.toChecksumAddress(address);
    }
}

module.exports = validator;
