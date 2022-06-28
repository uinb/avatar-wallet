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
import {selectConfig} from '../../../../utils';
import {Link} from 'react-router-dom';


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
    const networkConfig = useMemo(() => {
        if(!networkId || !chain){
            return {} as any
        }
        return selectConfig(chain, networkId);
    },[chain, networkId])
    const {symbol='', nodeId=''} = networkConfig;
    const api = useAppChain(nodeId);
    let tokens_list = useMemo(()=>{
        return networkConfig['tokens'].filter((token:any,index:any) => {
            return index !== 0;
        }).map((item:any) => {
            return {
                ...item,
                balance:"--"
            }
        });
    },[chain,networkConfig]);
    const [tokenList,setTokenList] = useState(tokens_list) as any;
    const [balance,setBalance] = useState('--') as any;
    useEffect(() => {
        if(!api || !activeAccount || !symbol){
            return;
        }
        //setLoading(true);
        (async () => {
            const balance = await api.fetchBalances(activeAccount, symbol);
            setBalance(balance);
            
        })()
    },[activeAccount, api, symbol]);

    useEffect(()=>{
        if(!api || !activeAccount || !symbol || !tokens_list.length){
            return;
        }
        (async ()=>{
            const tokensInfo = await api.fetchAccountTonkenBalances(activeAccount, symbol, tokens_list, networkConfig.tokenModule, networkConfig.tokenMethod)
            setTokenList(tokensInfo);
        })()
    },[api,activeAccount,symbol,networkConfig,tokens_list])

    const handleOperateClick = (type:string) => {
        if(type === 'forgetAccount'){
            const result = keyring.forgetAccount(activeAccount);
            console.log(result);
            navigator('/dashboard', {replace: false})
        }else if(type === 'exportAccount'){
            const account = keyring.getPairs().find(item => item.address === activeAccount);
            const result = keyring.backupAccount(account, '')
            console.log(result);
        }
    }


    const address = useMemo(() => {
        const accounts = keyring.getPairs()?.map(item => item.address);
        if(!activeAccount && accounts.length){
            dispatch(setActiveAccount({account: accounts[0], networkId}))
        }
        return accounts
    }, [dispatch, activeAccount, networkId]);

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
                            <ListItem disableGutters dense component={Link} to={"/total-assets/"+symbol.toLowerCase()}>
                                <ListItemAvatar>
                                    {appChain.appchain_metadata?.fungible_token_metadata?.icon ? (
                                        <Avatar style={{height: 32, width:32, background: 'transparent'}}>
                                        <img src={appChain.appchain_metadata?.fungible_token_metadata?.icon} alt="" width="100%"/>
                                        </Avatar>
                                    ): (
                                        <Avatar style={{height: 32, width:32}}>{appChain.appchain_metadata?.fungible_token_metadata?.symbol.slice(0,1)}</Avatar>
                                    )}
                                </ListItemAvatar>
                                <ListItemText primary={`${balance} ${appChain.appchain_metadata?.fungible_token_metadata?.symbol}`} secondary={balance+" $"}/>
                            </ListItem>
                        </Card> 
                    </Grid>
                    {
                        tokens_list.map((tokens:any,index:any)=>(
                            <Grid className="">
                                <Card className="mt2">
                                    <ListItem disableGutters dense component={Link} to={"/total-assets/"+tokens.symbol.toLowerCase()}>
                                        <ListItemAvatar>
                                            <Avatar style={{height: 32, width:32, background: 'transparent'}}>
                                                <img src={tokens.logo} alt="" width="100%"/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${tokenList[index].balance} ${tokens?.symbol}`} secondary={tokenList[index].balance+" $"}/>
                                    </ListItem>
                                </Card> 
                            </Grid>
                        ))
                    }
                </>
            ) : (
                <NullAccountWrapper chain="appchains"/>
            )}
        </Grid>
    )
}
export default withTheme(AppChainWrapper)