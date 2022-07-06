import Grid from "@material-ui/core/Grid";
import {useCallback, useEffect, useMemo, useState} from 'react';
import Box from '@material-ui/core/Box';
import {selectConfig} from '../../../utils';
import Card from '@material-ui/core/Card';
import { selectChain, selectNetwork } from '../../../reducer/network';
import { useAppSelector} from '../../../app/hooks';
import useAppChain from '../../../hooks/useAppChain';
import "./total-assets.scss"
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderWithBack } from '../../components/header';
import Content from '../../components/layout-content';
import Typography from '@material-ui/core/Typography';
import {selectActiveAccountByNetworkId} from '../../../reducer/account';
import receive from "../../../img/receive.svg"
import send from "../../../img/send.svg"
import TokenIcon from "../../components/token-icon";
import {isEmpty} from 'lodash';
import {selectAccountBlances} from '../../../reducer/near';
import Big from 'big.js';

const TotalAssets = (props:any)=>{
  const networkId = useAppSelector(selectNetwork);
  const chain = useAppSelector(selectChain(networkId));
  const activeAccount = useAppSelector(selectActiveAccountByNetworkId(networkId));
  const balancedTokens = useAppSelector(selectAccountBlances(networkId));
  const {symbol = '' } = useParams() as {symbol: string};
  const networkConfig = useMemo(() => {
      if(!networkId || !chain || chain === 'near'){
          return {} as any
      }
      return selectConfig(chain, networkId);
  },[chain, networkId])
  const {nodeId=''} = networkConfig;
  const api = useAppChain(nodeId);
  const [balance,setBalance] = useState('--') as any;

  const selectToken = useMemo(() => {
    if(chain === 'near'){
      if(isEmpty(balancedTokens)){
        return {}
      }
      return balancedTokens.filter(token => Number(token.balance) > 0).find(token => token.symbol.toLowerCase() === symbol.toLocaleLowerCase());
    }else{
      if(isEmpty(networkConfig)){
        return {}
      }
      return networkConfig.tokens.filter((item:any)=>{
        return item.symbol === symbol.toUpperCase();
      })[0];
    }
  },[networkConfig, balancedTokens, chain, symbol]);
  const fetchAppChainAccountBalance = useCallback(async () => {
    if(!api || !activeAccount || !symbol){
        return 
    }
    let balance = '';
    if(selectToken.code === 0){
      balance = await api.fetchBalances(activeAccount, networkConfig);
    }else{
      balance = await api.fetchFTBalanceByTokenId({params: [selectToken.code, activeAccount], config:networkConfig})
    }
    setBalance(balance);
},[activeAccount, api, symbol, selectToken, networkConfig])

  useEffect(() => {
    if(chain ==='near'){
      return ;
    }
    fetchAppChainAccountBalance();
  },[chain, fetchAppChainAccountBalance])

  const navigate = useNavigate()
  const handelSend = ()=>{
    if(chain === 'near'){
      navigate(`/transfer/${symbol}`);
    }else{
      navigate(`/appchain-transfer/${symbol}`);
    }
  }
  const handelReceive= ()=>{
    navigate(`/deposit/${chain}/${symbol}`)
  }

  return (
    <Grid>
        <HeaderWithBack back="/dashboard"/>
        <Content>
            <Grid>
              <Card className='center'>
                <Grid container justifyContent="center" className="mt1">
                  <TokenIcon icon={selectToken?.logo || selectToken?.icon} size={48} symbol={symbol} showSymbol={false}/>
                </Grid>
                <Typography variant="h5" gutterBottom color="textPrimary" className="mt2">
                  {chain === 'near' ? new Big(selectToken?.balance || 0).toFixed(4) : balance} {symbol.toUpperCase()}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color="textSecondary">
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
              <Card >
                <p className="nodata">No transactions yet.</p>
              </Card>
            </Grid>
        </Content>
    </Grid>
  )
}
export default TotalAssets;