import * as nearAPI from 'near-api-js';
import axios from 'axios';
import Big from 'big.js';
import mainnetConfig from '../constant/mainnet-config';
import testnetConfig from '../constant/testnet-config';
import { NEAR_MAX_GAS } from '../constant';
const {parseSeedPhrase, generateSeedPhrase } = require('near-seed-phrase')
const {connect, keyStores, Near, KeyPair, Contract, utils} = nearAPI;
const bs58 = require('bs58');

//todo fetch token price from coingeco https://api.coingecko.com/api/v3/simple/price


const BOATLOAD_OF_GAS = new Big(3).times(10 ** 14).toFixed();

class NearCore extends Near {
    near;
    networkId;
    constructor(config){
        super({...config, keyStore: new keyStores.BrowserLocalStorageKeyStore()});
        this.networkId = config?.networkId;
        this.init(config);
    }
    async init(config){
        const keyStore = new keyStores.BrowserLocalStorageKeyStore()
        const near = await connect({
            keyStore, 
            ...config
        })
        this.near = near;
    }
    async importAccount(seeds){
        const { helperUrl, keyStore, networkId } = this.near?.config;
        const {secretKey, publicKey} = parseSeedPhrase(seeds);
        const address = Buffer.from(bs58.decode(publicKey.split(':')[1])).toString('hex')
        return axios.get(`${helperUrl}/publicKey/${publicKey}/accounts`).then(async ({data}) => {
            const PRIVATE_KEY = secretKey.split("ed25519:")[1];
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            if(data.length){
                await keyStore.setKey(networkId, data[0], keyPair);
            }else{
                await keyStore.setKey(networkId, address, keyPair);
            }
            return null
        }).catch(async (e) => {
            const PRIVATE_KEY = secretKey.split("ed25519:")[1];
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            const address = Buffer.from(bs58.decode(publicKey.split(':')[1])).toString('hex')
            await keyStore.setKey(networkId, address, keyPair);
            return null
        });
    }
    getAccounts(){
        const {keyStore, networkId} = this.config;
        return keyStore.getAccounts(networkId).then(resp => {
            return resp;
        }).catch(e => {
            return [];
        });
    }

    async forgetAccount(accountId){
        const {keyStore, networkId} = this.near.config;
        await keyStore.removeKey(networkId, accountId);
    }
    
    async exportAccount(accountId){
        const {keyStore, networkId} = this.near.config;
        const result = await keyStore.getKey(networkId, accountId);
        return `ed25519:${result.secretKey}`;
    }

