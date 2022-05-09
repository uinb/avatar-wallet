import React from 'react';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Input from '@material-ui/core/Input';

const SignUp = () => {
    return (
        <div> 
            <Button fullWidth color="primary" variant='contained' component={Link} to="/dashboard" disabled={false}>Sign up</Button><br/><br/>
            <Input />
        </div>
    )
}

export default SignUp; 