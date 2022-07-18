import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../components/header';
import { useNavigate } from 'react-router-dom';
import Content from '../../components/layout-content';
import {useParams} from 'react-router-dom';
import keyring from '@polkadot/ui-keyring';
import useNear from '../../../hooks/useNear';
import { useAppSelector } from '../../../app/hooks';
import { selectNetwork } from '../../../reducer/network';
import {mnemonicValidate} from '@polkadot/util-crypto/mnemonic';
import classNames from 'classnames';


const ImportAccount = (props:any) => {
    const [seeds, setSeeds] = useState('');
    const [errorText, setErrorText] = useState('');
    const navigator = useNavigate()
    const {chain = 'near'} = useParams() as {chain: string};
    const networkId = useAppSelector(selectNetwork)
    const near = useNear(networkId);
    const handleImport = async () => {
        if(chain === 'near'){
            await near.importAccount(seeds);
        }
        if(chain === 'appchains'){
            keyring.addUri(seeds);
        }
        navigator('/dashboard');
    }
    const handleSetSeeds = (e:any) => {
        setSeeds(e.target.value);
        if(!mnemonicValidate(e.target.value)){
            setErrorText('Invalid seeds')
        }else{
            setErrorText('')
        }
    }
    return (
        <Grid>
            <HeaderWithBack back="/dashboard"/>
            <Content>
                <div>
                    <Typography>Import Phrase</Typography>
                    <TextareaAutosize 
                        minRows={5} 
                        style={{width: '100%'}} 
                        onChange={(e) => handleSetSeeds(e)}
                        value={seeds}
                        className={classNames('textarea mt2', errorText ? 'error' : '')}
                    />
                    {errorText ? <Typography color="error" variant="caption">{errorText}</Typography> : null }
                    <Button color="primary" className="mt3" size="large" variant="contained" fullWidth onClick={handleImport}>continue</Button>
                </div>
            </Content>
        </Grid>
    )
}

export default ImportAccount;