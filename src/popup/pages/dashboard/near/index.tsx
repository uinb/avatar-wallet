import  React, {useState, useEffect, useCallback, useMemo} from 'react';
import  Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Near} from '../../../../api';
import {utils, KeyPair} from 'near-api-js';
import {Link} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import {Typography, withTheme} from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../constant/chains';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {formatLongAddress, decimalTokenAmount} from '../../../../utils';
import FileCopy from '@material-ui/icons/FileCopy';
import {setSignerAccounts, selectSignerAccount, selectActiveAccount, setActiveAccount, setPriceList, selectPriceList, setBalancesForAccount, setNearBalanceForAccount, selectNearConfig} from '../../../../reducer/near';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import Big from 'big.js';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';

interface BalanceProps {
    decimal: number;
    price: string;
    symbol: string;
    balance:string ,
    usdValue: string ;
    contractId: string;
    icon:string;
}

interface NFTMetadataProps{
    [key:string] :any
}

const NearCoreComponent = (props: any) => {
    const {config, theme} = props;
    const dispatch = useAppDispatch();
    const signerAccounts = useAppSelector(selectSignerAccount);
    const [anchorEl, setAnchorEl] = useState(null)
    const [operationAnchorEl, setOperationAnchorEl] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const activeAccount = useAppSelector(selectActiveAccount)
    const [balances, setBalances] = useState({}) as any;
    const [ftBalances, setFTBalances] = useState<Array<BalanceProps>>([]);
    const [activeTab, setActiveTab] = useState('assets');
    const [nftBalances, setNftBalances] = useState<NFTMetadataProps>({});
    const nearSymbolConfig = useAppSelector(selectNearConfig);
    const refreshAccountList = useCallback(async () => {
        const fecthedAccounts = await Near.getAccounts();
        setAccounts(fecthedAccounts);
        if(!activeAccount){
            dispatch(setActiveAccount(fecthedAccounts[0]))
        }
    },[])

    useEffect(() => {
        if(!accounts.length){
            return 
        }
        (async () => {
            const accountsState = await Near.fetchAccountsState(accounts);
            dispatch(setSignerAccounts(Object.keys(accountsState).filter((account) => !accountsState[account])))
        })()
    },[accounts])


    const fetchNearBalances = useCallback(async () => {
        if(!activeAccount){
            return ;
        }
        try{
            const account = await Near.account(activeAccount);
            const balances = await account.getAccountBalance();
            setBalances(balances);
            dispatch(setNearBalanceForAccount({account: activeAccount, balance: {...balances, available: utils.format.formatNearAmount(balances.available)}}))
        }catch(e){
            setBalances({total: 0});
        }
    },[activeAccount])

    const fetchFtBalance = useCallback(async () => {
        if(!activeAccount){
            return ;
        }
        try{
            const {balances, tokens} = await Near.fetchFtBalance(activeAccount);
            console.log(balances, tokens);
            setFTBalances(balances)
            dispatch(setPriceList(tokens))
            dispatch(setBalancesForAccount({account: activeAccount, balances}))
        }catch(e){
            console.log(e);
        }
    },[activeAccount])

    const fetchNfts = useCallback(async () => {
        if(!activeAccount){
            return ;
        }
        try{
            const nftMetadata = await Near.fetchNFTBalance(activeAccount);
            setNftBalances(nftMetadata)
        }catch(e){
            console.log(e)
        }
    },[activeAccount])

    useEffect(() => {
        fetchNearBalances();
        fetchFtBalance()
    },[fetchNearBalances])

    useEffect(() =>{
        fetchNfts()
    },[fetchNfts])

    useEffect(() => {
        refreshAccountList();
    },[refreshAccountList])


    const handleAccountItemClick = (account:string) => {
        dispatch(setActiveAccount(account))
        setAnchorEl(null);
    }

    /* useEffect(() => {
        if(!signerAccounts.length){
            return;
        }
        (async () => {
            const {keyStore} = Near.config;
            const tempAddress = 'wulin8.near';
            const creator = await Near.account('ac17492d17dfe7b476a4f573f1d48df9178a9f455c441c9ecacfff4e90be913b');
            const keyPair = await keyStore.getKey('mainnet', 'ac17492d17dfe7b476a4f573f1d48df9178a9f455c441c9ecacfff4e90be913b');
            const setKeyPair = KeyPair.fromString(keyPair.secretKey);
            console.log(setKeyPair)
            //await keyStore.setKey('mainnet', tempAddress, setKeyPair);
            
            await creator.functionCall({
                contractId: "near",
                methodName: "create_account",
                args: {
                    new_account_id: tempAddress,
                    new_public_key: keyPair.publicKey.toString(),
                },
                gas: "300000000000000",
                attachedDeposit: utils.format.parseNearAmount('0'),
            });
            const targetAccount = await Near.account(tempAddress);
            const addKeyResult = await targetAccount.addKey(keyPair.publicKey.toString());
            console.log(addKeyResult);

        })()
    },[signerAccounts]) */

    const MenuContent:any = (props:any) => {
        const {items = [], handleItemClick} = props as {items: Array<any>, handleItemClick: any};
        return (
            items.map((item:any, index:number) => (
                item.link ? (
                    <MenuItem 
                        key={index} 
                        component={Link}
                        to={item.link}
                    >{item.label}</MenuItem> 
                ) : (
                    <MenuItem key={index} onClick={() => handleItemClick(item.value)}>{item.label}</MenuItem> 
                )
            ))
        )
    }

    const handleChangeAccount = (e:any) => {
        setAnchorEl(e.currentTarget);
    }

    const operations = [
        {
            label:'Create Account',
            value: 'createAccount',
            link:"/create-account/near"
        },
        {
            label:'Import Account',
            value: 'importAccount',
            link:'/import-account/near'
        },
        {
            label:'Export Account',
            value: 'exportAccount'
        },
        {
            label:'Forget Account',
            value: 'forgetAccount'
        }
    ]

    const handleAccountOperate = (e:any) => {
        setOperationAnchorEl(e.currentTarget);
    }

    const handleOperateClick = async (type:string) => {
        if(type === 'forgetAccount'){
            await Near.forgetAccount(activeAccount);
        }
        refreshAccountList();
        setOperationAnchorEl(null);
    }

    const sendMoney = async () => {
        /* const senderAccount = await Near.account(signerAccounts[1]);
        const sendResult = await senderAccount.sendMoney(signerAccounts[0], utils.format.parseNearAmount('0.02')); */
        console.log('sendmoney')
    }

    const createNewAccount = async () => {
        const  keyPair = Near.generateKeyPair();
        console.log(keyPair);
        const {publicKey, secretKey } = keyPair;
        const PRIVATE_KEY = secretKey.split("ed25519:")[1];
        //const keyPair = KeyPair.fromString(PRIVATE_KEY);
        const creator = await Near.account(signerAccounts[0]);
      /*   const contract = await Near.loadContract('near', {
            sender: creator
        });
        console.log(contract); */
        const result = await creator.addKey('wulin6.near', publicKey);
        console.log(result);
    }


 
    return (
        <Grid component="div" className="px1 mt1">
            {accounts.length ? (
                <>
                    <Paper style={{padding: theme.spacing(2),background: config.primary, color: theme.palette.primary.contrastText}}>
                        <Grid container justifyContent='space-between'>
                            <Box>
                                <Grid container onClick={handleChangeAccount}>
                                    <Typography variant="body2" component="div">{formatLongAddress(activeAccount)}</Typography> &nbsp;
                                    <ArrowDropDown fontSize="medium"/>
                                </Grid>
                                <CopyToClipboard 
                                    text={activeAccount}
                                    onCopy={() => {console.log('copied!')}}
                                >
                                    <Typography variant="caption" color="textSecondary" className="mt2">{formatLongAddress(activeAccount)} <FileCopy color="inherit" fontSize="inherit"/></Typography>
                                </CopyToClipboard>
                                <Menu
                                    id="account-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    <MenuContent 
                                        items={accounts.map(item => ({label: formatLongAddress(item), value: item}))}
                                        handleItemClick={handleAccountItemClick}
                                    />
                                </Menu>
                            </Box>
                            <MoreVert onClick={handleAccountOperate}/>
                            <Menu
                                id="operate-menu"
                                anchorEl={operationAnchorEl}
                                open={Boolean(operationAnchorEl)}
                                onClose={() => {setOperationAnchorEl(null)}}
                            >
                                <MenuContent items={operations} handleItemClick={handleOperateClick}/>
                            </Menu>
                        </Grid>
                    </Paper>
                    <Grid>
                        <Tabs indicatorColor="primary" textColor="primary" value={activeTab} onChange={(e, value) => setActiveTab(value)}>
                            <Tab label="Assets" value="assets"/>
                            <Tab label="NFTs" value="nfts"/>
                        </Tabs>
                        {activeTab === 'assets' ? (
                            <Grid className="assetsList mt2">
                                <Card className="mb1">
                                    <ListItem component={Link} to="/transfer/near">
                                        <ListItemAvatar>
                                            <Avatar style={{background: chains.near.background,height: 32, width:32}}>
                                                <img src={chains.near.logo} alt=""/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${utils.format.formatNearAmount(balances.available, 4)} NEAR`} secondary={`$${new Big(utils.format.formatNearAmount(balances.available)).times(nearSymbolConfig?.price || 1).toFixed(4)}`} />
                                    </ListItem>
                                </Card>
                                {ftBalances.length ? ftBalances.filter(item => Number(item.balance) > 0 && item.symbol !== 'near').map(item => (
                                    <Card className="mt2" key={item.symbol}>
                                        <ListItem component={Link} to="/transfer/near">
                                            <ListItemAvatar>
                                                <Avatar style={{height: 32, width:32}}>
                                                    {item?.icon ? (
                                                        <img src={item?.icon} alt=""/>
                                                    ): (
                                                        item.symbol.slice(0,1)
                                                    )}
                                                    
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={`${new Big(item.balance).toFixed(4)} ${item.symbol}`} secondary={`$${new Big(item?.usdValue).toFixed(4)}`} />
                                        </ListItem>
                                    </Card> 
                                )) :null}
                            </Grid>
                        ) : null}
                        {activeTab === "nfts" ? (
                            <Grid className="assetsList mt2">
                                {Object.entries(nftBalances).length ? Object.entries(nftBalances).map(([contract, {tokens = [], ...restProps}]) => {
                                    return (
                                        <Grid container spacing={2}>
                                            <Grid item sm={6} md={6} lg={6}>
                                                {tokens.map(token => (
                                                    <Grid key={token?.title}>
                                                        <Box>
                                                            <img src={`${restProps.base_uri}/${token.metadata.media}`} alt="" width="134px" height="134px" style={{borderRadius: 8}}/>
                                                        </Box>
                                                        <Typography variant="caption" color="primary" className="mt1" component='div'>{token.metadata.title}</Typography>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    )
                                }) : (<Typography variant="caption" color="primary" className="mt1" component='div' align="left">No Collections</Typography>)}
                            </Grid>
                        ) : null}
                    </Grid>
                </>
                
            ) : (
                <Grid container justifyContent='space-between'>
                    <Button color="primary" variant="contained" component={Link} to={`/import-account/near`}>Import Account</Button>
                    <Button color="primary" variant="outlined" component={Link} to={`/create-account/near`}>Create Account</Button>
                </Grid>
            )}
            
        </Grid>
    )
}


export default withTheme(NearCoreComponent);