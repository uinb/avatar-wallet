import Grid from '@material-ui/core/Grid';
import {withTheme} from '@material-ui/core/styles';
import AccountCard from '../../../components/chains-account-card';
import { appChainsConfig } from '../../../../constant/chains';
import { selectChain, selectAppChain, selectNetwork } from '../../../../reducer/network';
import {  setTokenAccount } from '../../../../reducer/account';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import keyring from '@polkadot/ui-keyring';
import NullAccountWrapper from '../../../components/null-account-wrapper';
import {useEffect, useMemo, useState} from 'react';
import {selectActiveAccountByNetworkId, setActiveAccount} from '../../../../reducer/account';

import { useNavigate,useLocation } from 'react-router-dom';
import {selectConfig} from '../../../../utils';
import { saveAs } from 'file-saver';
import {isEmpty} from 'lodash'; 
import TokenItem from '../../../components/token-item';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import qs from 'qs';
import Typography from '@material-ui/core/Typography';

import {tokenAccountList} from '../../../../reducer/account';
import { If,Default,For } from 'react-statements'
const AppChainWrapper = (props:any) => {
    const { api } = props;
    const networkId = useAppSelector(selectNetwork);
    const chain = useAppSelector(selectChain(networkId));
    const config  = appChainsConfig[chain];
    const appChain = useAppSelector(selectAppChain(networkId, chain));
    const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));
    const defaultList = useAppSelector(tokenAccountList(networkId));
    const dispatch = useAppDispatch();
    const navigator = useNavigate();
    const handleAccountItemClick = (account:string) => {
        dispatch(setActiveAccount({account: account, networkId}))
    }
    const location = useLocation();
    const query = qs.parse(location.search.replace('?',''));
    const activeTab = query?.activeTabs || 'assets'
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
    const [balanceSymbol,setBalanceSymbol] = useState() as any;

    useEffect(() => {
        let unsubscribe = null;
        if(!api || !activeAccount || !networkConfig){
            setBalance('--')
            return 
        }
        (async () => {
            const {balance,symbol} = await api.fetchBalances(activeAccount, networkConfig);
            setBalance(balance);
            setBalanceSymbol(symbol);
            unsubscribe = await api.setSubscribe(activeAccount, networkConfig, ({balance,symbol})=>{
                setBalance(balance);
                setBalanceSymbol(symbol);
            })
        })();
        return ()=>{
            if(!unsubscribe)return;
            unsubscribe();
        }
    },[activeAccount, api, networkConfig, chain]);
    
    useEffect(()=>{
        let unsubscribeList = [];
        if(!api || !activeAccount || !tokens_list.length){
            return;
        }
        (async ()=>{
            const tokensInfo = await api.fetchAccountTonkenBalances(activeAccount, tokens_list, networkConfig)
            tokens_list.forEach(async (token:any,index:any)=>{
               let unsubscribe = await api.setSubscribeToken({params: {code: token.code, account:activeAccount, symbol: token.symbol, decimal: token.decimal}, config:networkConfig},({balance,formattedBalance})=>{
                const accountInfo = tokens_list.map((item:any,index:any)=>{
                    let cover_balance = (item?.balance ==='--'?"0":item?.balance) || "0",cover_formattedBalance = item?.formattedBalance || "0";
                    if(item.symbol === token.symbol){
                        cover_balance = balance;
                        cover_formattedBalance = formattedBalance;
                    }
                    return {
                        ...item,
                        balance: cover_balance,
                        formattedBalance:cover_formattedBalance
                    }
                });
                setTokenList(accountInfo);
               });
               unsubscribeList.push(unsubscribe);
            })
            setTokenList(tokensInfo);
        })()
        return ()=>{
            unsubscribeList.forEach(fn => {
                fn();
            })
        }
    },[api,activeAccount,networkConfig,tokens_list])

    const nativeTokens = useMemo(()=>{
        if(isEmpty(networkConfig)){
            return []
        }
        return networkConfig['tokens'].filter((token:any,index:any) => {
            return index === 0;
        }).map((item:any) => {
            return {
                ...item,
                balance:item.symbol.toUpperCase() === balanceSymbol?balance:"--",
                formattedBalance:(item.symbol.toUpperCase() === balanceSymbol && api)?api.inputLimit(balance,4):"--"
            }
        })[0];
    },[networkConfig,balance,balanceSymbol,api]);
    useEffect(()=>{
        if(!tokens_list.length && nativeTokens.balance !== "--"){
            dispatch(setTokenAccount({
                chain:chain,
                networkId,
                list:[nativeTokens]
            }))
        }
        if(!tokens_list.length || nativeTokens.balance === "--" || tokenList.length !== tokens_list.length)return;
        dispatch(setTokenAccount({
            chain:chain,
            networkId,
            list:[nativeTokens,...tokenList]
        }))
    },[tokenList,dispatch,networkId,chain,nativeTokens,tokens_list]);

    const handleOperateClick = (type:string) => {
        if(type === 'forgetAccount'){
            keyring.forgetAccount(activeAccount);
            dispatch(setActiveAccount({account: address.filter(account => account !== activeAccount)[0], networkId}))
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
        <Grid component="div" className="px1 mt1" style={{height: '100%'}}>
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
                    <Grid style={{height: 'calc(100vh - 100px)',zIndex: 0}}>
                        <Tabs indicatorColor="primary" textColor="primary" value={activeTab} onChange={(e, value) => navigator(`/dashboard?activeTabs=${value}`)}>
                            <Tab label="Assets" value="assets"/>
                            <Tab label="NFTs" value="nfts"/>
                        </Tabs>
                        <AutoSizer>
                            {({width,height}) => {
                                return (
                                    <div style={{overflowY: 'scroll', height: height, width: width}}>
                                        {
                                            activeTab === 'assets' ?(
                                                <If when={api && balance !== '--'?true:false}>
                                                    <>
                                                    <TokenItem
                                                        token={{
                                                            logo:appChain.appchain_metadata?.fungible_token_metadata?.icon,
                                                            symbol:appChain.appchain_metadata?.fungible_token_metadata?.symbol,
                                                            balance:balance
                                                        }}
                                                        showNative
                                                        key={appChain.appchain_metadata?.fungible_token_metadata?.symbol}
                                                        className="mt2"
                                                        handleItemClick={() =>handleBalanceOperation(networkConfig?.symbol)}
                                                    />
                                                    <For of={tokens_list}>
                                                        {(tokens:any,index:any) => (
                                                            <TokenItem
                                                                token={{
                                                                    ...tokens,
                                                                    balance:tokenList[index]?.balance
                                                                }}
                                                                showNative
                                                                key={index}
                                                                className="mt2"
                                                                handleItemClick={() => handleBalanceOperation(tokens.symbol)}
                                                            />
                                                        )}
                                                    </For>
                                                    </>
                                                    <Default>
                                                        <If when={(defaultList?defaultList[chain]:false)?true:false}>
                                                            <For of={defaultList?defaultList[chain]:[]}>
                                                                {(tokens:any,index:any)=>(
                                                                    <TokenItem
                                                                        token={tokens}
                                                                        showNative
                                                                        key={index}
                                                                        className="mt2"
                                                                        handleItemClick={() => handleBalanceOperation(tokens.symbol)}
                                                                    />
                                                                )}
                                                            </For>
                                                            <Default>
                                                                <TokenItem
                                                                    token={{
                                                                        logo:nativeTokens.logo,
                                                                        symbol:nativeTokens.symbol,
                                                                        balance:0
                                                                    }}
                                                                    showNative
                                                                    key={nativeTokens.symbol}
                                                                    className="mt2"
                                                                />
                                                            </Default>
                                                        </If>
                                                    </Default>
                                                </If>
                                            ):null
                                        }
                                        {
                                            activeTab === "nfts"?(
                                                <Typography variant="caption" color="primary" className="mt1" component='div' align="left">No Collections</Typography>
                                            ):null
                                        }
                                    </div>
                                )
                            }}
                        </AutoSizer>

                    </Grid>
                </>
            ) : (
                <NullAccountWrapper chain="appchains"/>
            )}
        </Grid>
    )
}
export default withTheme(AppChainWrapper)