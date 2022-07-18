import { createSlice, createSelector,  Reducer,} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  accounts: Array<string>,
  activeAccount: '',
  balacne: string,
  tokenAccount:any,
  allAccounts: Array<string>,
}

const initialState: StateProps = {
  loading: false,
  accounts: [],
  activeAccount: '',
  balacne:'--',
  tokenAccount:{},
  allAccounts: []
}

export const account = createSlice({
  name:'account',
  initialState,
  reducers: {
    setTokenAccount(state,{payload}){
      const {chain, networkId, list} = payload;
      state.tokenAccount[networkId] = {[chain]:list};
    },
    setAccount(state, {payload }){
      const {account} = payload;
      state.accounts =  state.accounts.concat(account);
    },
    setActiveAccount(state, {payload}){
      const {account} = payload;
      state.activeAccount = account
    }
  }
})

export const {setAccount, setActiveAccount, setTokenAccount} = account.actions;
const selectRootState =  (state: RootState)  => state.account;
export const tokenAccountList = (networkId:string) => createSelector(selectRootState, state => state.tokenAccount[networkId] || {}); 
export const selectAccountsByNetworkId = (networkId:string) =>  createSelector(selectRootState, state => state.accounts || [])
export const selectActiveAccountByNetworkId = (networkId:string) =>  createSelector(selectRootState, state => state.activeAccount || '')


export default account.reducer as Reducer<typeof initialState>;