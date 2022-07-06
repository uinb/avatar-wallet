import React, {useState, useMemo, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import Button from '@material-ui/core/Button';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import {selectAccountBlances, selectNearActiveAccountByNetworkId, setTempTransferInfomation} from '../../../../../reducer/near';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {utils} from 'near-api-js';
import {parseTokenAmount} from '../../../../../utils';
import { useNavigate } from 'react-router-dom';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import {TokenProps} from '../../../../../constant/near-types';
import { selectNetwork } from '../../../../../reducer/network';
import useNear from '../../../../../hooks/useNear';
import {useParams} from 'react-router-dom';
import TokenIcon from '../../../../components/token-icon';
import {isEmpty} from 'lodash';
import {useSnackbar} from 'notistack';

interface TransferProps{
    balance: string,
    symbol: string,
    icon: string,
    contractId: string,
    usdValue?:string,
}


const Transfer = () => {
    const {symbol} = useParams() as {symbol : string};
    const networkId = useAppSelector(selectNetwork)
    const activeAccount = useAppSelector(selectNearActiveAccountByNetworkId(networkId));
    const [state, setInputState] = useState({contractId: '', symbol: symbol, receiver:'', amount: '', sender: activeAccount})
    const [selectTokenOpen, setSelectTokenOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [searchWord, setSearchWord] = useState('');
    const [sendError, setSendError] = useState('');
    const near = useNear(networkId)
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar()
    const handleInputChange = (e) => {
        setInputState(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
        setSendError('');
    }
    const navigator = useNavigate();
    const balances = useAppSelector(selectAccountBlances(networkId));
    const handleSend = async () => {
        setLoading(true);
        dispatch(setTempTransferInfomation(state))
        if(state.contractId === 'near'){
            const result = await near.transferNear({...state, amount: utils.format.parseNearAmount(state.amount)});
            if(result.status){
                navigator('/transfer-success');
                enqueueSnackbar('send success', {variant:'success'});
                setLoading(false);
            }else{
                setSendError(result.msg);
                setLoading(false);
            }
        }else{
            const result = await near.ftTransfer({...state, amount: parseTokenAmount(state.amount, 18)});
            if(result.status){
                navigator('/transfer-success');
                enqueueSnackbar('send success', {variant:'success'});
                setLoading(false);
            }else{
                setSendError(result.msg);
                setLoading(false);
            }
        }
    }
    const filterdTokens = useMemo(() => {
        if(!balances.length){
            return [] as Array<TransferProps>;
        }
        return balances.filter((item: TokenProps) => Number(item.balance) > 0 && item.symbol.toLowerCase().includes(searchWord))
    }, [balances, searchWord]);
    const selectToken = useMemo(() => {
        if(!balances.length){
            return {} as TransferProps;
        }
        return state.symbol ? balances.filter(token => Number(token.balance) > 0).find((item:TokenProps) => item?.symbol.toLowerCase() === state.symbol.toLowerCase()) || {} as any : filterdTokens[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[balances, state.symbol])

    useEffect(() => {
        if(isEmpty(selectToken)){
            return  
        }
        setInputState(state => ({
            ...state,
            contractId: selectToken.contractId, 
            symbol: selectToken.symbol
        }))
    },[selectToken])

    const handleChangeToken = (item :any) => {
        setInputState(state => ({
            ...state, 
            contractId: item.contractId,
            symbol: item.symbol,
            amount: ''
        }))
        setSelectTokenOpen(false)
        navigator(`/transfer/${item.symbol}`,{replace: true})
    }

    const handleSearch = (e) => {
        setSearchWord(e.target.value)
    }


    const handleMax = () => {
        setInputState({
            ...state, 
            amount: selectToken.balance
        })
    }

    const sendDisabled = useMemo(() => {
        if(!Object.keys(selectToken).length){
            return true;
        }
        return Object.entries(state).some(([key, value]) => !value) || Boolean(Number(state.amount) > Number(selectToken?.balance)) || loading
    },[state, selectToken, loading])
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
                            value={state.symbol.toUpperCase()}
                            onChange={handleInputChange}
                            startAdornment={
                                <Grid style={{marginRight: 8}}>
                                    <TokenIcon icon={selectToken?.icon} size={28} symbol={selectToken.symbol} showSymbol={false}/>
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
                            value={state.sender}
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
                        <InputLabel className="flex justify-between items-center"><span>Amount</span> <span>available: <Typography color="textPrimary" component="span" variant='body2'>{Number(selectToken?.balance || 0).toFixed(4)} {state.symbol.toUpperCase()}</Typography></span></InputLabel>
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
                <Button 
                    color="primary" 
                    variant="contained" 
                    size="large" 
                    fullWidth 
                    className="mt4" 
                    onClick={handleSend} 
                    disabled={sendDisabled}
                >Send {loading ? <CircularProgress size={20} color="inherit" className="ml1"/> : null}</Button>
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