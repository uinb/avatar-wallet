import React, {useState, useMemo, useEffect, useCallback} from 'react';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import Button from '@material-ui/core/Button';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import {
    selectNearActiveAccountByNetworkId, 
    selectSignerAccount, 
    setTempTransferInfomation, 
    selectAllAccounts, 
    setNearBalanceForAccount,
    setBalancesForAccount,
    selectBalanesByAccount,
    updateAccountBalances
} from '../../../../../reducer/near';
import Dialog from '@material-ui/core/Dialog';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {utils} from 'near-api-js';
import {parseTokenAmount} from '../../../../../utils';
import { useNavigate } from 'react-router-dom';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import {TokenProps} from '../../../../../constant/near-types';
import { selectNetwork } from '../../../../../reducer/network';
import useNear from '../../../../../hooks/useNear';
import {useParams} from 'react-router-dom';
import TokenIcon from '../../../../components/token-icon';
import {isEmpty} from 'lodash';
import {useSnackbar} from 'notistack';
import MenuItem from '@material-ui/core/MenuItem';
import TokenItem from '../../../../components/token-item';
import nearIcon from '../../../../../img/near.svg';

interface TransferProps{
    balance: string,
    symbol: string,
    icon: string,
    contractId: string,
    price?:string,
    usdValue?:string,
    decimals: number,
    decimal: number
}


