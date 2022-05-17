import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  loading: boolean,
  network: string,
}

const initialState: StateProps = {
  loading: false,
  network: 'mainnet',
}


export const network = createSlice({
  name:'network',
  initialState,
  reducers: {
    setNetWork(state, {payload = ''}){
      state.network = payload;
    },
  },
  extraReducers: (builder) => {
    
  }
})


export default network.reducer;
