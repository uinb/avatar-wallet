import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  networkId: string,
  chain: string
}

const initialState: StateProps = {
  loading: false,
  networkId: 'testnet',
  chain:'near',
}


export const network = createSlice({
  name:'network',
  initialState,
  reducers: {
    setNetwork(state, {payload = ''}){
      state.networkId = payload;
      localStorage.setItem('networkId', payload)
    },
    setChain(state, {payload = ''}){
        state.chain = payload
    }
  },
  extraReducers: (builder) => {
    
  }
})

export const {setChain}  = network.actions;
const selectRootState =  (state: RootState)  => state.network;
export const selectChain = createSelector(selectRootState, state => state.chain); 
export const selectNetwork = createSelector(selectRootState, state => state.networkId); 


export default network.reducer;
