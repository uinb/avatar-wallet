const config = {
    near:{
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        walletUrl: "https://wallet.mainnet.near.org",
        helperUrl: "https://api.kitwallet.app",
        explorerUrl: "https://explorer.mainnet.near.org",
        headers: {},
        ftPriceUrl:'https://indexer.ref-finance.net/list-token-price',
        nftFetchUrl:'https://api.kitwallet.app/account/{requestAccount}/likelyNFTs',
        ftFetchUrl: 'https://api.kitwallet.app/account/{requestAccount}/likelyTokens'
    },
    oct:{
        explorerUrl: "https://explorer.mainnet.oct.network",
        octTokenContractId: "f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near",
        registryContractId: "octopus-registry.near",
        bridgeId:'dev.dev_oct_relay.testnet'
    },
    atocha:{
        nodeId:"wss://gateway.mainnet.octopus.network/atocha/jungxomf4hdcfocwcalgoiz64g9avjim",
        symbol:"ATO",
        tokens: []
    },
    myriad:{
        nodeId:"wss://gateway.mainnet.octopus.network/myriad/a4cb0a6e30ff5233a3567eb4e8cb71e0",
        symbol:"MYRIA"
    },
    deip:{
        nodeId:"wss://gateway.mainnet.octopus.network/deip/b9e1ipeh3ejw2znrb4s2xd4tlf6gynq0",
        symbol:"DEIP"
    },
    debionetwork:{
        nodeId:"wss://gateway.mainnet.octopus.network/debionetwork/ae48005a0c7ecb4053394559a7f4069e",
        symbol:"DBIO"
    }
}

export default config