import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Input from '@material-ui/core/Input';
import {HeaderWithBack} from '../../components/header';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import './index.scss';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import { useAppDispatch } from '../../../app/hooks';
import {setUserPwd} from '../../../reducer/auth';

const SignUp = () => {
    const dispatch = useAppDispatch();
    const [pwd, setPwd] = useState('');
    const handleSignUp = () => {
        dispatch(setUserPwd(pwd))
    }
    return (
        <Grid container direction="column" >
            <HeaderWithBack back="/welcome"/>
            <Container className="content">
                <Box>
                    <Box className="mt2">
                        <InputLabel>Network Name</InputLabel>
                        <Input 
                            fullWidth 
                            className="mt2"
                            onChange={(e) => {setPwd(e.target.value)}} 
                            type="text"
                            ></Input>
                    </Box>
                    <Box className="mt2">
                        <InputLabel>New RPC URL</InputLabel>
                        <Input 
                            fullWidth 
                            type="text"
                            className="mt2" 
                            ></Input>
                    </Box>
                </Box>
                <Button fullWidth color="primary" variant='contained' size="large" component={Link} to="/dashboard" disabled={false} className="mt2" onClick={handleSignUp}>Sign up</Button><br/><br/>
            </Container> 
        </Grid>
    )
}

export default SignUp; 