import { createSlice, createSelector, Reducer } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface StateProps {
  subscribeTokens: any
}

const initialState: StateProps = {
  subscribeTokens: {},
}

export const subscribe = createSlice({
  name:'subscribe',
  initialState,
  reducers: {
    setSubscribeTokens: (state, {payload}) => {
      console.log("p -",payload)
      const {chain ,symbol, unsubscribe} = payload;
      console.log(chain ,symbol, unsubscribe)
      state.subscribeTokens[chain][symbol].unsubscribe = unsubscribe;
    },

  }
})

export const {setSubscribeTokens} = subscribe.actions;

const selectBaseState = (state: RootState)  => state.subscribe;
export const selectSubscribeTokens = createSelector(selectBaseState, state => state.subscribeTokens)

export default subscribe.reducer as Reducer<typeof initialState>;
  