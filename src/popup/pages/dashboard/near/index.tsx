import  React, {useState, useEffect} from 'react';
import  Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {initNear} from '../../../../api';
import axios from 'axios';
import {KeyPair, utils} from 'near-api-js';
import Paper from '@material-ui/core/Paper';
import {Typography, withTheme} from '@material-ui/core';
import MoreVert from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Card from '@material-ui/core/Card';
import ImageIcon from '@material-ui/icons/Image';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../constant/chains';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const {parseSeedPhrase} = require('near-seed-phrase')


const NearCore = (props: any) => {
    const {networkId, config, theme} = props;
    const [near, setNear] = useState(null) as any;
    const [operateEnable, setOperateEnable] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null)
    const [operationAnchorEl, setOperationAnchorEl] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [activeAccount, setActiveAccount] = useState('');
    const [balances, setBalances] = useState({}) as any;
    useEffect(() => {
        if(near){
            return ;
        }
        (async () => {
            const connectedNear = await initNear(networkId);
            setNear(connectedNear);
            setOperateEnable(true)
        })()
    })

    const refreshAccountList = async () => {
        const {keyStore} = near.config;
        const accounts = await keyStore.getAccounts(networkId);
        setAccounts(accounts);
        setActiveAccount(accounts[0]);
    }


    useEffect(() => {
        if(!near){
            return;
        }
        refreshAccountList();
    },[near])

    const handleImportAccount = async () => {
        if(!operateEnable){
            return ;
        }
        const { helperUrl, keyStore } = near.config;
        const {secretKey, publicKey} = parseSeedPhrase('erode donkey glow total cricket fancy mind time wrestle emerge rebuild brave');
        const {data} = await axios.get(`${helperUrl}/publicKey/${publicKey}/accounts`);
        const PRIVATE_KEY = secretKey.split("ed25519:")[1];
        const keyPair = KeyPair.fromString(PRIVATE_KEY);
        await keyStore.setKey("testnet", data[0], keyPair);
        refreshAccountList();
    }

    const handleCreateAccount = () => {

    }

    const handleAccountItemClick = (account:string) => {
        setActiveAccount(account);
        setAnchorEl(null);
    }

    const MenuContent:any = (props:any) => {
        const {items = [], handleItemClick} = props as {items: Array<any>, handleItemClick: any};
        return (
            items.map((item:any, index:number) => (
                <MenuItem key={index} onClick={() => handleItemClick(item.value)}>{item.label}</MenuItem> 
            ))
        )
    }

    const handleChangeAccount = (e:any) => {
        setAnchorEl(e.currentTarget);
    }

    const operations = [
        {
            label:'Reanme',
            value: 'rename'
        },
        {
            label:'Create Account',
            value: 'createAccount'
        },
        {
            label:'Import Account',
            value: 'importAccount'
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
            const {keyStore} = near.config;
            await keyStore.removeKey(networkId, activeAccount);
            refreshAccountList();
        }
        setOperationAnchorEl(null);
    }

    const fetchBalances = async () => {
        const account = await near.account(activeAccount);
        const balances = await account.getAccountBalance();
        setBalances(balances);
    }

    useEffect(() => {
        if(!activeAccount || !near){
            return ;
        }
        fetchBalances();
    },[activeAccount, near])

    return (
        <Grid component="div" className="px1 mt1">
            {accounts.length ? (
                <>
                    <Paper className="p1" style={{background: config.primary, color: theme.palette.primary.contrastText}}>
                        <Grid container justifyContent='space-between'>
                            <Box>
                                <Grid container onClick={handleChangeAccount}>
                                    <Typography variant="body2" component="div">{activeAccount}</Typography> &nbsp;
                                    <ArrowDropDown fontSize="medium"/>
                                </Grid>
                                <CopyToClipboard 
                                    text={activeAccount}
                                    onCopy={() => {console.log('copied!')}}
                                >
                                    <Typography variant="caption">{activeAccount}</Typography>
                                </CopyToClipboard>
                                <Menu
                                    id="account-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                >
                                    <MenuContent 
                                        items={accounts.map(item => ({label: item, value: item}))}
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
                        <Typography component="div"></Typography>
                        <Grid className="assetsList mt2">
                            <Card>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar style={{background: chains.near.background}}>
                                            <img src={chains.near.logo} alt=""/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${utils.format.formatNearAmount(balances.total, 4)} NEAR`} secondary='折合cny' />
                                </ListItem>
                            </Card>
                        </Grid>
                    </Grid>
                </>
                
            ) : (
                <Grid container justifyContent='space-between'>
                    <Button color="primary" variant="contained" onClick={handleImportAccount}>Import Account</Button>
                    <Button color="primary" variant="outlined" onClick={handleCreateAccount}>Create Account</Button>
                </Grid>
            )}
            
        </Grid>
    )
}


export default withTheme(NearCore);