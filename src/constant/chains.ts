import near from '../img/chains/near.svg';
import nearGray from '../img/chains/near-gray.svg';
import fusotaoGray from '../img/chains/tao-gray.svg';
import fusotao from '../img/chains/tao.svg';
import nearIcon from '../img/near.svg';

interface InstanceProps{
    logo: any;
    inactiveLogo: any;
    name: string;
    primary: string;
    background: string;
    ftPriceUrl?: string;
    icon?: any 
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
        
        icon: nearIcon
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