import {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {useTheme} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Paper from '@material-ui/core/Paper';
import MoreVert from '@material-ui/icons/MoreVert';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Typography from '@material-ui/core/Typography';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {formatLongAddress} from '../../utils';
import FileCopy from '@material-ui/icons/FileCopy';
import {Link} from 'react-router-dom';

const MenuContent:any = (props:any) => {
    const {items = [], handleItemClick} = props as {items: Array<any>, handleItemClick: any};
    return (
        items.map((item:any, index:number) => (
            item.link ? (
                <MenuItem 
                    key={index} 
                    component={Link}
                    to={item.link}
                >{item.label}</MenuItem> 
            ) : (
                <MenuItem key={index} onClick={() => handleItemClick(item.value)}>{item.label}</MenuItem> 
            )
        ))
    )
}

const ChainAccountCard = (props:any) => {
    const {config, operations, handleAccountItemClick, accounts, activeAccount, handleOperateClick} = props;
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null)
    const [operationAnchorEl, setOperationAnchorEl] = useState(null);
    const handleAccountOperate = (e:any) => {
        setOperationAnchorEl(e.currentTarget);
    } 
    const handleChangeAccount = (e:any) => {
        setAnchorEl(e.currentTarget);
    }

    const handleAccountClick = (account:string) => {
        handleAccountItemClick(account);
        setAnchorEl(null);
    }

    const handleOperateItemClick = (value) => {
        handleOperateClick(value)
        setOperationAnchorEl(null)
    }
    return (
        <Paper style={{padding: theme.spacing(2),background: config?.primary ? config?.primary : theme.palette.primary.main, color: theme.palette.primary.contrastText}}>
            <Grid container justifyContent='space-between'>
                <Box>
                    <Grid container onClick={handleChangeAccount}>
                        <Typography variant="body2" component="div">{formatLongAddress(activeAccount)}</Typography> &nbsp;
                        <ArrowDropDown fontSize="medium"/>
                    </Grid>
                    <CopyToClipboard 
                        text={activeAccount}
                        onCopy={() => {console.log('copied!')}}
                    >
                        <Typography variant="caption" className="mt2">{formatLongAddress(activeAccount)} <FileCopy color="inherit" fontSize="inherit"/></Typography>
                    </CopyToClipboard>
                    <Menu
                        id="account-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuContent 
                            items={accounts.map(item => ({label: formatLongAddress(item), value: item}))}
                            handleItemClick={handleAccountClick}
                        />
                    </Menu>
                </Box>
                {operations.length ? (
                    <MoreVert onClick={handleAccountOperate}/>
                ) : null}
                <Menu
                    id="operate-menu"
                    anchorEl={operationAnchorEl}
                    open={Boolean(operationAnchorEl)}
                    onClose={() => {setOperationAnchorEl(null)}}
                >
                    <MenuContent items={operations} handleItemClick={handleOperateItemClick}/>
                </Menu>
            </Grid>
        </Paper>
    )
}

export default ChainAccountCard;