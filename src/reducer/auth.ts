import { createSlice, createSelector} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface AuthProps {
  loading: boolean,
  password: string,
}

const initialState: AuthProps = {
  loading: false,
  password: '',
}


export const auth = createSlice({
  name:'auth',
  initialState,
  reducers: {
    setUserPwd(state, {payload = ''}){
      state.password  = payload;
    },
  },
  extraReducers: (builder) => {
    
  }
})

export const {setUserPwd} = auth.actions;
const selectAuthState =  (state: RootState)  => state.auth;
export const selectPwd = createSelector(selectAuthState, state => state.password); 

export default auth.reducer;
