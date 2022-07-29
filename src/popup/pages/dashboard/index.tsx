import Grid from '@material-ui/core/Grid';
import {DashboardHeader} from '../../components/header';
import './index.scss';
import chains from '../../../constant/chains';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core';
import NearCore from './near';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectNetwork, selectAppChains, setChain, selectChain, fetchAppChains} from '../../../reducer/network';
import AppChainCore from './appchain-wrapper';
import cn from 'classnames'
import { useEffect, useMemo, useState } from 'react';
import useAppChain from '../../../hooks/useAppChain';
import {selectConfig} from '../../../utils';
import TokenIcon from '../../components/token-icon';
import Loading from '../../components/loading';
import Content from '../../components/layout-content';
import { useNavigate } from 'react-router-dom';
const extension = require('extensionizer');

const Dashboard = (props:any) => {
    const {theme} = props;
    const dispatch = useAppDispatch();
    const networkId = useAppSelector(selectNetwork);
    const activeChain = useAppSelector(selectChain(networkId));
    const appChains = useAppSelector(selectAppChains(networkId));
    const [appChainApi, setAppChainApi] = useState(null);
    const [expiredTime, setExpiredTime] = useState(0);
    const navigator = useNavigate();
    extension.storage.local.get(['password', 'expiredTime'], function(result) {
        setExpiredTime(result.expiredTime)
    });

    useEffect(() => {
        if(!expiredTime){
            return
        }
        if(!(expiredTime > Date.now())){
            navigator('/sign-in')
        }
    },[expiredTime, navigator])

    const networkConfig = useMemo(() => {
        if(!networkId || !activeChain || activeChain === 'near'){
            return {} as any
        }
        return selectConfig(activeChain, networkId);
    },[activeChain, networkId])
    const api = useAppChain(networkConfig?.nodeId);

    useEffect(() => {
        setAppChainApi(api)
    },[api])
    const handleChangeChain = (chain:string) => {
        setAppChainApi(null);
        dispatch(setChain({networkId, chain}));
    }

    useEffect(() => {
        setAppChainApi(null)
    },[networkId])

    useEffect(() => {
        if(!networkId) {
            return;
        }
        dispatch(fetchAppChains({networkId}))
    },[networkId, dispatch])
    
    return (
        <Grid>
            <DashboardHeader />
            <Content className="dashboard-content">
                {activeChain === 'near' || appChainApi ? (
                        <>
                            <Grid className="chainList">
                                {Object.entries(chains).map(([key, item]: [string, any]) => {
                                    return (
                                        <div className={cn('chainItem', activeChain === item.appchain_id ? 'active' :'')} key={key} >
                                            <span className="activeBar" style={{background: theme.palette.primary.main, display: activeChain === key ? 'block' : 'none'}}></span>
                                            <Typography color="primary" variant='caption' className="icon" onClick={() => handleChangeChain(key)} style={{backgroundColor: activeChain === key ? item.background : theme.palette.background.paper}}>
                                            <img src={activeChain === key ? item.logo : item.inactiveLogo} alt="" width="18"/>
                                            </Typography>
                                        </div>
                                    )
                                })}
                                {appChains?.map((item) => {
                                    return (
                                        <div className={cn('chainItem', activeChain === item.appchain_id ? 'active' :'')} key={item.appchain_id} onClick={() => handleChangeChain(item.appchain_id)} >
                                            <TokenIcon 
                                                className="img" 
                                                icon={item.appchain_metadata.fungible_token_metadata.icon} 
                                                symbol={item.appchain_id} 
                                                showSymbol={false}
                                                size={32}
                                                bg={true}
                                            />
                                            <span className="activeBar" style={{background: theme.palette.primary.main, display: activeChain === item.appchain_id ? 'block' : 'none'}}></span>
                                        </div>
                                    )
                                })}
                            </Grid>
                            <Grid className="chainContent">
                                {activeChain === 'near' ? <NearCore networkId={networkId} config={chains.near}/> : null}
                                {activeChain !== 'near' ? <AppChainCore api={appChainApi}/> : null}
                            </Grid>
                        </>
                    ) : (
                        <Loading /> 
                    )
                }
            </Content>
        </Grid>
    )
}

export default withTheme(Dashboard); 