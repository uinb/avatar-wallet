import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { HeaderWithBack } from '../../../../components/header';
import Content from '../../../../components/layout-content';
import Button from '@material-ui/core/Button';
import { useAppSelector } from '../../../../../app/hooks';
import {selectAccountBlances, selectActiveAccount} from '../../../../../reducer/near';
import Dialog from '@material-ui/core/Dialog';
import near from '../../../../../img/chains/near.svg';
import Avatar from '@material-ui/core/Avatar';
import chains from '../../../../../constant/chains';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { Near } from '../../../../../api';
import {utils} from 'near-api-js';
import {parseTokenAmount} from '../../../../../utils';


const Transfer = () => {
    const activeAccount = useAppSelector(selectActiveAccount);
    // oct f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near
    const [state, setInputState] = useState({contractId: 'f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near', asset: 'oct', receiver:'wulin2.near', amount: '0.01', sender: activeAccount})
    const accountBalances = useAppSelector(selectAccountBlances);
    const handleInputChange = (e) => {
        setInputState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const balances = useAppSelector(selectAccountBlances);
    const handleSend = async () => {
        console.log(state);
        if(state.contractId === 'near'){
            const result = await Near.transferNear({...state, amount: utils.format.parseNearAmount(state.amount)});
            console.log(result);
        }else{
            const result = await Near.ftTransfer({...state, amount: parseTokenAmount(state.amount, 18)});
            console.log(result); 
        }
    }
    return (
        <Grid>
            <HeaderWithBack back="/dashboard"/>
            <Content>
                <Grid>
                    <Box className="mt2">
                        <InputLabel className="tl">Asset</InputLabel>
                        <Input 
                            fullWidth className="mt2" 
                            name="asset"
                            disabled
                            value={state.asset}
                            onChange={handleInputChange}
                            startAdornment={
                                <Grid style={{marginRight: 8}}>
                                    <Avatar style={{background: chains.near.background, width: 28, height: 28}}>
                                        <img src={chains.near.logo} alt=""/>
                                    </Avatar>
                                </Grid>
                            }
                            endAdornment={<ArrowDropDown color="action" fontSize="small"/>}
                        />
                    </Box>
                    <Box className="mt4">
                        <InputLabel className="tl">Send to</InputLabel>
                        <Input 
                            name="to"
                            fullWidth className="mt2" 
                            value={state.receiver}
                            onChange={handleInputChange}
                            />
                    </Box>
                    <Box className="mt4">
                        <InputLabel className="flex">Amount <span>available:</span></InputLabel>
                        <Input 
                            name="amount"
                            fullWidth className="mt2" 
                            onChange={handleInputChange}
                            value={state.amount}
                            endAdornment={<Button color="primary" variant='text' size="small">All</Button>}
                        />
                    </Box>
                </Grid>
                <Button color="primary" variant="contained" size="large" fullWidth className="mt4" onClick={handleSend}>Send</Button>
            </Content>
        </Grid>
    )
}

export default Transfer;