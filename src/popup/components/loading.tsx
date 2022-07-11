import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useTheme} from '@material-ui/core/styles'; 


const Loading = (props:any) => {
    const theme = useTheme();
    const {size = 40, height='100%'} = props;
    return (
        <Grid style={{width: '100%', height: height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.palette.primary.main}}>
            <CircularProgress size={size} color="inherit"/>
        </Grid>
    )
}

export default Loading;
  