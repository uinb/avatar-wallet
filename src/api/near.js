import * as nearAPI from 'near-api-js';
import axios from 'axios';
import chainConfig from '../constant/chains';
const {parseSeedPhrase, generateSeedPhrase} = require('near-seed-phrase')
const {connect, keyStores, Near, KeyPair, Contract, utils} = nearAPI;
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
        const { helperUrl, keyStore } = this.near?.config;
        const {secretKey, publicKey} = parseSeedPhrase(seeds);
        const {data} = await axios.get(`${helperUrl}/publicKey/${publicKey}/accounts`);
        if(data.length){
            const PRIVATE_KEY = secretKey.split("ed25519:")[1];
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            await keyStore.setKey(this.networkId, data[0], keyPair);
            return null
        }else{
            const PRIVATE_KEY = secretKey.split("ed25519:")[1];
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            const address = Buffer.from(bs58.decode(publicKey.split(':')[1])).toString('hex')
            await keyStore.setKey(this.networkId, address, keyPair);
            return null
        }
    }
    async getAccounts(){
        const {keyStore} = this.near.config;
        const accounts = await keyStore.getAccounts(this.networkId);
        return accounts;
    }
    async forgetAccount(accountId){
        const {keyStore} = this.near.config;
        await keyStore.removeKey(this.networkId, accountId);
    }

    generateKeyPair(){
        const keys = generateSeedPhrase();
        return keys;
    }
    async viewAccountState(account){
        try{
            const viewAccount = await this.near.account(account);
            const result = await viewAccount.state();
            return false;
        }catch(e){
            return true
        }
    }
    async fetchFTContract(){
        const {data} = await axios.get(chainConfig.near.ftPriceUrl)
        if(data){
            return data;
        }else{
            return {}
        }
    }
    async contractBalanceOf(accountId, contractId){
        const account = await this.near.account(accountId);
        const contract = new Contract(
            account,
            contractId,
            {
                viewMethods: ['ft_balance_of'],
                changeMethods: ["addMessage"],
            }
        )
        const balance = await contract.ft_balance_of({account_id: accountId});
        return balance

    }
    async fetchFtBalance(accountId){
        const tokens = await this.fetchFTContract();
        const request = Object.keys(tokens).map(address => {
            return this.contractBalanceOf(accountId, address);
        })

        const value = await Promise.all(request);
        const refactorTokensBalance = Object.keys(tokens).map((token, index) => ({...tokens[token], balance: value[index]}))
        return refactorTokensBalance || []
    }
    async fetchNfts(accountId){
        const result = await axios.get(`https://api.kitwallet.app/account/${accountId}/likelyNFTs`);
        console.log(result);
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
}
export default NearCore;



