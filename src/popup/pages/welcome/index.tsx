import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './index.scss';
import {Link, useNavigate} from 'react-router-dom';
import Logo from '../../components/logo';
import { useAppSelector } from '../../../app/hooks';
import {selectPwd, selectExpiredTime} from '../../../reducer/auth';

const Welcome = () => {
    const hasPwd = Boolean(useAppSelector(selectPwd));
    const expiredTime = useAppSelector(selectExpiredTime);
    const navigate = useNavigate();
    useEffect(() => {
        if(!hasPwd){
            return ;
        }
        if(expiredTime > Date.now()){
            navigate('/dashboard');
        }else{
            navigate('/sign-in');
        }
    },[hasPwd, navigate, expiredTime])
    return (
        <Grid className="welcome">
            <Logo />
            <Button color="primary" variant='contained' size="large" fullWidth component={Link} to="/sign-up">Get Started</Button>
        </Grid>
    )
}

export default Welcome;