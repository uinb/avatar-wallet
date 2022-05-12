import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './index.scss';
import {Link} from 'react-router-dom';
import Logo from '../../components/logo';


const Welcome = () => {
    return (
        <Grid className="welcome">
            <Logo />
            <Button color="primary" variant='contained' size="large" fullWidth component={Link} to="/sign-up">Get Started</Button>
        </Grid>
    )
}

export default Welcome;