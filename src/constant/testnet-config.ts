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
        icon:"https://www.fusotao.org/share/tao.svg",
        tokenModule: 'token',
        tokenMethod: 'balances',
        tokenViewModules:{
            balance: {
                module: 'token',
                method: 'balances',
                params: 'array'
            },
            metadata: {
                module: 'token',
                method: 'tokens',
                params: ''
            },
        },
        tokenChangeModules:{
            transfer: {
                module: 'token', 
                method: 'transfer',
                params: ''
            }
        },
        tokens:[
            {"code":0, decimal: 18, symbol: "TAO", "name":"TAO", "logo":"https://www.fusotao.org/share/tao.svg"},
            {"code":1, decimal: 18, symbol: "USDT", "name":"USDT", "logo":"https://www.fusotao.org/share/usdt.svg"},
            {"code":2, decimal: 18, symbol: "WETH", "name":"WETH", "logo":"https://www.fusotao.org/share/weth.svg"},
            {"code":3, decimal: 18, symbol: "wNEAR", "name":"wNEAR", "logo":"https://www.fusotao.org/share/wnear.svg"}
        ]
    },
    "barnacle0918":{
        nodeId:"wss://gateway.testnet.octopus.network/barnacle0918/j8xz59egu4h8y814qnunm0cqfrq09lrw",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        symbol:"BAR",
        tokenViewModules:{
            balance: {
                module: 'octopusAssets',
                method: 'account',
                params: ''
            }
        },
        tokenChangeModules:{
            transfer: {
                module: 'octopusAssets', 
                method: 'transfer',
                params: ''
            }
        },
        tokens:[
            {"code":0, decimal: 18, symbol: "BAR", "name":"BAR", "logo":"https://avatars.githubusercontent.com/u/14307069"},
        ]
    },
    "barnacle-evm":{
        nodeId:"wss://gateway.testnet.octopus.network/barnacle-evm/wj1hhcverunusc35jifki19otd4od1n5",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        symbol:"BARE",
        tokenViewModules:{
            balance: {
                module: 'octopusAssets',
                method: 'account',
                params: ''
            }
        },
        tokenChangeModules:{
            transfer: {
                module: 'octopusAssets', 
                method: 'transfer',
                params: ''
            }
        },
        tokens:[
            {"code":0, decimal: 18, symbol: "BARE", "name":"BARE", "logo":""},
        ]
    },
    "discovol":{
        nodeId:"wss://gateway.testnet.octopus.network/discovol/o4urcey87y4n1qimhfrad92gzs315z9h",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        tokenViewModules:{
            balance: {
                module: 'octopusAssets',
                method: 'account',
                params: ''
            }
        },
        tokenChangeModules:{
            transfer: {
                module: 'octopusAssets', 
                method: 'transfer',
                params: ''
            }
        },
        symbol:"DISC",
        tokens:[
            {"code":0, decimal: 18, symbol: "DISC", "name":"DISC", "logo":"https://discovol.co/web3/assets/favicon.ico"},

        ]
    },
    "myriad":{
        nodeId:"wss://gateway.testnet.octopus.network/myriad/8f543a1c219f14d83c0faedefdd5be6e",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        tokenViewModules:{
            balance: {
                module: 'octopusAssets',
                method: 'account',
                params: ''
            }
        },
        tokenChangeModules:{
            transfer: {
                module: 'octopusAssets', 
                method: 'transfer',
                params: ''
            }
        },
        symbol:"MYRIA",
        tokens:[
            {"code":0, decimal: 18, symbol: "MYRIA", "name":"MYRIA", "logo":"https://2dverse.org/myriad/Logo_Solid.svg"},
            {"code":1, decimal: 18, symbol: "USDC", "name":"USDC", "logo":"https://www.fusotao.org/share/usdc.svg"},
        ]
    },
    "debionetwork":{
        nodeId:"wss://gateway.testnet.octopus.network/debionetwork/554976cbb180f676f188abe14d63ca24",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        tokenViewModules:{
            balance: {
                module: 'octopusAssets',
                method: 'account',
                params: ''
            }
        },
        tokenChangeModules:{
            transfer: {
                module: 'octopusAssets', 
                method: 'transfer',
                params: ''
            }
        },
        symbol:"DBIO",
        tokens:[
            {"code":0, decimal: 18, symbol: "DBIO", "name":"DBIO", "logo":"http://debio.dev/debiologo.png"},
            {"code":1, decimal: 18, symbol: "USDC", "name":"USDC", "logo":"https://www.fusotao.org/share/usdc.svg"},
        ]
    },
    "deip-test":{
        nodeId:"wss://gateway.testnet.octopus.network/deip/46v4p8ss613olf92p2scmsjud68mhzrr",
        tokenModule: 'assets',
        tokenMethod: 'account',
        tokenViewModules:{
            balance: {
                module: 'assets',
                method: 'account',
                params: ''
            }
        },
        tokenChangeModules:{
            transfer: {
                module: 'uniques', 
                method: 'transfer',
                params: ''
            }
        },
        symbol:"DEIP",
        tokens:[
            {"code":0, decimal: 18, symbol: "DEIP", "name":"DEIP", "logo":"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iLjg5MiIgeT0iLjkxIiB3aWR0aD0iNDMuMTYxIiBoZWlnaHQ9IjQzLjE2MSIgcng9IjIxLjU4MSIgZmlsbD0iI0Y4RkVGQSIvPjxwYXRoIGQ9Ik05LjcgMTAuNmgxNC41MzRjNi41NjcgMCAxMS44OTIgNS4zMjMgMTEuODkyIDExLjg5IDAgNi41NjgtNS4zMjQgMTEuODkyLTExLjg5MiAxMS44OTJIOS43VjEwLjZaIiBmaWxsPSJ1cmwoI2EpIi8+PGNpcmNsZSBjeD0iMjIuNDczIiBjeT0iMjIuNDkxIiByPSI0Ljg0NSIgZmlsbD0iIzAwMCIvPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjAiIGN5PSIwIiByPSIxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguMjE2IDExLjY5NTUgLTExLjkyNjc3IC4yMjAyOCAyMi42OTcgMjIuNjg3KSI+PHN0b3Agb2Zmc2V0PSIuMzU5IiBzdG9wLWNvbG9yPSIjRTlGRjAwIi8+PHN0b3Agb2Zmc2V0PSIuNzYiIHN0b3AtY29sb3I9IiMyNjM4MDAiLz48c3RvcCBvZmZzZXQ9IjEiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4="},

        ]
    },
    "atocha":{
        nodeId:"wss://gateway.testnet.octopus.network/atocha/yevqd2d4jhm0dqakaj4hkbyjjfg6ukbu",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        symbol:"ATO",
        tokenViewModules:{
            balance: {
                module: 'octopusAssets',
                method: 'account',
                params: ''
            }
        },
        tokenChangeModules:{
            transfer: {
                module: 'octopusAssets', 
                method: 'transfer',
                params: ''
            }
        },
        tokens:[
            {"code":0, decimal: 18, symbol: "ATO", "name":"ATO", "logo":"https://avatars.githubusercontent.com/u/92355981?s=200&v=4"},
        ]
    },
    "uniqueone-appchain":{
        nodeId:"wss://gateway.testnet.octopus.network/uniqueone/e83rnqoi4hr65cwx46a83u6a7a970dgq",
        tokenModule: 'octopusAssets',
        tokenMethod: 'account',
        symbol:"UNET",
        tokenViewModules:{
            balance: {
                module: 'octopusAssets',
                method: 'account',
                params: ''
            }
        },
        tokenChangeModules:{
            transfer: {
                module: 'octopusAssets', 
                method: 'transfer',
                params: ''
            }
        },
        tokens:[
            {"code":0, decimal: 18, symbol: "UNET", "name":"UNET", "logo":"https://files.unique.one/images/unet.png"},
        ]
    }
    
}

export default config;
