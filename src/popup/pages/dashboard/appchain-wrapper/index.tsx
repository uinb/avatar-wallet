import Grid from '@material-ui/core/Grid';
import {withTheme} from '@material-ui/core/styles';
import AccountCard from '../../../components/chains-account-card';
import { appChainsConfig } from '../../../../constant/chains';
import { selectChain, selectAppChain, selectNetwork } from '../../../../reducer/network';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import keyring from '@polkadot/ui-keyring';
import NullAccountWrapper from '../../../components/null-account-wrapper';
import {useEffect, useMemo,useState} from 'react';
import {selectActiveAccountByNetworkId, setActiveAccount} from '../../../../reducer/account';
import { useNavigate } from 'react-router-dom';
import useAppChain from '../../../../hooks/useAppChain';
import mainnetConfig from '../../../../constant/mainnet-config';
import testnetConfig from '../../../../constant/testnet-config';
import { formatBalance } from '@polkadot/util';
const AppChainWrapper = (props:any) => {
    const networkId = useAppSelector(selectNetwork);
    const chain = useAppSelector(selectChain(networkId));
    const config  = appChainsConfig[chain];
    const appChain = useAppSelector(selectAppChain(networkId, chain));
    const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));
    const dispatch = useAppDispatch();
    const navigator = useNavigate();
    const handleAccountItemClick = (account:string) => {
        dispatch(setActiveAccount({account: account, networkId}))
    }
    const networkConfig = {mainnetConfig,testnetConfig};
    const networkIdKey = networkId+"Config";
    const symbol = networkConfig[networkIdKey][chain]['symbol'];
    const nodeId = networkConfig[networkIdKey][chain]['nodeId'];
    const api = useAppChain(nodeId);
    useEffect(() => {
        if(!api){
            return;
        }
        console.log(api.getBlockHash())
    },[api])
    // const tokensList = networkConfig[networkIdKey][chain]['tokens'];
    const [balance,setBalance] = useState('--') as any;
    useEffect(() => {
        if(!api){
            return;
        }
        //setLoading(true);
        (async () => {
            const { data:{ free } }  = await api.query.system.account(activeAccount) as any;
            const balance = formatBalance(free, { forceUnit: symbol, withSi: true, withUnit: false }, 18);
            setBalance(balance);
        })()
    },[activeAccount, api]);

    const handleOperateClick = (type:string) => {
        if(type === 'forgetAccount'){
            const result = keyring.forgetAccount(activeAccount);
            console.log(result);
            navigator('/dashboard', {replace: false})
        }else if(type === 'exportAccount'){
            const account = keyring.getPairs().find(item => item.address === activeAccount);
            const result = keyring.backupAccount(account, '')
        }
    }


    const address = useMemo(() => {
        const accounts = keyring.getPairs()?.map(item => item.address);
        if(!activeAccount && accounts.length){
            dispatch(setActiveAccount({account: accounts[0], networkId}))
        }
        return accounts
    }, [dispatch, activeAccount, networkId]);

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
                        activeAccount={activeAccount}
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
                                <ListItemText primary={`${appChain.appchain_metadata?.fungible_token_metadata?.symbol}`} secondary={balance}/>
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