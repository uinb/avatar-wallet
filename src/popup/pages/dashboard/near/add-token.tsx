import  React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../../components/header';
import Content from '../../../components/layout-content';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Box from '@material-ui/core/Box';
import {Typography, withTheme} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../constant/chains';
import {utils, KeyPair} from 'near-api-js';
import Big from 'big.js';
import {setSignerAccounts, selectSignerAccount, selectActiveAccount, setActiveAccount, setPriceList, selectPriceList, setBalancesForAccount, setNearBalanceForAccount, selectNearConfig} from '../../../../reducer/near';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';

interface BalanceProps {
  decimal: number;
  price: string;
  symbol: string;
  balance:string ,
  usdValue: string ;
  contractId: string;
  icon:string;
}
interface NFTMetadataProps{
  [key:string] :any
}

const AddToken = (props:any) => {
  const [activeTab, setActiveTab] = useState('assets');
  const [balances, setBalances] = useState({}) as any;
  const nearSymbolConfig = useAppSelector(selectNearConfig);
  const [ftBalances, setFTBalances] = useState<Array<BalanceProps>>([]);
  const [nftBalances, setNftBalances] = useState<NFTMetadataProps>({});
  return (
    <Grid>
      <HeaderWithBack back="/dashboard" />
      <Content>
        <Grid>
          {activeTab === 'assets' ? (
            <Grid className="assetsList mt2">
              <Card className="mb1">
                <ListItem component={Link} to="/transfer/near" disableGutters dense>
                  <ListItemAvatar>
                    <Avatar style={{ background: chains.near.background, height: 32, width: 32 }}>
                      <img src={chains.near.logo} alt="" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`${utils.format.formatNearAmount(balances.available, 4)} NEAR`} secondary={`$${new Big(utils.format.formatNearAmount(balances.available)).times(nearSymbolConfig?.price || 1).toFixed(4)}`} />
                </ListItem>
              </Card>
              {ftBalances.length ? ftBalances.filter(item => Number(item.balance) > 0 && item.symbol !== 'near').map(item => (
                <Card className="mt2" key={item.symbol}>
                  <ListItem component={Link} to="/transfer/near" disableGutters dense>
                    <ListItemAvatar>
                      <Avatar style={{ height: 32, width: 32 }}>
                        {item?.icon ? (
                          <img src={item?.icon} alt="" />
                        ) : (
                          item.symbol.slice(0, 1)
                        )}

                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${new Big(item.balance).toFixed(4)} ${item.symbol}`} secondary={`$${new Big(item?.usdValue).toFixed(4)}`} />
                  </ListItem>
                </Card>
              )) : null}
            </Grid>
          ) : null}
          {activeTab === "nfts" ? (
            <Grid className="assetsList mt2">
              {Object.entries(nftBalances).length ? Object.entries(nftBalances).map(([contract, { tokens = [], ...restProps }]) => {
                return (
                  <Grid container spacing={2}>
                    <Grid item sm={6} md={6} lg={6}>
                      {tokens.map(token => (
                        <Grid key={token?.title}>
                          <Box>
                            <img src={`${restProps.base_uri}/${token.metadata.media}`} alt="" width="134px" height="134px" style={{ borderRadius: 8 }} />
                          </Box>
                          <Typography variant="caption" color="primary" className="mt1" component='div'>{token.metadata.title}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )
              }) : (<Typography variant="caption" color="primary" className="mt1" component='div' align="left">No Collections</Typography>)}
            </Grid>
          ) : null}
        </Grid>
      </Content>
    </Grid>
  )
}

export default AddToken