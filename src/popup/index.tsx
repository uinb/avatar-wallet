import React from 'react';
import './popup.scss'
import SignUp from './pages/sign-up';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Grid from '@material-ui/core/Grid';
import Welcome from './pages/welcome';

const Popup = () => {
    return (
        <Grid className="root">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </HashRouter>
        </Grid>
    )
}

export default Popup;