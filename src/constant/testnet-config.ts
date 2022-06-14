const config = {
    near:{
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
        headers:{}
    },
    oct:{
        explorerUrl: "https://explorer.testnet.oct.network",
        octTokenContractId: "oct.beta_oct_relay.testnet",
        registryContractId: "registry.test_oct.testnet",
    },
    fusotao:{
        netwoekId: 'testnet',
        nodeId: 'wss://binnode.brandy.fusotao.org',
        name:'Fusotao',
        website: '',
        icon:"",
        tokenModule: 'token',
        tokenMethod: 'tokens',
        tokens:[
            {"code":0, decimal: 18, symbol: "TAO", "name":"TAO", "logo":"https://www.fusotao.org/share/tao.svg"},
            {"code":1, decimal: 18, symbol:"USDT", "name":"USDT", "logo":"https://www.fusotao.org/share/usdt.svg"},
            {"code":2, decimal: 18, symbol:"WETH", "name":"WETH", "logo":"https://www.fusotao.org/share/weth.svg"},
            {"code":3, decimal: 18, symbol:"wNEAR", "name":"wNEAR", "logo":"https://www.fusotao.org/share/wnear.svg"}
        ]
    },
    barnacle0918:{
        nodeId: 'wss://gateway.testnet.octopus.network/barnacle0918/j8xz59egu4h8y814qnunm0cqfrq09lrw',
        tokenModule: 'token',
        tokenMethod: 'tokens',
        tokens:[]
    },
    myriad:{
        nodeId: 'wss://gateway.testnet.octopus.network/barnacle0918/j8xz59egu4h8y814qnunm0cqfrq09lrw',
        tokenModule: 'token',
        tokenMethod: 'tokens',
        tokens:[]
    },

}

export default config;
