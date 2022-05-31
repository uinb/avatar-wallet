import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {DashboardHeader} from '../../components/header';
import './index.scss';
import chains from '../../../constant/chains';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core';
import NearCore from './near';
import { useAppSelector } from '../../../app/hooks';
import { selectNetwork, selectAppChains } from '../../../reducer/network';
import Avatar from '@material-ui/core/Avatar';

const Dashboard = (props:any) => {
    const {theme} = props;
    const [activeChain, setActiveChain] = useState('near');
    const networkId = useAppSelector(selectNetwork);
    const appChains = useAppSelector(selectAppChains(networkId));
    const handleChangeChain = (chain:string) => {
        setActiveChain(chain)
    }

    return (
        <Grid>
            <DashboardHeader />
            <Grid className="dashboard-content">
                <Grid className="chainList">
                    {Object.entries(chains).map(([key, item]: [string, any]) => {
                        return (
                            <div className="chainItem" key={key} >
                                <span className="activeBar" style={{background: theme.palette.primary.main, display: activeChain === key ? 'block' : 'none'}}></span>
                                <Typography color="primary" variant='caption' className="icon" onClick={() => handleChangeChain(key)} style={{backgroundColor: activeChain === key ? item.background : theme.palette.background.paper}}>
                                <img src={activeChain === key ? item.logo : item.inactiveLogo} alt="" width="18"/>
                                </Typography>
                            </div>
                        )
                    })}
                    {appChains?.map((item) => {
                        return (
                            <div className="chainItem" key={item.appchain_id} onClick={() => handleChangeChain(item.appchain_id)} >
                                <Avatar style={{width: 32, height: 32}}>
                                    {item.appchain_metadata.fungible_token_metadata.icon ? (
                                        <img src={activeChain === item.appchain_id ? item.appchain_metadata.fungible_token_metadata.icon : item.appchain_metadata.fungible_token_metadata.icon} alt="" width="100%"/>
                                    ) : item.appchain_id.substr(0,1).toUpperCase()}
                                </Avatar>
                                <span className="activeBar" style={{background: theme.palette.primary.main, display: activeChain === item.appchain_id ? 'block' : 'none'}}></span>
                            </div>
                        )
                    })}
                </Grid>
                <Grid className="chainContent">
                    <NearCore networkId={networkId} config={chains.near}/>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default withTheme(Dashboard); 