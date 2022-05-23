import NearCore from './near';
import testnetConfig from "../constant/testnet-config";
import mainnetConfig from "../constant/mainnet-config";

const connectNetworkId = localStorage.getItem('networkId') || 'mainnet'
const config = connectNetworkId === 'testnet' ? testnetConfig.near : mainnetConfig.near;

const Near:any = new NearCore({
    ...config,
    connectNetworkId,
})

export { Near };