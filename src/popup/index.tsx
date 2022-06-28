import React from 'react';
import './popup.scss'
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import AddCustom from './pages/add-custom';
import Grid from '@material-ui/core/Grid';
import Welcome from './pages/welcome';
import ImportAccount from './pages/import-account';
import CreateAccount from './pages/create-account';
import Settings from './pages/settings';
import EditPwd from './pages/settings/editPwd';
import Transfer from './pages/dashboard/near/components/transfer';
import AppchainTransfer from './pages/dashboard/appchain-wrapper/components/transfer';
import TransferSuccess from './pages/dashboard/near/components/transfer-success'
import AddToken  from './pages/dashboard/near/add-token'
import Bridge from './pages/bridge'
import TotalAssets from './pages/dashboard/appchain-wrapper/components/total-assets'


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
                    <Route path="/addcustom" element={<AddCustom />} />
                    <Route path="/import-account/:chain" element={<ImportAccount />} />
                    <Route path="/create-account/:chain" element={<CreateAccount />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/edit-pwd" element={<EditPwd />} />
                    <Route path="/add-token" element={<AddToken />} />
                    <Route path="/transfer/:chain" element={<Transfer />} />
                    <Route path="/appchain-transfer/:chain" element={<AppchainTransfer />} />
                    <Route path="/transfer-success" element={<TransferSuccess />} />
                    <Route path="/bridge/:from/:to" element={<Bridge />} />
                    <Route path="/token-detail/:tokenId" element={<TokenDetail />} />
                    <Route path="/total-assets/:chain" element={<TotalAssets />} />
                </Routes>
            </HashRouter>
        </Grid>
    )
}

export default Popup;
