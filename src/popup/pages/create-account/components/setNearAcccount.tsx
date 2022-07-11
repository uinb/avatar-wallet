import React, {useState, useMemo} from 'react'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Box from '@material-ui/core/Box';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core';
import useNear from '../../../../hooks/useNear';
import { selectNetwork } from '../../../../reducer/network';
import { useAppSelector } from '../../../../app/hooks';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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
    },
    redioGroup: {
        flexDirection: 'row', 
        color: theme.palette.text.hint,

    },
    radio:{
        '&.selected': {
            color:theme.palette.primary.main
        }
    }
}))


const SetNearAccount =  (props:any) => {
    const classes = useStyles();
    const [account, setViewAccount] = useState('');
    const [accountState, setAccountState] = useState(true);
    const {setAccount, address} = props;
    const networkId = useAppSelector(selectNetwork);
    const near = useNear(networkId)
    const [suffix] = useState(networkId === 'testnet' ? '.testnet' : '.near');
    const [accountType, setAccountType] = useState('near')

    const handleInput = async (e:any) => {
        setViewAccount(e.target.value)
        const viewAccountState = await near.viewAccountState(`${e.target.value}${suffix}`);
        setAccountState(viewAccountState)
    }

    const btnDisabled = useMemo(() => {
        return accountType === 'near' ? !account || !accountState : !address
    },[accountType, account, accountState, address])

    return (
        <Grid>
            <Typography variant="h5" gutterBottom>Reserve Account ID</Typography>
            <Typography variant='caption' color="textSecondary">Enter an Account ID to use with your AVATAR account. Your Account ID will be used for all AVATAR operations, including sending and receiving assets.</Typography>
            <RadioGroup color="primary" className={classes.redioGroup} value={accountType} onChange={(e,value) => setAccountType(value)}>
                <FormControlLabel value="near" control={<Radio />} label=".near" className={classes.radio}/>
                <FormControlLabel value="implicitAccount" control={<Radio />} label="implicit account"  className={classes.radio}/>
            </RadioGroup>
            {accountType === 'near' ? (
                <Box className={cn(classes.input, 'mt2')}>
                    <Input fullWidth onChange={handleInput} error={!accountState} value={account} endAdornment={<span className={classes.inputSuffix} style={{left: account.length ? account.length * 10 : 8}}>{suffix}</span>}/>
                </Box>
            ) : (
                <Box className={cn(classes.input, 'mt2')}>
                    <Input 
                        fullWidth 
                        disabled={true}
                        value={address}
                    />
                </Box>
            )}
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
                disabled={btnDisabled}
                onClick={() => setAccount(accountType === 'near' ? `${account}${suffix}` : address)}
            >Continue</Button>
        </Grid>
    )
}

export default SetNearAccount;