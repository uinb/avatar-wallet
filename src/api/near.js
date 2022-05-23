import * as nearAPI from 'near-api-js';
import axios from 'axios';
import chainConfig from '../constant/chains';
const {parseSeedPhrase, generateSeedPhrase} = require('near-seed-phrase')
const {connect, keyStores, Near, KeyPair, Contract, ContractMethods} = nearAPI;


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
            return {
                type: 'error',
                msg: 'invalid seeds'
            }
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
    async fetchFTContract(accountId){
        const {data} = await axios.get(chainConfig.near.ftPriceUrl)
        await this.contractBalanceOf(accountId, 'f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near');
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
        const tokens = await this.fetchFTContract(accountId);
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
}
export default NearCore;



