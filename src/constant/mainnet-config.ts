const config = {
    near:{
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
        headers: {},
        ftPriceUrl:'https://indexer.ref-finance.net/list-token-price',
        nftFetchUrl:'https://api.kitwallet.app/account/{requestAccount}/likelyNFTs'
    },
    oct:{
        explorerUrl: "https://explorer.mainnet.oct.network",
        octTokenContractId: "f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near",
        registryContractId: "octopus-registry.near",
    }
}

export default config