import React, {useMemo, useState} from 'react';
import { HeaderWithBack } from '../../../../components/header';
import Grid from '@material-ui/core/Grid';
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { selectNearActiveAccountByNetworkId, selectNftBalancesByAccount, setTempTransferInfomation, setNftBalancesForAccount } from '../../../../../reducer/near';
import { selectNetwork } from '../../../../../reducer/network';
import {isEmpty} from 'lodash';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Content from '../../../../components/layout-content';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import useNear from '../../../../../hooks/useNear';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';



const NftTransfer = () => {
    const {contract, tokenId} = useParams() as {contract: string ,tokenId: string};
    const networkId = useAppSelector(selectNetwork);
    const activeAccount = useAppSelector(selectNearActiveAccountByNetworkId(networkId));
    const nftBlances = useAppSelector(selectNftBalancesByAccount(activeAccount));
    const near = useNear(networkId);
    const {enqueueSnackbar} = useSnackbar();
    const navigator = useNavigate();
    const dispatch = useAppDispatch();
    const currenToken = useMemo(() => {
        if(isEmpty(nftBlances)){
            return {}
        }
        return {...nftBlances[contract].tokens.find(item => item.token_id === tokenId), base_uri: nftBlances[contract].base_uri};
    },[nftBlances, tokenId, contract])
    const [isSend, setIsSend] = useState(false);
    const [formState, setFormState] = useState({sender: activeAccount, target: '', contractId: contract, tokenId, symbol: currenToken.metadata.title, type: 'nft'}) as any;
    const [sendError, setSendError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchNfts = () => {
        near.fetchNFTBalance(activeAccount).then(resp => {
            dispatch(setNftBalancesForAccount({account: activeAccount, networkId, balances: resp}))
        }).catch(e => {
            console.log(e)
        })
    }

    const handleSend = () => {
        dispatch(setTempTransferInfomation(formState));
        setLoading(true);
        near.nftTransfer(formState).then(resp => {
            fetchNfts();
            enqueueSnackbar('Send success', {variant: 'success'});
            navigator('/transfer-success');
            setLoading(false);
        }).catch(e => {
            setSendError(e.message)
            setLoading(false);
        });
    }


    const sendDisabled = useMemo(() => {
        if(!Object.keys(currenToken).length){
            return true;
        }
        return Object.entries(formState).some(([key, value]) => !value) || loading
    },[formState, currenToken, loading])
    return  (
        <Grid>
            {!isSend ? (
                <>
                    <HeaderWithBack back={`/dashboard?activeTabs=nfts`}/>
                    <Content style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', paddingBottom: 24}}>
                        <Grid>
                            <Box className="mt1">
                                <img src={`${currenToken.base_uri}/${currenToken.metadata.media}`} width="100%" style={{borderRadius: 8}} alt=""/>
                            </Box>
                            <Typography className="mt2" variant='body1'>{currenToken.metadata.title}</Typography>
                        </Grid>
                        <Button color="primary" variant="contained" size="large" fullWidth onClick={() => setIsSend(true)}>Send</Button>
                    </Content>
                </>
            ) : (
                <>
                    <HeaderWithBack callback={() => setIsSend(false)} title="Send NFT"/>
                    <Content style={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column', paddingBottom: 24}}>
                        <Grid>
                            <Box className="mt1 text-center">
                                <img src={`${currenToken.base_uri}/${currenToken.metadata.media}`} width="70%" style={{borderRadius: 8}} alt=""/>
                            </Box>
                            <Box className="mt4">
                                <InputLabel className="tl">Send to</InputLabel>
                                <Input 
                                    name="target"
                                    fullWidth 
                                    className="mt2" 
                                    value={formState.target}
                                    placeholder="Send to"
                                    onChange={(e) => setFormState(state => ({...state, target: e.target.value}))}
                                />
                            </Box>
                            {sendError ? (
                                <Typography color="error" variant="body2">{sendError}</Typography>
                            ) : null}
                            <Button 
                                color="primary" 
                                variant="contained" 
                                size="large" 
                                fullWidth 
                                onClick={handleSend} 
                                disabled={sendDisabled}
                                className="mt3"
                            >
                                Send {loading ? <CircularProgress size={20} color="inherit" className="ml1"/> : null}
                            </Button>
                        </Grid>
                    </Content>
                </>
            )}
        </Grid>
    )
}

export default NftTransfer;