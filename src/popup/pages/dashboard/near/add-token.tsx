import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../../components/header';
import Content from '../../../components/layout-content';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../constant/chains';
interface BalanceProps {
  decimal: number;
  price: string;
  symbol: string;
  balance: string,
  usdValue: string;
  contractId: string;
  icon: string;
}
interface NFTMetadataProps {
  [key: string]: any
}
const AddToken = (props: any) => {
  const [activeTab, setActiveTab] = useState('assets');
  const [ftBalances] = useState<Array<BalanceProps>>([]);
  const [nftBalances] = useState<NFTMetadataProps>({});
  const [state, setState] = useState(false);

  const handleChange = () => {
    setState(true);
  }
  return (
    <Grid>
      <HeaderWithBack back="/dashboard" />
      <Content>
        <Grid>
          {activeTab === 'assets' ? (
            <Grid className="assetsList mt2">
              <Card className="mb1">
                <ListItem component={Link} to="add-token" disableGutters dense>
                  <ListItemAvatar>
                    <Avatar style={{ background: chains.near.background, height: 32, width: 32 }}>
                      <img src={chains.near.logo} alt="" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={`NEAR`} secondary={`NEAR`} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={state}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label=""
                  />
                </ListItem>
              </Card>
              {ftBalances.length ? ftBalances.filter(item => Number(item.balance) > 0 && item.symbol !== 'near').map(item => (
                <Card className="mt2" key={item.symbol}>
                  <ListItem component={Link} to="add-token" disableGutters dense>
                    <ListItemAvatar>
                      <Avatar style={{ height: 32, width: 32 }}>
                        {item?.icon ? (
                          <img src={item?.icon} alt="" />
                        ) : (
                          item.symbol.slice(0, 1)
                        )}

                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`NEAR`} secondary={`NEAR`} />
                  </ListItem>
                </Card>
              )) : null}
            </Grid>
          ) : null}
        </Grid>
      </Content>
    </Grid>
  )
}

export default AddToken