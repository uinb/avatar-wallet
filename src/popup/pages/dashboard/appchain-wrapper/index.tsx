import Grid from '@material-ui/core/Grid';
import {withTheme} from '@material-ui/core/styles';
import AccountCard from '../../../components/chains-account-card';
import { appChainsConfig } from '../../../../constant/chains';
import { selectChain, selectAppChain, selectNetwork } from '../../../../reducer/network';
import { useAppSelector } from '../../../../app/hooks';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import keyring from '@polkadot/ui-keyring';
import NullAccountWrapper from '../../../components/null-account-wrapper';
import {useMemo} from 'react';



const AppChainWrapper = (props:any) => {
    const networkId = useAppSelector(selectNetwork);
    const chain = useAppSelector(selectChain(networkId));
    const config  = appChainsConfig[chain];
    const appChain = useAppSelector(selectAppChain(networkId, chain));
    const handleAccountItemClick = () => {

    }

    const handleOperateClick = () => {

    }

    const address = useMemo(() => {
        return keyring.getPairs()?.map(item => item.address)
    }, []);
    console.log(address);

    /* useEffect(() => {
        (async() => {
            const result = await Near.fetchContractTokens();
            console.log('tokens',result);
        })()
    },[]) */

    const operations = [
        {
            label:'Create Account',
            value: 'createAccount',
            link:"/create-account/appchains"
        },
        {
            label:'Import Account',
            value: 'importAccount',
            link:'/import-account/appchains'
        },
        {
            label:'Export Account',
            value: 'exportAccount'
        },
        {
            label:'Forget Account',
            value: 'forgetAccount'
        }
    ]
    return (
        <Grid component="div" className="px1 mt1">
            {address.length ? (
                <>
                    <AccountCard 
                        accounts={address}
                        handleAccountItemClick={handleAccountItemClick}
                        handleOperateClick={handleOperateClick}
                        config={config}
                        operations={operations}
                        activeAccount={''}
                    />
                    <Grid className="mt4">
                        <Card className="mt2">
                            <ListItem disableGutters dense>
                                <ListItemAvatar>
                                    {appChain.appchain_metadata?.fungible_token_metadata?.icon ? (
                                        <Avatar style={{height: 32, width:32, background: 'transparent'}}>
                                        <img src={appChain.appchain_metadata?.fungible_token_metadata?.icon} alt="" width="100%"/>
                                        </Avatar>
                                    ): (
                                        <Avatar style={{height: 32, width:32}}>{appChain.appchain_metadata?.fungible_token_metadata?.symbol.slice(0,1)}</Avatar>
                                    )}
                                </ListItemAvatar>
                                <ListItemText primary={`${appChain.appchain_metadata?.fungible_token_metadata?.symbol}`}/>
                            </ListItem>
                        </Card> 
                    </Grid>
                </>
            ) : (
                <NullAccountWrapper chain="appchains"/>
            )}
        </Grid>
    )
}


export default withTheme(AppChainWrapper)