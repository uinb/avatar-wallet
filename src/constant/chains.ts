import near from '../img/chains/near.svg';
import nearGray from '../img/chains/near-gray.svg';
import nearIcon from '../img/near.svg';

interface InstanceProps{
    logo?: any;
    inactiveLogo?: any;
    name?: string;
    primary: string;
    background?: string;
    ftPriceUrl?: string;
    icon?: any 
}

interface ChainsProps {
    [key: string]: InstanceProps
}

export const appChainsConfig:ChainsProps = {
    myriad:{
        primary: '#862AE9', 
    },
    fusotao:{
        primary: '#dc2227', 
    },
    discovol:{
        primary: '#F06F18', 
    },
    debionetwork:{
        primary:'#E54CC9'
    },
    deip:{
        primary:'#1D2A00'
    },
    'deip-test':{
        primary:'#1D2A00'
    },
    atocha:{
        primary:'#ECC700'
    },
    "uniqueone-appchain":{
        primary:'#2C80F9'
    }
}


export default {
    near: {
        logo: near,
        inactiveLogo: nearGray,
        name:'near',
        primary: '#000000',
        background: '#000000',
        icon: nearIcon
    },
} as {
    [key:string]: {
        logo: any,
        inactiveLogo:any,
        name: string,
        primary: string,
        background: string
    }
} as ChainsProps