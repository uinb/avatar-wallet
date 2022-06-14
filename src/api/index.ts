import NearCore from './near';
import testnetConfig from "../constant/testnet-config";
import mainnetConfig from "../constant/mainnet-config";
import AppChainCore from './appChain';
import {WsProvider } from '@polkadot/api';
import {keyStores} from 'near-api-js';

const newNear:any = (networkId:string) => new NearCore({
    ...networkId === 'testnet' ? testnetConfig.near : mainnetConfig.near,
    connectNetworkId:networkId,
    keyStore: new keyStores.BrowserLocalStorageKeyStore()
})

const appChain = (nodeId:string) => new AppChainCore({provider: new WsProvider(nodeId)})

export { appChain, newNear};