import React from 'react';
import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../../components/header';
import Content from '../../../components/layout-content';
import nearIcon from '../../../../img/near.svg';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../constant/chains';
import './index.scss'

const TokenDetail = (props: any) => {
  return (
    <Grid>
      <HeaderWithBack back="/dashboard" />
      <Content>
        <div className='token-detail'>
          <div className='token-detail-info'>
            <Avatar style={{background: chains.near.background, height: 40, width:40}}>
                <img src={nearIcon} alt=""/>
            </Avatar>
            <dl>
              <dt>98,485,748.8875 NEAR</dt>
              <dd>1,696,909,453.331625 USD</dd>
            </dl>
          </div>
        </div>
      </Content>
    </Grid>
  );
}

export default TokenDetail;
