import Grid from "@material-ui/core/Grid";
import {useCallback, useEffect, useMemo, useState} from 'react';
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
import {selectAccountBlances, selectNearActiveAccountByNetworkId} from '../../../reducer/near';
import Big from 'big.js';
import useNear from "../../../hooks/useNear";
import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import nearTranferIcon from '../../../img/near-transfer-icon.svg';
import nearKeyIcon from '../../../img/near-key-icon.svg';
import nearCallIcon from '../../../img/near-call-icon.svg';
import nearSendcon from '../../../img/near-send-icon.svg';
import nearRecieveIcon from '../../../img/near-recieve-icon.svg';
import nearAccountIcon from '../../../img/near-create-account-icon.svg';
import Avatar from '@material-ui/core/Avatar';
import {green, red} from '@material-ui/core/colors'
import moment from 'moment';
import {toUsd} from '../../../utils';

const getHistotyOptions = (item:any, accountId: string) => {
  switch(item.action_kind.toLowerCase()){
    case 'create_account':
      return {
        icon: nearAccountIcon,
        title: 'Create new Account',
        subTitle: `account ${item.receiver_id}`,
        titleOption: ''
      };
    case 'add_key':
      return {
        icon: nearKeyIcon,
        title: 'Access Key added',
        subTitle: `For ${item.receiver_id}`,
        titleOption: ''
      };
    case "function_call" : 
      return {
        icon: nearCallIcon,
        title: 'Method Call',
        subTitle: `${item.args.method_name} in ${item.receiver_id}`,
        titleOption: ''
      };
    case "transfer" : 
      return {
        icon: item.receiver_id !== accountId ? nearSendcon : nearRecieveIcon,
        title: item.receiver_id !== accountId ? 'Sent NEAR' : 'Received NEAR',
        subTitle: item.receiver_id !== accountId ? `To ${item.receiver_id}` : `From ${item.signer_id}`,
        titleOption: item.receiver_id !== accountId ? `-${new Big(item.args.deposit || 0).div(new Big(10).pow(24)).toFixed(4)}` : `+${new Big(item.args.deposit || 0).div(new Big(10).pow(24)).toFixed(4)}`
      }
    default: 
      return{
        icon: nearTranferIcon,
        title: item.action_kind.replaceAll('_', ' '),
        subTitle: `${item.args.method_name} in ${item.receiver_id}`,
        titleOption: item.receiver_id !== accountId ? `-${new Big(item.args.deposit || 0).div(new Big(10).pow(24)).toFixed(4)}` : `+${new Big(item.args.deposit || 0).div(new Big(10).pow(24)).toFixed(4)}`
      }
  }
}


const TotalAssets = (props:any)=>{
  const networkId = useAppSelector(selectNetwork);
  const chain = useAppSelector(selectChain(networkId));
  const balancedTokens = useAppSelector(selectAccountBlances(networkId));
  const chainTokens = useAppSelector(tokenAccountList(networkId));
  const near = useNear(networkId);
  const tokenList = chainTokens[chain];
  const nearActiveAccount = useAppSelector(selectNearActiveAccountByNetworkId(networkId));
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

  const [nearHistory, setNearHistory] = useState([]);

  const fetchNearHistory = useCallback(async () => {
    if(!nearActiveAccount || !near){
      return ;
    }
    const history = await near.fetchHistory(nearActiveAccount);
    setNearHistory(history)
  },[near, nearActiveAccount])

  useEffect(() => {
    if(chain !== 'near'){
      return 
    }
    fetchNearHistory();
  },[chain, fetchNearHistory])

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
                  {selectToken?.price? chain === 'near' ? toUsd(selectToken?.balance , selectToken?.price, 4) : selectToken?.price : "--"} USD
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
              {chain === 'near' ? (
                <Card>
                  {nearHistory.length ? (
                    <>
                      {nearHistory.slice(0,3).map((item, index) => {
                        const displayOptions = getHistotyOptions(item, nearActiveAccount);
                        return (
                          <ListItem disableGutters dense style={{padding: 0}} key={index}>
                            <ListItemAvatar>
                              <Avatar style={{background: 'transparent', marginRight: 4}}><img src={displayOptions.icon} alt='' width="16"/></Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={
                                    <Box className="flex items-center justify-between" component="div">
                                      <Typography variant="caption" component="span">
                                          {displayOptions.title}
                                      </Typography>
                                      <Typography variant="caption" component="span" style={{color: displayOptions.titleOption ? Number(displayOptions.titleOption) > 0  ? green[500] : red[500] : 'inherit'}}>
                                        {displayOptions.titleOption ? `${displayOptions.titleOption} NEAR` : displayOptions.titleOption}
                                      </Typography>
                                    </Box>
                                } 
                                secondary={
                                  <Box className="flex itemss-center justify-between"  component="span">
                                      <Typography variant="caption" color="textSecondary" component="span">
                                        {displayOptions.subTitle}
                                      </Typography>
                                      <Typography variant="caption" color="textSecondary" component="span">
                                          {moment(Number(item.block_timestamp.slice(0,13))).fromNow()}
                                      </Typography>
                                  </Box>
                                } 
                            />
                        </ListItem>
                        )
                      })}
                      <Typography align="center" className="mt2" variant="caption" display="block" color="primary" component="a" href={`https://explorer.${networkId === 'testnet' ? 'testnet.' : 'mainnet.'}near.org/accounts/${nearActiveAccount}}`} target="_blank">View More</Typography>
                    </>
                  ) : (
                    <Typography className="nodata">No transactions yet.</Typography>
                  )}
                </Card>
              ) : (
                <Card component="div">
                    <Typography className="nodata">No transactions yet.</Typography>
                </Card>
              )}
            </Grid>
        </Content>
    </Grid>
  )
}
export default TotalAssets;