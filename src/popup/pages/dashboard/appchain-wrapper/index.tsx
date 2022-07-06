import Grid from '@material-ui/core/Grid';
import {withTheme} from '@material-ui/core/styles';
import AccountCard from '../../../components/chains-account-card';
import { appChainsConfig } from '../../../../constant/chains';
import { selectChain, selectAppChain, selectNetwork } from '../../../../reducer/network';
import {  setTokenAccount } from '../../../../reducer/account';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import keyring from '@polkadot/ui-keyring';
import NullAccountWrapper from '../../../components/null-account-wrapper';
import {useEffect, useMemo, useState} from 'react';
import {selectActiveAccountByNetworkId, setActiveAccount} from '../../../../reducer/account';
import { useNavigate } from 'react-router-dom';
import {selectConfig} from '../../../../utils';
import {Link} from 'react-router-dom';
import TokenIcon from '../../../components/token-icon';
import { saveAs } from 'file-saver';
import { toUsd } from '../../../../utils';
import Typography from '@material-ui/core/Typography';
import {grey} from '@material-ui/core/colors';

const AppChainWrapper = (props:any) => {
    const { api } = props;
    const networkId = useAppSelector(selectNetwork);
    const chain = useAppSelector(selectChain(networkId));
    const config  = appChainsConfig[chain];
    const appChain = useAppSelector(selectAppChain(networkId, chain));
    const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));
    // const defaultAccountList = useAppSelector(tokenAccountList);
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

    let tokens_list = useMemo(()=>{
        return networkConfig['tokens'].filter((token:any,index:any) => {
            return index !== 0;
        }).map((item:any) => {
            return {
                ...item,
                balance:"--"
            }
        });
    },[networkConfig]);
    const [tokenList,setTokenList] = useState(tokens_list) as any;

    const [balance,setBalance] = useState('--') as any;

    useEffect(() => {
        if(!api || !activeAccount || !networkConfig){
            setBalance('--')
            return 
        }
        (async () => {
            const balance = await api.fetchBalances(activeAccount, networkConfig);
            setBalance(balance);
        })()
    },[activeAccount, api, networkConfig, chain]);
    useEffect(()=>{
        if(!api || !activeAccount || !tokens_list.length){
            return;
        }
        (async ()=>{
            const tokensInfo = await api.fetchAccountTonkenBalances(activeAccount, tokens_list, networkConfig)
            setTokenList(tokensInfo);
        })()
    },[api,activeAccount,networkConfig,tokens_list])

    useEffect(()=>{

        dispatch(setTokenAccount({
            [chain]:tokenList
        }))
    },[tokenList,dispatch,chain]);

    const handleOperateClick = (type:string) => {
        if(type === 'forgetAccount'){
            keyring.forgetAccount(activeAccount);
            navigator('/dashboard', {replace: true})
        }else if(type === 'exportAccount'){
            const account = keyring.getPairs().find(item => item.address === activeAccount);
            const result = keyring.backupAccount(account, '')
            const blob = new Blob([JSON.stringify(result)], { type: 'application/json; charset=utf-8' });
            saveAs(blob, `${activeAccount}.json`);
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
                            <ListItem disableGutters dense component={Link} to={"/total-assets/" + networkConfig?.symbol.toLowerCase()}>
                                <ListItemAvatar>
                                    <TokenIcon 
                                        showSymbol={false} 
                                        icon={appChain.appchain_metadata?.fungible_token_metadata?.icon} 
                                        symbol={appChain.appchain_metadata?.fungible_token_metadata?.symbol} 
                                        size={40}
                                    />
                                </ListItemAvatar> 
                                <ListItemText 
                                    className='ml1'
                                    primary={
                                        <Typography variant="body1">
                                            {api ? Number(balance || 0).toFixed(4) : '--' }
                                            <Typography variant="caption" color="textSecondary" component="span" className="ml1">
                                                {appChain.appchain_metadata?.fungible_token_metadata?.symbol}
                                            </Typography>
                                        </Typography>
                                    } 
                                    secondary={
                                        <Typography variant='caption' component="span" style={{color: grey[500]}}>
                                            {toUsd(balance, 0)} USD
                                        </Typography>
                                    } 
                                />
                            </ListItem>
                        </Card> 
                    </Grid>
                    {
                        tokens_list.map((tokens:any,index:any)=>(
                            <Card className="mt2" key={index}>
                                <ListItem disableGutters dense component={Link} to={"/total-assets/"+tokens.symbol.toLowerCase()}>
                                    <ListItemAvatar>
                                        <TokenIcon showSymbol={false} icon={tokens.logo} symbol={tokens?.symbol} size={40}/>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        className='ml1'
                                        primary={
                                            <Typography variant="body1">
                                                {tokenList[index]?.balance ? tokenList[index]?.balance : '--'}
                                                <Typography variant="caption" color="textSecondary" component="span" className="ml1">
                                                    {tokens?.symbol}
                                                </Typography>
                                            </Typography>
                                        } 
                                        secondary={
                                            <Typography variant='caption' component="span" style={{color: grey[500]}}>
                                                {toUsd(tokenList[index]?.balance, 0)} USD
                                            </Typography>
                                        } 
                                    />
                                </ListItem>
                            </Card> 
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