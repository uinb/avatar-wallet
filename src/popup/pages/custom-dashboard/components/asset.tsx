import React from 'react';
import Grid from '@material-ui/core/Grid';
import {HeaderWithBack} from '../../../components/header';
import Content from '../../../components/layout-content';
import TokenIcon from '../../../components/token-icon';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { useNavigate } from 'react-router';
import Box from '@material-ui/core/Box';
import "./total-assets.scss"
import receive from "../../../../img/receive.svg"
import send from "../../../../img/send.svg"

const AssetPage = (props:any) => {
    const {chainMeta, balance} = props;
    const {symbol=''} = chainMeta
    const navigate = useNavigate()

    const handelSend = ()=>{
        navigate(`/custom/transfer/${symbol.toLowerCase()}`);
    }
    const handelReceive= ()=>{
        navigate(`/custom/deposit/${symbol.toLowerCase()}`)
    }

    return (
        <>
            <HeaderWithBack back="/custom" title="Total Assets" />
            <Content>
                <Grid>
                    <Card className='center'>
                        <Grid container justifyContent="center" className="mt1">
                        <TokenIcon icon={''} size={48} symbol={symbol} showSymbol={false}/>
                        </Grid>
                        <Typography variant="h5" gutterBottom color="textPrimary" className="mt2">
                            {balance} {symbol.toUpperCase()}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom color="textSecondary">
                            -- USD
                        </Typography>
                    </Card>
                </Grid>
                <Grid>
                    <Box className='flexCenter'>
                        <Box className='op' onClick={handelReceive}>
                        <img src={receive} alt="" height="48" width="48" />
                        <p>Receive</p>
                        </Box>
                        <Box className='op' onClick={handelSend}>
                        <img src={send} alt="" height="48" width="48" />
                        <p>Send</p>
                        </Box>
                    </Box>
                    <p className='tit'>Record</p>
                </Grid>
            </Content>
        </>
    )
}

export default AssetPage