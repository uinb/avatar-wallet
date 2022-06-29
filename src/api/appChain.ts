import { ApiPromise } from '@polkadot/api';
import {formatBalance} from '@polkadot/util';
import { web3FromSource,web3Accounts } from '@polkadot/extension-dapp';
import Big from 'big.js';
Big.PE = 100;

class AppChains extends ApiPromise {
    constructor(config){
        super({...config});
    }
    getBlockHash(){
        return this.genesisHash.toHex()
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
    async fetchBalances(account:string, symbol: string){
        return this.query.system.account(account).then((resp: any) => {
            const { free } = resp?.data;
            const balance = formatBalance(free, { forceUnit: symbol, withSi: true, withUnit: false }, 18);
            return balance
        }).catch((e) => {
            return ''
        });
    }
    async fetchTokenBalance(account:string,symbol:string,tokenId:string,tokenModule:any, tokenMethod:any){
        if(tokenModule === "token" && tokenMethod === "balances"){
            return this.query.token.balances([tokenId,account]).then((resp: any) => {
                const { balance } = resp;
                const res = formatBalance(balance, { forceUnit: symbol, withSi: true, withUnit: false }, 18);
                return res
            }).catch((e) => {
                return ''
            });
        }else{
            return this.query[tokenModule][tokenMethod]([tokenId,account]).then((resp: any) => {
                const { free } = resp;
                const balance = formatBalance(free, { forceUnit: symbol, withSi: true, withUnit: false }, 18);
                return balance
            }).catch((e) => {
                return '0'
            });
        }
    }
    async fetchAccountTonkenBalances(activeAccount:string, symbol:string, accounts:any, tokenModule:any,tokenMethod:any){
        const request = accounts.map(account => this.fetchTokenBalance(activeAccount, symbol, account.code, tokenModule, tokenMethod));
        const result = await Promise.all(request); 
        const accountInfo = accounts.map((item:any,index:any)=>{
            //item.balance = result[index]
            return {
                ...item,
                balance: result[index]
            }
        });
        return accountInfo;
    }
    async transfer(account:string,amount:string){
        const transfer = this.tx.balances.transfer(account,this.addPrecision(amount,18));
        console.log(transfer)
        const accountsAll = await web3Accounts() as any;
        console.log("account  -- > ", accountsAll)
        const [sender] = await accountsAll.filter((item:any) => {
            return item.address === account;
        });
		await web3FromSource(sender?.meta.source);
        return ""
        /* const txHash = await transfer.signAndSend(sender.address, { nonce: -1,signer: injector.signer },({ events = [],status }) => {
            console.log(`Current status is ${status.type}`);
            if (status.isInBlock) {
                console.log(`Transaction included at blockHash ${status.asInBlock}`);
            } else if (status.isFinalized) {
                console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
                events.forEach(({ phase, event: { data, method, section } }) => {
                    console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
                    if(section == 'system'){
                        let success = null;
                        if(method == 'ExtrinsicSuccess'){
                            success = true;
                        }else if(method == 'ExtrinsicFailed'){
                            success = false;
                        }
                        // callback(success);
                    }
                });
            }
        });
        return txHash; */
    }
    async transferToken(account:string,amount:string){
        const transfer = this.tx.balances.transfer(account,this.addPrecision(amount,18));
        console.log(transfer)
        const accountsAll = await web3Accounts() as any;
        console.log("account  -- > ", accountsAll)
        const [sender] = await accountsAll.filter((item:any) => {
            return item.address === account;
        });
		const injector = await web3FromSource(sender?.meta.source);
        console.log(injector);
        return ""
        /* const txHash = await transfer.signAndSend(sender.address, { nonce: -1,signer: injector.signer },({ events = [],status }) => {
            console.log(`Current status is ${status.type}`);
            if (status.isInBlock) {
                console.log(`Transaction included at blockHash ${status.asInBlock}`);
            } else if (status.isFinalized) {
                console.log(`Transaction finalized at blockHash ${status.asFinalized}`);
                events.forEach(({ phase, event: { data, method, section } }) => {
                    console.log(`\t' ${phase}: ${section}.${method}:: ${data}`);
                    if(section == 'system'){
                        let success = null;
                        if(method == 'ExtrinsicSuccess'){
                            success = true;
                        }else if(method == 'ExtrinsicFailed'){
                            success = false;
                        }
                        // callback(success);
                    }
                });
            }
        });
        return txHash; */
    }
}


export default AppChains