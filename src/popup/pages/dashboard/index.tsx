import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {DashboardHeader} from '../../components/header';
import './index.scss';
import chains from '../../../constant/chains';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core';
import NearCore from './near';

const Dashboard = (props:any) => {
    const {theme} = props;
    const [activeChain, setActiveChain] = useState('near');
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
                </Grid>
                <Grid className="chainContent">
                    <NearCore networkId="testnet"/>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default withTheme(Dashboard); 