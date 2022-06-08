import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  accounts: {
    [key: string] : Array<string>
  }
}

const initialState: StateProps = {
  loading: false,
  accounts:{}
}


export const account = createSlice({
  name:'account',
  initialState,
  reducers: {
      setAccount(state, {payload }){
        const {networkId, account} = payload;
        state.accounts[networkId] =  state.accounts[networkId].concat(account);
      }
  },
  extraReducers: (builder) => {
    
  }
})

const {setAccount} = account.actions;
const selectRootState =  (state: RootState)  => state.account;
const selectAccountsByNetworkId = (networkId:string) =>  createSelector(selectRootState, state => state.accounts[networkId])


export default account.reducer;