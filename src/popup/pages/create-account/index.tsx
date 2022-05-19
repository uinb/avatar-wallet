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
import CreateSuccess from './components/createSuccess'

const bs58 = require('bs58');


const CreateAccount = () => {
    const [seeds, setSeeds] = useState('');
    const [step, setStep] = useState('generate');
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
        const address = Buffer.from(bs58.decode(publicKey.split(':')[1])).toString('hex');
        const PRIVATE_KEY = secretKey.split("ed25519:")[1];
        const keyPair = KeyPair.fromString(PRIVATE_KEY);
        await keyStore.setKey(networkId, address, keyPair);
        setTempAddress(address)
        setStep('createSuccess');
    }
    return (
        <Grid>
            <HeaderWithBack callback={handleBack} action={step === 'createSuccess' ? <Typography color="primary" component={Link} to="/dashboard">skip</Typography> : null}/>
            <Content>
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




