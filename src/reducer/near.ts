import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  signerAccounts: Array<string>,
  activeAccount: string,
  balances?: {
    [key: string] : any 
  },
  priceList: Array<any>
}

const initialState: StateProps = {
  loading: false,
  signerAccounts: [],
  activeAccount: '',
  priceList:[]
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

    },
    setPriceList(state, {payload}){
      state.priceList = payload;
    },
  },
  extraReducers: (builder) => {
    
  }
})

export const {setSignerAccounts, setActiveAccount, setPriceList} = near.actions;
const selectRootState =  (state: RootState)  => state.near;
export const selectSignerAccount = createSelector(selectRootState, state => state.signerAccounts);
export const selectActiveAccount = createSelector(selectRootState, state => state.activeAccount);
export const selectPriceBySymbol = (symbol: string) => createSelector(selectRootState, state => {
  const symbolItem = state.priceList.find(item => item.symbol === symbol);
  if(symbolItem) {
    return symbolItem.price ;
  }else{
    return ''
  }
})
export const selectPriceList = createSelector(selectRootState, state => state.priceList)



export default near.reducer;
