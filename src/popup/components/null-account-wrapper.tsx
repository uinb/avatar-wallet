import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    create:{
        paddingTop: `${theme.spacing(2)}px`,
        paddingBottom: `${theme.spacing(2)}px`,
        borderRadius: theme.spacing(1),
        borderStyle:'dashed',
        color: theme.palette.text.secondary
    },
    import:{
        paddingTop: `${theme.spacing(2)}px`,
        paddingBottom: `${theme.spacing(2)}px`,
        borderRadius: theme.spacing(1),
    },
}))

const NullAccountWrapper = (props:any) => {
    const {chain} = props;
    const classes = useStyles();
    return (
        <Grid container justifyContent='space-between' className='mt3'>
            <Button 
                color="primary" 
                variant="outlined" 
                component={Link} 
                to={`/import-account/${chain}`}
                className={classes.import}
                >+ Import Account</Button>
            <Button 
                color="default" 
                variant="outlined" 
                component={Link} 
                to={`/create-account/${chain}`}
                className={classes.create}
            >Create Account</Button>
        </Grid>
    )
}

export default NullAccountWrapper;