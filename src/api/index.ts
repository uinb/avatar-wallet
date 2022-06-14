import NearCore from './near';
import testnetConfig from "../constant/testnet-config";
import mainnetConfig from "../constant/mainnet-config";
import AppChainCore from './appChain';
import { ApiPromise, WsProvider } from '@polkadot/api';

const connectNetworkId = localStorage.getItem('networkId') || 'mainnet'
const config = connectNetworkId === 'testnet' ? testnetConfig.near : mainnetConfig.near;

const Near:any = new NearCore({
    ...config,
    connectNetworkId,
})

const appChain = (nodeId:string) => new AppChainCore({provider: new WsProvider(nodeId)})

export { Near, appChain};