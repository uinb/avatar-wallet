import { ApiPromise } from '@polkadot/api';
import {formatBalance, hexToU8a, isHex} from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import Big from 'big.js';
Big.PE = 100;

class AppChains extends ApiPromise {
    constructor(config){
        super({...config});
    }
    getBlockHash(){
        return this.genesisHash.toHex()
    }

    getAccounts(){
        const accounts = keyring.getPairs()?.map(item => item.address);
        return accounts
    }
    checkForValidAddresses = (address) => {
        try {
            encodeAddress(
            isHex(address)
                ? hexToU8a(address)
                : decodeAddress(address)
            );
            return true;
        } catch (error) {
            return false;
        }
    }
    internationalizationNumbernum (n:any){
        const num = String(n);
        if (!!!num) {
            return "--";
        }
        const res=[];
        const splits = num.toString().split(".");
        splits[0].split("").reverse().forEach(function(item,i){
            if(i%3 === 0 && i!==0){ res.push(","); }
            res.push(item);
        });
        return res.reverse().join("")+(splits?.length>1 ? "."+splits[1] : "");
    }
    downFixed(num:any, fix:any) {
        // num为原数字，fix是保留的小数位数
        let result = "0";
        if (Number(num) && fix > 0) {
          // 简单的做个判断
          fix = +fix || 2;
          num = num + "";
          if (/e/.test(num)) {
            // 如果是包含e字符的数字直接返回
            var m:any = Number(num)
              .toExponential()
              .match(/\d(?:\.(\d*))?e([+-]\d+)/);
            result = this.downFixed(
              Number(num).toFixed(Math.max(0, (m[1] || "").length - m[2])),
              fix
            );
          } else if (!/\./.test(num)) {
            // 如果没有小数点
            result = num + `.${Array(fix + 1).join("0")}`;
          } else {
            // 如果有小数点
            num = num + `${Array(fix + 1).join("0")}`;
            let reg = new RegExp(`-?\\d*.\\d{0,${fix}}`);
            result = reg.exec(num)[0];
          }
        }
        return result;
    }
    inputLimit(prices:any,precision:any){
        let price = String(prices);
        let priceVal = price.replace(/[^\d.]/g, "");
        if(priceVal.split(".").length-1 > 1 || (priceVal[1] === '0' && priceVal[0] === '0')){
            priceVal = priceVal.substr(0,priceVal.length - 1);
        }
        if(priceVal[1] && priceVal[1] !== '.' && priceVal[0] === '0'){
            priceVal = priceVal.substr(1,priceVal.length - 1);
        }
        if(priceVal.includes(".")){
            if(priceVal.split(".")[1].length > Number(precision)){
                priceVal = this.downFixed(priceVal,precision);
            }
        };
        return priceVal;
    }
    addPrecision(number:string,decimals:number){
        let n = new Big("10");
        let x = n.pow(decimals||18),y = new Big(number);
        return y.times(x).toString();
    }
    async fetchBalances(account:string, config: any){
        const {symbol} = config;
        const tokenMeta = config.tokens.find(item => item.symbol === symbol);
        const {decimal = 18} = tokenMeta;
        return this.query.system.account(account).then((resp: any) => {
            const { free } = resp?.data;
            const balance = formatBalance(free, { forceUnit: symbol, withSi: true, withUnit: false }, decimal);
            return {balance,symbol}
        }).catch((e) => {
            return {
                balance:"0",
                symbol
            }
        });
    }
    async fetchAccountTonkenBalances(activeAccount:string, tokens:Array<any>, config:any){
        const request = tokens.map(token => {
            return this.fetchFTBalanceByTokenId({params: [token.code, activeAccount], config})
        });
        const result = await Promise.all(request),this_ = this; 
        const accountInfo = tokens.map((item:any,index:any)=>{
            return {
                ...item,
                balance: result[index],
                formattedBalance:this_.inputLimit(result[index],4)
            }
        });
        return accountInfo;

    }
    async transfer(account:string, to:string, amount:string, callback:any){
        const transfer = await this.tx.balances.transfer(to,amount);
        const signer = keyring.getPair(account);
        await signer.unlock('');
        const txHash = await transfer.signAndSend(signer, {nonce: -1}, (res) => {
            if (res.isFinalized) {
                callback({status:1})
                // window.location.reload();
            } else if (res.isError) {
                console.error(res);
            }
        }).catch(err => {
            callback({status:0,error:err})
            console.log('error', err);
        });
        return txHash;
    }
    async transferToken(account:string, params:any, config:any, callback:any){
        const {tokenChangeModules} = config;
        const refactorParams = tokenChangeModules.transfer.params === 'array' ? [params] : params;
        const transfer:any = await this.tx[tokenChangeModules.transfer.module][tokenChangeModules.transfer.method](...refactorParams);
        const signer = keyring.getPair(account);
        await signer.unlock('');
        const txHash = await transfer.signAndSend(signer, {nonce: -1}, (res) => {
            if (res.isFinalized) {
                callback({status:1})
                // window.location.reload();
            } else if (res.isError) {
                console.error(res);
            }
        }).catch(err => {
            callback({status:0,error:err})
            console.log('error', err);
        });
        return txHash;
    }

    async fetchFTBalanceByTokenId({params, config}){
        const {tokenViewModules, symbol, tokens} = config;
        const tokenMeta = tokens.find(item => item.symbol === symbol);
        const {decimal = 18} = tokenMeta;
        const refactorParams = tokenViewModules.balance.params === 'array' ? [params] : params;
        const result:any = await this.query[tokenViewModules.balance.module][tokenViewModules.balance.method](...refactorParams);
        const balance = formatBalance(result?.free || result?.balance, { forceUnit: symbol, withSi: true, withUnit: false }, decimal);
        return balance;
    }

}


export default AppChains