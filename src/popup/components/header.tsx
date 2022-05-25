import React from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core';
import { Link, useNavigate} from 'react-router-dom';
import dashboardLogo from '../../img/dashboard-logo.svg';
import cn from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import Grid from '@material-ui/core/Grid';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Box from '@material-ui/core/Button';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {setNetwork, selectNetwork} from '../../reducer/network';

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.background.default,
        color: theme.palette.text.secondary,
        padding: `${theme.spacing(1)}px`,
        boxShadow: '0 0 0',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        display: 'flex', 
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        flexDirection: 'row'
    },
    dashboardBar:{
        background: theme.palette.background.paper,
        padding: `${theme.spacing(1)}px`,
        boxShadow: '0 0 0', 
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingright: theme.spacing(1),
        justifyContent: 'space-between'
    },
    iconButton:{
        background: theme.palette.background.default,
        borderRadius: theme.spacing(0.5),
        height:32,
        width:32,
        fontSize: 16,
        boxSizing: 'border-box'
    },
    fnTab:{
        background: theme.palette.background.default,
        fontSize: 12,
        cursor: 'pointer',
        textTransform: 'capitalize'
    },
    link:{
        color: theme.palette.primary.main
    }
}))

export const HeaderWithBack  = (props:any) => {
    const classes = useStyles();
    const {back = '/', callback, action, ...restProps } = props;
    const navigator = useNavigate();
    const handleCallback= () =>{
        if(callback){
            callback();
        }else{
            navigator(back);
        }
    }
    return (
        <AppBar className={classes.root} {...restProps}>
            <ArrowBack color="inherit" onClick={handleCallback}/>
            {action}
        </AppBar>
    )
}

export const DashboardHeader = () => {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const networkId = useAppSelector(selectNetwork);
    const handleChangeNetworkId = () => {
        if(networkId === 'mainnet'){
            dispatch(setNetwork('testnet'))
        }else{
            dispatch(setNetwork('mainnet'))
        }
    }
    return (
        <AppBar className={cn(classes.dashboardBar)}>
            <img src={dashboardLogo} alt="" height="24"/>
            <Grid>
                <Box className={classes.fnTab} onClick={() => handleChangeNetworkId()}><FiberManualRecord color="primary" fontSize="inherit"/> &nbsp;{networkId} <ArrowDropDown color="action"/></Box>
                <Box className={cn(classes.fnTab, 'ml1', classes.link)} component={Link} to="/bridge">Bridge</Box>
                <IconButton className={cn(classes.iconButton, 'ml1')} component={Link} to="/">
                    <Settings fontSize='inherit'/>
                </IconButton>
            </Grid>
        </AppBar>
    )
}
