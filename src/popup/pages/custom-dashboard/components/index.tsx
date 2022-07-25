import React from 'react';
import Grid from '@material-ui/core/Grid';
import {DashboardHeader} from '../../../components/header';
import Content from '../../../components/layout-content';
import { useAppDispatch } from '../../../../app/hooks';
import { setActiveAccount} from '../../../../reducer/account';
import keyring from '@polkadot/ui-keyring';
import {isEmpty} from 'lodash';
import TokenIcon from '../../../components/token-icon';
import cn from 'classnames';
import {useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccountCard from '../../../components/chains-account-card';
import TokenItem from '../../../components/token-item';
import Loading from '../../../components/loading';
import { useNavigate } from 'react-router-dom';
import NullAccountWrapper from '../../../components/null-account-wrapper';

const Index = (props:any) => {
    const {chainMeta, allAccounts, activeAccount, balance, accountOperateCallback} = props;
    const theme = useTheme();
    const dispatch = useAppDispatch()

    const handleOperateClick = (type:string) => {
        if(type === 'forgetAccount'){
            keyring.forgetAccount(activeAccount);
            accountOperateCallback();
            dispatch(setActiveAccount({account: allAccounts.filter(account => account !== activeAccount)[0], networkId:''}))
        }
    }

    const navigator = useNavigate();

    const operations = [
        {
            label:'Create Account',
            value: 'createAccount',
            link:"/create-account/appchains"
        },
        {
            label:'Import Account',
            value: 'importAccount',
            link:'/import-account/appchains'
        },
        {
            label:'Export Account',
            value: 'exportAccount'
        },
        {
            label:'Forget Account',
            value: 'forgetAccount'
        }
    ]

    const handleAccountItemClick = (account:string) => {
        dispatch(setActiveAccount({account: account, networkId: ''}))
    }

    const handleAssetClick = (tokenItem: any) => {
        navigator(`/custom/asset/${tokenItem.symbol}`)
    }
    return (
        <>
            <DashboardHeader />
            <Content className="dashboard-content">
                {isEmpty(chainMeta) ? (
                    <Loading size={40} />
                ) : (
                <>
                    <Grid className="chainList">
                        <div className={cn('chainItem', 'active')}>
                            <span className="activeBar" style={{background: theme.palette.primary.main, display: 'block'}}></span>
                            <Typography color="primary" variant='caption' className="icon"  style={{backgroundColor: theme.palette.background.paper}}>
                                <TokenIcon icon={''} symbol={chainMeta?.symbol}  showSymbol={false} size={32} />
                            </Typography>
                        </div>
                    </Grid>
                    <Grid className="chainContent">
                        {allAccounts.length ? (
                            <Grid component="div" className="px1 mt1" style={{height: '100%'}}>
                                <AccountCard 
                                    accounts={allAccounts}
                                    handleAccountItemClick={handleAccountItemClick}
                                    handleOperateClick={handleOperateClick}
                                    config={{primary: theme.palette.primary.main}}
                                    operations={operations}
                                    activeAccount={activeAccount}
                                />
                                <Grid>
                                    <TokenItem
                                        token={{
                                            logo:'',
                                            symbol:chainMeta.symbol,
                                            balance: balance
                                        }}
                                        showNative
                                        key={chainMeta.symbol}
                                        className="mt2"
                                        handleItemClick={handleAssetClick}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <NullAccountWrapper chain="appchains"/>
                        )}
                    </Grid>
                </> 
                )}
            </Content>
        </>
    )
}

export default Index