import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';

const NullAccountWrapper = (props:any) => {
    const {chain} = props;
    return (
        <Grid container justifyContent='space-between'>
            <Button color="primary" variant="contained" component={Link} to={`/import-account/${chain}`}>Import Account</Button>
            <Button color="primary" variant="outlined" component={Link} to={`/create-account/${chain}`}>Create Account</Button>
        </Grid>
    )
}

export default NullAccountWrapper;