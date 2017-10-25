const AppConfigMixin = (superclass) => class extends superclass {
    constructor() {
        super();
    }

    computeMarketId(tokenx, tokeny) {
        return this.appConfig.computeMarketId(tokenx, tokeny);
    }

    getTokenByName(tokenName) {
        if (tokenName) {
            return this.appConfig.tokenMap[tokenName.toUpperCase()];
        }
    }
    getMarket(marketKey) {
        if (marketKey) {
            let marketArr = marketKey.split("-");
            if (marketArr.length === 2) {
                let marketId = this.computeMarketId(marketArr[0].toUpperCase(), marketArr[1].toUpperCase());
                let market = this.appConfig.marketMap[marketId];
                if (!market) {
                    return null;
                } else {
                    return market;
                }
            } else {
                console.log("error market: " + marketKey)
                return null;
            }
        } else {
            console.log("error market: " + marketKey)
            return null;
        }
    }

    toNumber(str, tokenConfig) {
        return (new BigNumber(str))
            .dividedBy(new BigNumber(10).toPower(tokenConfig.digits))
            .toNumber();
    };
}