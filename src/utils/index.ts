import Big from 'big.js';

export const formatLongAddress = (value: string) => {
    return value.length > 15 ? `${value.substr(0,5)}...${value.substr(-5)}`: value
}

export const decimalTokenAmount = (number: number | string, decimal:number | string, fixed: number) => {
    return new Big(number).div(new Big(10).pow(Number(decimal || 0))).toFixed(fixed || 4)
}

export const parseTokenAmount = (value, decimal) => {
    console.log(new Big(value).times(new Big(10).pow(Number(decimal))).toString());
    return new Big(value).times(new Big(10).pow(Number(decimal))).toString()
}