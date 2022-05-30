import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Input from '@material-ui/core/Input';
import {HeaderWithBack} from '../../components/header';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import './index.scss';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import { useAppDispatch } from '../../../app/hooks';
import {setNetwork} from '../../../reducer/network';

const AddNetwork = () => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const handleAddNetwork = () => {
        dispatch(setNetwork({name,url}));
    }
    return (
        <Grid container direction="column" >
            <HeaderWithBack back="/welcome"/>
            <Container className="content">
                <Box>
                    <Box className="mt2">
                        <InputLabel>Network Name</InputLabel>
                        <Input 
                            fullWidth 
                            className="mt2"
                            onChange={(e) => {setName(e.target.value)}} 
                            type="text"
                            ></Input>
                    </Box>
                    <Box className="mt2">
                        <InputLabel>New RPC URL</InputLabel>
                        <Input 
                            fullWidth 
                            type="text"
                            className="mt2" 
                            onChange={(e) => {setUrl(e.target.value)}} 
                            ></Input>
                    </Box>
                </Box>
                <Button fullWidth color="primary" variant='contained' size="large" component={Link} to="/" disabled={false} className="mt2" onClick={handleAddNetwork}>Save</Button><br/><br/>
            </Container> 
        </Grid>
    )
}

export default AddNetwork; 