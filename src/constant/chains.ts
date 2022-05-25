import near from '../img/chains/near.svg';
import nearGray from '../img/chains/near-gray.svg';
import fusotaoGray from '../img/chains/tao-gray.svg';
import fusotao from '../img/chains/tao.svg';

interface InstanceProps{
    logo: any;
    inactiveLogo: any;
    name: string;
    primary: string;
    background: string;
    ftPriceUrl?: string;
}

interface ChainsProps {
    [key: string]: InstanceProps
}


export default {
    near: {
        logo: near,
        inactiveLogo: nearGray,
        name:'near',
        primary: '#000000',
        background: '#000000',
        ftPriceUrl:'https://indexer.ref-finance.net/list-token-price',
    },
    fusotao: {
        logo: fusotao,
        inactiveLogo: fusotaoGray,
        name:'Fusotao',
        primary: '#F23E5F',
        background: '#fafafa',
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