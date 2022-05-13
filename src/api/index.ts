import testnetConfig from "../constant/testnet-config";
import mainnetConfig from "../constant/mainnet-config";
import {connect, keyStores} from 'near-api-js';

export const initNear = async (networkId : string) => {
    const conncetConfig = networkId === 'testnet' ? testnetConfig.near : mainnetConfig.near;
    const keyStore = new keyStores.BrowserLocalStorageKeyStore()
    const account = await keyStore.getAccounts(networkId);
    console.log('account', account);
    const near = await connect({
        keyStore, 
        ...conncetConfig
    })
    return near;
}

