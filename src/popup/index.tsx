import React from 'react';
import './popup.scss'
import SignUp from './pages/sign-up';
import {HashRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Grid from '@material-ui/core/Grid';

const Popup = () => {
    return (
        <Grid className="container">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<SignUp />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </HashRouter>
        </Grid>
    )
}

export default Popup;