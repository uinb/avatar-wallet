import React from 'react';
import {QRCodeSVG} from 'qrcode.react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Typography } from '@material-ui/core';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import {useParams, Link} from 'react-router-dom';
import qs from 'qs';
import { useAppSelector } from '../../../../app/hooks';
import {selectActiveAccountByNetworkId} from '../../../../reducer/account';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useSnackbar} from 'notistack';


const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.primary.main,
        height: '100vh',
        color: theme.palette.primary.contrastText,
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    qrCode:{
        textAlign:'center',
        marginTop: theme.spacing(4),
        padding: `${theme.spacing(6)}px`
    },
    button:{
        borderColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.contrastText,
        marginTop: theme.spacing(4)
    },
    header:{
        display: 'flex',
        alignItems: 'center',
        padding: `${theme.spacing(1)}px 0`,
        '& .title':{
            flex: 1
        }
    }
}))


const Deposit = (props:any) => {
    const classes = useStyles();
    const {symbol=''} = useParams()
    const account = useAppSelector(selectActiveAccountByNetworkId(''))
    const {enqueueSnackbar} = useSnackbar()
    return (
        <Grid className={classes.root}>
            <Grid component={Link} to={`/custom/asset/${symbol.toLowerCase()}`} className={classes.header}>
                <ArrowBack color="inherit" fontSize='small' />
                <Typography align='center' className="title">Recieve</Typography>
            </Grid>
            <Paper className={classes.qrCode}>
                <Grid className="mt1 mb1">
                    <QRCodeSVG value={`deposit?${qs.stringify({symbol, address: account})}`} size={180}/>
                </Grid>
                <Typography gutterBottom color="textSecondary" variant='body2' component='p' className="mt3">Address</Typography>
                <Typography gutterBottom variant='body2' className="mt2" style={{wordBreak: 'break-all'}}>{account}</Typography>
            </Paper>
            <CopyToClipboard 
                text={account}
                onCopy={() => {enqueueSnackbar('copied!', {variant:'success'})}}
            >
                <Button 
                    color="default" 
                    variant="outlined" 
                    className={classes.button}
                    fullWidth
                    size="large"
                    >copy Adress</Button>
            </CopyToClipboard>
        </Grid>
    )
}
export default Deposit;