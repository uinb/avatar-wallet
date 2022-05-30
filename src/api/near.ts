import * as nearAPI from 'near-api-js';
import axios from 'axios';
import Big from 'big.js';
import mainnetConfig from '../constant/mainnet-config';
import testnetConfig from '../constant/testnet-config';
const {parseSeedPhrase, generateSeedPhrase} = require('near-seed-phrase')
const {connect, keyStores, Near, KeyPair, Contract} = nearAPI;
const bs58 = require('bs58');

class NearCore extends Near{
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
        const {data} = await axios.get(`${helperUrl}/publicKey/${publicKey}/accounts`);
        if(data.length){
            const PRIVATE_KEY = secretKey.split("ed25519:")[1];
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            await keyStore.setKey(networkId, data[0], keyPair);
            return null
        }else{
            const PRIVATE_KEY = secretKey.split("ed25519:")[1];
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            const address = Buffer.from(bs58.decode(publicKey.split(':')[1])).toString('hex')
            await keyStore.setKey(networkId, address, keyPair);
            return null
        }
    }
    async getAccounts(){
        const {keyStore, networkId} = this.near.config;
        const accounts = await keyStore.getAccounts(networkId);
        return accounts;
    }
    async forgetAccount(accountId){
        const {keyStore, networkId} = this.near.config;
        await keyStore.removeKey(networkId, accountId);
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
            const {data} = await axios.get(ftPriceUrl)
            if(data){
                return data;
            }else{
                return {}
            }
        }
        return {}
    }
    async contractBalanceOf(accountId, contractId){
        const account = await this.near.account(accountId);
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['ft_balance_of','ft_metadata'],
                changeMethods: ["ft_transfer"],
            }
        )
        const ftMetadata = await contract.ft_metadata();
        const balance = await contract.ft_balance_of({account_id: accountId});
        return {
            ...ftMetadata, 
            balance
        }
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
    async fetchFtBalance(accountId){
        const tokens = await this.fetchFTContract();
        const request = Object.keys(tokens).map(address => {
            return this.contractBalanceOf(accountId, address);
        })

        const value = await Promise.all(request);
        const refactorTokensBalance = Object.keys(tokens).map((token: string, index:number) => ({
            ...tokens[token], 
            ...value[index],
            balance: new Big(value[index].balance).div(new Big(10).pow(tokens[token].decimal)).toNumber(),
            usdValue: new Big(value[index].balance).div(new Big(10).pow(tokens[token].decimal)).times(tokens[token].price).toNumber(),
            contractId: token
        }))

        return {
            balances: refactorTokensBalance,
            tokens
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
        const {sender, contractId, receiver, amount} = payload;
        const account = await this.near.account(sender);
        const contract:any = new Contract(
            account,
            contractId,
            {
                viewMethods: ['ft_balance_of', 'storage_balance_of'],
                changeMethods: ["ft_transfer", 'storage_deposit'],
            }
        )
        /* const approveResult = await contract.storage_deposit({
            args:{
                account_id: sender, 
            },
            amount: utils.format.parseNearAmount('0.00125')
        })
        console.log(approveResult); */
        //const viewApproveAmount = await contract.storage_balance_of({account_id: sender});
        return contract.ft_transfer(
            {
                receiver_id: receiver, 
                amount
            },
            "300000000000000",
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
        const {sender, receiver, amount} = payload;
        const account = await this.near.account(sender);
        return account.sendMoney(receiver, amount).then(resp => {
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
    async getAppChains(accountId){
        const {networkId} = this.near.config;
        const account = await this.near.account(accountId);
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
}
export default NearCore;



