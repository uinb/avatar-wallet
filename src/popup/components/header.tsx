import React, {useMemo} from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import { DialogContent, makeStyles, Typography } from '@material-ui/core';
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
import { selectNetworkList,changeNetwork, selectNetwork, selectChain, selectAppChains, updateNetworkOptions} from '../../reducer/network';
import "./header.scss"
import { grey } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/Delete';


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
        textTransform: 'capitalize',
        maxWidth: 120,
        textAlign:'left'
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
      textTransform: 'capitalize',
      paddingRight: theme.spacing(1),
      wordBreak:'break-all',
      display: 'flex',
      justifyContnet: 'space-between',
      width: 'calc(100% - 32px)'
    },
    labelRoot:{
      width: '100%',
      display: 'flex',
      flexWrap: 'nowrap',
    },
    netlist:{
      overflow:'hidden',
      width: '100%',
      maxHeight: 300,
      overflowY:'scroll'
    },
    content:{
      overflow:'hidden'
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
            <ArrowBack color="inherit" onClick={handleCallback} style={{color: grey[500]}}/>
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
    console.log(selectedValue); 
    const dispatch = useAppDispatch();
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

    const isNativeNetwork = (value) => ['mainnet', 'testnet'].includes(value);
    const canDelete = (item) => {
      return !isNativeNetwork(item.name) && selectedValue !== item.name
    }
    const handleDelete = (item) => {
      dispatch(updateNetworkOptions(item.name))
    }
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" fullWidth open={open}>
        <DialogTitle id="simple-dialog-title">Network</DialogTitle>
        <IconButton aria-label="close" className={cn(classes.closeButton, 'ml1')} onClick={closeDialog}>
          <CloseIcon />
        </IconButton>
        <DialogContent className={classes.content}>
          <FormControl className={classes.netlist}>
            <RadioGroup name={selectedValue} value={selectedValue} onChange={handleChange}>
              {
                networkList.map((network, index) => (
                    <FormControlLabel 
                      key={index} 
                      value={network.name} 
                      control={<Radio />} 
                      classes={{
                        root: classes.labelRoot,
                        label: classes.label
                      }}
                      label={(
                        <Grid style={{width: '100%', display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap'}}>
                          <Typography variant="body2" component='span' className={cn('overflow-text')} style={{flex: '1 1 auto'}} title={network.name}>{network.name}</Typography>
                          {canDelete(network) ? <DeleteIcon color='primary' style={{flex: '0 0  32px'}} onClick={() => handleDelete(network)}/> : null}
                        </Grid>
                      )} 
                    />
                    
                ))
              }
            </RadioGroup>
          </FormControl>
          <Button 
            className="mt2" 
            variant="outlined" 
            color="primary" 
            size="large" 
            fullWidth 
            component={Link} 
            to="/addcustom"
          >+Add Custom</Button>
        </DialogContent>
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
    const [selectedValue, setSelectedValue] = React.useState(networkId);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value: any) => {
      setOpen(false);
      setSelectedValue(value);
      dispatch(changeNetwork(value));
      if(!['mainnet', 'testnet'].includes(value)){
        navigator('/custom');
      }else{
        navigator('/dashboard');
      }
    };
    const classes = useStyles();

    const handleToBridge = () => {
      if(activeChain === 'near'){
        navigator(`/bridge/near/${appChains[0].appchain_id}`, {replace: true});
      }else{
        navigator(`/bridge/${activeChain}/near`, {replace: true});
      }
    }

    const showBridge = useMemo(() => {
      return ['mainnet', 'testnet'].includes(networkId)
    },[networkId])


    return (
        <AppBar className={cn(classes.dashboardBar)}>
            <img src={dashboardLogo} alt="" height="24"/>
            <Grid>
                <Box className={cn(classes.fnTab, 'overflow-text')} style={{justifyContent:'flex-start'}} component="div" onClick={handleClickOpen}><FiberManualRecord color="primary" fontSize="inherit"/> &nbsp;{selectedValue} <ArrowDropDown color="action"/></Box>
                {showBridge ? (<Button color="primary" className={cn(classes.fnTab, 'ml1', classes.link)} onClick={handleToBridge}>Bridge</Button>) : null}
                <NetworkDialog 
                  networkList={networkList} 
                  selectedValue={selectedValue} 
                  open={open} 
                  onClose={handleClose} 
                />
                <IconButton className={cn(classes.iconButton, 'ml1')} component={Link} to="/settings">
                    <Settings fontSize='inherit'/>
                </IconButton>
            </Grid>
        </AppBar>
    )
}
