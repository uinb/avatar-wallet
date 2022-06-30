import {useState, useEffect, useCallback} from 'react';
import Grid from '@material-ui/core/Grid';
import {utils,} from 'near-api-js';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../constant/chains';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {setSignerAccounts, setAllAccounts, selectNearActiveAccountByNetworkId, setActiveAccount, setPriceList,  setBalancesForAccount, setNearBalanceForAccount, selectNearConfig} from '../../../../reducer/near';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import Big from 'big.js';
import {selectNetwork} from '../../../../reducer/network';
/* import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios'; */
import AccountsCard from '../../../components/chains-account-card';
import NullAccountWrapper from '../../../components/null-account-wrapper';
import useNear from '../../../../hooks/useNear';
 
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
    const {config} = props;
    const networkId = useAppSelector(selectNetwork)
    const dispatch = useAppDispatch();
    const near = useNear(networkId);
    const [accounts, setAccounts] = useState([]);
    const activeAccount = useAppSelector(selectNearActiveAccountByNetworkId(networkId))
    const [balances, setBalances] = useState({}) as any;
    const [ftBalances, setFTBalances] = useState<Array<BalanceProps>>([]);
    const [activeTab, setActiveTab] = useState('assets');
    const [nftBalances, setNftBalances] = useState<NFTMetadataProps>({});
    const nearSymbolConfig = useAppSelector(selectNearConfig);

    useEffect(() => {
        if(!near){
            return ;
        }
        (async () => {
            const fecthedAccounts = await near.getAccounts();
            setAccounts(fecthedAccounts);
            if(!activeAccount){
                dispatch(setActiveAccount({account: fecthedAccounts[0], networkId}))
            }
        })()
    },[networkId, near, activeAccount, dispatch])

    useEffect(() => {
        if(!accounts.length || !near){
            return 
        }
        (async () => {
            const accountsState = await near.fetchAccountsState(accounts);
            dispatch(setAllAccounts(accounts));
            dispatch(setSignerAccounts(Object.keys(accountsState).filter((account) => !accountsState[account])))
        })()
    },[accounts, dispatch, near])


    const fetchNearBalances = useCallback(async () => {
        if(!activeAccount || !near){
            return ;
        }
        try{
            const account = await near.account(activeAccount);
            const balances = await account.getAccountBalance();
            setBalances(balances);
            dispatch(setNearBalanceForAccount({account: activeAccount, balance: {...balances, available: utils.format.formatNearAmount(balances.available)}}))
        }catch(e){
            setBalances({total: 0});
        }
    },[activeAccount, dispatch, near])

    const fetchFtBalance = useCallback(async () => {
        if(!activeAccount || !near){
            return ;
        }
        try{
            const {balances, tokens} = await near.fetchFtBalance(activeAccount);
            setFTBalances(balances)
            dispatch(setPriceList(tokens))
            dispatch(setBalancesForAccount({account: activeAccount, balances}))
        }catch(e){
            console.log(e);
        }
    },[activeAccount, dispatch, near])

    const fetchNfts = useCallback(async () => {
        if(!activeAccount || !near){
            return ;
        }
        try{
            const nftMetadata = await near.fetchNFTBalance(activeAccount);
            setNftBalances(nftMetadata)
        }catch(e){
            console.log(e)
        }
    },[activeAccount, near])

    useEffect(() => {
        fetchNearBalances();
        fetchFtBalance()
    },[fetchFtBalance, fetchNearBalances])

    useEffect(() =>{
        fetchNfts()
    },[fetchNfts])

    const handleAccountItemClick = (account:string) => {
        dispatch(setActiveAccount({account, networkId}))
    }

    /* useEffect(() => {
        if(!signerAccounts.length){
            return;
        }
        (async () => {
            const {keyStore} = near.config;
            const tempAddress = 'wulin8.near';
            const creator = await near.account('ac17492d17dfe7b476a4f573f1d48df9178a9f455c441c9ecacfff4e90be913b');
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
            const targetAccount = await near.account(tempAddress);
            const addKeyResult = await targetAccount.addKey(keyPair.publicKey.toString());
            console.log(addKeyResult);

        })()
    },[signerAccounts]) */
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

    const handleOperateClick = async (type:string) => {
        if(type === 'forgetAccount'){
            await near.forgetAccount(activeAccount);
            dispatch(setActiveAccount({networkId, account: ''}));
        }
    }

    return (
        <Grid component="div" className="px1 mt1">
            {accounts.length ? (
                <>
                    <AccountsCard 
                        accounts={accounts}
                        handleAccountItemClick={handleAccountItemClick}
                        handleOperateClick={handleOperateClick}
                        config={config}
                        operations={operations}
                        activeAccount={activeAccount}
                    />
                    <Grid>
                        <Tabs indicatorColor="primary" textColor="primary" value={activeTab} onChange={(e, value) => setActiveTab(value)}>
                            <Tab label="Assets" value="assets"/>
                            <Tab label="NFTs" value="nfts"/>
                        </Tabs>
                        {activeTab === 'assets' ? (
                            <Grid className="assetsList mt2">
                                <Card className="mb1">
                                    <ListItem component={Link} to={`/total-assets/near`} disableGutters dense>
                                        <ListItemAvatar>
                                            <Avatar style={{background: chains.near.background, height: 32, width:32}}>
                                                <img src={chains.near.logo} alt=""/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${utils.format.formatNearAmount(balances.available, 4)} NEAR`} secondary={`$${new Big(utils.format.formatNearAmount(balances.available)).times(nearSymbolConfig?.price || 1).toFixed(4)}`} />
                                    </ListItem>
                                </Card>
                                {ftBalances.length ? ftBalances.filter(item => Number(item.balance) > 0 && item.symbol !== 'near').map((item:any) => {
                                    return (
                                        <Card className="mt2" key={item.symbol}>
                                            <ListItem component={Link} to={`/total-assets/${item.symbol}`} disableGutters dense>
                                                <ListItemAvatar>
                                                    <Avatar style={{height: 32, width:32}}>
                                                        {item?.icon ? (
                                                            <img src={item?.icon} alt=""/>
                                                        ): (
                                                            item.symbol.slice(0,1)
                                                        )}
                                                        
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText 
                                                    primary={`${new Big(item.balance).toFixed(4)} ${item.name || item.symbol}`} 
                                                    secondary={<Typography variant='caption' component="span">{`$${new Big(item?.usdValue).toFixed(4)}`}</Typography>} 
                                                />
                                            </ListItem>
                                        </Card> 
                                    )
                                }) :null}
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
                <NullAccountWrapper chain="near"/>
            )}
            
        </Grid>
    )
}


export default NearCoreComponent;