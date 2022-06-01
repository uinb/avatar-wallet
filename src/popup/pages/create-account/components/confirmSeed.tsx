import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';


const ConfirmSeed = (props:any) => {
    const [confirmSeed, setConfirmSeed] = useState('');
    const handleSetSeed = (e:any) => {
        setConfirmSeed(e.target.value);
    }
    const {handleContinue, seeds, randomSeed} = props; 
    return (

        <Grid>
            <Typography variant="h5" gutterBottom>Verify Phrase</Typography>
            <Typography variant='caption' color="textSecondary">Enter the following word from your recovery phrase to complete the setup process.</Typography>
            <Typography variant='caption' color="textSecondary" className="mt2">word #{randomSeed}</Typography>
            <TextareaAutosize 
                minRows={5} 
                style={{width: '100%'}} 
                onChange={handleSetSeed}
                value={confirmSeed}
                className="textarea mt2"
            />
            {confirmSeed && confirmSeed !== seeds.split(' ')[randomSeed-1] ? (<Typography color="error" variant='caption'>Invalid seed</Typography>) :null}
            <Button 
                color="primary" 
                variant="contained" 
                fullWidth 
                size="large" 
                className='mt4'
                onClick={handleContinue}
                disabled={confirmSeed !== seeds.split(' ')[randomSeed-1]}
            >Continue</Button>
        </Grid>
    )
}

export default ConfirmSeed;
