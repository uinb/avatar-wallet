import {connect, keyStores, Near, KeyPair} from 'near-api-js';
import axios from 'axios';

const {parseSeedPhrase} = require('near-seed-phrase')

class NearCore extends Near{
    near: any;
    networkId: string;
    config: any;
    constructor(config:any){
        super({...config, keyStore: new keyStores.BrowserLocalStorageKeyStore()});
        this.networkId = config?.networkId;
        this.config = config;
        this.init();
    }
    async init(){
        const keyStore = new keyStores.BrowserLocalStorageKeyStore()
        const near = await connect({
            keyStore, 
            ...this.config
        })
        this.near = near;
    }
    async importAccount(seeds:string){
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
    async forgetAccount(accountId:string){
        const {keyStore} = this.near.config;
        await keyStore.removeKey(this.networkId, accountId);
    }
}
export default NearCore;



