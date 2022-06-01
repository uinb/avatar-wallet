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
/* import {useEffect} from 'react';
import { Near } from '../../../../api'; */

const AppChainWrapper = (props:any) => {
    const networkId = useAppSelector(selectNetwork);
    const chain = useAppSelector(selectChain(networkId));
    const config  = appChainsConfig[chain];
    const appChain = useAppSelector(selectAppChain(networkId, chain));
    const handleAccountItemClick = () => {

    }

    const handleOperateClick = () => {

    }

    /* useEffect(() => {
        if(!appChain){
            return 
        }
        (async() => {
            const result = await Near.fetchContractTokens(appChain.appchain_anchor);
            console.log('tokens',result);
        })()
    },[appChain]) */
  /*   useEffect(() => {
        (async() => {
            const result = await Near.fetchAppChainTokenBalance(appChain.appchain_owner, 'lindawu8134.testnet');
            console.log('balances', result);
        })()
    },[]) */
    return (
        <Grid component="div" className="px1 mt1">
            <AccountCard 
                accounts={[]}
                handleAccountItemClick={handleAccountItemClick}
                handleOperateClick={handleOperateClick}
                config={config}
                operations={[]}
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
        </Grid>
    )
}


export default withTheme(AppChainWrapper)