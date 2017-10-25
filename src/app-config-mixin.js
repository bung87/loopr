const AppConfigMixin = (superclass) => class extends superclass {
    constructor() {
        super();
    }

    test() {
        console.log("test");
    }

    computeMarketId(tokenx, tokeny) {
        return this.appConfig.computeMarketId(tokenx, tokeny);
    }
}