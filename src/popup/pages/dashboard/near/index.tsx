import  React, {useState, useEffect, useCallback} from 'react';
import  Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Near} from '../../../../api';
import {utils} from 'near-api-js';
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
import {formatLongAddress} from '../../../../utils';
import FileCopy from '@material-ui/icons/FileCopy';
import {setSignerAccounts} from '../../../../reducer/near';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import Big from 'big.js';

interface BalanceProps {
    decimal: number;
    price: string;
    symbol: string;
    balance:string    
}

const NearCoreComponent = (props: any) => {
    const {config, theme} = props;
    const dispatch = useAppDispatch()
    const [anchorEl, setAnchorEl] = useState(null)
    const [operationAnchorEl, setOperationAnchorEl] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [activeAccount, setActiveAccount] = useState('');
    const [balances, setBalances] = useState({}) as any;
    const [ftBalances, setFTBalances] = useState<Array<BalanceProps>>([]);
    const refreshAccountList = useCallback(async () => {
        const fecthedAccounts = await Near.getAccounts();
        setAccounts(fecthedAccounts);
        setActiveAccount(fecthedAccounts[0]);
    },[])


    const fetchBalances = useCallback(async () => {
        if(!activeAccount){
            return ;
        }
        try{
            const account = await Near.account(activeAccount);
            const balances = await account.getAccountBalance();
            const ftContract = await Near.fetchFtBalance(activeAccount);
            setFTBalances(ftContract)
            setBalances(balances);
        }catch(e){
            setBalances({total: 0});
        }
    },[activeAccount])

    useEffect(() => {
        fetchBalances();
    },[fetchBalances])

    useEffect(() => {
        refreshAccountList();
    },[refreshAccountList])


    const handleAccountItemClick = (account:string) => {
        setActiveAccount(account);
        setAnchorEl(null);
    }

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
                        <Tabs indicatorColor="primary" textColor="primary" value="assets">
                            <Tab label="Assets" value="assets"/>
                            <Tab label="NFTs" value="nfts"/>
                        </Tabs>
                        <Grid className="assetsList mt2">
                            <Card className="mb1">
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar style={{background: chains.near.background}}>
                                            <img src={chains.near.logo} alt=""/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${utils.format.formatNearAmount(balances.total, 4)} NEAR`} secondary='≈折合USD' />
                                </ListItem>
                                
                            </Card>
                            {ftBalances.length ? ftBalances.filter(item => Number(item.balance) > 0).map(item => (
                                <Card>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar style={{background: chains.near.background}}>
                                                <img src={chains.near.logo} alt=""/>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${new Big(item.balance).div(new Big(10).pow(item.decimal)).toNumber()} ${item.symbol}`} secondary='≈折合USD' />
                                    </ListItem>
                                </Card> 
                            )) :null}
                        </Grid>
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