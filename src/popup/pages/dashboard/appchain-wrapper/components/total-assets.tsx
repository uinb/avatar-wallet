import Grid from "@material-ui/core/Grid";
import {useEffect, useMemo, useState} from 'react';
import Box from '@material-ui/core/Box';
import {selectConfig} from '../../../../../utils';
import Card from '@material-ui/core/Card';
import { selectChain, selectNetwork } from '../../../../../reducer/network';
import { useAppSelector} from '../../../../../app/hooks';
import useAppChain from '../../../../../hooks/useAppChain';
import Avatar from '@material-ui/core/Avatar';
import "./total-assets.scss"
import { useNavigate,useLocation } from 'react-router-dom';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import Typography from '@material-ui/core/Typography';
import { makeStyles,createStyles,Theme } from '@material-ui/core/styles';
import {selectActiveAccountByNetworkId} from '../../../../../reducer/account';
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
  // const appChain = useAppSelector(selectAppChain(networkId, chain));
  const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));
  const networkConfig = useMemo(() => {
      if(!networkId || !chain){
          return {} as any
      }
      return selectConfig(chain, networkId);
  },[chain, networkId])
  const location = useLocation();
  const symbol = location.pathname.split("/").pop();
  const {nodeId=''} = networkConfig;
  const api = useAppChain(nodeId);
  const [balance,setBalance] = useState('--') as any;
  const [selectToken = {}] = networkConfig.tokens.filter((item:any)=>{
    return item.symbol === symbol.toUpperCase();
  });
  useEffect(() => {
      if(!api || !activeAccount || !symbol){
          return 
      }
      (async () => {
          let balance = '';
          if(selectToken.code === 0){
            balance = await api.fetchBalances(activeAccount, symbol);
          }else{
            console.log()
            balance = await api.fetchFTBalanceByTokenId({params: [selectToken.code, activeAccount], config:networkConfig})
          }
          setBalance(balance);
      })()
  },[activeAccount, api, symbol, selectToken, networkConfig]);

  const classes = useStyles();
  const navigate = useNavigate()
  const handelSend = ()=>{
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
                  <img src={selectToken?.logo} alt="" width="100%"/>
                </Avatar>
                <Typography variant="h5" gutterBottom className={classes.colorTitle}>
                  {balance} {symbol.toUpperCase()}
                </Typography>
                <Typography variant="subtitle1" gutterBottom className={classes.colorFont}>
                  {balance} USD
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