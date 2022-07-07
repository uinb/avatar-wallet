import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {useNavigate} from 'react-router-dom';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import './index.scss';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { useAppSelector, useAppDispatch} from '../../../app/hooks';
import {selectPwd, updateExpiredTime} from '../../../reducer/auth';
import Logo from '../../components/logo';
import {enqueueSnackbar} from '../../../reducer/snackbar';

const SignIn = () => {
    const [pwdVisible, setPwdVisible] = useState(false);
    const [inputPwd, setInputPwd] = useState('');
    const [inputError, setInputError] = useState('');
    const navigate = useNavigate();
    const pwd = useAppSelector(selectPwd);
    const dispatch = useAppDispatch();
    const handleSignIn = () => {
        if(inputPwd === pwd){
            dispatch(updateExpiredTime())
            dispatch(enqueueSnackbar({
                message: 'Login Success',
                options:{
                    key:'loginSuccess',
                    variant: 'success'
                }

            }))
            navigate('/dashboard')
        }
        setInputError('invalid password !!')
    }
    const handlePwdChange = (e:any) => {
        setInputPwd(e.target.value)
    }
    return (
        <Grid container direction="column" >
            <Container className="sign-in-content">
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
                    <Button fullWidth color="primary" variant='contained' size="large" className="mt2" onClick={handleSignIn}>Sign In</Button><br/><br/>
                </Box>
            </Container> 
        </Grid>
    )
}

export default SignIn; 