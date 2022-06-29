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
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        tokens:[
            {"code":0, decimal: 18, symbol: "ATO", "name":"ATO", "logo":"https://avatars.githubusercontent.com/u/92355981?s=200&v=4"},
        ]
    },
    myriad:{
        nodeId:"wss://gateway.mainnet.octopus.network/myriad/a4cb0a6e30ff5233a3567eb4e8cb71e0",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        symbol:"MYRIA",
        tokens:[
            {"code":0, decimal: 18, symbol: "MYRIA", "name":"MYRIA", "logo":"https://2dverse.org/myriad/Logo_Solid.svg"},
        ]
    },
    deip:{
        nodeId:"wss://gateway.mainnet.octopus.network/deip/b9e1ipeh3ejw2znrb4s2xd4tlf6gynq0",
        tokenModule: 'assets',
        tokenMethod: 'account',
        symbol:"DEIP",
        tokens:[
            {"code":0, decimal: 18, symbol: "DEIP", "name":"DEIP", "logo":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iLjg5MiIgeT0iLjkxIiB3aWR0aD0iNDMuMTYxIiBoZWlnaHQ9IjQzLjE2MSIgcng9IjIxLjU4MSIgZmlsbD0iI0Y4RkVGQSIvPjxwYXRoIGQ9Ik05LjcgMTAuNmgxNC41MzRjNi41NjcgMCAxMS44OTIgNS4zMjMgMTEuODkyIDExLjg5IDAgNi41NjgtNS4zMjQgMTEuODkyLTExLjg5MiAxMS44OTJIOS43VjEwLjZaIiBmaWxsPSJ1cmwoI2EpIi8+PGNpcmNsZSBjeD0iMjIuNDczIiBjeT0iMjIuNDkxIiByPSI0Ljg0NSIgZmlsbD0iIzAwMCIvPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguMjE2IDExLjY5NTUgLTExLjkyNjc3IC4yMjAyOCAyMi42OTcgMjIuNjg3KSI+PHN0b3Agb2Zmc2V0PSIuMzU5IiBzdG9wLWNvbG9yPSIjRTlGRjAwIi8+PHN0b3Agb2Zmc2V0PSIuNzYiIHN0b3AtY29sb3I9IiMyNjM4MDAiLz48c3RvcCBvZmZzZXQ9IjEiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4="},

        ]
    },
    debionetwork:{
        nodeId:"wss://gateway.mainnet.octopus.network/debionetwork/ae48005a0c7ecb4053394559a7f4069e",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        symbol:"DBIO",
        tokens:[
            {"code":0, decimal: 18, symbol: "DBIO", "name":"DBIO", "logo":"http://debio.dev/debiologo.png"},

        ]
    }
}

export default config