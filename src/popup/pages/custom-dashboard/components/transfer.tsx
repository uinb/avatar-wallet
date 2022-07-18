import React, {useState, useMemo} from 'react';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { HeaderWithBack } from '../../../components/header';
import Content from '../../../components/layout-content';
import Button from '@material-ui/core/Button';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { useNavigate,useParams } from 'react-router-dom';
import TokenIcon from '../../../components/token-icon';



const Transfer = (props:any) => {
    const {chainMeta, activeAccount, balance, api, sendCallback} = props;
    const {symbol = '' } = useParams() as {symbol: string};
    const [state, setInputState] = useState({ symbol: symbol, receiver:'', amount: ''})

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [sendError, setSendError] = useState('');
    const handleInputChange = (e) => {
        setInputState(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
        setSendError('');
    }
    const handleInputNumberChange = (e) => {
        let value = e.target.value;
        let quantityScale ="18";
        let re = new RegExp('^(0|[1-9][0-9]*)(\\.[0-9]{0,' + quantityScale + '})?$');
        if (re.test(value.toString()) || value === '') {
            setInputState(state => ({
                ...state,
                [e.target.name]: value
            }))
        }
        setSendError('');
    }
    const navigator = useNavigate();
    const handleSend = async () => {
        if(state.receiver.length !== 48){
            setSendError('The length of the destination address is incorrect!');
            return;
        }
        if(!api.checkForValidAddresses(state.receiver)){
            setSendError('Invalid address!');
            return;
        }
        setLoading(true);
        await api.transfer(activeAccount,state.receiver, api.addPrecision(state.amount, Number(chainMeta.decimal)),(response:any)=>{
            setLoading(false);
            if(response.status === 1){
                sendCallback();
                enqueueSnackbar('Send transaction Success!', { variant: 'success' });
                navigator('/custom');
            }else{
                enqueueSnackbar(response.error, { variant: 'error' });
            }
        });
    }

    const handleMax = () => {
        setInputState({
            ...state, 
            amount: balance
        })
    }

    const sendDisabled = useMemo(() => {
        return Object.entries(state).some(([key, value]) => !value) || Boolean(Number(state.amount) > Number(balance) || Number(state.amount) === 0) || loading
    },[state, balance, loading])
    return (
        <Grid>
            <HeaderWithBack back={`/custom/asset/${symbol.toLocaleLowerCase()}`} title="Send"/>
            <Content>
                <Grid>
                    <Box className="mt2">
                        <InputLabel className="tl">Asset</InputLabel>
                        <Input 
                            fullWidth className="mt2" 
                            name="symbol"
                            disabled
                            value={state.symbol?.toUpperCase()|| symbol.toUpperCase()}
                            startAdornment={
                                <Grid style={{marginRight: 8}}>
                                    <TokenIcon icon='' symbol={chainMeta.symbol} showSymbol={false} size={24}/>
                                </Grid>
                            }
                            endAdornment={<ArrowDropDown color="action" fontSize="small"/>}
                        />
                    </Box>
                    <Box className="mt4">
                        <InputLabel className="tl">From</InputLabel>
                        <Input 
                            name="sender"
                            fullWidth className="mt2" 
                            value={activeAccount}
                            disabled
                        />
                    </Box>
                    <Box className="mt4">
                        <InputLabel className="tl">Send to</InputLabel>
                        <Input 
                            name="receiver"
                            fullWidth className="mt2" 
                            value={state.receiver}
                            placeholder="target address"
                            onChange={handleInputChange}
                            />
                    </Box>
                    <Box className="mt4">
                        <InputLabel className="flex justify-between items-center"><span>Amount</span> <span>available: <Typography color="textPrimary" component="span" variant='body2'>{balance || 0} {symbol.toUpperCase()}</Typography></span></InputLabel>
                        <Input 
                            name="amount"
                            fullWidth className="mt2" 
                            onChange={handleInputNumberChange}
                            placeholder="Amount"
                            value={state.amount}
                            endAdornment={<Button color="primary" variant='text' size="small" onClick={handleMax}  style={{minWidth: 'auto'}}>All</Button>}
                        />
                    </Box>
                </Grid>
                <div className='bottomBtn'>
                    <Button color="primary" variant="contained" size="large" fullWidth className="mt4" onClick={handleSend} disabled={sendDisabled}>Send&nbsp;{loading ? <CircularProgress size={20} color="inherit"/> : null}</Button>
                </div>
                {sendError ? <Typography color="error" variant='body2' className="mt2">{sendError}</Typography> : null}
            </Content>
        </Grid>
    )
}

export default Transfer;