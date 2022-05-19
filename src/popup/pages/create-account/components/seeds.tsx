import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, alpha } from '@material-ui/core';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FileCopy from '@material-ui/icons/FileCopy';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    seedContainer:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    seedKey:{
        flex: '0 0 1.75rem'
    },
    seedItem:{
        background: alpha(theme.palette.primary.main, 0.1), 
        color: theme.palette.primary.main,
        height: '2rem',
        lineHeight: '2rem',
        borderRadius: theme.spacing(0.75),
        flex: 1,
        paddingLeft: theme.spacing(1),
    }
}))


const Seeds = (props:any) => {
    const {seeds, handleContinue} = props;
    const classes = useStyles();
    return (
        <Grid>
            <Typography variant="h5" gutterBottom>Your Secure phrase</Typography>
            <Typography variant='caption' color="textSecondary">Write down the following words in order and keep them somewhere safe. Anyone with access to it will also have access to your account! You’ll be asked to verify your passphrase next.</Typography>
            <Grid container spacing={2} className="mt2">
                {seeds.split(' ').map((item:string, index:number) => (
                    <Grid item xs={6} sm={6} md={6} lg={6} key={index} container className={classes.seedContainer}>
                        <Typography variant="body2" className={classes.seedKey}>{index+1}.</Typography>
                        <Typography align="left" variant="body2" className={classes.seedItem}>{item}</Typography>
                    </Grid>
                ))}
            </Grid>
            <br/>
            <CopyToClipboard 
                text={seeds}
                onCopy={() => {console.log('copied!')}}
            >
                <Typography variant="caption" color="primary" className="mt2" component="a">
                    <FileCopy color="inherit" fontSize="inherit"/> &nbsp; Copy to Clipboard
                </Typography>
            </CopyToClipboard>
            <Button 
                color="primary" 
                variant="contained" 
                fullWidth 
                size="large" 
                className='mt4'
                onClick={handleContinue}
            >Continue</Button>
        </Grid>
    )
} 


export default Seeds;