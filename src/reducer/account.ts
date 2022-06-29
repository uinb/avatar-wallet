import { createSlice, createSelector,  Reducer,} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  accounts: {
    [key: string] : Array<string>
  },
  activeAccount: {
    [network: string]: string
  },
  balacne: string,
  tokenAccount:any
}

const initialState: StateProps = {
  loading: false,
  accounts:{},
  activeAccount: {

  },
  balacne:'--',
  tokenAccount:{}
}

export const account = createSlice({
  name:'account',
  initialState,
  reducers: {
    setTokenAccount(state,payload){
      state.tokenAccount = payload;
    },
    setAccount(state, {payload }){
      const {networkId, account} = payload;
      state.accounts[networkId] =  state.accounts[networkId].concat(account);
    },
    setActiveAccount(state, {payload}){
      const {account, networkId} = payload;
      state.activeAccount[networkId] = account
    }
  },
  extraReducers: (builder) => {

  }
})

export const {setAccount, setActiveAccount, setTokenAccount} = account.actions;
const selectRootState =  (state: RootState)  => state.account;
export const tokenAccountList = createSelector(selectRootState, state => state.tokenAccount); 
export const selectAccountsByNetworkId = (networkId:string) =>  createSelector(selectRootState, state => state.accounts[networkId])
export const selectActiveAccountByNetworkId = (networkId:string) =>  createSelector(selectRootState, state => state.activeAccount[networkId] || '')


export default account.reducer as Reducer<typeof initialState>;