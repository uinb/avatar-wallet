import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../../components/header';
import Content from '../../../components/layout-content';
import Card from '@material-ui/core/Card';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../constant/chains';

const AddToken = (props: any) => {
  const [state, setState] = useState(false);

  const handleChange = (e) => {
    setState(e.target.checked);
  }

  return (
    <Grid>
      <HeaderWithBack back="/dashboard" />
      <Content>
        <Grid>
          <Grid className="assetsList mt2">
            <Card className="mb1 background-color-F9F9F9">
              <Grid className='flex-no-wrap'>
                <ListItemAvatar>
                  <Avatar style={{ background: chains.near.background, height: 40, width: 40 }}>
                    <img src={chains.near.logo} alt="" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText className="ml1" primary={`NEAR`} secondary={`NEAR`} />
                <Switch
                  checked={state}
                  onChange={handleChange}
                  name="checkeds"
                  color="primary"
                />
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Content>
    </Grid>
  )
}

export default AddToken