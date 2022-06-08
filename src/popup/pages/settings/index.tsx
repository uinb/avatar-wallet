import './index.scss';
import Grid from '@material-ui/core/Grid';
import IconLanguage from '../../../img/settings/language.svg';
import IconLock from '../../../img/settings/lock.svg';
import { HeaderWithBack } from '../../components/header';
import Content from '../../components/layout-content';
import { useState } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { selectPwd } from '../../../reducer/auth';
import DialogTitle from './components/dialogTitle'

const Settings = () => {
  const [languageOpen, setLangugeOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [locael, setLocael] = useState(1)
  const [pwdVisible, setPwdVisible] = useState(false);
  const [inputPwd, setInputPwd] = useState('');
  const [inputError, setInputError] = useState('');
  const pwd = useAppSelector(selectPwd);
  const navigate = useNavigate();

  const handleLanguageOpen = () => {
    setLangugeOpen(true);
  }
  const handleLanguageClose = () => {
    setLangugeOpen(false);
  }
  const handlePwdOpen = () => {
    setPwdOpen(true);
  }
  const handlePwdClose = () => {
    setPwdOpen(false);
    setInputPwd('');
    setInputError('');
  }
  const handleLanguageChange = (e: any) => {
    setLocael(e.target.value)
  }
  const handlePwdChange = (e: any) => {
    setInputPwd(e.target.value)
  }
  const handleNext = () => {
    if (inputPwd === pwd) {
      navigate('/edit-pwd')
    }
    setInputError('invalid password !!')
  }


  return (
    <Grid>
      <HeaderWithBack back="/dashboard" />
      <Content>
        <div className='set-options' onClick={handleLanguageOpen}>
          <img src={IconLanguage} height="20" alt=""/>
          <span>Language</span>
        </div>
        <div className='set-options mt-1-5' onClick={handlePwdOpen}>
          <img src={IconLock} height="22"  alt=""/>
          <span>Password</span>
        </div>
        <Dialog
          open={languageOpen}
          keepMounted
          onClose={handleLanguageClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="customized-dialog-title" onClose={handleLanguageClose}>
            Language
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" component="div">
              <Select
                value={locael}
                onChange={handleLanguageChange}
                fullWidth
              >
                <MenuItem value={1}>English</MenuItem>
                <MenuItem value={2}>Chinese</MenuItem>
              </Select>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={pwdOpen}
          keepMounted
          onClose={handlePwdClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="customized-dialog-title" onClose={handlePwdClose}>
            Safety Verification
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" component="div">
              <Grid container direction="column" >
                <Box>
                  <Box className="mt2">
                    <InputLabel className="tl">Enter Password</InputLabel>
                    <Input
                      value={inputPwd}
                      fullWidth className="mt2"
                      type={pwdVisible ? "text" : "password"}
                      onChange={handlePwdChange}
                      endAdornment={pwdVisible ? <VisibilityOff color="action" fontSize="small" onClick={() => setPwdVisible(false)} /> : <Visibility color="action" fontSize="small" onClick={() => setPwdVisible(true)} />}
                    />
                    {inputError && <Typography component="div" color="primary" className="tl mt1" variant="caption">{inputError}</Typography>}
                  </Box>
                  <Button fullWidth color="primary" variant='contained' size="large" className="mt2" onClick={handleNext}>Next</Button><br /><br />
                </Box>
              </Grid>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Content>
    </Grid>
  )

}
export default Settings