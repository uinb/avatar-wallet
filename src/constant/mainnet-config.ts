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
    },
    fusotao:{
        netwoekId: 'testnet',
        nodeId: 'wss://gateway.testnet.octopus.network/fusotao/erc8ygm5qvmi2fw23ijpvzgpzzto47mi',
        name:'Fusotao',
        symbol:"TAO",
        website: '',
        icon:"",
        tokenModule: 'token',
        tokenMethod: 'tokens',
        tokens:[
            {"code":0, decimal: 18, symbol: "TAO", "name":"TAO", "logo":"https://www.fusotao.org/share/tao.svg"},
            {"code":1, decimal: 18, symbol: "USDT", "name":"USDT", "logo":"https://www.fusotao.org/share/usdt.svg"},
            {"code":2, decimal: 18, symbol: "WETH", "name":"WETH", "logo":"https://www.fusotao.org/share/weth.svg"},
            {"code":3, decimal: 18, symbol: "wNEAR", "name":"wNEAR", "logo":"https://www.fusotao.org/share/wnear.svg"}
        ]
    },
    atocha:{
        nodeId:"wss://gateway.mainnet.octopus.network/atocha/jungxomf4hdcfocwcalgoiz64g9avjim",
        symbol:"ATO"
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