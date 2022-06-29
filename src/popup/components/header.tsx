import React from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, Typography } from '@material-ui/core';
import { Link, useNavigate} from 'react-router-dom';
import dashboardLogo from '../../img/dashboard-logo.svg';
import cn from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Settings from '@material-ui/icons/Settings';
import Grid from '@material-ui/core/Grid';
import FiberManualRecord from '@material-ui/icons/FiberManualRecord';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Box from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import { useAppSelector,useAppDispatch } from '../../app/hooks';
import { selectNetworkList,changeNetwork, selectNetwork, selectChain, selectAppChains} from '../../reducer/network';
import "./header.scss"


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
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    label:{
      textTransform: 'capitalize'
    }
}))

export const HeaderWithBack  = (props:any) => {
    const classes = useStyles();
    const {back = '/', callback, action, title = '', ...restProps } = props;
    const navigator = useNavigate();
    const handleCallback= () =>{
        if(callback){
            callback();
        }else{
            navigator(back, {replace: true});
        }
    }
    return (
        <AppBar className={classes.root} {...restProps}>
            <ArrowBack color="inherit" onClick={handleCallback}/>
            <Typography variant='body1' align='center'>{title}</Typography>
            <div>
              {action}
            </div>
        </AppBar>
    )
}
export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  networkList: any;
  onClose: (value: string) => void;
}
export const NetworkDialog = (props: SimpleDialogProps) => {
    const { networkList, onClose, selectedValue, open } = props;
    const handleClose = () => {
      onClose(selectedValue);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onClose((event.target as HTMLInputElement).value);
    };
    const closeDialog = () => {
      onClose(selectedValue)
    }
    const classes = useStyles();
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" fullWidth open={open}>
        <DialogTitle id="simple-dialog-title">Network</DialogTitle>
        <IconButton aria-label="close" className={cn(classes.closeButton, 'ml1')} onClick={closeDialog}>
          <CloseIcon />
        </IconButton>
        <FormControl component="fieldset">
          <div className='box'>
            <RadioGroup aria-label="gender" name={selectedValue} value={selectedValue} onChange={handleChange}>
              {
                networkList.map((network, index) => (
                  <FormControlLabel key={index} value={network.name} classes={{root: classes.label}} control={<Radio />} label={network.name} />
                ))
              }
            </RadioGroup>
            <Button variant="outlined" color="primary" size="large" fullWidth component={Link} to="/addcustom">+Add Custom</Button>
          </div>
        
      </FormControl>
      </Dialog>
    );
}
export const DashboardHeader = () => {
    const [open, setOpen] = React.useState(false);
    const networkList = useAppSelector(selectNetworkList);
    const networkId = useAppSelector(selectNetwork)
    const dispatch = useAppDispatch();
    const activeChain = useAppSelector(selectChain(networkId));
    const appChains = useAppSelector(selectAppChains(networkId))
    const navigator = useNavigate();
    /* const activeNetwork = networkList.filter(network => {
      return network.active === true;
    }) */
    const [selectedValue, setSelectedValue] = React.useState(networkId);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value: any) => {
      setOpen(false);
      setSelectedValue(value);
      dispatch(changeNetwork(value));
    };
    const classes = useStyles();

    const handleToBridge = () => {
      if(activeChain === 'near'){
        navigator(`/bridge/near/${appChains[0].appchain_id}`, {replace: true});
      }else{
        navigator(`/bridge/${activeChain}/near`, {replace: true});
      }
    }

    return (
        <AppBar className={cn(classes.dashboardBar)}>
            <img src={dashboardLogo} alt="" height="24"/>
            <Grid>
                <Box className={classes.fnTab} onClick={handleClickOpen}><FiberManualRecord color="primary" fontSize="inherit"/> &nbsp;{selectedValue} <ArrowDropDown color="action"/></Box>
                <Button color="primary" className={cn(classes.fnTab, 'ml1', classes.link)} onClick={handleToBridge}>Bridge</Button>
                <NetworkDialog networkList={networkList} selectedValue={selectedValue} open={open} onClose={handleClose} />
                <IconButton className={cn(classes.iconButton, 'ml1')} component={Link} to="/settings">
                    <Settings fontSize='inherit'/>
                </IconButton>
            </Grid>
        </AppBar>
    )
}
