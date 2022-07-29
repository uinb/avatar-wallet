import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import Input from '@material-ui/core/Input';
import { HeaderWithBack } from '../../components/header';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { password } from '../../../utils/validate';
import Content from '../../components/layout-content';
import moment from 'moment';
const extension = require('extensionizer');

const SignUp = () => {
    const [pwdVisible, setPwdVisible] = useState(false);
    const [pwd, setPwd] = useState<string>('');
    const [confirmPwd, setConfirmPwd] = useState<string>('');
    const [inputError, setInputError] = useState({ passowrd: '', confirmPassword: '' });
    const [verifyStatus, setVerifyStatus] = useState(false);
    const navigate = useNavigate()

    const verifyPwd = () => {
        if (!password(pwd) && pwd) {
            setInputError({ ...inputError, passowrd: 'Password at least 8 characters, including numbers and letters !!' })
            setVerifyStatus(false)
        } else if (pwd !== confirmPwd && confirmPwd) {
            setInputError({ passowrd: '', confirmPassword: 'Inconsistent password entered twice !!' })
            setVerifyStatus(false)
        } else if (confirmPwd) {
            setInputError({ passowrd: '', confirmPassword: '' })
            setVerifyStatus(true)
        } else {
            setInputError({ passowrd: '', confirmPassword: '' })
        }
    }

    useEffect(() => {
        if (pwd || confirmPwd) {
            verifyPwd()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pwd, confirmPwd])

    const handleSignUp = () => {
        extension.storage.local.set({password: pwd, expiredTime:  moment().add(1, 'Q').valueOf()}, () => {
            navigate('/dashboard')
        });
    }
    
    return (
        <Grid container direction="column" >
            <HeaderWithBack back="/welcome"/>
            <Content style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <Box style={{flex: 1}}>
                    <Typography variant="h5" gutterBottom>Set Password</Typography>
                    <Typography variant="caption" color="textSecondary" gutterBottom>The password is used to protect your Enigma seed phrase(s) so that other Chrome extensions can't access them.</Typography>
                    <Box className="mt2">
                        <InputLabel>New Password</InputLabel>
                        <Input
                            fullWidth
                            className="mt2"
                            onChange={(e) => { setPwd(e.target.value) }}
                            type={pwdVisible ? "text" : "password"}
                            endAdornment={pwdVisible ? <VisibilityOff color="action" fontSize="small" onClick={() => setPwdVisible(false)} /> : <Visibility color="action" fontSize="small" onClick={() => setPwdVisible(true)} />} />
                        {inputError.passowrd && <Typography component="div" color="primary" className="tl mt1" variant="caption">{inputError.passowrd}</Typography>}
                    </Box>
                    <Box className="mt2">
                        <InputLabel>Confirm New Password</InputLabel>
                        <Input
                            fullWidth
                            type={pwdVisible ? "text" : "password"}
                            onChange={(e) => { setConfirmPwd(e.target.value) }}
                            className="mt2"
                            endAdornment={pwdVisible ? <VisibilityOff color="action" fontSize="small" onClick={() => setPwdVisible(false)} /> : <Visibility color="action" fontSize="small" onClick={() => setPwdVisible(true)} />} />
                        {inputError.confirmPassword && <Typography component="div" color="primary" className="tl mt1" variant="caption">{inputError.confirmPassword}</Typography>}
                    </Box>
                </Box>
                <Button fullWidth color="primary" variant='contained' size="large" disabled={!verifyStatus} className="mt2" onClick={handleSignUp}>Sign up</Button><br/><br/>
            </Content> 
        </Grid>
    )
}

export default SignUp; 
