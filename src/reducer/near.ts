import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  signerAccounts: Array<string>
}

const initialState: StateProps = {
  loading: false,
  signerAccounts: []
}


export const near = createSlice({
  name:'near',
  initialState,
  reducers: {
    setSignerAccounts(state, {payload  = []}){
        state.signerAccounts = payload;
    },
  },
  extraReducers: (builder) => {
    
  }
})

export const {setSignerAccounts} = near.actions;
const selectRootState =  (state: RootState)  => state.near;

export default near.reducer;
