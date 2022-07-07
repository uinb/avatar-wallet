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
import {isEmpty} from 'lodash'; 

import {tokenAccountList} from '../../../../reducer/account';
import { If,Default,For } from 'react-statements'
const AppChainWrapper = (props:any) => {
    const { api } = props;
    const networkId = useAppSelector(selectNetwork);
    const chain = useAppSelector(selectChain(networkId));
    const config  = appChainsConfig[chain];
    const appChain = useAppSelector(selectAppChain(networkId, chain));
    const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));
    const {payload:defaultList} = useAppSelector(tokenAccountList);
    console.log("defa -- ",defaultList)
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
        if(isEmpty(networkConfig)){
            return []
        }
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

    const nativeTokens = useMemo(()=>{
        return networkConfig['tokens'].filter((token:any,index:any) => {
            return index === 0;
        }).map((item:any) => {
            return {
                ...item,
                balance:balance
            }
        })[0];
    },[networkConfig,balance]);

    useEffect(()=>{
        if(nativeTokens.balance === "--")return;
        dispatch(setTokenAccount({
            [chain]:[nativeTokens,...tokenList]
        }))
    },[tokenList,dispatch,chain,nativeTokens]);

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
    
    const handleBalanceOperation = (symbol:string) => {
        if(api)navigator(`/total-assets/${symbol.toLowerCase()}`)
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
                    <If when={api?true:false}>
                        <>
                        <Card className="mt2">
                            <ListItem disableGutters dense onClick={()=>handleBalanceOperation(networkConfig?.symbol)}>
                                <ListItemAvatar>
                                    <TokenIcon showSymbol={false} icon={appChain.appchain_metadata?.fungible_token_metadata?.icon} symbol={appChain.appchain_metadata?.fungible_token_metadata?.symbol} size={40}/>
                                </ListItemAvatar> 
                                <ListItemText primary={`${api ? balance : '--'} ${appChain.appchain_metadata?.fungible_token_metadata?.symbol}`} secondary={`$ ${api ? balance : '--'}`}/>
                            </ListItem>
                        </Card> 
                        <For of={tokens_list}>
                            {(tokens:any,index:any) => (
                                <Card className="mt2" key={index}>
                                    <ListItem disableGutters dense onClick={()=>handleBalanceOperation(tokens.symbol)}>
                                        <ListItemAvatar>
                                            <TokenIcon showSymbol={false} icon={tokens.logo} symbol={tokens?.symbol} size={40}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${tokenList[index]?.balance ? tokenList[index]?.balance : '--'} ${tokens?.symbol}`} secondary={`$ ${tokenList[index]?.balance ? tokenList[index]?.balance : '--'}`}/>
                                    </ListItem>
                                </Card> 
                            )}
                        </For>
                        </>
                        <Default>
                            {
                            defaultList[chain].map((tokens:any,index:any)=>(
                                <Card className="mt2" key={index}>
                                    <ListItem disableGutters dense component={Link} to={"/total-assets/"+tokens.symbol.toLowerCase()}>
                                        <ListItemAvatar>
                                            <TokenIcon showSymbol={false} icon={tokens.logo} symbol={tokens?.symbol} size={40}/>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${tokens.balance} ${tokens.symbol}`} secondary={`$ ${tokens.balance}`}/>
                                    </ListItem>
                                </Card> 
                                )) 
                            }
                        </Default>
                        
                    </If>
                    
                    
                </>
            ) : (
                <NullAccountWrapper chain="appchains"/>
            )}
        </Grid>
    )
}
export default withTheme(AppChainWrapper)