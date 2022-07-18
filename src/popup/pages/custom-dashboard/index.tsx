import React, {useCallback, useEffect, useState, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';
import { useAppSelector } from '../../../app/hooks';
import { selectNetwork, selectNetworkById } from '../../../reducer/network';
import useAppChain from '../../../hooks/useAppChain';
import { selectActiveAccountByNetworkId} from '../../../reducer/account';
import keyring from '@polkadot/ui-keyring';
import { formatBalance } from '@polkadot/util';
import {isEmpty} from 'lodash';
import { useLocation } from 'react-router-dom';
import Index from './components/index';
import AssetPage from './components/asset';
import TranferPage from './components/transfer';
import DepositPage from './components/deposit';


const CustomPage = () => {
    const [appChainApi, setAppChainApi] = useState(null);
    const networkId = useAppSelector(selectNetwork);
    const customConfig = useAppSelector(selectNetworkById(networkId));
    const activeAccount = useAppSelector(selectActiveAccountByNetworkId(''))
    const api = useAppChain(customConfig.networkUrl);
    const [chainMeta, setChainMeta] = useState({}) as any;

    const allAccounts = useMemo(() => {
        const accounts = keyring.getPairs()?.map(item => item.address);
        return accounts;
    },[])

    const fetchMetatdata = useCallback(async () => {
        if(!appChainApi){
            return ;
        }
        const result = await appChainApi.rpc.system.chain();
        const properties = await appChainApi.rpc.system.properties();
        const {tokenDecimals, tokenSymbol} = properties;
        setChainMeta({
            name: result.toString(), 
            decimal: tokenDecimals.toString().slice(1,-1), 
            symbol:tokenSymbol.toString().slice(1,-1)
        })
    },[appChainApi])

    useEffect(() => {
        if(!api){
            return 
        }
        setAppChainApi(api);
        fetchMetatdata();
    }, [api, fetchMetatdata])

    const [balance, setBalance] = useState('--');

    const fetchBalances = useCallback(async () => {
        if(!api || isEmpty(activeAccount) || isEmpty(chainMeta)){
            return ;
        }
        return api.query.system.account(activeAccount).then((resp: any) => {
            const { free } = resp?.data;
            const balance = formatBalance(free, { forceUnit: chainMeta?.symbol, withSi: true, withUnit: false }, Number(chainMeta?.decimal));
            setBalance(balance);
            return balance
        }).catch((e) => {
            return {
                balance:'0',
            }
        });
    },[api, activeAccount, chainMeta])

    useEffect(() => {
        fetchBalances();
    },[fetchBalances])

    const location = useLocation();

    return (
        <Grid>
            {location.pathname === '/custom' ? (<Index 
                allAccounts={allAccounts} 
                chainMeta={chainMeta}
                activeAccount={activeAccount}
                balance={balance}
            />) : null}
            {location.pathname.startsWith('/custom/asset') ? (
                <AssetPage 
                    allAccounts={allAccounts} 
                    chainMeta={chainMeta}
                    activeAccount={activeAccount}
                    balance={balance}
                />
            ): null}
            {location.pathname.startsWith('/custom/transfer') ? (
                <TranferPage 
                    allAccounts={allAccounts} 
                    chainMeta={chainMeta}
                    activeAccount={activeAccount}
                    balance={balance}
                    api={appChainApi}
                    sendCallback={() => fetchBalances()}
                />
            ): null}

            {location.pathname.startsWith('/custom/deposit') ? (
                <DepositPage 
                    allAccounts={allAccounts} 
                    chainMeta={chainMeta}
                    activeAccount={activeAccount}
                    balance={balance}
                    api={appChainApi}
                    
                />
            ): null}
        </Grid>
    )   
}

export default CustomPage;