import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  networkOption: any,
  networkId: string,
  chain: {
    [key:string]: string
  },
  appChains: {
    [network:string]: Array<any>
  }
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
  networkId: "Miannet",
  chain:{},
  appChains: {}
}


export const network = createSlice({
  name:'network',
  initialState,
  reducers: {
    setNetwork(state, {payload = {}}){
      state.networkOption.push(payload);
    },
    changeNetwork(state,{payload}){
      state.networkOption.map(option =>{
        option.active = false;
        if(option.name === payload){
          option.active = true;
          state.networkId = payload;
        }
        return option;
      });
    },
    setChain(state, {payload}){
        const {networkId, chain} = payload;
        state.chain[networkId] = chain
    },
    setAppChains(state, {payload}){
      const {networkId, chains} = payload;
      state.appChains[networkId] = chains;
    }
  },
  extraReducers: (builder) => {
    
  }
})

export const {setChain,setNetwork,changeNetwork,setAppChains}  = network.actions;
const selectRootState =  (state: RootState)  => state.network;
export const selectNetwork = createSelector(selectRootState, state => state.networkOption); 
export const selectChain = (networkId:string) => createSelector(selectRootState, state => state.chain[networkId] || 'near'); 
export const selectAppChains = (networkId) =>  createSelector(selectRootState, (state) => {
  return state.appChains[networkId] || [];
})
export const selectAppChain = (networkId:string,  name: string) => createSelector(selectAppChains(networkId),  state => {
  if(!name){
    return {}
  }else{
    return state.find(item => item.appchain_id === name) 
  }
})


export default network.reducer;
