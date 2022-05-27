import React from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
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
import "./header.scss"
const networks = ['Mainnet','Testnet'];

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.background.default,
        color: theme.palette.text.secondary,
        padding: `${theme.spacing(1)}px`,
        boxShadow: '0 0 0',
        paddingLeft: theme.spacing(1),
        paddingright: theme.spacing(1),
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
        cursor: 'pointer'
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
}))

export const HeaderWithBack  = (props:any) => {
    const classes = useStyles();
    const {back = '/' } = props;
    const navigator = useNavigate();
    return (
        <AppBar className={classes.root}>
            <ArrowBack color="inherit" onClick={() => navigator(back)}/>
        </AppBar>
    )
}
export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}
export const NetworkDialog = (props: SimpleDialogProps) => {
    const { onClose, selectedValue, open } = props;
    const handleClose = () => {
      onClose(selectedValue);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onClose((event.target as HTMLInputElement).value);
    };
    const closeDialog = () => {
      console.log(selectedValue)
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
                networks.map(network => (
                  <FormControlLabel value={network} control={<Radio />} label={network} />
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
    const [selectedValue, setSelectedValue] = React.useState(networks[1]);
    console.log(selectedValue)
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = (value: any) => {
      setOpen(false);
      setSelectedValue(value);
    };
    const classes = useStyles();
    return (
        <AppBar className={cn(classes.dashboardBar)}>
            <img src={dashboardLogo} alt="" height="24"/>
            <Grid>
                <Box className={classes.fnTab} onClick={handleClickOpen}><FiberManualRecord color="primary" fontSize="inherit"/> &nbsp;{selectedValue} <ArrowDropDown color="action"/></Box>
                <Box className={cn(classes.fnTab, 'ml1', classes.link)} component={Link} to="/bridge">Bridge</Box>
                <NetworkDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
                <IconButton className={cn(classes.iconButton, 'ml1')} component={Link} to="/">
                    <Settings fontSize='inherit'/>
                </IconButton>
            </Grid>
        </AppBar>
    )
}
