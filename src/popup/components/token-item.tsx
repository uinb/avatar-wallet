import React from 'react';
import Card from '@material-ui/core/Card';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import TokenIcon from './token-icon';
import {toUsd} from '../../utils';
import {grey} from '@material-ui/core/colors';

const TokenItem = (props:any) => {
    const {handleItemClick, token, showNative, ...restProps} = props;
    return (
        <Card onClick={() => handleItemClick(token)} {...restProps}>
            <ListItem disableGutters dense>
                <ListItemAvatar>
                    <TokenIcon icon={token?.icon || token?.logo} symbol={token.symbol} size={32} showSymbol={false}/>
                </ListItemAvatar>
                <ListItemText 
                    primary={
                        <Typography variant="body1">
                            {showNative? token.balance : Number(token.balance || 0).toFixed(4)}
                            <Typography variant="caption" color="textSecondary" component="span" className="ml1">
                                {token?.symbol}
                            </Typography>
                        </Typography>
                    } 
                    secondary={
                        showNative?
                        <Typography variant='caption' component="span" style={{color: grey[500]}}>
                            {token?.price ? `${token.price} USD` : "--"}
                        </Typography> 
                        :
                        <Typography variant='caption' component="span" style={{color: grey[500]}}>
                            {token?.price ? `${toUsd(token.balance, token?.price)} USD` : "--"}
                        </Typography>
                    } 
                />
            </ListItem>
        </Card> 
    )
}

export default TokenItem