import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FileCopy from '@material-ui/icons/FileCopy';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import {useSnackbar} from 'notistack';


const Seeds = (props:any) => {
    const {tempAddress} = props;
    const {enqueueSnackbar} = useSnackbar();
    return (
        <Grid>
            <Typography variant="h6" gutterBottom>Almost there! To get started, send at least 0.1 NEAR to your wallet address.</Typography>
            <Typography variant='caption' color="textSecondary">Send from an exchange,or ask a friend!</Typography>
            <InputLabel className="tl mt4">Your Wallet Address</InputLabel>
            <Input 
                fullWidth className="mt2" 
                value={tempAddress}
                disabled
            />
            <CopyToClipboard 
                text={tempAddress}
                onCopy={() => { enqueueSnackbar('copied!', {variant: 'success'}) }}
            >
                <Typography variant="caption" component="div" color="primary" className="mt4" align="center">
                    <FileCopy color="inherit" fontSize="inherit"/> &nbsp; Copy to Clipboard
                </Typography>
            </CopyToClipboard>
        </Grid>
    )
} 


export default Seeds;