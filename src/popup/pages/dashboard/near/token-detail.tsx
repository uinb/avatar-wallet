import React from 'react';
import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../../components/header';
import Content from '../../../components/layout-content';
import nearIcon from '../../../../img/near.svg';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../constant/chains';
import { withTheme } from '@material-ui/core';
import ReceiveIcon from '../../../../img/receive.svg';
import SendIcon from '../../../../img/send.svg';
import './index.scss'

const TokenDetail = (props: any) => {
  const { theme } = props;
  return (
    <Grid>
      <HeaderWithBack back="/dashboard" />
      <Content>
        <div className='token-detail'>
          <div className='token-detail-info' style={{ background: theme.overrides.MuiCard.root.background }}>
            <Avatar style={{ background: chains.near.background, height: 40, width: 40 }}>
              <img src={nearIcon} alt="" />
            </Avatar>
            <dl>
              <dt>98,485,748.8875 NEAR</dt>
              <dd>1,696,909,453.331625 USD</dd>
            </dl>
          </div>
          <div className='action' style={{ color: theme.palette.text.secondary }}>
            <div>
              <p style={{ background: theme.palette.primary.main }}>
                <img src={ReceiveIcon} alt="" />
              </p>
              Receive
            </div>
            <div>
              <p style={{ background: theme.palette.primary.main }}>
                <img src={SendIcon} alt="" />
              </p>
              Send
            </div>
          </div>
          <div className='record' style={{ marginTop: 32 }}>
            <p style={{ color: theme.palette.text.secondary, marginBottom: 8 }}>Record</p>
            <div className='record-list' style={{ background: theme.overrides.MuiCard.root.background }}>
              <p className='nodata'>No transactions yet.</p>
            </div>
          </div>
        </div>
      </Content>
    </Grid>
  );
}

export default withTheme(TokenDetail);
