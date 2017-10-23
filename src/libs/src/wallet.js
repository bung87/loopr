const hexUtils = require('./hex-uitls.js')

function wallet() {
    this.getAddress = function () {
        return Promise.reject('Implement me');
    };

    this.getNakedAddress = function () {
        return new Promise(resolve => {
            this.getAddress().then(address => {
                resolve(hexUtils.stripHex(address));
            });
        });
    };

    this.signRawTransaction = function (_tx) {
        return Promise.reject('Implement me');
    };

}

module.exports = wallet;