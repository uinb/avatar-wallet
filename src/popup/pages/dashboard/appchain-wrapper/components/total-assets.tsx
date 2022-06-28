import React, {useState, useMemo, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { selectChain, selectAppChain, selectNetwork } from '../../../../../reducer/network';
import { useAppSelector, useAppDispatch } from '../../../../../app/hooks';
import Avatar from '@material-ui/core/Avatar';
import "./total-assets.scss"
import { useNavigate,useLocation } from 'react-router-dom';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import Typography from '@material-ui/core/Typography';
import { makeStyles,createStyles,Theme } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import receive from "../../../../../img/receive.svg"
import send from "../../../../../img/send.svg"
const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    colorTitle: {
      color:"#282828"
    },
    colorFont:{
      color:"#8A8C9B"
    },
    large: {
      width: theme.spacing(6),
      height: theme.spacing(6),
      margin:"16px auto"
    },
  })
  
);
const TotalAssets = (props:any)=>{
  const networkId = useAppSelector(selectNetwork);
  const chain = useAppSelector(selectChain(networkId));
  const appChain = useAppSelector(selectAppChain(networkId, chain));
  const classes = useStyles();
  const navigate = useNavigate()
  const location = useLocation();
  const symbol = location.pathname.split("/").pop();
  const handelSend = ()=>{
    console.log("/appchain-transfer/"+symbol)
    navigate("/appchain-transfer/"+symbol);
  }
  const handelReceive= ()=>{
    navigate("/")
  }
  return (
    <Grid>
        <HeaderWithBack back="/dashboard"/>
        <Content>
            <Grid>
              <Card className='center'>
                <Avatar className={classes.large}>
                  <img src={appChain.appchain_metadata?.fungible_token_metadata?.icon} alt="" width="100%"/>
                </Avatar>
                <Typography variant="h5" gutterBottom className={classes.colorTitle}>
                  98,485,748.8875 NEAR
                </Typography>
                <Typography variant="subtitle1" gutterBottom className={classes.colorFont}>
                  1,696,909,453.331625 USD
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
              <Card>
                <p className='nodata'>No transactions yet.</p>
              </Card>
            </Grid>
        </Content>
    </Grid>
  )
}
export default TotalAssets;