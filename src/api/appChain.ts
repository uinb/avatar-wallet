import { ApiPromise } from '@polkadot/api';

class AppChains extends ApiPromise {
    constructor(config){
        super({...config});
    }
    getBlockHash(){
        return this.genesisHash.toHex()
    }
}


export default AppChains