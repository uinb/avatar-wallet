import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../components/header';
import Content from '../../components/layout-content';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {useCallback, useEffect, useState} from 'react';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectAppChains, selectNetwork } from '../../../reducer/network';
import { useMemo } from 'react';
import SwitchIcon from '@material-ui/icons/ImportExport';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import nearIcon from '../../../img/near.svg';
import {selectNearActiveAccountByNetworkId, selectSignerAccount, selectAllAccounts, setPriceList, updateAccountBalances } from '../../../reducer/near';
import { selectActiveAccountByNetworkId as selectAppChainActiveAccount } from '../../../reducer/account';
import { selectConfig, toDecimals} from '../../../utils';
import useAppChain from '../../../hooks/useAppChain';
import useNear from '../../../hooks/useNear';
import { stringToHex, u8aToHex} from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';
import { decodeAddress } from '@polkadot/util-crypto';
import { useSnackbar } from 'notistack';
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import TokenIcon from '../../components/token-icon';
import {isEmpty} from 'lodash';


const useStyles = makeStyles(theme => ({
    input:{
        backgroundColor: 'white'
    },
    iconButton:{
        background: 'white',
        padding: theme.spacing(1),
        borderColor: theme.palette.background.paper
    },
    tokenItem:{
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems:'center'
    },
    chain:{
        padding: theme.spacing(1.25), 
        display:'flex', 
        alignItems:'center', 
        justifyContent: 'space-between', 
        background: theme.palette.background.paper, 
        marginTop: theme.spacing(2),
        borderRadius: theme.spacing(0.875),
    },
    token:{
        padding: theme.spacing(0.25), 
        display:'flex', 
        alignItems:'center', 
        justifyContent: 'space-between', 
        background: theme.palette.background.paper, 
        marginTop: theme.spacing(2),
        borderRadius: theme.spacing(0.875),
    }
}))

