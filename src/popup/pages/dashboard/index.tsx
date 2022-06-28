import Grid from '@material-ui/core/Grid';
import {DashboardHeader} from '../../components/header';
import './index.scss';
import chains from '../../../constant/chains';
import { Typography } from '@material-ui/core';
import { withTheme } from '@material-ui/core';
import NearCore from './near';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectNetwork, selectAppChains, setChain, selectChain} from '../../../reducer/network';
import Avatar from '@material-ui/core/Avatar';
import AppChainCore from './appchain-wrapper';
import cn from 'classnames'


const Dashboard = (props:any) => {
    const {theme} = props;
    const dispatch = useAppDispatch();
    const networkId = useAppSelector(selectNetwork);
    const activeChain = useAppSelector(selectChain(networkId));
    const appChains = useAppSelector(selectAppChains(networkId));
    const handleChangeChain = (chain:string) => {
        dispatch(setChain({networkId, chain}));
    }
    
    return (
        <Grid>
            <DashboardHeader />
            <Grid className="dashboard-content">
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
                                <Avatar className="img">
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
                    {activeChain === 'near' ? <NearCore networkId={networkId} config={chains.near}/> : null}
                    {activeChain !== 'near' ? <AppChainCore /> : null}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default withTheme(Dashboard); 