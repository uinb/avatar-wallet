import React from 'react';
import Button from '@material-ui/core/Button';
import { CircularProgress } from '@material-ui/core';


const ButtonWithLoading = (props:any) => {
    return (
        <Button 
            color="primary" 
            size="large" 
            variant="contained" 
            fullWidth 
            {...props}
            disabled={props.loading}
        >{props.children}&nbsp;{props.loading ? <CircularProgress size={20} color='inherit' /> : null}</Button>
    )
}

export default ButtonWithLoading;