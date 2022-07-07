import Big from 'big.js';
import mainnetConfig from '../constant/mainnet-config';
import testnetConfig from '../constant/testnet-config';



export const formatLongAddress = (value: string  = '') => {
    const values = value.split('.');
    return values.length > 1 ? `${[values.slice(0,-1).map(item => `${item.substr(0,3)}...${item.substr(-3)}`).join('.'), values.slice(-1)].join('.')}` : `${value.substr(0,5)}...${value.substr(-5)}`
}

export const decimalTokenAmount = (number: number | string, decimal:number | string, fixed: number) => {
    return new Big(number).div(new Big(10).pow(Number(decimal || 0))).toFixed(fixed || 4)
}

export const parseTokenAmount = (value, decimal) => {
    return new Big(value).times(new Big(10).pow(Number(decimal))).toString()
}

export const selectConfig = (chain:string, networkId:string) => {
    const networkConfig = {mainnetConfig,testnetConfig};
    const networkIdKey = networkId+"Config";
    return networkConfig[networkIdKey][chain] || {} as any
}

export function fromDecimals(numStr, decimals = 18) {
    return new Big(numStr).div(Math.pow(10, decimals)).toNumber();
  }
  
export function toDecimals(num, decimals = 18) {
    return new Big(num).times(new Big(10).pow(decimals)).toString(10);
}

export const toUsd = (balance:string|number, price: string|number = '', fixed: number = 4) => {
    if(!price){
        return  '--';
    }
    if(Number(balance) === 0 || Number(price) === 0){
        return 0;
    }else{
        return new Big(balance || 0).times(price || 0).toFixed(fixed)
    }
}