import {useState, useEffect, useCallback, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';
import {useNavigate} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
    setSignerAccounts, 
    setAllAccounts, 
    selectNearActiveAccountByNetworkId, 
    setActiveAccount, 
    setPriceList,
    selectBalanesByAccount, 
    setBalancesForAccount, 
} from '../../../../reducer/near';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import {selectNetwork} from '../../../../reducer/network';
import AccountsCard from '../../../components/chains-account-card';
import NullAccountWrapper from '../../../components/null-account-wrapper';
import useNear from '../../../../hooks/useNear';
import nearIcon from '../../../../img/near.svg';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import { darken, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TokenItem from '../../../components/token-item'

 
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

const useStyles = makeStyles((theme) => ({
    styledCard: {
        background: darken(theme.palette.background.default, 0.8),
        padding: theme.spacing(1.25),
        wordBreak: 'break-all',
        color: theme.palette.text.secondary, 
        marginTop: theme.spacing(1.5)
    }
}))

const NearCoreComponent = (props: any) => {
    const {config} = props;
    const networkId = useAppSelector(selectNetwork)
    const dispatch = useAppDispatch();
    const near = useNear(networkId);
    const [accounts, setAccounts] = useState([]);
    const activeAccount = useAppSelector(selectNearActiveAccountByNetworkId(networkId))
    const [activeTab, setActiveTab] = useState('assets');
    const [nftBalances, setNftBalances] = useState<NFTMetadataProps>({});
    const classes = useStyles();
    const balances = useAppSelector(selectBalanesByAccount(activeAccount));
    const navigator = useNavigate();
    const fetchAccountBalances = useCallback(async () => {
        if(!near || !activeAccount){
            return ;
        }
        const balances = await near.fetchAccountBalance(activeAccount);
        dispatch(setBalancesForAccount({account: activeAccount, balances}))
    },[activeAccount, near, dispatch])

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

    const fetchFTPrice = useCallback(async () => {
        if(!activeAccount || !near){
            return ;
        }
        try{
            const tokens = await near.fetchFTBasicMetadata(activeAccount);
            dispatch(setPriceList(tokens))
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
        fetchFTPrice()
    },[fetchFTPrice])

    useEffect(() =>{
        fetchAccountBalances()
        fetchNfts()
    },[fetchNfts, fetchAccountBalances])

    const handleAccountItemClick = (account:string) => {
        dispatch(setActiveAccount({account, networkId}))
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

    const [exportAccountValue, setExportAccountValue] = useState('');
    const handleOperateClick = async (type:string) => {
        if(type === 'forgetAccount'){
            await near.forgetAccount(activeAccount);
            dispatch(setActiveAccount({networkId, account: ''}));
        }else if(type === 'exportAccount'){
            const result = await near.exportAccount(activeAccount);
            if(result){
                setExportAccountValue(result)
                setExportAccountOpen(true)
            }
        }
    }
    const [exportAccountOpen,  setExportAccountOpen] = useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const nearBalance = useMemo(() => {
        return balances.find(balance => balance.symbol.toLocaleLowerCase() === 'near') || {} as BalanceProps
    },[balances])


   
    return (
        <Grid component="div" className="px1 mt1" style={{height: '100%'}}>
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
                    <Grid style={{height: 'calc(100vh - 100px)',zIndex: 0}}>
                        <Tabs indicatorColor="primary" textColor="primary" value={activeTab} onChange={(e, value) => setActiveTab(value)}>
                            <Tab label="Assets" value="assets"/>
                            <Tab label="NFTs" value="nfts"/>
                        </Tabs>
                        <AutoSizer>
                            {({width, height}) => {
                                return (
                                    <div style={{overflowY: 'scroll', height: height, width: width}}>
                                        {activeTab === 'assets' ? (
                                            <Grid className="assetsList mt2">
                                                <TokenItem 
                                                    token={{icon: nearIcon, symbol: 'NEAR', balance:nearBalance.balance, price: nearBalance.price}}
                                                    handleItemClick={() => navigator(`/total-assets/near`, {replace: true})}
                                                />
                                                {balances.length ? balances.filter(item => Number(item.balance) > 0 && item.symbol.toLowerCase() !== 'near').map((item:any) => {
                                                    return (
                                                        <TokenItem
                                                            token={item}
                                                            key={item.symbol}
                                                            className="mt2"
                                                            handleItemClick={() => navigator(`/total-assets/${item.symbol}`, {replace: true})}
                                                        />
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
                                    </div>
                                )
                            }}
                        </AutoSizer>
                    </Grid>
                </>
                
            ) : (
                <NullAccountWrapper chain="near"/>
            )}
            <Dialog open={exportAccountOpen} onClose={() => { setExportAccountOpen(false); setExportAccountValue('')}}>
                <DialogTitle>
                    View secretKey
                </DialogTitle>
                <DialogContent>
                    <Typography variant='caption' color="textSecondary">请不要分享你的私钥！任何获得你私钥的人也将获得你的账户的完整访问权限。</Typography>
                    <Card classes={{root: classes.styledCard}}>
                        <CopyToClipboard 
                            text={exportAccountValue}
                            onCopy={() => {enqueueSnackbar('copied!', {variant:'success'})}}
                        >
                            <Typography>{exportAccountValue}</Typography>
                        </CopyToClipboard>
                    </Card>
                    <Button className="mt2" onClick={() => { setExportAccountOpen(false); setExportAccountValue('')}} fullWidth color="primary" variant='contained'>Close</Button>
                </DialogContent>
            </Dialog>
        </Grid>
    )
}


export default NearCoreComponent;