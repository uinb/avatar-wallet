import { createSlice, createSelector, createAsyncThunk} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import {newNear} from '../api';
import {selectConfigByNetwork} from '../utils';


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
      name:"mainnet",
      networkUrl:"wss://binnode.brandy.fusotao.org",
      active:true
    },
    {
      name:"testnet",
      networkUrl:"wss://binnode.brandy.fusotao.org",
      active:false
    }
  ],
  networkId: localStorage.getItem('networkId') || 'mainnet',
  chain:{},
  appChains: selectConfigByNetwork(['mainnet', 'testnet'].includes(localStorage.getItem('networkId')) ? localStorage.getItem('networkId') : 'mainnet')
}


export const fetchAppChains = createAsyncThunk(
  '/network/fetch-appchains',
  async (params:any, ThunkAPI) => {
    const {networkId} = params;
    const near = await newNear(networkId);
    return near.getAppChains();
  }
)


export const network = createSlice({
  name:'network',
  initialState,
  reducers: {
    addNetwork(state, {payload = {}}){
      state.networkOption.push(payload);
    },
    setNetwork(state, {payload = ''}){
      state.networkId = payload;
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
      const configedChain = selectConfigByNetwork(networkId);
      state.appChains[networkId] = chains.filter(item => configedChain.hasOwnProperty(item.appchain_id));
    },
    updateNetworkOptions:(state, {payload}) => {
      state.networkOption = state.networkOption.filter(item => item.name !== payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAppChains.pending, (state) => {
      state.loading = true;
    }).addCase(fetchAppChains.fulfilled, (state, {payload}) => {
      const {networkId, chains} = payload;
      const configedChain = selectConfigByNetwork(networkId);
      if(state.appChains[networkId]){
        state.appChains[networkId] = chains.filter(item => configedChain.hasOwnProperty(item.appchain_id));
      }else{
        state.appChains = {
          ...state.appChains, 
          [networkId]: chains.filter(item => configedChain.hasOwnProperty(item.appchain_id))
        }
      }
      state.loading = false;
    })
  }
})

export const {setChain, addNetwork, setNetwork, changeNetwork, setAppChains, updateNetworkOptions}  = network.actions;
const selectRootState =  (state: RootState)  => state.network;
export const selectNetwork = createSelector(selectRootState, state => state.networkId); 
export const selectNetworkList = createSelector(selectRootState, state => state.networkOption); 
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

export const selectNetworkById = (networkId :string) => createSelector(selectRootState,  state => {
  return state.networkOption.find(item => item.name === networkId) || {}
})


export default network.reducer;
