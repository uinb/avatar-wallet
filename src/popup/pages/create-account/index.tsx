import React, {useEffect, useState} from 'react';
import { HeaderWithBack } from '../../components/header';
import Content from '../../components/layout-content';
import Grid from '@material-ui/core/Grid';
import { Near } from '../../../api';
import Typography from '@material-ui/core/Typography';
import { useNavigate, Link } from 'react-router-dom';
import {KeyPair} from 'near-api-js';
import { useAppSelector } from '../../../app/hooks';
import { selectNetwork } from '../../../reducer/network';
import Seeds from './components/seeds';
import ConfirmSeed from './components/confirmSeed';
import CreateSuccess from './components/createSuccess';
import SetNearAccount from './components/setNearAcccount';
import BN from 'bn.js';


const bs58 = require('bs58');


const CreateAccount = (props:any) => {
    const {hasAccount} = props;
    const [seeds, setSeeds] = useState('');
    const [step, setStep] = useState('setNearAccount');
    const [tempAddress, setTempAddress] = useState('');
    const [tempKeyPair, setKeypair] = useState() as any;
    const networkId = useAppSelector(selectNetwork);
    const [randomSeed] = useState(Math.ceil(Math.random()*12));
    useEffect(() => {
        const tempSeeds = Near.generateKeyPair();
        setKeypair(tempSeeds)
        setSeeds(tempSeeds.seedPhrase);
    },[])
    const navigator = useNavigate();

    const handleBack = () => {
        if(step === 'confirmSeeds'){
            setStep('generate');
        }else{
            navigator('/dashboard');
        }   
    }

    const handleCreateAccount = async () => {
        const {keyStore} = Near.config;
        const {secretKey, publicKey} = tempKeyPair;
        if(!tempAddress){
            const address = tempAddress || Buffer.from(bs58.decode(publicKey.split(':')[1])).toString('hex');
            const PRIVATE_KEY = secretKey.split("ed25519:")[1];
            const keyPair = KeyPair.fromString(PRIVATE_KEY);
            await keyStore.setKey(networkId, address, keyPair);
            setTempAddress(address)
            setStep('createSuccess');
        }else{
            try{
                const PRIVATE_KEY = secretKey.split("ed25519:")[1];
                const keyPair = KeyPair.fromString(PRIVATE_KEY);
                const creator = await Near.account('ac17492d17dfe7b476a4f573f1d48df9178a9f455c441c9ecacfff4e90be913b');
                await keyStore.setKey(networkId, tempAddress, keyPair);
                await creator.createAccount(
                    tempAddress,
                    publicKey.split(':')[1],
                    new BN(0)
                )
            }catch(e){
                setStep('createSuccess');
            }
            setStep('createSuccess');
        }
    }

    const setAccount = (account:string) => {
        setTempAddress(account);
        setStep('generate');
    }
    return (
        <Grid>
            <HeaderWithBack callback={handleBack} action={step === 'createSuccess' ? <Typography color="primary" component={Link} to="/dashboard">skip</Typography> : null}/>
            <Content>
                {step === 'setNearAccount' ? (
                    <SetNearAccount setAccount={setAccount}/>
                ) : null}
                {step === 'generate' ? (
                    <Seeds 
                        seeds={seeds} 
                        handleContinue={() => setStep('confirmSeeds')}
                    />
                ) : null}
                {step === 'confirmSeeds' ? (
                    <ConfirmSeed 
                        seeds={seeds} 
                        handleContinue={handleCreateAccount} 
                        randomSeed={randomSeed}
                    />
                ) : null}
                {step === 'createSuccess' ? (
                    <CreateSuccess tempAddress={tempAddress}/>
                ) : null}
            </Content>
        </Grid>
    )
}



export default CreateAccount;




