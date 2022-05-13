import  React, {useState, useEffect} from 'react';
import  Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {initNear} from '../../../../api';
import axios from 'axios';
import {KeyPair} from 'near-api-js';
const {parseSeedPhrase} = require('near-seed-phrase')


const NearCore = (props: any) => {
    const {networkId} = props;
    const [near, setNear] = useState(null) as any;
    const [operateEnable, setOperateEnable] = useState(false);
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        if(near){
            return ;
        }
        (async () => {
            const connectedNear = await initNear(networkId);
            const {keyStore} = connectedNear.config;
            const accounts = await keyStore.getAccounts(networkId);
            setAccounts(accounts);
            setNear(connectedNear);
            setOperateEnable(true)
        })()
    })

    console.log(accounts);

    const handleImportAccount = async () => {
        if(!operateEnable){
            return ;
        }
        console.log(near.config);
        const { helperUrl, keyStore } = near.config;
        const {secretKey, publicKey} = parseSeedPhrase('erode donkey glow total cricket fancy mind time wrestle emerge rebuild brave');
        const {data} = await axios.get(`${helperUrl}/publicKey/${publicKey}/accounts`);
        const PRIVATE_KEY = secretKey.split("ed25519:")[1];
        const keyPair = KeyPair.fromString(PRIVATE_KEY);
        await keyStore.setKey("testnet", data[0], keyPair);
        const accounts = await keyStore.getAccounts(networkId)
        setAccounts(accounts);
    }

    const handleCreateAccount = () => {

    }
    return (
        <Grid container justifyContent='space-between' className="px1 mt1">
            {accounts.length ? (
                accounts.map(account => (
                    <Grid>{account}</Grid>
                ))
            ) : (
                <>
                    <Button color="primary" variant="contained" onClick={handleImportAccount}>Import Account</Button>
                    <Button color="primary" variant="outlined" onClick={handleCreateAccount}>Create Account</Button>
                </>
            )}
            <>
                <Button color="primary" variant="contained" onClick={handleImportAccount}>Import Account</Button>
                <Button color="primary" variant="outlined" onClick={handleCreateAccount}>Create Account</Button>
            </>
        </Grid>
    )
}


export default NearCore;