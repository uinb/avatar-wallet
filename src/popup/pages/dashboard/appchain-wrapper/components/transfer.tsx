import React, {useState, useMemo, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import Button from '@material-ui/core/Button';
import { useAppSelector } from '../../../../../app/hooks';
import {selectActiveAccountByNetworkId} from '../../../../../reducer/account';
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
    let tokens_list = useMemo(()=>{
        return networkConfig['tokens'].filter((token:any,index:any) => {
            return index !== 0;
        }).map((item:any) => {
            return {
                ...item,
                balance:"--"
            }
        });
    },[networkConfig]);
    const [tokenList,setTokenList] = useState(tokens_list) as any;
    const [balance,setBalance] = useState('--') as any;
    const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));
    const [allList,setAllList] = useState([]) as any;
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
    useEffect(()=>{
        if(!api || !activeAccount || !symbol || !tokens_list.length){
            return;
        }
        (async ()=>{
            const tokensInfo = await api.fetchAccountTonkenBalances(activeAccount, tokens_list, networkConfig.tokenModule, networkConfig.tokenMethod);
            setTokenList(tokensInfo);
        })()
    },[api,symbol,activeAccount,networkConfig,tokens_list])
    useEffect(()=>{
        const firstAccount = [networkConfig['tokens'][0]];
        firstAccount[0].balance = balance;
        const all = firstAccount.concat(tokenList);
        setAllList(all);
    },[balance, networkConfig, tokenList])
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
    //const navigator = useNavigate();
    // useEffect(() => {
    //     if(!activeAccount){
    //         navigator('/dashboard');
    //     }
    // }, [activeAccount, navigator])
    const handleSend = async () => {
        console.log(state)

        if(state.symbol === symbol){
            const result = await api.transfer(activeAccount,state.amount);
            console.log(" --- - > >? > ?..>>",result)
            if(result.status){
                // navigator('/transfer-success');
            }else{
                setSendError(result.msg);
            }
        }else{

        }
    }
    const selectToken = useMemo(() => allList.find((item:any) => item?.symbol.toLowerCase() === state.symbol.toLowerCase()) ,[allList, state.symbol])
    const filterdTokens = useMemo(() => allList.filter((item: any) => item.symbol.toLowerCase().includes(searchWord)), [allList, searchWord]);
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
            amount: selectToken.balance
        })
    }

    const sendDisabled = useMemo(() => {
        return Object.entries(state).some(([key, value]) => !value) || Boolean(Number(state.amount) > Number(balance))
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
                                        <img src={selectToken?.logo} alt="" width="100%"/>
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
                        <InputLabel className="flex justify-between items-center"><span>Amount</span> <span>available: <Typography color="textPrimary" component="span" variant='body2'>{selectToken?.balance || 0} {selectToken?.symbol.toUpperCase()}</Typography></span></InputLabel>
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