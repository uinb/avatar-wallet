import React from 'react';
import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../../components/header';
import Content from '../../../components/layout-content';
import Card from '@material-ui/core/Card';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Switch from '@material-ui/core/Switch';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectNearActiveAccountByNetworkId, selectBalanesByAccount, updateTokensStatusByAccount } from '../../../../reducer/near';
import { selectNetwork } from '../../../../reducer/network';
import TokenIcon from '../../../components/token-icon';
import {AutoSizer} from 'react-virtualized';

const AddToken = (props: any) => {
  const networkId = useAppSelector(selectNetwork)
  const activeAccount = useAppSelector(selectNearActiveAccountByNetworkId(networkId))
  const balancedTokens = useAppSelector(selectBalanesByAccount(activeAccount));
  const dispatch = useAppDispatch();
  const handleChange = (e, token) => {
    const refactorTokensStatus = balancedTokens.map(item => ({...item, show: item.name === token.name ? e.target.checked : item.show || false}))
    dispatch(updateTokensStatusByAccount({account:activeAccount, tokens: refactorTokensStatus}))
  }

  return (
    <Grid>
      <HeaderWithBack back="/dashboard" title="Manage Tokens"/>
      <Content>
          <AutoSizer>
            {({width, height}) => {
              return (
                <Grid className="assetsList mt2" style={{width, height, overflowY:'scroll'}}>
                  {balancedTokens.map((item, index) => (
                    <Card className="mb2 background-color-F9F9F9" key={index}>
                      <Grid className='flex-no-wrap'>
                        <ListItemAvatar>
                          <TokenIcon 
                            icon={item?.icon}
                            symbol={item.symbol}
                            size={40}
                            showSymbol={false}
                          />
                        </ListItemAvatar>
                        <ListItemText className="ml1" primary={item.symbol} secondary={item?.name || item.symbol} />
                        <Switch
                          checked={item.symbol === 'NEAR' ? true : item?.show || false}
                          onChange={(e) => handleChange(e, item)}
                          name="checked"
                          color="primary"
                        />
                      </Grid>
                    </Card>
                  ))}
                </Grid>
              )
            }}
          </AutoSizer>
      </Content>
    </Grid>
  )
}

export default AddToken