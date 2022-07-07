import { createSlice, createSelector, } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import {TokenProps} from '../constant/near-types';
import chains from '../constant/chains';

interface StateProps {
  loading: boolean,
  signerAccounts: Array<string>,
  allAccounts:  Array<string>,
  activeAccount: {
    [networkId:string]: string
  },
  accountBalances: {
    [key: string] : {
      [key:string]: TokenProps
    } 
  },
  priceList: {
    [key: string]: any
  },
  transferInfomation: any;
}

const initialState: StateProps = {
  loading: false,
  signerAccounts: [],
  activeAccount: {},
  priceList: {},
  accountBalances: {},
  transferInfomation: {},
  allAccounts:[]
}

export const near = createSlice({
  name:'near',
  initialState,
  reducers: {
    setAllAccounts(state, {payload = []}) {
      state.allAccounts = payload;
    },
    setSignerAccounts(state, {payload  = []}){
        state.signerAccounts = payload;
    },
    setActiveAccount(state, {payload}){
      const {account, networkId} = payload;
      if(state.activeAccount[networkId]){
        state.activeAccount[networkId] = account;
      }else{
        state.activeAccount = {
          ...state.activeAccount,
          [networkId]: account
        }
      }
    },
    setBalancesForAccount(state, {payload}){
      const {account, balances} = payload;
      const refactorBalances = balances.reduce((all, current) => {
        return {
          ...all,
          [current.symbol]: {...current, icon: ['wNEAR', 'near'].includes(current.symbol.toLowerCase()) ? chains.near.icon : current.icon}
        }
      }, {})
      if(!state.accountBalances[account]){
        state.accountBalances[account] = refactorBalances;
      }else{
        state.accountBalances[account] = {...state.accountBalances[account], ...refactorBalances}
      }
    },
    setPriceList(state, {payload}){
      state.priceList = payload;
    },
    setNearBalanceForAccount(state, {payload}){
      const {account, balance} = payload;
      const nearItem:TokenProps = {
        symbol: 'near',
        price:'1',
        usdValue: '',
        contractId: 'near',
        decimal: 24,
        balance: balance.available,
        icon: chains.near.icon
      }
      if(state.accountBalances[account]){
        state.accountBalances[account] = {
          NEAR: nearItem, 
          ...state.accountBalances[account]
        }
      }else{
        state.accountBalances[account] = { NEAR : nearItem }
      }
    },
    setTempTransferInfomation(state, {payload}){
      state.transferInfomation = payload;
    }
  },
  extraReducers: (builder) => {
    
  }
})

export const {setAllAccounts, setSignerAccounts, setActiveAccount, setPriceList, setBalancesForAccount, setNearBalanceForAccount, setTempTransferInfomation} = near.actions;
const selectRootState =  (state: RootState)  => state.near;
export const selectAllAccounts = createSelector(selectRootState, state => state.allAccounts);
export const selectSignerAccount = createSelector(selectRootState, state => state.signerAccounts);
export const selectNearActiveAccountByNetworkId = (networkId:string) => createSelector(selectRootState, state => state.activeAccount[networkId] || '');
export const selectPriceList = createSelector(selectRootState, state => state.priceList);
export const selectAccountBlances = (networkId:string) => createSelector(selectRootState, selectNearActiveAccountByNetworkId(networkId), (state,account) => {
  if(state.accountBalances[account] && Object.keys(state.accountBalances[account])){
    return Object.entries(state.accountBalances[account]).map(([key, item]: [string, TokenProps]) => item)
  }else{
    return [] as Array<TokenProps>
  }
})
export const selectBalanesByAccount = (account:string) => createSelector(selectRootState, (state) => {
  if(state.accountBalances[account] && Object.keys(state.accountBalances[account])){
    return Object.entries(state.accountBalances[account]).map(([key, item]: [string, TokenProps]) => item)
  }else{
    return [] as Array<TokenProps>
  }
})
export const selectNearConfig = createSelector(selectRootState, state => state.priceList['wrap.near'] || {price: '1'})
export const selectTransferInformation = createSelector(selectRootState, state => state.transferInfomation)



export default near.reducer;
