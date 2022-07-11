import React, {useState, useMemo, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import Button from '@material-ui/core/Button';
import { useAppSelector } from '../../../../../app/hooks';
import {selectActiveAccountByNetworkId,tokenAccountList} from '../../../../../reducer/account';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import { Typography } from '@material-ui/core';
import { selectNetwork,selectChain } from '../../../../../reducer/network';
import useAppChain from '../../../../../hooks/useAppChain';
import {selectConfig} from '../../../../../utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { useNavigate,useParams } from 'react-router-dom';



const Transfer = () => {
    const networkId = useAppSelector(selectNetwork);
    const chain = useAppSelector(selectChain(networkId));

    const chainTokens = useAppSelector(tokenAccountList);
    const tokenList_ = chainTokens[chain];
    const {symbol = '' } = useParams() as {symbol: string};

    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const networkConfig = useMemo(() => {
        if(!networkId || !chain){
            return {} as any
        }
        return selectConfig(chain, networkId);
    },[chain, networkId])
    const {nodeId=''} = networkConfig;
    const api = useAppChain(nodeId);
    const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));

    const [state, setInputState] = useState({ symbol: '', receiver:'', amount: ''})
    const [selectTokenOpen, setSelectTokenOpen] = useState(false);
    // const dispatch = useAppDispatch();
    const [searchWord, setSearchWord] = useState('');
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
        //check
        if(state.receiver.length !== 48){
            setSendError('The length of the destination address is incorrect!');
            return;
        }
        if(!api.checkForValidAddresses(state.receiver)){
            setSendError('Invalid address!');
            return;
        }
        setLoading(true);
        if(state.symbol === symbol){
            const resultTxHash = await api.transfer(activeAccount,state.receiver,api.addPrecision(state.amount,selectToken.decimal),(response:any)=>{
                setLoading(false);
                if(response.status === 1){
                    enqueueSnackbar('Send transaction Success!', { variant: 'success' });
                    navigator('/dashboard');
                }else{
                    enqueueSnackbar(response.error, { variant: 'error' });
                }
            });
            console.log(resultTxHash)
        }else{
            const resultHash = await api.transferToken(activeAccount,
                [
                    Number(selectToken.code),
                    state.receiver,
                    api.addPrecision(state.amount,selectToken.decimal)
                ],networkConfig,
                (response:any) => {
                    setLoading(false);
                    if(response.status === 1){
                        enqueueSnackbar('Send transaction Success!', { variant: 'success' });
                        navigator('/dashboard');
                    }else{
                        enqueueSnackbar(response.error, { variant: 'error' });
                    }
            })
            console.log(resultHash)
        }
    }
    const selectToken = useMemo(() => tokenList_.find((item:any) => item?.symbol.toLowerCase() === state.symbol.toLowerCase()) ,[tokenList_, state.symbol])
    const filterdTokens = useMemo(() => tokenList_.filter((item: any) => item.symbol.toLowerCase().includes(searchWord)), [tokenList_, searchWord]);
    // console.log("selectToken  -  " ,selectToken)
    useEffect(() => {
        if(!filterdTokens.length){
            //navigator('/dashboard');  
            return  
        }
        setInputState(state => ({
            ...state,
            symbol: filterdTokens[0].symbol
        }))
    },[filterdTokens])

    const handleChangeToken = (item :any) => {
        setInputState(state => ({
            ...state, 
            symbol: item.symbol,
            amount: ''
        }))
        setSelectTokenOpen(false)
    }

    const handleSearch = (e) => {
        setSearchWord(e.target.value)
    }

    const handleMax = () => {
        setInputState({
            ...state, 
            amount: selectToken.formattedBalance
        })
    }

    const sendDisabled = useMemo(() => {
        return Object.entries(state).some(([key, value]) => !value) || Boolean(Number(state.amount) > Number(selectToken?.formattedBalance)) || loading
    },[state, selectToken,loading])
    return (
        <Grid>
            <HeaderWithBack back="/dashboard"/>
            <Content>
                <Grid>
                    <Box className="mt2" onClick={() => setSelectTokenOpen(true)}>
                        <InputLabel className="tl">Asset</InputLabel>
                        <Input 
                            fullWidth className="mt2" 
                            name="symbol"
                            value={state.symbol.toUpperCase()||symbol.toUpperCase()}
                            onChange={handleInputChange}
                            startAdornment={
                                <Grid style={{marginRight: 8}}>
                                    <Avatar style={{width: 28, height: 28}}>
                                        <img src={selectToken?.logo} alt="" width="100%"/>
                                    </Avatar>
                                </Grid>
                            }
                            endAdornment={<ArrowDropDown color="action" fontSize="small"/>}
                        />
                    </Box>
                    {/* <Box className="mt4">
                        <InputLabel className="tl">From</InputLabel>
                        <Input 
                            name="sender"
                            fullWidth className="mt2" 
                            value={activeAccount}
                            disabled
                        />
                    </Box> */}
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
                        <InputLabel className="flex justify-between items-center"><span>Amount</span> <span>available: <Typography color="textPrimary" component="span" variant='body2'>{selectToken?.balance || 0} {selectToken?.symbol.toUpperCase()}</Typography></span></InputLabel>
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
            <Dialog open={selectTokenOpen} onClose={() => setSelectTokenOpen(false)}>
                <DialogTitle>
                    Assets
                </DialogTitle>
                <DialogContent>
                    <Grid>
                        <Input 
                            fullWidth
                            onChange={handleSearch}
                            startAdornment={
                                <SearchIcon  fontSize="small" className="mr1"/>
                            }
                        />
                    </Grid>
                    <Grid className="mt2" style={{maxHeight: '300px', overflow: 'scroll', paddingBottom: 16}}>
                        {
                           filterdTokens.length ? filterdTokens.map((item:any) => (
                            <Card className="mt2" key={item.symbol} onClick={() => handleChangeToken(item)}>
                                <ListItem disableGutters dense>
                                    <ListItemAvatar>
                                        <Avatar style={{height: 32, width:32}}>
                                            {item?.logo ? (
                                                <img src={item?.logo} alt="" width="100%"/>
                                            ): (
                                                item.symbol.slice(0,1)
                                            )}
                                            
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${item?.balance || 0} ${item?.symbol}`} secondary={`$${item?.balance || 0}`} />
                                </ListItem>
                            </Card> 
                           )) : <Typography color="primary" align="center">No Result</Typography>
                        }
                    </Grid>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}

export default Transfer;