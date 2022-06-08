import React, {useState,useEffect} from 'react';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Input from '@material-ui/core/Input';
import {HeaderWithBack} from '../../components/header';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import './index.scss';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useAppSelector,useAppDispatch } from '../../../app/hooks';
import {selectNetwork,setNetwork} from '../../../reducer/network';
// import { ApiPromise, WsProvider } from '@polkadot/api';
// const connectToBlockchain = async (url) => {
//   const wsProvider = new WsProvider(url)
//   return await ApiPromise.create({provider: wsProvider});
// }
const AddNetwork = () => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const networkList = useAppSelector(selectNetwork);
    const [inputError, setInputError] = useState({ customName: '', customUrl: '' });
    const [verifyStatus, setVerifyStatus] = useState(false);

    /**
     * verify networks
     */
     const verifyNetworks = () => {
        let sameNetworksUrl = networkList.filter(item => {
          return item.networkUrl == url;
        });
        let sameNetworksName = networkList.filter(item => {
          return item.name == name;
        });
        if(sameNetworksUrl.length){
          setInputError({ customName: '', customUrl: "RPC URL must be unique !!" })
          setVerifyStatus(false)
        }else if(sameNetworksName.length){
          setInputError({ customUrl: '', customName: "The network name must be unique !!" })
          setVerifyStatus(false)
        }else if (!name.trim()) {
            setInputError({ customUrl: '', customName: "The network name cannot be empty !!" })
            setVerifyStatus(false)
        }else if(!url.trim()){
          setInputError({ customUrl: 'The RPC URL cannot be empty !!', customName: "" })
          setVerifyStatus(false)
        } else if (name && url) {
            setInputError({ customUrl: '', customName: '' })
            setVerifyStatus(true)
        } else {
          setInputError({ customUrl: '', customName: '' })
        }
    }

    useEffect(() => {
        if (name || url) {
          verifyNetworks()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, url])

    const handleAddNetwork = async () => {

      
      //check URL
      // let api = await connectToBlockchain(url);
      // console.log(api);

      dispatch(setNetwork({name,networkUrl:url,active:false}));
    }
    return (
        <Grid container direction="column" >
            <HeaderWithBack back="/welcome"/ >
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
                        {inputError.customName && <Typography component="div" color="primary" className="tl mt1" variant="caption">{inputError.customName}</Typography>}
                    </Box>
                    <Box className="mt2">
                        <InputLabel>New RPC URL</InputLabel>
                        <Input 
                            fullWidth 
                            type="text"
                            className="mt2" 
                            onChange={(e) => {setUrl(e.target.value)}} 
                            ></Input>
                        {inputError.customUrl && <Typography component="div" color="primary" className="tl mt1" variant="caption">{inputError.customUrl}</Typography>}
                    </Box>
                </Box>
                <Button fullWidth color="primary" variant='contained' size="large" disabled={!verifyStatus} component={Link} to="/" className="mt2" onClick={handleAddNetwork}>Save</Button><br/><br/>
            </Container> 
        </Grid>
    )
}

export default AddNetwork; 