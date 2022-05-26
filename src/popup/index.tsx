import React from 'react';
import './popup.scss'
import SignUp from './pages/sign-up';
import SignIn from './pages/sigh-in';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Grid from '@material-ui/core/Grid';
import Welcome from './pages/welcome';
import ImportAccount from './pages/import-account';
import CreateAccount from './pages/create-account';
import Transfer from './pages/dashboard/near/components/transfer';
import TransferSuccess from './pages/dashboard/near/components/transfer-success'

const Popup = () => {
   
    return (
        <Grid className="root">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Welcome />}/>
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/import-account/:chain" element={<ImportAccount />} />
                    <Route path="/create-account/:chain" element={<CreateAccount />} />
                    <Route path="/transfer/:chain" element={<Transfer />} />
                    <Route path="/transfer-success" element={<TransferSuccess />} />
                </Routes>
            </HashRouter>
        </Grid>
    )
}

export default Popup;