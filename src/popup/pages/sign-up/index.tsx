import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Input from '@material-ui/core/Input';
import {HeaderWithBack} from '../../components/header';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import './index.scss';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { useAppDispatch } from '../../../app/hooks';
import {setUserPwd} from '../../../reducer/auth';

const SignUp = () => {
    const [pwdVisible, setPwdVisible] = useState(false);
    const dispatch = useAppDispatch();
    const handleSignUp = () => {
        dispatch(setUserPwd('wulin1234'))
    }
    return (
        <Grid container direction="column" >
            <HeaderWithBack />
            <Container className="content">
                <Box>
                    <Typography variant="h5" gutterBottom>Set Password</Typography>
                    <Typography variant="caption" color="textSecondary" gutterBottom>The password is used to protect your Enigma seed phrase(s) so that other Chrome extensions can't access them.</Typography>
                    <Box className="mt2">
                        <InputLabel>New Password</InputLabel>
                        <Input 
                            fullWidth 
                            className="mt2" 
                            type={pwdVisible ? "text" : "password" }
                            endAdornment={pwdVisible ? <VisibilityOff color="action" fontSize="small"  onClick={() => setPwdVisible(false)}/> : <Visibility color="action"  fontSize="small" onClick={() => setPwdVisible(true)}/>}/>
                    </Box>
                    <Box className="mt2">
                        <InputLabel>Confirm New Password</InputLabel>
                        <Input 
                            fullWidth 
                            type={pwdVisible ? "text" : "password" }
                            className="mt2" 
                            endAdornment={pwdVisible ? <VisibilityOff color="action"  fontSize="small" onClick={() => setPwdVisible(false)}/> : <Visibility color="action" fontSize="small" onClick={() => setPwdVisible(true)}/>}/>
                    </Box>
                </Box>
                <Button fullWidth color="primary" variant='contained' size="large" component={Link} to="/dashboard" disabled={false} className="mt2" onClick={handleSignUp}>Sign up</Button><br/><br/>
            </Container> 
        </Grid>
    )
}

export default SignUp; 