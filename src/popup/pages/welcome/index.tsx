import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './index.scss';
import {Link, useNavigate} from 'react-router-dom';
import Logo from '../../components/logo';
import { useAppSelector } from '../../../app/hooks';
import { selectNetwork } from '../../../reducer/network';
const extension = require('extensionizer');


const Welcome = () => {
    const [hasPwd, setHasPwd] = useState(false);
    const [expiredTime, setExpiredTime] = useState(0);
    const networkId = useAppSelector(selectNetwork)
    const navigate = useNavigate();
    extension.storage.local.get(['password', 'expiredTime'], (result) => {
        setHasPwd(Boolean(result.password))
        setExpiredTime(result.expiredTime)
    });
    useEffect(() => {
        if(!hasPwd){
            return ;
        }
        if(expiredTime > Date.now()){
            if(['mainnet', 'testnet'].includes(networkId)){
                navigate('/dashboard');
            }else{
                navigate('/custom');
            }
        }else{
            navigate('/sign-in');
        }
    },[hasPwd, navigate, expiredTime, networkId])
    return (
        <Grid className="welcome">
            <Logo />
            <Button color="primary" variant='contained' size="large" fullWidth component={Link} to="/sign-up">Get Started</Button>
        </Grid>
    )
}

export default Welcome;