const Transfer = () => {
    const {symbol} = useParams() as {symbol : string};
    const networkId = useAppSelector(selectNetwork)
    const activeAccount = useAppSelector(selectNearActiveAccountByNetworkId(networkId));
    const [formState, setFormState] = useState({contractId: '', symbol: symbol, target:'', amount: '', sender: activeAccount})
    const [selectTokenOpen, setSelectTokenOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [searchWord, setSearchWord] = useState('');
    const [sendError, setSendError] = useState('');
    const near = useNear(networkId)
    const [loading, setLoading] = useState(false);
    const [selectAccountOpen, setSelectAccountOpen] = useState(false);
    const [accountSide, setAccountSide] = useState('')
    const {enqueueSnackbar} = useSnackbar()
    const accountBalances = useAppSelector(selectBalanesByAccount(formState.sender))
    const signerAccounts = useAppSelector(selectSignerAccount);
    const allAccounts = useAppSelector(selectAllAccounts);

    const fetchAccountBalances = useCallback(async () => {
        if(!near || !formState.sender){
            return ;
        }
        const balances = await near.fetchAccountBalance(formState.sender);
        dispatch(setBalancesForAccount({account: formState.sender, balances}))
    },[formState.sender, near, dispatch])

    useEffect(() => {
        fetchAccountBalances()
    }, [fetchAccountBalances])


    const fetchBalances = useCallback(async (accountId:string) => {
        if(!near){
            return;
        }
        const balances = await near.fetchAccountBalance(accountId);
        dispatch(setNearBalanceForAccount({account: accountId, balance: balances}))
    },[near, dispatch])
    
    useEffect(() => {
        if(!formState.sender){
            return ;
        }
        fetchBalances(formState.sender)
    },[formState.sender, fetchBalances])
    const handleInputChange = (e) => {
        setFormState(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
        setSendError('');
    }
    const navigator = useNavigate();

    const filterdTokens = useMemo(() => {
        if(!accountBalances.length){
            return [] as Array<TransferProps>;
        }
        return accountBalances.filter((item: TokenProps) => Number(item.balance) > 0 && item.symbol.toLowerCase().includes(searchWord))
    }, [accountBalances, searchWord]);
    const selectToken = useMemo(() => {
        if(!accountBalances.length){
            return {} as TransferProps;
        }
        const currentSymbolToken = accountBalances.filter(token => Number(token.balance) > 0).find((item:TokenProps) => item?.symbol.toLowerCase() === formState.symbol.toLowerCase())
        return formState.symbol ?  currentSymbolToken ? currentSymbolToken : filterdTokens[0] : filterdTokens[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[accountBalances, formState.symbol, formState.sender])

    const isNativeToken = useMemo(() => {
        if(isEmpty(selectToken)){
            return false
        }
        return selectToken?.symbol?.toLowerCase() === 'near'
    },[selectToken])

    const refreshNearBalance = async (accountId) => {
        const result = await near.fetchNearBalance(accountId);
        dispatch(updateAccountBalances({account:accountId, updateItem: result}));
    }
    
    const refreshFtBalance = async (accountId, contractId) => {
        const result = await near.contractBalanceOfAccount(accountId, contractId);
        dispatch(updateAccountBalances({account:accountId, updateItem: result}));
    }

    const handleSend = async () => {
        setLoading(true);
        dispatch(setTempTransferInfomation(formState))
        if(isNativeToken){
            const result = await near.transferNear({...formState, amount: utils.format.parseNearAmount(formState.amount)});
            if(result.status){
                enqueueSnackbar('send success', {variant:'success'})
                refreshNearBalance(formState.sender)
                if(allAccounts.includes(formState.target)){
                    refreshNearBalance(formState.target)
                }
                setLoading(false);
                navigator('/transfer-success');
            }else{
                setSendError(result.msg);
                setLoading(false);
            }
        }else{
            const result = await near.ftTransfer({...formState, amount: parseTokenAmount(formState.amount, selectToken.decimal)});
            if(result.status){
                refreshFtBalance(formState.sender, formState.contractId)
                if(allAccounts.includes(formState.target)){
                    refreshFtBalance(formState.target, formState.contractId)
                }
                enqueueSnackbar('send success', {variant:'success'})
                navigator('/transfer-success');
                setLoading(false);
            }else{
                setSendError(result.msg);
                setLoading(false);
            }
        }
        
    }

    useEffect(() => {
        if(isEmpty(selectToken)){
            return  
        }
        setFormState(state => ({
            ...state,
            contractId: selectToken?.contractId, 
            symbol: selectToken?.symbol
        }))
    },[selectToken])

    const handleChangeToken = (item :any) => {
        setFormState(state => ({
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
        setFormState(state => ({
            ...state, 
            amount: selectToken?.balance
        }))
    }

    const sendDisabled = useMemo(() => {
        if(isEmpty(selectToken)){
            return true;
        }
        return Object.entries(formState).some(([key, value]) => !value) || Boolean(Number(formState.amount) > Number(selectToken?.balance)) || loading
    },[formState, selectToken, loading])

    const handleSetAccountSide = (side: string) => {
        setAccountSide(side);
        setSelectAccountOpen(true)
    }

    const handleChangeAccount = (item:string) => {
        setFormState(state => ({
            ...state, 
            sender: accountSide === 'from' ? item : state.sender,
            target: accountSide === 'target' ? item : state.target
        }))
        setSelectAccountOpen(false)
    }

    const accounts = useMemo(() => {
        if(!accountSide){
            return [];
        }
        if(accountSide === 'from') {
            return signerAccounts.filter(account => account !== formState.target);
        }else{
            return allAccounts.filter(account => account !== formState.sender);
        }
    }, [accountSide, signerAccounts, allAccounts, formState.sender, formState.target])

    const handleAccountSelectClose = () => {
        setAccountSide('');
        setSelectAccountOpen(false)
    }
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
                            value={formState.symbol.toUpperCase()}
                            onChange={handleInputChange}
                            startAdornment={
                                <Grid style={{marginRight: 8}}>
                                    <TokenIcon icon={isNativeToken ? nearIcon : selectToken?.icon} size={28} symbol={selectToken?.symbol} showSymbol={false}/>
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
                            value={formState.sender}
                            placeholder="Sender address"
                            disabled
                            endAdornment={
                                signerAccounts.length ? (
                                    <Button color="primary" variant='text' size="small" onClick={() => handleSetAccountSide('from')}>
                                        change
                                    </Button>
                                ) : null
                            }
                        />
                    </Box>
                    <Box className="mt4">
                        <InputLabel className="tl">Send to</InputLabel>
                        <Input 
                            name="target"
                            fullWidth className="mt2" 
                            value={formState.target}
                            placeholder="Target address"
                            onChange={handleInputChange}
                            endAdornment={
                                allAccounts.length ? (
                                    <Button color="primary" variant='text' size="small" onClick={() => handleSetAccountSide('target')}>
                                        change
                                    </Button>
                                ) : null
                            }
                        />
                    </Box>
                    <Box className="mt4">
                        <InputLabel className="flex justify-between items-center"><span>Amount</span> <span>available: <Typography color="textPrimary" component="span" variant='body2'>{Number(selectToken?.balance || 0).toFixed(4)} {formState.symbol.toUpperCase()}</Typography></span></InputLabel>
                        <Input 
                            name="amount"
                            fullWidth className="mt2" 
                            onChange={handleInputChange}
                            placeholder="Amount"
                            value={formState.amount}
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
                               <TokenItem 
                                className="mt2" 
                                key={item.symbol}
                                token={{...item, icon: item.symbol.toLowerCase() === 'near' ? nearIcon : item.icon}}
                                handleItemClick={handleChangeToken}
                               />
                           )) : <Typography color="primary" align="center">No Result</Typography>
                        }
                    </Grid>
                </DialogContent>
            </Dialog>
            <Dialog open={selectAccountOpen} onClose={handleAccountSelectClose}>
                <DialogTitle>
                    Select Account
                </DialogTitle>
                <DialogContent>
                    {accounts?.map((item:any, index:number) => (
                        <MenuItem key={index} onClick={() => handleChangeAccount(item)}>{item}</MenuItem> 
                    ))}
                </DialogContent>
            </Dialog>
        </Grid>
    )
}

export default Transfer;