    generateKeyPair(){
        const keys = generateSeedPhrase();
        return keys;
    }
    async viewAccountState(account){
        try{
            const viewAccount = await this.near.account(account);
            await viewAccount.state();
            return false;
        }catch(e){
            return true
        }
    }
    async fetchFTContract(){
        const {ftPriceUrl =''} = this.near.config;
        if(ftPriceUrl){
            return axios.get(ftPriceUrl).then(({data}) => {
                return data;
            }).catch(e => {
                return {}
            })
        }
        return {};
    }
    async fetchFTMetadata(contractId){
        const {networkId} = this.near.config;
        const account = await this.near.account(networkId === 'testnet' ? 'testnet': 'near');
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['ft_metadata'],
                changeMethods: [],
            }
        )
        return contract.ft_metadata().then(resp => {
            return resp;
        }).catch(error => {
            return {}
        });
    }
    async fetchFTBasicMetadata(accountId:string){
        const {ftFetchUrl = ''} = this.near.config;
        const [base, path] = ftFetchUrl?.split('{requestAccount}');
        if(ftFetchUrl){
            return axios.get(`${base}${accountId}${path}`).then(async ({data}) => {
                const metaRequest = data.map(item => this.fetchFTMetadata(item))
                const metaResult = await Promise.all(metaRequest);
                return data.reduce((all, item, index) => {
                    if(Object.keys(metaResult[index]).length){
                        return {
                            ...all, 
                            [item]: {
                                ...metaResult[index],
                                contractId: item,
                                decimal: metaResult[index].decimals
                            }
                        }
                    }else{
                        return all;
                    }
                }, {});
            }).catch(e => {
                return {}
            })
        }
        return {};
    }
    async contractBalanceOfAccount(accountId, contractId){
        const account = await this.near.account(accountId);
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['ft_balance_of','ft_metadata'],
                changeMethods: ["ft_transfer"],
            }
        )
        const ftMetadata = await contract.ft_metadata().then(resp => resp).catch(e => {
            return {}
        });
        return contract.ft_balance_of({account_id: accountId}).then(resp => {
            return {
                ...ftMetadata, 
                balance: new Big(resp || 0).div(new Big(10).pow(ftMetadata.decimal || 18)).toNumber()
            }
        }).catch(e => {
            return {
                ...ftMetadata, 
                balance:'0'
            }
        });
    }
    async NFTtMetadata(accountId, contractId){
        const account = await this.near.account(accountId);
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['nft_metadata', 'nft_tokens_for_owner'],
                changeMethods: ["nft_transfer"],
            }
        )
        const metadata = await contract.nft_metadata();
        const tokens = await contract.nft_tokens_for_owner({account_id: accountId});
        return {...metadata, tokens}
    }
    async nftTransfer(payload){
        const {sender, contractId, tokenId, target} = payload;
        const account = await this.near.account(sender);
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['nft_metadata', 'nft_tokens_for_owner'],
                changeMethods: ["nft_transfer"],
            }
        )
        return contract.nft_transfer(
            {
                receiver_id: target, 
                token_id: tokenId
            },
            NEAR_MAX_GAS,
            1
        )
       
    }
    async fetchFtBalance(accountId){
        const newTokenBalances = await this.fetchFTBasicMetadata(accountId);
        const tokens = await this.fetchFTContract();
        const requestTokens = {...newTokenBalances, ...tokens};
        const request = Object.keys(requestTokens).map(address => {
            return this.contractBalanceOfAccount(accountId, address);
        })

        const value = await Promise.all(request);
        const refactorTokensBalance = Object.keys(requestTokens).map((token: string, index:number) => {
            return ({
                ...requestTokens[token], 
                ...value[index],
                balance: value[index].balance,
                usdValue: new Big(value[index].balance).times(requestTokens[token].price || 0).toNumber(),
                contractId: token
            })
        })

        return {
            balances: refactorTokensBalance,
            tokens:requestTokens
        }
    }
    async fetchNFTBalance(accountId){
        const {nftFetchUrl = ''} = this.near.config;
        const [base, path] = nftFetchUrl?.split('{requestAccount}');
        if(nftFetchUrl){
            const {data} = await axios.get(`${base}${accountId}${path}`);
            if(data.length){
                const request = data.map(contract => this.NFTtMetadata(accountId, contract));
                const result = await Promise.all(request);
                const refactorNFTMetadata = data.reduce((all, current, index) => {
                    return {
                        ...all,
                        [current]: result[index]
                    }
                }, {})
                return refactorNFTMetadata;
            }
           return {}
        }
        return {}
    }

    async fetchAccountsState(accounts){
        const request = accounts.map(account => this.viewAccountState(account));
        const result = await Promise.all(request);
        const accountState = accounts.reduce((all, account, index) => ({
            ...all,
            [account]: result[index]
        }), {})
       return accountState;
    }

    async ftTransfer(payload){
        const {sender, contractId, target, amount} = payload;
        const account = await this.near.account(sender);
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['ft_balance_of', 'storage_balance_of'],
                changeMethods: ["ft_transfer", 'storage_deposit'],
            }
        )
        await contract.storage_deposit({
            args:{
                account_id: target, 
            },
            amount: utils.format.parseNearAmount('0.00125')
        })
        return contract.ft_transfer(
            {
                receiver_id: target, 
                amount
            },
            NEAR_MAX_GAS,
            1
        ).then(resp => {
            return {
                ...resp,
                status: true
            }
        }).catch(e => {
            return {
                status: false,
                msg: e.message
            }
        })
    }
    async transferNear(payload){
        const {sender, target, amount} = payload;
        const account = await this.near.account(sender);
        return account.sendMoney(target, amount).then(resp => {
            return {
                ...resp,
                status: true
            }
        }).catch(e => {
            return {
                status: false,
                msg: e.message
            }
        })
    }

    async getAppChains(){
        const {networkId} = this.near.config;
        const account = await this.near.account(networkId === 'testnet' ? 'testnet': 'near');
        const contractId = networkId === 'testnet' ? testnetConfig.oct.registryContractId: mainnetConfig.oct.registryContractId;
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['get_token_contract_id', 'get_appchains_with_state_of', 'get_appchain_ids'],
                changeMethods: [],
            }
        )
        const appChains = await contract.get_appchains_with_state_of({
            appchain_state: ['Active'],
            page_number: 1,
            page_size: 50,
            sorting_field: 'RegisteredTime',
            sorting_order: 'Descending'
            }
        );
        return {
            networkId, 
            chains: appChains
        } || {networkId, chains: []}
    }

    async fetchContractTokens(contractId:string){
        const {networkId} = this.near.config;
        return this.near.account(networkId === 'testnet' ? 'testnet' : 'near').then((account) => {
            const contract:any = new Contract(
                account,
                contractId,
                {
                    viewMethods: ['get_near_fungible_tokens', 'get_wrapped_appchain_token'],
                    changeMethods: [],
                }
            )
            return contract.get_near_fungible_tokens().then(async resp => {
                const validTokens = resp.filter(token => token.bridging_state === 'Active')
                const request = validTokens.map((token:any) => this.fetchFTMetadata(token.contract_account))
                const result = await Promise.all(request);
                return validTokens.map((item, index) => ({
                    ...item,
                    metadata: result[index]
                }));
            })
        }).catch((e) => {
            return []
        });;
    }
    async approveContract(payload:any){
        const {accountId, contractId, amount, receiver} = payload;
        const account = await this.near.account(accountId);
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['storage_balance_of'],
                changeMethods: ['storage_deposit', 'burn_wrapped_appchain_token']
            }
        )
        return contract.burn_wrapped_appchain_token(
            {
                receiver_id: receiver, 
                amount: amount
            },
            new Big(3).times(10 ** 14).toFixed(),
        ).then(async resp => {
            return true;
        }).catch(error => {
            return false
        })
    }
    

    async toBridge(accountId: string, contractId:string = 'dev.dev_oct_relay.testnet'){
        const account = await this.near.account(accountId);
        const contract = new Contract(
            account,
            contractId,
            {
              viewMethods: ['get_bridge_token', 'get_num_appchains', 'get_appchain', 'get_appchains', 'get_native_token'],
              changeMethods: ['burn_native_token']
            }
        );
        console.log(contract)
    }

    async bridgeNativeToken(payload:any){
        const {accountId, receiver, amount, appChainContract} = payload;
        const account = await this.near.account(accountId);
        //const approveResult = await this.approveContract({accountId, contractId: appChainContract, amount, receiver});
        const contract:any = new Contract(
            account,
            appChainContract,
            {
                viewMethods: [''],
                changeMethods: ['burn_wrapped_appchain_token']
            }
        )
        return contract.burn_wrapped_appchain_token(
            {
                receiver_id: receiver, 
                amount: amount
            },
            new Big(3).times(10 ** 14).toFixed(),
        ).then(async resp => {
            return true;
        }).catch(error => {
            return false
        })
    }

    async bridgeTokenTransfer(payload){
        const {accountId, contractId, amount, bridgeId, appchain, target} = payload;
        const account = await this.near.account(accountId);
        const contract:any = new Contract(
            account,
            contractId,
            {
              viewMethods: ['ft_balance_of'],
              changeMethods: ['ft_transfer', 'ft_transfer_call']
            }
        );
        const result = await contract.ft_transfer_call(
            {
                receiver_id: bridgeId,
                amount,
                msg: `lock_token,${appchain},${target}`,
              },
              BOATLOAD_OF_GAS,
              1
        );
        return result
    }

    async fetchNearBalance(accountId:string){
        const {networkId} = this.near.config;
        const account = await this.near.account(accountId);
        return account.getAccountBalance().then(resp => {
            return {
                symbol: 'NEAR', 
                name: 'NEAR',
                contractId: networkId === 'testnet' ? 'testnet' : 'near',
                balance: utils.format.formatNearAmount(resp.available)
            }
        }).catch(e => {
            return {
                symbol: 'NEAR', 
                name: 'NEAR',
                contractId: networkId === 'testnet' ? 'testnet' : 'near',
                balance: 0
            }
        });
    }

    async fetchAccountBalance(accountId:string){
        const nearBalance = await this.fetchNearBalance(accountId);
        const { balances } = await this.fetchFtBalance(accountId);
        const refactorBalances = [{
            ...balances.find(item => item.symbol.toLowerCase() === 'wnear'),
            ...nearBalance
        }].concat(balances)
        return refactorBalances
    }

    async fetchContractTokenMetadata(accountId){
        const newTokenBalances = await this.fetchFTBasicMetadata(accountId);
        const tokens = await this.fetchFTContract();
        return {
            ...newTokenBalances,
            ...tokens
        }
    }
}
export default NearCore;



