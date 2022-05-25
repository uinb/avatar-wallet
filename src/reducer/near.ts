import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  signerAccounts: Array<string>,
  activeAccount: string
}

const initialState: StateProps = {
  loading: false,
  signerAccounts: [],
  activeAccount: ''
}


export const near = createSlice({
  name:'near',
  initialState,
  reducers: {
    setSignerAccounts(state, {payload  = []}){
        state.signerAccounts = payload;
    },
    setActiveAccount(state, {payload = ''}){
      state.activeAccount = payload;
    }
  },
  extraReducers: (builder) => {
    
  }
})

export const {setSignerAccounts, setActiveAccount} = near.actions;
const selectRootState =  (state: RootState)  => state.near;
export const selectSignerAccount = createSelector(selectRootState, state => state.signerAccounts);
export const selectActiveAccount = createSelector(selectRootState, state => state.activeAccount);

export default near.reducer;
