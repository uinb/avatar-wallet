import { Grid } from '@material-ui/core';
import React from 'react';
import logo from '../../img/logo.svg';


const Logo  = () => {
    return (
        <Grid>
            <div className='logo'>
                <img src={logo} alt="" />
                <div className="name">Avatar Wallet</div>
            </div>
        </Grid>
    )
}


export default Logo 