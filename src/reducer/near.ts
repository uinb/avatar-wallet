import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  signerAccounts: Array<string>,
  activeAccount: string,
  accountBalances: {
    [key: string] : any 
  },
  priceList: {
    [key: string]: any
  }
}

const initialState: StateProps = {
  loading: false,
  signerAccounts: [],
  activeAccount: '',
  priceList: {},
  accountBalances: {}
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
    },
    setBalancesForAccount(state, {payload}){
      const {account, balances} = payload;
      state.accountBalances[account] = balances;
    },
    setPriceList(state, {payload}){
      state.priceList = payload;
    },
    setNearBalanceForAccount(state, {payload}){
      const {account, balance} = payload;
      console.log(payload);
      const nearItem = {
        symbol: 'near',
        price:'1',
        usdValue: '',
        contractId: 'near',
        decimal: 24,
        balance: balance.available,
      }
      if(state.accountBalances[account]){
        state.accountBalances[account] = [nearItem, ...state.accountBalances[account]]
      }else{
        state.accountBalances[account] = nearItem
      }
    }
  },
  extraReducers: (builder) => {
    
  }
})

export const {setSignerAccounts, setActiveAccount, setPriceList, setBalancesForAccount, setNearBalanceForAccount} = near.actions;
const selectRootState =  (state: RootState)  => state.near;
export const selectSignerAccount = createSelector(selectRootState, state => state.signerAccounts);
export const selectActiveAccount = createSelector(selectRootState, state => state.activeAccount);
export const selectPriceList = createSelector(selectRootState, state => state.priceList);
export const selectAccountBlances = createSelector(selectRootState, selectActiveAccount, (state,account) => {
  return state.accountBalances[account] || [];
})
export const selectNearConfig = createSelector(selectRootState, state => state.priceList['wrap.near'] || {price: '1'})



export default near.reducer;
