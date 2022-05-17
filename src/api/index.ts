import NearCore from './near';
import testnetConfig from "../constant/testnet-config";
import mainnetConfig from "../constant/mainnet-config";


const networkId = localStorage.getItem('networkId') || 'testnet'
const config = networkId === 'testnet' ? testnetConfig.near : mainnetConfig.near

const Near = new NearCore({
    ...config,
    networkId
})


export {Near};