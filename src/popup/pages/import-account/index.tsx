import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { HeaderWithBack } from '../../components/header';
import { useAppSelector } from '../../../app/hooks';
import { selectChain} from '../../../reducer/network';
import {Near} from '../../../api';
import { useNavigate } from 'react-router-dom';
import Content from '../../components/layout-content';


const ImportAccount = (props:any) => {
    const chain = useAppSelector(selectChain);
    const [seeds, setSeeds] = useState('');
    const [errorText, setErrorText] = useState('');
    const navigator = useNavigate()
    const handleImport = async () => {
        if(chain === 'near'){
            const result = await Near.importAccount(seeds);
            if(result?.msg){
                setErrorText(result.msg)
            }else{
                navigator('/dashboard');
            }
        }
    }
    const handleSetSeeds = (e:any) => {
        setSeeds(e.target.value);
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
                        className="textarea mt2"
                    />
                    {errorText ? <Typography color="primary" variant="caption">{errorText}</Typography> : null }
                    <Button color="primary" className="mt3" size="large" variant="contained" fullWidth onClick={handleImport}>continue</Button>
                </div>
            </Content>
        </Grid>
    )
}

export default ImportAccount;