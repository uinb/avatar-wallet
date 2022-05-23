import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';
import {Near} from '../../../../api';

const accountRules = [
    "Your account ID can contain any of the following:",
    "-dLowercase characters(a-z)",
    "-Digits(0-9)",
    "-Characters(_-)can be used as seperators",
    "Your account ID CANNOT contain:",
    "-Characters “@” or “.”",
    "-Fewer than 2 characters",
    "-More than 64 characters(including.near)"
]


const useStyles = makeStyles(theme => ({
    input:{
        position: 'relative',
    },
    inputSuffix:{
        color: theme.palette.text.hint,
    }
}))


const SetNearAccount =  (props:any) => {
    const classes = useStyles();
    const [account, setViewAccount] = useState('');
    const [accountState, setAccountState] = useState(true);
    const {setAccount} = props;

    const handleInput = async (e:any) => {
        setViewAccount(e.target.value)
        const viewAccountState = await Near.viewAccountState(`${e.target.value}.near`);
        setAccountState(viewAccountState)
    }
    return (
        <Grid>
            <Typography variant="h5" gutterBottom>Reserve Account ID</Typography>
            <Typography variant='caption' color="textSecondary">Enter an Account ID to use with your AVATAR account. Your Account ID will be used for all AVATAR operations, including sending and receiving assets.</Typography>
            <Box className={cn(classes.input, 'mt2')}>
                <Input fullWidth onChange={handleInput} error={!accountState} endAdornment={<span className={classes.inputSuffix} style={{left: account.length ? account.length * 10 : 8}}>.near</span>}/>
            </Box>
            {account.length ? accountState ? (<Typography color="primary" variant="caption">Congrats! {`${account}.near`} is available.</Typography>) : (<Typography color="error" variant="caption">Account ID is taken. Try something else.</Typography>) : null}
            <Box>
                {accountRules.map((rule, index) => (
                    <Typography key={index} variant='caption' component="div" color="textSecondary" className={cn(!rule.startsWith('-') ? 'mt2' : '')}>{rule}</Typography>
                ))}
            </Box>
            <Button 
                color="primary" 
                variant="contained"
                fullWidth 
                size="large" 
                className='mt4'
                disabled={!account || !accountState}
                onClick={() => setAccount(`${account}.near`)}
            >Continue</Button>
        </Grid>
    )
}

export default SetNearAccount;