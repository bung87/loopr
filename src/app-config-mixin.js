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

    _pager(){
        let pager = this.$.pager;
        if(pager){
            Array.prototype.forEach.call(pager.shadowRoot.querySelectorAll('a'), (item) => {
                item.addEventListener('click', this._pageClick.bind(this));
                item.href = "javascript:void(0)";
            });
        }
    }

    _pageClick(e){
        if("general first" === e.target.className){
            this.currentPage = 1;
        } else if("general previous" === e.target.className){
            this.currentPage = this.currentPage - 1;
        } else if("general" === e.target.className){
            this.currentPage = Number(e.target.textContent);
        } else if("general next" === e.target.className){
            this.currentPage = this.currentPage + 1;
        } else if("general last" === e.target.className){
            this.currentPage = this.totalPage;
        } else {
            return;
        }
        this._pager();
    }
}