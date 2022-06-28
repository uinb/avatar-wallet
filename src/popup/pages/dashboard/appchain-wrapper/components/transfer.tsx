import React, {useState, useMemo, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import Button from '@material-ui/core/Button';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import {selectAccountBlances, setTempTransferInfomation} from '../../../../../reducer/near';
import {selectActiveAccountByNetworkId} from '../../../../../reducer/account';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {parseTokenAmount} from '../../../../../utils';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import { Typography } from '@material-ui/core';
import {TokenProps} from '../../../../../constant/near-types';
import { selectNetwork,selectChain } from '../../../../../reducer/network';
import useNear from '../../../../../hooks/useNear';
import useAppChain from '../../../../../hooks/useAppChain';
import {selectConfig} from '../../../../../utils';



const Transfer = () => {
    const networkId = useAppSelector(selectNetwork);
    const chain = useAppSelector(selectChain(networkId));
    const networkConfig = useMemo(() => {
        if(!networkId || !chain){
            return {} as any
        }
        return selectConfig(chain, networkId);
    },[chain, networkId])
    const {symbol='', nodeId=''} = networkConfig;
    const api = useAppChain(nodeId);
    const [balance,setBalance] = useState('--') as any;
    const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));

    console.log("id -- ",networkId,"active -- ",activeAccount)
    useEffect(() => {
        if(!api || !activeAccount || !symbol){
            return;
        }
        //setLoading(true);
        (async () => {
            const balance = await api.fetchBalances(activeAccount, symbol);
            setBalance(api.inputLimit(balance));
        })()
    },[activeAccount, api, symbol]);
    const [state, setInputState] = useState({contractId: '', symbol: '', receiver:'', amount: '', sender: activeAccount})
    const [selectTokenOpen, setSelectTokenOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [searchWord, setSearchWord] = useState('');
    const [sendError, setSendError] = useState('');
    const near = useNear(networkId)
    const handleInputChange = (e) => {
        setInputState(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
        setSendError('');
    }
    //const navigator = useNavigate();
    // useEffect(() => {
    //     if(!activeAccount){
    //         navigator('/dashboard');
    //     }
    // }, [activeAccount, navigator])
    const balances = useAppSelector(selectAccountBlances(networkId));
    const handleSend = async () => {
        dispatch(setTempTransferInfomation(state))
        if(state.contractId === 'tao'){
            const result = await api.transfer(activeAccount,state.amount);
            console.log(" --- - > >? > ?..>>",result)
            if(result.status){
                // navigator('/transfer-success');
            }else{
                setSendError(result.msg);
            }
        }else{
            const result = await near.ftTransfer(activeAccount, parseTokenAmount(state.amount, 18));
            if(result.status){
                // navigator('/transfer-success');
            }else{
                setSendError(result.msg);
            }
        }
    }
    const selectToken = useMemo(() => balances.find((item:TokenProps) => item?.symbol.toLowerCase() === state.symbol.toLowerCase()) ,[balances, state.symbol])
    const filterdTokens = useMemo(() => balances.filter((item: TokenProps) => Number(item.balance) > 0 && item.symbol.toLowerCase().includes(searchWord)), [balances, searchWord]);

    // useEffect(() => {
    //     if(!filterdTokens.length){
    //         //navigator('/dashboard');  
    //         return  
    //     }
    //     setInputState(state => ({
    //         ...state,
    //         contractId: filterdTokens[0].contractId, 
    //         symbol: filterdTokens[0].symbol
    //     }))
    // },[])

    const handleChangeToken = (item :any) => {
        setInputState(state => ({
            ...state, 
            contractId: item.contractId,
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
            amount: balance
        })
    }

    const sendDisabled = useMemo(() => {
      console.log((Object.entries(state)))
        return Object.entries(state).some(([key, value]) => {console.log(value); return !value}) || Boolean(Number(state.amount) > Number(balance))
    },[state, balance])
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
                                        <img src={selectToken?.icon || networkConfig.icon} alt="" width="100%"/>
                                    </Avatar>
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
                            onChange={handleInputChange}
                            placeholder="Amount"
                            value={state.amount}
                            endAdornment={<Button color="primary" variant='text' size="small" onClick={handleMax}  style={{minWidth: 'auto'}}>All</Button>}
                        />
                    </Box>
                </Grid>
                <Button color="primary" variant="contained" size="large" fullWidth className="mt4" onClick={handleSend} disabled={sendDisabled}>Send</Button>
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
                           filterdTokens.length ? filterdTokens.map((item, index) => (
                            <Card className="mt2" key={item.symbol} onClick={() => handleChangeToken(item)}>
                                <ListItem disableGutters dense>
                                    <ListItemAvatar>
                                        <Avatar style={{height: 32, width:32}}>
                                            {item?.icon ? (
                                                <img src={item?.icon} alt="" width="100%"/>
                                            ): (
                                                item.symbol.slice(0,1)
                                            )}
                                            
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${Number(item?.balance || 0).toFixed(4)} ${item?.symbol}`} secondary={`$${Number(item?.usdValue || 0).toFixed(4)}`} />
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