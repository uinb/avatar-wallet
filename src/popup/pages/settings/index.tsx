import './index.scss';
import Grid from '@material-ui/core/Grid';
import IconLanguage from '../../../img/settings/language.svg';
import IconLock from '../../../img/settings/lock.svg';
import { HeaderWithBack } from '../../components/header';
import Content from '../../components/layout-content';
import Modal from '@material-ui/core/Modal';
import { useState, useEffect } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Settings = () => {
  const language = ['English', 'Chinese']
  const [languageOpen, setLangugeOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [locael, setLocael] = useState(1)
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
  }
  const handleLocaelChange = (e: any) => {
    setLocael(e.target.value)
  }

  return (
    <Grid>
      <HeaderWithBack back="/dashboard" />
      <Content>
        <div className='set-options' onClick={handleLanguageOpen}>
          <img src={IconLanguage} height="20" />
          <span>Language</span>
        </div>
        <div className='set-options mt-1-5' onClick={handlePwdOpen}>
          <img src={IconLock} height="22" />
          <span>Password</span>
        </div>
        <Modal
          open={languageOpen}
          onClose={handleLanguageClose}
          aria-labelledby="Language"
          BackdropProps={{ timeout: 500 }}
        >
          <Select
            value={locael}
            onChange={handleLocaelChange}
          >
            <MenuItem value={1}>English</MenuItem>
            <MenuItem value={2}>Chinese</MenuItem>
          </Select>
        </Modal>
        <Modal
          open={pwdOpen}
          onClose={handlePwdClose}
          aria-labelledby="Language"
          BackdropProps={{ timeout: 500 }}
        >
          <span>111</span>
        </Modal>
      </Content>

    </Grid>
  )

}
export default Settings