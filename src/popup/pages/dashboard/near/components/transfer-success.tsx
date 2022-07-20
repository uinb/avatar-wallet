import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {selectTransferInformation, setTempTransferInfomation} from '../../../../../reducer/near';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import {formatLongAddress} from '../../../../../utils';
import { useNavigate } from 'react-router-dom';

const TransferSuccess = () => {
    const transferInfomation = useAppSelector(selectTransferInformation);
    const navigator = useNavigate();
    const dispatch = useAppDispatch();
    const handleBack = () => {
        dispatch(setTempTransferInfomation({}));
        navigator('/')
    }
    return (
        <Grid>
            <HeaderWithBack back="/"/>
            <Content>
                <Grid>
                    <Grid className="tc" container direction="column" justifyContent='center'>
                        <Typography variant='h5' align="center" style={{fontSize: 80}}><CheckCircle color="primary" fontSize="inherit"/></Typography>
                        <Typography variant='h5' align="center">Send successfully</Typography>
                    </Grid>
                    <Paper className="mt4 px2 py2">
                        <Grid container justifyContent='space-between'>
                            <Typography variant='body2'>From</Typography>
                            <Typography variant='body2'>{formatLongAddress(transferInfomation?.sender)}</Typography>
                        </Grid>
                        <Grid container justifyContent='space-between' className="mt2">
                             <Typography variant='body2'>To</Typography>
                            <Typography variant='body2'>{formatLongAddress(transferInfomation?.target)}</Typography>
                        </Grid>
                        {transferInfomation?.amount ? (
                            <Grid container justifyContent='space-between' className="mt2">
                                <Typography variant='body2'>Amount</Typography>
                                <Typography variant='body2'>{transferInfomation?.amount}&nbsp;{transferInfomation?.symbol}</Typography>
                            </Grid>
                        ) : null}
                        {transferInfomation.type === 'nft' ? (
                            <Grid container justifyContent='space-between' className="mt2">
                                <Typography variant='body2'>NFT</Typography>
                                <Typography variant='body2'>{transferInfomation?.symbol}</Typography>
                            </Grid>
                        ) : null}
                    </Paper>
                    <Button color="primary" variant='contained' size="large" className="mt4" fullWidth  onClick={handleBack}>Go Back</Button>
                </Grid>
            </Content>
        </Grid>
    )
}

export default TransferSuccess;