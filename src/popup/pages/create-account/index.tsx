import {useEffect, useState} from 'react';
import { HeaderWithBack } from '../../components/header';
import Content from '../../components/layout-content';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {KeyPair} from 'near-api-js';
import { useAppSelector } from '../../../app/hooks';
import { selectNetwork } from '../../../reducer/network';
import { selectSignerAccount } from '../../../reducer/near';
import Seeds from './components/seeds';
import ConfirmSeed from './components/confirmSeed';
import CreateSuccess from './components/createSuccess';
import SetNearAccount from './components/setNearAcccount';
import keyring from '@polkadot/ui-keyring';
import useNear from '../../../hooks/useNear';
/* import BN from 'bn.js';
import axios from 'axios'; */


const bs58 = require('bs58');


const CreateAccount = (props:any) => {
    const singerAccounts = useAppSelector(selectSignerAccount)
    const params = useParams();
    const {chain = ""} = params;
    const [seeds, setSeeds] = useState('');
    const [step, setStep] = useState(chain !== 'appchains' && singerAccounts.length  ? 'setNearAccount' : 'generate');
    const [tempAddress, setTempAddress] = useState('');
    const [tempKeyPair, setKeypair] = useState() as any;
    const networkId = useAppSelector(selectNetwork);
    const [randomSeed] = useState(Math.ceil(Math.random()*12));
    const near = useNear(networkId)
    useEffect(() => {
        if(!near){
            return ;
        }
        const tempSeeds = near.generateKeyPair();
        setKeypair(tempSeeds)
        const address = Buffer.from(bs58.decode(tempSeeds.publicKey.split(':')[1])).toString('hex');
        setTempAddress(address);
        setSeeds(tempSeeds.seedPhrase);
    },[near])
    const navigator = useNavigate();

    const handleBack = () => {
        if(step === 'confirmSeeds'){
            setStep('generate');
        }else{
            navigator('/dashboard');
        }   
    }

    const handleCreateAccount = async () => {
        if(chain === 'near'){
            const {keyStore} = near.config;
            const keyPair = tempKeyPair;
            const {secretKey, publicKey} = keyPair;
            const address = tempAddress || Buffer.from(bs58.decode(publicKey.split(':')[1])).toString('hex');
            if(!tempAddress){
                const PRIVATE_KEY = secretKey.split("ed25519:")[1];
                const keyPair = KeyPair.fromString(PRIVATE_KEY);
                await keyStore.setKey(networkId, address, keyPair);
                setTempAddress(address)
                setStep('createSuccess');
            }else{
                try{
                    const PRIVATE_KEY = secretKey.split("ed25519:")[1];
                    const setKeyPair = KeyPair.fromString(PRIVATE_KEY);
                    /* const creator = await near.account(singerAccounts[0]);
                    const targetAccount = await near.account(tempAddress); */
                    await keyStore.setKey(networkId, tempAddress, setKeyPair);
                    /* await creator.functionCall({
                        contractId: "near",
                        methodName: "create_account",
                        args: {
                          new_account_id: tempAddress,
                          new_public_key: keyPair.publicKey.toString(),
                        },
                        gas: "300000000000000",
                        attachedDeposit: utils.format.parseNearAmount('0.1'),
                      });
                    const addKeyResult = await targetAccount.addKey(keyPair.publicKey.toString());
                    console.log(addKeyResult); */
                    
                }catch(e){
                    console.log(e);
                    setStep('createSuccess');
                }
                setStep('createSuccess');
            }
        }else{
           const result = keyring.addUri(seeds, '', {}, 'sr25519');
           console.log(result);
           navigator('/dashboard');
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
                    <SetNearAccount setAccount={setAccount} address={tempAddress}/>
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




