import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  networkOption: any,
  chain: string
}

const initialState: StateProps = {
  loading: false,
  networkOption: [
    {
      name:"Miannet",
      networkUrl:"wss://binnode.brandy.fusotao.org",
      active:true
    },
    {
      name:"Testnet",
      networkUrl:"wss://binnode.brandy.fusotao.org",
      active:false
    }
  ],
  chain:'near',
}


export const network = createSlice({
  name:'network',
  initialState,
  reducers: {
    setNetwork(state, {payload = {}}){
      state.networkOption.push(payload);
    },
    setChain(state, {payload = ''}){
      state.chain = payload
    }
  },
  extraReducers: (builder) => {
    
  }
})

export const {setChain,setNetwork}  = network.actions;
const selectRootState =  (state: RootState)  => state.network;
export const selectChain = createSelector(selectRootState, state => state.chain); 
export const selectNetwork = createSelector(selectRootState, state => state.networkOption); 


export default network.reducer;