const Bridge = () => {
    const {from, to} =  useParams() as {from:string,to?: string};
    const [selectAppChainOpen, setSelectAppChainOpen] = useState(false);
    const networkId = useAppSelector(selectNetwork)
    const nearActiveAccount = useAppSelector(selectNearActiveAccountByNetworkId(networkId))
    const appChainActiveAccount = useAppSelector(selectAppChainActiveAccount(networkId))
    const [formState, setFormState] = useState({amount: '0', from: from === 'near' ? nearActiveAccount : appChainActiveAccount, target: to === 'near' ? nearActiveAccount : appChainActiveAccount})
    const [activeChain, setActiveChain] = useState<any>({});
    const appChains = useAppSelector(selectAppChains(networkId))
    const [searchWord, setSearchWord] = useState('');
    const classes = useStyles();
    const filterdChains = useMemo(() => appChains.filter((item: any) => item.appchain_id.includes(searchWord)), [appChains, searchWord]);
    const near = useNear(networkId);
    const [nearCrossTokens, setNearCrossTokens] = useState([])
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const octConfig = selectConfig('oct', networkId);
    const navigator = useNavigate();
    const [selectedToken, setSelectedToken] = useState({}) as any;
    const [tokenAnchorEl, setTokenAnchorEl] = useState(null);
    const [balance, setBalance] = useState('0')
    const [selectAccountOpen, setSelectAccountOpen] = useState(false);
    const [accountSide, setAccountSide] = useState('')
    const dispatch = useAppDispatch();

    const chainConfig = useMemo(() => {
        if(!networkId || !activeChain){
            return;
        }
        const config = selectConfig(activeChain.appchain_id, networkId);
        return config
    },[activeChain, networkId])
    const api = useAppChain(chainConfig.nodeId);
    const {tokens: appChainTokens} = chainConfig;

    const fetchCrossTokens = useCallback(async() => {
        if(!near || !activeChain){
            return;
        }
        const result = await near.fetchContractTokens(activeChain.appchain_anchor);
        const allTokens = result.map(item => {
            const localTokenConfig = appChainTokens.find(token => token.symbol.toLowerCase() === item.metadata.symbol.toLowerCase());
            return {
                ...item, 
                ...item.metadata,
                icon: localTokenConfig?.logo,
                code: localTokenConfig?.code,
                decimal: localTokenConfig?.decimal
            }
        });
        setNearCrossTokens(allTokens);
    }, [near, activeChain, appChainTokens])
    useEffect(() => {
        fetchCrossTokens();
    },[fetchCrossTokens])

    useEffect(() => {
        if(!appChains.length){
            return ;
        }
        setActiveChain(appChains.find(chain => chain.appchain_id.toLowerCase().startsWith(from === 'near' ? to : from)))
    },[appChains, from, to])

    useEffect(() => {
        if(isEmpty(nearCrossTokens)){
            return ;
        }
        setSelectedToken(nearCrossTokens[0]);
    },[nearCrossTokens])

    const isNativeToken = useMemo(() => {
        if(isEmpty(selectedToken) || isEmpty(activeChain)){
            return false
        }
        if(selectedToken.symbol === activeChain.appchain_metadata?.fungible_token_metadata?.symbol){
            return true
        }
        return false
    },[selectedToken, activeChain])

    const fetchAppChainAccountBalance = useCallback(async () => {
        if(isEmpty(selectedToken) || !api || !appChainActiveAccount){
            return ;
        }
        if(isNativeToken){
            const balance = await api.fetchBalances(appChainActiveAccount, chainConfig);
            setBalance(isEmpty(balance) ? '--' : balance.balance);
        }else{
            const balance = await api.fetchFTBalanceByTokenId({params:{code: selectedToken.code, account:appChainActiveAccount, symbol: selectedToken.symbol, decimal: selectedToken.decimal}, config: chainConfig});
            setBalance(isEmpty(balance) ? '--' : balance);
        }
    },[appChainActiveAccount, api, selectedToken, chainConfig, isNativeToken])
    const fetchNearAccountBalance = useCallback(async () => {
        if(isEmpty(selectedToken) || !formState.from || !near) {
            return 
        }
        const result:any = await near.contractBalanceOfAccount(formState.from, selectedToken.contract_account);
        const decimalValue = result.balance;
        setBalance(decimalValue);
    },[near, selectedToken, formState.from])

    const refreshFtBalance = useCallback(async (accountId) => {
        if(isEmpty(selectedToken) || !accountId || !near) {
            return 
        }
        const result:any = await near.contractBalanceOfAccount(accountId, selectedToken.contract_account);
        dispatch(updateAccountBalances({account:accountId, updateItem: result})); 
    },[near, selectedToken, dispatch])


    const fetchTokensMetadata = useCallback(() => {
        if(!formState.from || !near) {
            return 
        }
        near.fetchContractTokenMetadata(formState.from).then(resp => {
            dispatch(setPriceList(resp))
        }).catch(e=> {
            dispatch(setPriceList({}))
        });
    },[near, formState.from, dispatch])

    useEffect(() => {
        if(from === 'near'){
            return ;
        }
        fetchAppChainAccountBalance()
    },[fetchAppChainAccountBalance, from])


    useEffect(() => {
        if(from !== 'near'){
            return ;
        }
        fetchNearAccountBalance();
        fetchTokensMetadata()
    },[fetchNearAccountBalance, from, fetchTokensMetadata])


    const handleSearch = (e) => {
        setSearchWord(e.target.value)
    }

    const handleChangeChain = (item:any) => {
        setSelectAppChainOpen(false);
        setBalance('--');
        navigator(`/bridge/${from ==='near' ? 'near' : item.appchain_id}/${to ==='near' ? 'near' : item.appchain_id}`, {replace: true})
        setFormState(state => ({
            ...state, 
            amount: '0'
        }))
    }

    const handleInputChange = (e) => {
        setFormState((state) => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    const handleMax = () => {
        setFormState(state => ({
            ...state, 
            amount: Number(balance) > 0 ? balance : '0'
        }))
    }

    const handleSwitch = () => {
        navigator(`/bridge/${to}/${from}`,{replace: true});
        setFormState(state => ({
            ...state,
            from: state.target,
            target: state.from
        }))
        setBalance('--');
    }

    const handleChangeToken = (item:any) => {
        setSelectedToken(item)
        setTokenAnchorEl(null)
    }

    const onRedeem = async () => {
        let hexAddress = stringToHex(formState.target);
        let assetId;
        if (!isNativeToken) {
          assetId = selectedToken.code;
         
          if (assetId === undefined) {
            return;
          }
        }
        const signer = keyring.getPair(formState.from);
        await signer.unlock('');
        let amount = toDecimals(formState.amount, selectedToken.metadata.decimals);
        await (
          isNativeToken ?
          api.tx.octopusAppchain.lock(hexAddress, amount) :
          api.tx.octopusAppchain.burnAsset(assetId, hexAddress, amount)
        ).signAndSend(signer, {nonce: -1}, (res) => {
            if (res.isFinalized) {
                enqueueSnackbar('Send transaction Success!', { variant: 'success' });
                fetchAppChainAccountBalance();
                if(nearAccounts.includes(formState.target)){
                    setTimeout(() => {
                        refreshFtBalance(formState.target)
                    },2000)
                }
                setLoading(false);
            } else if (res.isError) {
            }
        }).catch(err => {
            setLoading(false)
            console.log('error', err);
        });
        
    }

    const onLock = async () => {
        let hexAddress = '';
        try {
          let u8a = decodeAddress(formState.target);
          hexAddress = u8aToHex(u8a);
        } catch(err) {
          enqueueSnackbar('Invalid address!', { variant: 'error' });
          return;
        }

        let amount = toDecimals(formState.amount, selectedToken.metadata.decimals);
        
        try {
            if (isNativeToken) {
                const result = await near.bridgeNativeToken({accountId: nearActiveAccount, contractId: octConfig.bridgeId, receiver: hexAddress, amount: amount, appchain: activeChain.appchain_id, appChainContract: activeChain.appchain_anchor});
                if(result){
                    enqueueSnackbar('Send transaction Success!', { variant: 'success' });
                    fetchNearAccountBalance()
                }else{
                    enqueueSnackbar('Send transaction Fail!', { variant: 'error' });
                }
            } else {
                await near.bridgeTokenTransfer({
                    target: hexAddress,
                    accountId: formState.from, 
                    contractId: selectedToken.contract_account,
                    amount: amount,
                    bridgeId: activeChain.appchain_anchor,
                    appchain: activeChain.appchain_id
                }).then(resp => {
                    enqueueSnackbar('Transfer success', { variant: 'success' });
                    fetchNearAccountBalance()
                    setTimeout(() => {
                        refreshFtBalance(formState.from)
                    },2000)
                    setLoading(false)
                }).catch(e => {
                    enqueueSnackbar('Send transaction Fail!', { variant: 'error' });
                })
            }
            setLoading(false)
        } catch(err) {
            enqueueSnackbar(err.message, { variant: 'error' });
            setLoading(false)
        }
    }

    const handleTransfer = async () => {
        setLoading(true)
        if(from === 'near'){
            onLock();
        }else{
            onRedeem();
        }
    }

    const actionDisabled = useMemo(() => {
        if(isEmpty(selectedToken)){
            return true;
        }
        return Object.entries(formState).some(([key, value]) => key === 'amount' ? !Boolean(Number(value) > 0) : !value) || (Number(formState.amount) > Number(balance) || loading)
    },[formState, selectedToken, balance, loading])

    const appChainAccounts = useMemo(() => {
        if(!api){
            return [];
        }

        return api.getAccounts();
    },[api])

    const nearSignerAccounts = useAppSelector(selectSignerAccount);
    const nearAllAccounts = useAppSelector(selectAllAccounts)

    const nearAccounts = useMemo(() => {
        return from === 'near' ? nearSignerAccounts : nearAllAccounts
    },[nearSignerAccounts, nearAllAccounts, from])

    
    useEffect(() => {
        if(isEmpty(nearAccounts)){
            return ;
        }
        setFormState(state => ({
            ...state,
            from: from === 'near' ? nearAccounts.includes(nearActiveAccount) ? nearActiveAccount : nearAccounts[0] : state.from,
            target: to === 'near' ? nearAccounts.includes(nearActiveAccount) ? nearActiveAccount : nearAccounts[0] : state.target
        }))
    },[nearAccounts, from, to, nearActiveAccount])
    useEffect(() => {
        if(isEmpty(appChainAccounts)){
            return ;
        }
        setFormState(state => ({
            ...state,
            from: !state.from ? from !== 'near' ? appChainAccounts[0] : state.from : state.from,
            target: !state.from ? to !== 'near' ? appChainAccounts[0] : state.target : state.target
        }))
    },[appChainAccounts, from, to])

    const handleSetAccountSide = (side: string) => {
        setAccountSide(side);
        setSelectAccountOpen(true)
    }

    const handleChangeAccount = (item:string) => {
        setFormState(state => ({
            ...state, 
            from: accountSide === 'from' ? item : state.from,
            target: accountSide === 'target' ? item : state.target
        }))
        setSelectAccountOpen(false)
    }

    const accounts = useMemo(() => {
        if(!accountSide){
            return [];
        }
        if(accountSide === 'from') {
            return from === 'near' ?  nearAccounts : appChainAccounts;
        }else{
            return to === 'near' ?  nearAccounts : appChainAccounts;
        }
    }, [accountSide, from, to, nearAccounts, appChainAccounts])

    const handleAccountSelectClose = () => {
        setAccountSide('');
        setSelectAccountOpen(false)
    }

    return (
        <Grid>
            <HeaderWithBack back="/dashboard" title="Bridge"/>
            <Content>
                <Box className="mt2">
                    <InputLabel className="tl">Appchains</InputLabel>
                    <Grid 
                        onClick={() => setSelectAppChainOpen(true)}
                        className={classes.chain}
                    >
                        <TokenIcon icon={activeChain?.appchain_metadata?.fungible_token_metadata?.icon} symbol={activeChain?.appchain_id} size={32}/>
                        <ArrowDropDown color="action" fontSize="small" className="ml1"/>
                    </Grid>
                </Box>
                <Card className='mt3 py2'>
                    <Box>
                        <InputLabel className="tl">From</InputLabel>
                        <Input 
                            fullWidth className="mt1" 
                            name="from"
                            value={formState.from}
                            classes={{root: classes.input}}
                            startAdornment={
                                <Grid style={{marginRight: 8}}>
                                    <TokenIcon icon={from === 'near' ? nearIcon : activeChain?.appchain_metadata?.fungible_token_metadata?.icon}/>
                                </Grid>
                            }
                            endAdornment={
                                <Button color="primary" variant='text' size="small" onClick={() => handleSetAccountSide('from')}>
                                    change
                                </Button>
                            }
                        />
                    </Box>
                    <Typography align="center" className="mt2" onClick={handleSwitch}><IconButton color="primary" classes={{root: classes.iconButton}}><SwitchIcon /></IconButton></Typography>
                    <Box>
                        <InputLabel className="tl">Target</InputLabel>
                        <Input 
                            fullWidth className="mt1" 
                            name="target"
                            value={formState.target}
                            classes={{root: classes.input}}
                            onChange={handleInputChange}
                            startAdornment={
                                <Grid style={{marginRight: 8}}>
                                    <TokenIcon icon={to === 'near' ? nearIcon : activeChain?.appchain_metadata?.fungible_token_metadata?.icon}/>
                                </Grid>
                            }
                            endAdornment={
                                <Button color="primary" variant='text' size="small" onClick={() => handleSetAccountSide('target')}>
                                    change
                                </Button>
                            }
                        />
                    </Box>
                </Card>
                <Box className="mt4">
                    <InputLabel className="flex justify-between items-center" style={{height: 30}}>
                        <span>Amount</span> 
                        <span>available: 
                            <Typography color="textPrimary" component="span" variant='body2'>{balance}</Typography>
                            {Number(balance) > 0 ? <Button color="primary" variant='text' size="small" onClick={handleMax}  style={{minWidth: 'auto'}}>All</Button> : null}
                        </span>
                    </InputLabel>
                    <Grid className={classes.token}>
                        <Input 
                            name="amount"
                            fullWidth 
                            onChange={handleInputChange}
                            placeholder="Amount"
                            type="number"
                            value={formState.amount}
                        />
                        <Box>
                            <Box className={classes.tokenItem} onClick={(e:any) => setTokenAnchorEl(e.currentTarget)}>
                                <TokenIcon icon={isNativeToken ? activeChain?.appchain_metadata?.fungible_token_metadata?.icon: selectedToken?.logo} symbol={selectedToken?.symbol} />
                                <ArrowDropDown color="action" fontSize="small" className="ml1"/>
                            </Box>
                            <Menu open={Boolean(tokenAnchorEl)} anchorEl={tokenAnchorEl} onClose={() => setTokenAnchorEl(null)}>
                                {nearCrossTokens.map((item, index) => {
                                    return (
                                        <MenuItem 
                                            key={index} 
                                            value={item.contract_account} 
                                            classes={{
                                                root: classes.tokenItem
                                            }}
                                            onClick={() => handleChangeToken(item)}
                                        >
                                            <TokenIcon icon={item?.logo || item.icon} symbol={item?.symbol}></TokenIcon>
                                        </MenuItem>
                                    )
                                })}
                            </Menu>
                        </Box>
                    </Grid>
                </Box>
                <Button 
                    color="primary" 
                    size="large" 
                    className="mt4" 
                    variant='contained' 
                    fullWidth
                    onClick={handleTransfer}
                    disabled={actionDisabled}
                >Transfer &nbsp;{loading ? <CircularProgress size={20} color="inherit"/> : null}</Button>
            </Content>
            <Dialog open={selectAppChainOpen} onClose={() => setSelectAppChainOpen(false)}>
                <DialogTitle>
                    Select Appchain
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
                           filterdChains.length ? filterdChains.map((item, index) => (
                            <Card className="mt2" key={item.appchain_id} onClick={() => handleChangeChain(item)}>
                                <ListItem disableGutters dense>
                                    <ListItemAvatar>
                                        <TokenIcon icon={item?.appchain_metadata?.fungible_token_metadata?.icon} symbol={item?.appchain_id} size={32} />
                                    </ListItemAvatar>
                                </ListItem>
                            </Card> 
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


export default Bridge;