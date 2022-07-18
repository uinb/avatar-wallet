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
import TotalAssets from './pages/asset-page';
import Deposit from './pages/deposit';
import NFTTransfer from './pages/dashboard/near/components/nft-transfer';
import CustomPage from './pages/custom-dashboard';


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
                    <Route path="/manage-token" element={<AddToken />} />
                    <Route path="/transfer/:symbol" element={<Transfer />} />
                    <Route path="/nft-transfer/:contract/:tokenId" element={<NFTTransfer />} />
                    <Route path="/appchain-transfer/:symbol" element={<AppchainTransfer />} />
                    <Route path="/transfer-success" element={<TransferSuccess />} />
                    <Route path="/bridge/:from/:to" element={<Bridge />} />
                    <Route path="/total-assets/:symbol" element={<TotalAssets />} />
                    <Route path="/deposit/:chain/:symbol" element={<Deposit />} />
                    <Route path="/custom" element={<CustomPage />} >
                        <Route path="asset/:symbol" element={<CustomPage />}></Route>
                        <Route path="transfer/:symbol" element={<CustomPage />}></Route>
                        <Route path="deposit/:symbol" element={<CustomPage />}></Route>
                    </Route>
                </Routes>
            </HashRouter>
        </Grid>
    )
}

export default Popup;
