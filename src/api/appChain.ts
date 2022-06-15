import { ApiPromise } from '@polkadot/api';
import { formatBalance } from '@polkadot/util';


class AppChains extends ApiPromise {
    constructor(config){
        super({...config});
    }
    getBlockHash(){
        return this.genesisHash.toHex()
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
}


export default AppChains