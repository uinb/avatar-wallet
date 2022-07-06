import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import {useTheme, darken} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


const TokenIcon = (props:any) => {
    const {icon, symbol='', size = 24, showSymbol=true, bg = false, ...restProps} = props;
    const theme = useTheme();
    return (
        <Box 
            style={{
                display: 'flex', 
                alignItems:'center', 
                flexWrap: 'nowrap', 
                background: bg ? darken(theme.palette.background.paper, 0.05) : 'transprent', borderRadius: '50%'}}
        >
            <Avatar style={{width: size, height: size, background: icon ? "transparent" : theme.palette.primary.main, fontSize: size > 24 ? 20: 12}} {...restProps}>
                {icon ? (
                    <img src={icon} alt="" width="100%"/>
                ) : symbol.slice(0, 1)}
            </Avatar>
            {symbol && showSymbol ? (
                <Typography variant='body2' color="textSecondary" className="ml1" component="span">{symbol.toUpperCase()}</Typography>
            ) : null }
        </Box>
    )
}

export default TokenIcon;