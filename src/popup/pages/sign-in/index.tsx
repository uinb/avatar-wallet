import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {useNavigate} from 'react-router-dom';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { useAppDispatch } from '../../../app/hooks';
import Logo from '../../components/logo';
import {enqueueSnackbar} from '../../../reducer/snackbar';
import Content from '../../components/layout-content';
import moment from 'moment';
const extension = require('extensionizer');

const SignIn = () => {
    const [pwdVisible, setPwdVisible] = useState(false);
    const [inputPwd, setInputPwd] = useState('');
    const [inputError, setInputError] = useState('');
    const navigate = useNavigate();
    const [pwd, setPwd] = useState('');
    const dispatch = useAppDispatch();
    extension.storage.local.get(['password'], (result) => {
        setPwd(result.password)
    });
    const handleSignIn = () => {
        if(inputPwd === pwd){
            extension.storage.local.set({expiredTime:  moment().add(1, 'Q').valueOf()}, () => {
                dispatch(enqueueSnackbar({
                    message: 'Login Success',
                    options:{
                        key:'loginSuccess',
                        variant: 'success'
                    }
    
                }))
                navigate('/')
            });
        }
        setInputError('invalid password !!')
    }
    const handlePwdChange = (e:any) => {
        setInputPwd(e.target.value)
    }
    return (
        <Grid container direction="column"  justifyContent='space-between'>
            <Content style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box style={{flex: 1}}>
                    <Logo />
                    <Box>
                        <Box className="mt2">
                            <InputLabel className="tl">Enter Password</InputLabel>
                            <Input 
                                fullWidth className="mt2" 
                                type={pwdVisible ? "text" : "password" }
                                onChange={handlePwdChange}
                                endAdornment={pwdVisible ? <VisibilityOff color="action" fontSize="small"  onClick={() => setPwdVisible(false)}/> : <Visibility color="action"  fontSize="small" onClick={() => setPwdVisible(true)}/>}
                            />
                            {inputError && <Typography component="div" color="primary" className="tl mt1" variant="caption">{inputError}</Typography>}
                        </Box>
                    </Box>
                </Box>
                <Button fullWidth color="primary" variant='contained' size="large" className="mt2" onClick={handleSignIn}>Sign In</Button><br/><br/>
            </Content> 
        </Grid>
    )
}

export default SignIn; 