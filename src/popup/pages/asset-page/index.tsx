import Grid from "@material-ui/core/Grid";
import {useMemo} from 'react';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import { selectChain, selectNetwork } from '../../../reducer/network';
import { useAppSelector} from '../../../app/hooks';
import "./total-assets.scss"
import { useNavigate, useParams } from 'react-router-dom';
import { HeaderWithBack } from '../../components/header';
import Content from '../../components/layout-content';
import Typography from '@material-ui/core/Typography';
import {tokenAccountList} from '../../../reducer/account';
import receive from "../../../img/receive.svg"
import send from "../../../img/send.svg"
import TokenIcon from "../../components/token-icon";
import {isEmpty} from 'lodash';
import {selectAccountBlances} from '../../../reducer/near';
import Big from 'big.js';

const TotalAssets = (props:any)=>{
  const networkId = useAppSelector(selectNetwork);
  const chain = useAppSelector(selectChain(networkId));
  const balancedTokens = useAppSelector(selectAccountBlances(networkId));
  const chainTokens = useAppSelector(tokenAccountList);
  const tokenList = chainTokens[chain];
  const {symbol = '' } = useParams() as {symbol: string};
  const selectToken = useMemo(() => {
    if(chain === 'near'){
      if(isEmpty(balancedTokens)){
        return {}
      }
      return balancedTokens.filter(token => Number(token.balance) > 0).find(token => token.symbol.toLowerCase() === symbol.toLocaleLowerCase());
    }else{
      if(isEmpty(tokenList)){
        return {}
      }
      return tokenList.filter((item:any)=>{
        return item.symbol === symbol.toUpperCase();
      })[0];
    }
  },[tokenList, balancedTokens, chain, symbol]);
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
        <HeaderWithBack back="/dashboard" title="Total Assets" />
        <Content>
            <Grid>
              <Card className='center'>
                <Grid container justifyContent="center" className="mt1">
                  <TokenIcon icon={selectToken?.logo || selectToken?.icon} size={48} symbol={symbol} showSymbol={false}/>
                </Grid>
                <Typography variant="h5" gutterBottom color="textPrimary" className="mt2">
                  {chain === 'near' ? new Big(selectToken?.balance || 0).toFixed(4) : selectToken?.balance} {symbol.toUpperCase()}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color="textSecondary">
                  {selectToken?.price?selectToken?.price:"--"} USD
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