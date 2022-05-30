import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  networkId: string,
  chain: string,
  appChains: {
    [network:string]: Array<any>
  }
}

const initialState: StateProps = {
  loading: false,
  networkId: localStorage.getItem('networkId') || 'mainnet',
  chain:'near',
  appChains: {}
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
    },
    setAppChains(state, {payload}){
      const {networkId, chains} = payload;
      state.appChains[networkId] = chains;
    }
  },
  extraReducers: (builder) => {
    
  }
})

export const {setChain, setNetwork, setAppChains}  = network.actions;
const selectRootState =  (state: RootState)  => state.network;
export const selectChain = createSelector(selectRootState, state => state.chain); 
export const selectNetwork = createSelector(selectRootState, state => state.networkId); 
export const selectAppChains = (networkId) =>  createSelector(selectRootState, (state) => {
  return state.appChains[networkId] || [];
})


export default network.reducer;
