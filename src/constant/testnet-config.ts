const config = {
    near:{
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://testnet-api.kitwallet.app",
        explorerUrl: "https://explorer.testnet.near.org",
        headers:{},
        ftPriceUrl:'https://dev-indexer.ref-finance.com//list-token-price',
        nftFetchUrl:'https://testnet-api.kitwallet.app/account/{requestAccount}/likelyNFTs',
        ftFetchUrl: 'https://testnet-api.kitwallet.app/account/{requestAccount}/likelyTokens'
    },
    oct:{
        explorerUrl: "https://explorer.testnet.oct.network",
        octTokenContractId: "oct.beta_oct_relay.testnet",
        registryContractId: "registry.test_oct.testnet",
        bridgeId:'dev.dev_oct_relay.testnet'
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
    "barnacle0918":{
        nodeId:"wss://gateway.testnet.octopus.network/barnacle0918/j8xz59egu4h8y814qnunm0cqfrq09lrw",
        symbol:"BAR"
    },
    "barnacle-evm":{
        nodeId:"wss://gateway.testnet.octopus.network/barnacle-evm/wj1hhcverunusc35jifki19otd4od1n5",
        symbol:"BARE"
    },
    "discovol":{
        nodeId:"wss://gateway.testnet.octopus.network/discovol/o4urcey87y4n1qimhfrad92gzs315z9h",
        symbol:"DISC"
    },
    "myriad":{
        nodeId:"wss://gateway.testnet.octopus.network/myriad/8f543a1c219f14d83c0faedefdd5be6e",
        symbol:"MYRIA"
    },
    "debionetwork":{
        nodeId:"wss://gateway.testnet.octopus.network/debionetwork/554976cbb180f676f188abe14d63ca24",
        symbol:"DBIO"
    },
    "deip-test":{
        nodeId:"wss://gateway.testnet.octopus.network/deip/46v4p8ss613olf92p2scmsjud68mhzrr",
        symbol:"DEIP"
    },
    "atocha":{
        nodeId:"wss://gateway.testnet.octopus.network/atocha/yevqd2d4jhm0dqakaj4hkbyjjfg6ukbu",
        symbol:"ATO",
    },
    "uniqueone-appchain":{
        nodeId:"wss://gateway.testnet.octopus.network/uniqueone/e83rnqoi4hr65cwx46a83u6a7a970dgq",
        symbol:"UNET"
    }
    
}

export default config;
